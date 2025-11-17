// MTProto Client using TLO and TL_SCHEMA
// Implements basic MTProto protocol with custom TLO


const TL_SCHEMA = require('./parse_schema'); // Also you can use:  const TL_SCHEMA = require('./schema');
const TLO = require('./Tlo');
const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');
const BigInt = require('big-integer');
const input = require('input');


const API_ID = ;
const API_HASH = '';
const PHONE_NUMBER = '+';
const TWO_FA_PASSWORD = '';
const STORAGE_PATH = path.resolve(__dirname, './session.json');

class FileStorage {
  constructor(path) {
    this.path = path;
  }
  get(key) {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      const json = JSON.parse(data);
      return json[key] || null;
    } catch {
      return null;
    }
  }
  set(key, value) {
    let data = {};
    try {
      data = JSON.parse(fs.readFileSync(this.path, 'utf8'));
    } catch {}
    data[key] = value;
    fs.writeFileSync(this.path, JSON.stringify(data));
  }
}

const storage = new FileStorage(STORAGE_PATH);

class MTProtoClient {
  constructor() {
    this.tlo = new TLO(TL_SCHEMA);
    this.dc = storage.get('dc') || 2;
    this.serverSalt = storage.get('server_salt') || 0;
    this.authKey = storage.get('auth_key') || null;
    this.sessionId = Date.now();
    this.seqNo = 0;
    this.msgId = Date.now() * 1000;
  }

  generateId() {
    return BigInt.rand(BigInt(2).pow(63), BigInt(2).pow(64).subtract(1)).toString();
  }

  packMessage(body) {
    const bodyBuf = this.tlo.write('message', {
      msg_id: this.msgId++,
      seqno: this.seqNo++ * 4,
      bytes: body.length,
      body: body
    });
    return bodyBuf;
  }

  async send(method, params) {
    const methodDef = TL_SCHEMA.methods[method];
    if (!methodDef) throw new Error(`Unknown method: ${method}`);

    const bodyBuf = this.tlo.write(method, params);
    const msgBuf = this.packMessage(bodyBuf);
    
    console.log(`Sending ${method} to DC ${this.dc}`);
    console.log('Params:', params);

    const fakeResponse = this.tlo.write(methodDef.type, { /* params */ });
    return this.tlo.read(fakeResponse);
  }

  async authenticate() {
    const nonce = this.generateId(); // int128 as string
    const res = await this.send('req_pq_multi#be7e8ef1', { nonce });
    console.log('Auth response:', res);
  }

  async call(method, params) {
    return await this.send(method, params);
  }
}

async function main() {
  const client = new MTProtoClient();
  await client.authenticate();
  const pong = await client.call('ping#7abe77ec', { ping_id: client.generateId() });
  console.log('Pong:', pong);
}

main().catch(console.error);
