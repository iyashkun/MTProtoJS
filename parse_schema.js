const fs = require('fs');

const rawTL = fs.readFileSync('./Telegram_api.tl', 'utf8');
const TL_SCHEMA = {
  constructors: {},
  methods: {}
};

rawTL.split('\n').forEach(line => {
  line = line.trim();
  if (!line || line.startsWith('//') || line.includes('===')) return;

  const consMatch = line.match(/^(\w+)(#[\da-f]{8})?\s*(.*)\s*=\s*(\w+);$/);
  if (consMatch) {
    const name = consMatch[1];
    const id = consMatch[2] ? parseInt(consMatch[2].substring(1), 16) : null;
    const paramsStr = consMatch[3].trim();
    const type = consMatch[4];

    const params = [];
    if (paramsStr) {
      paramsStr.split(',').forEach(param => {
        param = param.trim();
        if (param) {
          const flagMatch = param.match(/flags\.(\d+)\?(\w+)\s+(\w+):(\w+)/);
          if (flagMatch) {
            params.push({ name: flagMatch[3], type: flagMatch[4], flag: parseInt(flagMatch[1]) });
          } else {
            const simpleMatch = param.match(/(\w+):(\w+)/);
            if (simpleMatch) {
              params.push({ name: simpleMatch[1], type: simpleMatch[2] });
            }
          }
        }
      });
    }

    TL_SCHEMA.constructors[name] = { id, type, params };
    return;
  }

  const methodMatch = line.match(/^(\w+)#([\da-f]{8})\s*(.*)\s*=\s*(\w+);$/);
  if (methodMatch) {
    const name = methodMatch[1];
    const id = parseInt(methodMatch[2], 16);
    const paramsStr = methodMatch[3].trim();
    const returnType = methodMatch[4];

    const params = [];
    if (paramsStr) {
      paramsStr.split(',').forEach(param => {
        param = param.trim();
        if (param) {
          const simpleMatch = param.match(/(\w+):(\w+)/);
          if (simpleMatch) {
            params.push({ name: simpleMatch[1], type: simpleMatch[2] });
          }
        }
      });
    }

    TL_SCHEMA.methods[name] = { id, type: returnType, params };
  }
});

console.log('Parsed constructors count:', Object.keys(TL_SCHEMA.constructors).length);
console.log('Parsed methods count:', Object.keys(TL_SCHEMA.methods).length);
module.exports = TL_SCHEMA;
