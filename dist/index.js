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
        const servers = config.host ? `${config.host}:${config.port || 11211}` : '127.0.0.1:11211';
        this.client = memjs_1.Client.create(servers, {
            retries: 10,
            retry_delay: 1000,
            expires: config.expires || 0,
            poolSize: config.max || 10,
        });
        this.local = config.local || '';
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
    tbget(key_1) {
        return __awaiter(this, arguments, void 0, function* (key, debug = false) {
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
    tbset(key_1, value_1) {
        return __awaiter(this, arguments, void 0, function* (key, value, sec = 86400) {
            key += this.local;
            const stringValue = JSON.stringify(value);
            yield this.handleError(this.client.set(key, stringValue, { expires: sec }));
        });
    }
    del(key) {
        return __awaiter(this, void 0, void 0, function* () {
            key += this.local;
            yield this.handleError(this.client.delete(key));
        });
    }
    incr(key_1) {
        return __awaiter(this, arguments, void 0, function* (key, sec = 86400, add = 1) {
            key += this.local;
            const result = yield this.handleError(this.client.increment(key, add));
            if (result && result.value !== null) {
                return result.value;
            }
            else {
                yield this.tbset(key, 1, sec);
                return 1;
            }
        });
    }
    get(key_1) {
        return __awaiter(this, arguments, void 0, function* (key, debug = false) {
            return this.tbget(key, debug);
        });
    }
    set(key_1, value_1) {
        return __awaiter(this, arguments, void 0, function* (key, value, sec = 86400) {
            return this.tbset(key, value, sec);
        });
    }
    add(key_1, value_1) {
        return __awaiter(this, arguments, void 0, function* (key, value, sec = 86400) {
            key += this.local;
            yield this.handleError(this.client.add(key, value, { expires: sec }));
        });
    }
}
exports.default = MemCache78;
//# sourceMappingURL=index.js.map