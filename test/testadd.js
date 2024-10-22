'use strict';
const expect = require('chai').expect;
const MemCache78 = require('../dist/index').default;
const fs = require('fs');
const path = require('path');

// 加载 JSON 配置文件
function loadJson(filepath) {
    try {
        console.log('Reading JSON file from:', filepath);
        const jsonData = fs.readFileSync(filepath, 'utf8');
        console.log('JSON data:', jsonData);
        return JSON.parse(jsonData);
    } catch (err) {
        console.error('Error loading JSON file:', err);
        return null;
    }
}

const configPath = path.resolve(__dirname, '../config.json'); // 直接写死配置文件路径
console.log('Config path:', configPath);
const config = loadJson(configPath);
console.log('Loaded config:', config);

if (!config) {
    throw new Error('Invalid configuration: config must be an object');
}

const memcached78 = new MemCache78(config);

describe('MemCache78 add method', () => { 

    it('should fail to add a key-value pair if the key already exists', async () => {
        const key = 'test_key5';
        const value = 'test_value';
        await memcached78.add(key, value); // First add
        const result = await memcached78.add(key, value); // Second add should fail
        expect(result).to.be.false;
    });
});