export default class Emitter {
    private e: { [key: string]: Array<{ fn: Function; ctx: any }> };

    constructor() {
        this.e = {};
    }

    on(name: string, fn: Function, ctx?: any) {
        const e = this.e || (this.e = {});
        (e[name] || (e[name] = [])).push({ fn, ctx });
        return this;
    }

    once(name: string, fn: Function, ctx?: any) {
        const self = this;

        function listener(...args: any[]) {
            self.off(name, listener);
            fn.apply(ctx, args);
        }

        (listener as any)._ = fn;
        return this.on(name, listener, ctx);
    }

    emit(name: string, ...data: any[]) {
        const evtArr = ((this.e || (this.e = {}))[name] || []).slice();
        for (let i = 0; i < evtArr.length; i += 1) {
            evtArr[i].fn.apply(evtArr[i].ctx, data);
        }
        return this;
    }

    off(name?: string, callback?: Function) {
        const e = this.e || (this.e = {});

        if (!name) {
            Object.keys(e).forEach((key) => {
                delete e[key];
            });
            delete this.e;
            return this;
        }

        const evts = e[name];
        const liveEvents = [];

        if (evts && callback) {
            for (let i = 0, len = evts.length; i < len; i += 1) {
                if (evts[i].fn !== callback && evts[i].fn._ !== callback) {
                    liveEvents.push(evts[i]);
                }
            }
        }

        if (liveEvents.length) {
            e[name] = liveEvents;
        } else {
            delete e[name];
        }

        return this;
    }
}
