interface AuthConfig {
  token: string;
  passkey: string;
}

interface InitConfig extends AuthConfig {
  apiUrl?: string;
  debug?: boolean;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

export class PlatformLeaflet {
  private static instance: PlatformLeaflet;
  private token: string;
  private passkey: string;
  private apiUrl: string;
  private debug: boolean;
  private initialized: boolean = false;

  private constructor() {
    this.token = '';
    this.passkey = '';
    this.apiUrl = 'https://api.default.com';
    this.debug = false;
  }

  public static getInstance(): PlatformLeaflet {
    if (!PlatformLeaflet.instance) {
      PlatformLeaflet.instance = new PlatformLeaflet();
    }
    return PlatformLeaflet.instance;
  }

  public init(config: InitConfig): void {
    if (this.initialized) {
      this.log('PlatformLeaflet already initialized');
      return;
    }

    this.token = config.token;
    this.passkey = config.passkey;
    this.apiUrl = config.apiUrl || this.apiUrl;
    this.debug = config.debug || false;

    this.initialized = true;
    this.log('PlatformLeaflet initialized successfully');
  }

  public getAuth(): AuthConfig {
    this.validateAuth();
    return {
      token: this.token,
      passkey: this.passkey
    };
  }

  public getApiUrl(): string {
    this.validateAuth();
    return this.apiUrl;
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    this.validateAuth();

    const url = `${this.apiUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'X-Passkey': this.passkey,
      'Content-Type': 'application/json',
      ...options.headers
    };

    try {
      this.log(`Making ${options.method || 'GET'} request to: ${url}`);
      
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.log('Request successful', data);
      
      return data as T;
    } catch (error) {
      this.log('Request failed', error);
      throw error;
    }
  }

  private log(message: string, data?: any): void {
    if (this.debug) {
      console.log(`[PlatformLeaflet] ${message}`, data ? data : '');
    }
  }

  public validateAuth(): void {
    if (!this.initialized) {
      throw new Error('PlatformLeaflet not initialized. Please call init() first.');
    }
  }
}
