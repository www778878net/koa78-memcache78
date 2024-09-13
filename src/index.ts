import { Client, MemcachedResponse } from 'memjs';

class MemCache78 {
	private client: Client;
	private local: string;

	constructor(config: any) {
		const servers = config.host ? `${config.host}:${config.port || 11211}` : '127.0.0.1:11211';
		this.client = Client.create(servers, {
			retries: 10,
			retry_delay: 1000,
			expires: config.expires || 0,
			poolSize: config.max || 10,
		});
		this.local = config.local || '';
	}

	private async handleError<T>(promise: Promise<T>): Promise<T | null> {
		try {
			return await promise;
		} catch (err) {
			console.error(`MemCache78 Error: ${err}`);
			return null;
		}
	}

	async tbget(key: string, debug: boolean = false): Promise<any> {
		key += this.local;
		const result: MemcachedResponse | null = await this.handleError(this.client.get(key));
		if (result && result.value) {
			const reply = result.value.toString();
			if (debug) {
				console.log(`memcache78 tbget: ${key} value: ${reply}`);
			}
			return JSON.parse(reply);
		}
		return null;
	}

	async tbset(key: string, value: any, sec: number = 86400): Promise<void> {
		key += this.local;
		const stringValue = JSON.stringify(value);
		await this.handleError(this.client.set(key, stringValue, { expires: sec }));
	}

	async del(key: string): Promise<void> {
		key += this.local;
		await this.handleError(this.client.delete(key));
	}

	async incr(key: string, sec: number = 86400, add: number = 1): Promise<number> {
		key += this.local;
		const result: MemcachedResponse | null = await this.handleError(this.client.increment(key, add));
		if (result && result.value !== null) {
			return result.value;
		} else {
			await this.tbset(key, 1, sec);
			return 1;
		}
	}

	async get(key: string, debug: boolean = false): Promise<any> {
		return this.tbget(key, debug);
	}

	async set(key: string, value: any, sec: number = 86400): Promise<void> {
		return this.tbset(key, value, sec);
	}

	async add(key: string, value: any, sec: number = 86400): Promise<void> {
		key += this.local;
		await this.handleError(this.client.add(key, value, { expires: sec }));
	}
}

export default MemCache78;