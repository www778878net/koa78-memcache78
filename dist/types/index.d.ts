declare class MemCache78 {
    private client;
    private local;
    constructor(config: any);
    private handleError;
    tbget(key: string, debug?: boolean): Promise<any>;
    tbset(key: string, value: any, sec?: number): Promise<void>;
    del(key: string): Promise<void>;
    incr(key: string, sec?: number, add?: number): Promise<number>;
    get(key: string, debug?: boolean): Promise<any>;
    set(key: string, value: any, sec?: number): Promise<void>;
    add(key: string, value: any, sec?: number): Promise<void>;
}
export default MemCache78;
