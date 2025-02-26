import Emitter from './utils/emitter';

export class BaseEventEmitter {
    protected emitter: Emitter;

    constructor() {
        this.emitter = new Emitter();
    }

    /**
     * 添加事件监听
     * @param eventName 事件名称
     * @param callback 回调函数
     * @param context 上下文
     */
    on(eventName: string, callback: Function, context?: any) {
        this.emitter.on(eventName, callback, context);
        return this;
    }

    /**
     * 添加一次性事件监听
     * @param eventName 事件名称
     * @param callback 回调函数
     * @param context 上下文
     */
    once(eventName: string, callback: Function, context?: any) {
        this.emitter.once(eventName, callback, context);
        return this;
    }

    /**
     * 触发事件
     * @param eventName 事件名称
     * @param args 参数列表
     */
    emit(eventName: string, ...args: any[]) {
        this.emitter.emit(eventName, ...args);
        return this;
    }

    /**
     * 移除事件监听
     * @param eventName 事件名称
     * @param callback 回调函数
     */
    off(eventName?: string, callback?: Function) {
        this.emitter.off(eventName, callback);
        return this;
    }

    /**
     * 销毁所有事件监听
     */
    destroy() {
        this.emitter.off();
    }
}

export default BaseEventEmitter;
