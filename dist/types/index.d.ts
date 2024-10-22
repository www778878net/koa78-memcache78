declare class MemCache78 {
    private client;
    private local;
    constructor(config: any);
    private handleError;
    tbget(key: string, debug?: boolean): Promise<any>;
    tbset(key: string, value: any, sec?: number): Promise<boolean>;
    del(key: string): Promise<boolean>;
    incr(key: string, sec?: number, add?: number): Promise<number>;
    get(key: string, debug?: boolean): Promise<string | null>;
    set(key: string, value: string, sec?: number): Promise<boolean>;
    add(key: string, value: any, sec?: number): Promise<boolean>;
}
export default MemCache78;
