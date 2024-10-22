"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const memjs_1 = require("memjs");
class MemCache78 {
    constructor(config) {
        console.log('MemCache78 constructor config:', config);
        if (!config || typeof config !== 'object') {
            throw new Error('Invalid configuration: config must be an object');
        }
        const host = config.host || '127.0.0.1';
        const port = config.port || 11211;
        const servers = `${host}:${port}`;
        this.client = memjs_1.Client.create(servers, {
            retries: 10,
            retry_delay: 1000,
            expires: config.expires || 0,
            poolSize: config.max || 10,
        });
        this.local = config.local || '';
        console.log(`MemCache78 initialized with server: ${servers}`);
    }
    handleError(promise) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield promise;
            }
            catch (err) {
                console.error(`MemCache78 Error: ${err}`);
                return null;
            }
        });
    }
    tbget(key, debug = false) {
        return __awaiter(this, void 0, void 0, function* () {
            key += this.local;
            const result = yield this.handleError(this.client.get(key));
            if (result && result.value) {
                const reply = result.value.toString();
                if (debug) {
                    console.log(`memcache78 tbget: ${key} value: ${reply}`);
                }
                return JSON.parse(reply);
            }
            return null;
        });
    }
    tbset(key, value, sec = 86400) {
        return __awaiter(this, void 0, void 0, function* () {
            key += this.local;
            const stringValue = JSON.stringify(value);
            yield this.handleError(this.client.set(key, stringValue, { expires: sec }));
            return true;
        });
    }
    del(key) {
        return __awaiter(this, void 0, void 0, function* () {
            key += this.local;
            yield this.handleError(this.client.delete(key));
            return true;
        });
    }
    incr(key, sec = 86400, add = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            key += this.local;
            const result = yield this.handleError(this.client.increment(key, add));
            if (result && result.value !== null) {
                return result.value;
            }
            else {
                yield this.set(key, '1', sec);
                return 1;
            }
        });
    }
    get(key, debug = false) {
        return __awaiter(this, void 0, void 0, function* () {
            key += this.local;
            const result = yield this.handleError(this.client.get(key));
            if (result && result.value) {
                const reply = result.value.toString();
                if (debug) {
                    console.log(`memcache78 get: ${key} value: ${reply}`);
                }
                return reply;
            }
            return null;
        });
    }
    set(key, value, sec = 86400) {
        return __awaiter(this, void 0, void 0, function* () {
            key += this.local;
            yield this.handleError(this.client.set(key, value, { expires: sec }));
            return true;
        });
    }
    add(key, value, sec = 86400) {
        return __awaiter(this, void 0, void 0, function* () {
            key += this.local;
            try {
                const result = yield this.client.add(key, value, { expires: sec });
                console.log('Add result:', result);
                return result;
            }
            catch (error) {
                console.error('Error in add method:', error);
                if (error instanceof Error && error.message.includes('NOT_STORED')) {
                    // 键已经存在
                    return false;
                }
                // 处理其他错误
                yield this.handleError(Promise.reject(error));
                return false;
            }
        });
    }
}
exports.default = MemCache78;
//# sourceMappingURL=index.js.map