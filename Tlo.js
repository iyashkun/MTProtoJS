const BigInt = require('big-integer');

class TLO {
  constructor(schema) {
    this.schema = schema;
    this.buffer = null;
    this.offset = 0;
  }

  write(constructorName, params) {
    const cons = this.findConstructor(constructorName);
    if (!cons) throw new Error(`Unknown constructor: ${constructorName}`);

    const idBuf = this.packInt(cons.id);
    this.buffer = Buffer.concat([idBuf, this.writeParams(cons.params, params)]);
    return this.buffer;
  }

  writeParams(paramDefs, values) {
    let buf = Buffer.alloc(0);
    for (let i = 0; i < paramDefs.length; i++) {
      const def = paramDefs[i];
      const val = values[def.name];
      switch (def.type) {
        case 'int':
          buf = Buffer.concat([buf, this.packInt(val)]);
          break;
        case 'long':
          buf = Buffer.concat([buf, this.packLong(val)]);
          break;
        case 'bytes':
          buf = Buffer.concat([buf, this.packBytes(val)]);
          break;
        case 'string':
          buf = Buffer.concat([buf, this.packString(val)]);
          break;
        default:
          if (def.type.startsWith('Vector<')) {
            const innerType = def.type.slice(7, -1);
            buf = Buffer.concat([buf, this.packVector(innerType, val)]);
          } else {
            throw new Error(`Unsupported type: ${def.type}`);
          }
      }
    }
    return buf;
  }

  read(buffer) {
    this.buffer = buffer;
    this.offset = 0;
    const id = this.unpackInt();
    const cons = this.findById(id);
    if (!cons) throw new Error(`Unknown ID: ${id.toString(16)}`);

    const params = {};
    for (let def of cons.params) {
      params[def.name] = this.readParam(def.type);
    }
    return { constructor: cons.type, params };
  }

  readParam(type) {
    switch (type) {
      case 'int':
        return this.unpackInt();
      case 'long':
        return this.unpackLong();
      case 'bytes':
        return this.unpackBytes();
      case 'string':
        return this.unpackString();
      default:
        if (type.startsWith('Vector<')) {
          const innerType = type.slice(7, -1);
          return this.unpackVector(innerType);
        }
        throw new Error(`Unsupported type: ${type}`);
    }
  }

  packInt(n) {
    const buf = Buffer.alloc(4);
    buf.writeInt32LE(n, 0);
    return buf;
  }

  unpackInt() {
    const val = this.buffer.readInt32LE(this.offset);
    this.offset += 4;
    return val;
  }

  packLong(n) {
    const big = BigInt(n);
    const buf = Buffer.alloc(8);
    buf.writeBigInt64LE(big.toString(), 0);
    return buf;
  }

  unpackLong() {
    const val = this.buffer.readBigInt64LE(this.offset);
    this.offset += 8;
    return val.toString();
  }

  packBytes(b) {
    const lenBuf = this.packInt(b.length);
    return Buffer.concat([lenBuf, Buffer.from(b)]);
  }

  unpackBytes() {
    const len = this.unpackInt();
    const val = this.buffer.slice(this.offset, this.offset + len);
    this.offset += len;
    return val;
  }

  packString(s) {
    return this.packBytes(s, true);
  }

  unpackString() {
    return this.unpackBytes().toString();
  }

  packVector(type, arr) {
    const lenBuf = this.packInt(arr.length);
    let innerBuf = Buffer.alloc(0);
    for (let item of arr) {
      innerBuf = Buffer.concat([innerBuf, this.writeParam(type, item)]);
    }
    return Buffer.concat([lenBuf, innerBuf]);
  }

  unpackVector(type) {
    const len = this.unpackInt();
    const arr = [];
    for (let i = 0; i < len; i++) {
      arr.push(this.readParam(type));
    }
    return arr;
  }

  findConstructor(name) {
    return this.schema.constructors[name];
  }

  findById(id) {
    for (let key in this.schema.constructors) {
      if (this.schema.constructors[key].id === id) return this.schema.constructors[key];
    }
    return null;
  }
}

module.exports = TLO;
