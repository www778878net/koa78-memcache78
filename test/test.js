'use strict';
const expect = require('chai').expect;
const MemCache78 = require('../dist/index').default;
var iconv = require('iconv-lite');
var fs = require('fs'); 
console.log(process.argv)
var fspath = process.argv[3]
var config = loadjson(fspath);
console.log(config)

function loadjson(filepath) {
    var data;
    try {
        var jsondata = iconv.decode(fs.readFileSync(filepath, "binary"), "utf8");
        data = JSON.parse(jsondata); 
    }
    catch (err) {
        console.log(err);
    }
    return data;
}

console.log('Loaded config:', config);

// ?????? config.memcached
let memcached78 = new MemCache78(config);

describe('test null config', () => {
    it('should throw error', () => {
        expect(() => new MemCache78(null)).to.throw('Invalid configuration: config must be an object');
    });
});

describe('test invalid config ', () => {
    it(' should throw error', () => {
        expect(() => new MemCache78(null)).to.throw('Invalid configuration: config must be an object');
    });
});

describe('test set  ', () => {
    it(' return true',async () => { 
        let result=await memcached78.set("testitem", 1, 60) 
        expect(result).to.be.true;
    });
});

describe('test get  ', () => {
    it(' return 1',async () => {
        let result = await memcached78.get("testitem") 
        expect(result).to.equals(1);
    });
}); 

describe('test incr  ', () => {
    it(' return 2',async () => {
        let result = await memcached78.incr("testitem") 
        expect(result).to.equals(2);
    });
}); 

describe('test del  ', () => {
    it(' return true',async () => {
        let result = await memcached78.del("testitem") 
        expect(result).to.be.true;
    });
}); 

describe('test tbset  ', () => {
    it(' return true',async () => {
        let result = await memcached78.tbset("testitemset", {test:1,test2:2},30) 
        expect(result).to.be.true;
    });
}); 

describe('test tbget  ', () => {
    it(' return true',async () => {
        let result = await memcached78.tbget("testitemset" ) 
        expect(result["test2"]).to.equals(2);
    });
});

describe('test default config', () => {
    it('should use default values', () => {
        const memcache = new MemCache78({});
        expect(memcache).to.be.an.instanceOf(MemCache78);
    });
});
