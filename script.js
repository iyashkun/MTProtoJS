// MTProto JS Client using @mtproto/core
// Comprehensive implementation using direct TL schema calls via the library

const MTProto = require('@mtproto/core');
const TL = require('@mtproto/core/tl');
const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');
const BigInt = require('big-integer');
const input = require('input');


const API_ID = ;
const API_HASH = '';
const PHONE_NUMBER = '';
const TWO_FA_PASSWORD = '';
const STORAGE_PATH = path.resolve(__dirname, './session.json');

// Custom storage class for persistence
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
  delete(key) {
    let data = {};
    try {
      data = JSON.parse(fs.readFileSync(this.path, 'utf8'));
    } catch {}
    delete data[key];
    fs.writeFileSync(this.path, JSON.stringify(data));
  }
}

const storage = new FileStorage(STORAGE_PATH);
const mtproto = new MTProto({
  api_id: API_ID,
  api_hash: API_HASH,
  storage: storage,
  systemLanguage: 'en',
  deviceModel: 'NodeJS',
  systemVersion: '18.0.0',
  appVersion: '1.0.0',
  langCode: 'en',
  langPack: '',
  transport: 'tcp',
  test: false,
});

function generateRandomLong() {
  return BigInt.rand(BigInt(2).pow(63), BigInt(2).pow(64).subtract(1)).toString();
}

function generateSecretToken() {
  const token = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
  console.log('Generated secret token (for custom use):', token);
  return token;
}

async function authenticate() {
  await mtproto.start();
  if (mtproto.storage.get('dc')) {
    console.log('Session loaded, already authorized.');
    return await mtproto.call('users.getFullUser', { id: { _: 'inputUserSelf' } });
  }
  console.log('Starting authentication...');
 
  // TL: auth.sendCode
  const { phone_code_hash } = await mtproto.call('auth.sendCode', {
    phone_number: PHONE_NUMBER,
    settings: { _: 'codeSettings' },
  });
  console.log('Code hash:', phone_code_hash);

  const phone_code = await input.text('Enter the code received: ');
  try {
    // TL: auth.signIn
    const { user } = await mtproto.call('auth.signIn', {
      phone_number: PHONE_NUMBER,
      phone_code_hash,
      phone_code,
    });
    console.log('Sign-in success:', user.first_name);
    return user;
  } catch (err) {
    if (err.error_message === 'SESSION_PASSWORD_NEEDED') {
      // TL: account.getPassword + auth.checkPassword for 2FA
      const { current_algo, srp_id, srp_B } = await mtproto.call('account.getPassword');
      const { g, p, salt1, salt2 } = current_algo;
      const srpParams = await mtproto.crypto.getSRPParams({
        g: BigInt(g),
        p: BigInt(p),
        salt1,
        salt2,
        gB: BigInt(srp_B),
        password: TWO_FA_PASSWORD,
      });
      const { user } = await mtproto.call('auth.checkPassword', {
        password: { _: 'inputCheckPasswordSRP', srp_id, A: srpParams.A, M1: srpParams.M1 },
      });
      console.log('2FA success:', user.first_name);
      return user;
    }
    throw err;
  }
}

// Config Fetch using TL help.getConfig - extracts autologin_token
async function fetchConfig() {
  try {
    // TL call: help.getConfig# c4f9186b = Config;
    const config = await mtproto.call('help.getConfig', {});
    console.log('Config fetched (partial):');
    console.log('This DC:', config.this_dc);
    console.log('DC Options count:', config.dc_options.length);
    config.dc_options.slice(0, 5).forEach((dc, i) => {
      console.log(`DC ${dc.id}: ${dc.ip_address}:${dc.port} (IPv6: ${dc.ipv6})`);
    });
    // autologin_token extraction - as per TL schema flags.16?true string
    if (config.autologin_token) {
      console.log('*** AUTOLOGIN TOKEN ***:', config.autologin_token);
      fs.writeFileSync(path.resolve(__dirname, './autologin_token.txt'), config.autologin_token);
      console.log('Token saved to autologin_token.txt');
    } else {
      console.warn('No autologin_token in this session (may require web/app context)');
    }
    console.log('Full config date:', new Date(config.date * 1000).toISOString());
    console.log('Chat size max:', config.chat_size_max);
    return config;
  } catch (err) {
    console.error('getConfig error:', err);
    throw err;
  }
}

function setupUpdates() {
  // TL Updates: mtproto.updates.on for various types
  mtproto.updates.on('updates', (updates) => {
    console.log('Full updates received:', updates);
    updates.updates.forEach(update => {
      if (update._ === 'updateShortMessage') { // TL: updateShortMessage#914fb0f7
        console.log('*** MATCHING SAMPLE: updateShortMessage ***');
        console.log('ID:', update.id);
        console.log('User ID:', update.user_id);
        console.log('Message:', update.message);
        console.log('PTS:', update.pts);
        console.log('Date:', new Date(update.date * 1000).toISOString());
        console.log('Entities:', update.entities || []);
        if (update.message.includes('new message')) {
          console.log('Auto-handling notification...');
        }
      }
    });
  });

  mtproto.updates.on('updateShort', (update) => console.log('Short update:', update));
  mtproto.updates.on('updatesTooLong', (info) => console.log('Too long:', info));
  console.log('Updates handler active - waiting for push like sample...');
}

async function sendMessage(peer, text) {
  const random_id = generateRandomLong();
  try {
    // TL: messages.sendMessage# a5776738
    const result = await mtproto.call('messages.sendMessage', {
      peer, // e.g., { _: 'inputPeerSelf' }
      message: text,
      random_id,
      noforwards: true,
    });
    console.log('Message sent:', result);
    return result;
  } catch (err) {
    console.error('Send error:', err);
  }
}

// TL Fetch History messages.getHistory
async function getHistory(peer, limit = 100) {
  try {
    const history = await mtproto.call('messages.getHistory', {
      peer,
      limit,
      offset_id: 0,
      offset_date: 0,
      add_offset: 0,
      max_id: 0,
      min_id: 0,
      hash: 0,
    });
    console.log(`History: ${history.messages.length} msgs`);
    return history;
  } catch (err) {
    console.error('History error:', err);
  }
}

async function flood(peer, text, count = 50) {
  console.warn('FLOOD: May ban account!');
  for (let i = 0; i < count; i++) {
    await sendMessage(peer, `${text} #${i}`);
    await new Promise(r => setTimeout(r, 1500));
  }
}

async function bulkResolve(usernames) {
  for (const username of usernames) {
    try {
      const resolved = await mtproto.call('contacts.resolveUsername', { username });
      console.log(`Resolved @${username}:`, resolved.users[0]?.id);
      await new Promise(r => setTimeout(r, 800));
    } catch (err) {
      console.error(`Resolve fail:`, err);
    }
  }
}

async function createSecretChat(user_id) {
  try {
    // TL: messages.requestEncryption#f5bb5152
    const result = await mtproto.call('messages.requestEncryption', {
      peer: { _: 'inputUser', user_id },
      random_length: 16,
      g_a: Buffer.alloc(256).fill(0), // g^a from DH - implement full!
    });
    console.log('Secret chat requested:', result);
  } catch (err) {
    console.error('Secret error:', err);
  }
}

async function deleteMessages(channel, ids, revoke = true) {
  try {
    await mtproto.call('messages.deleteMessages', { channel, id: ids, revoke });
    console.log('Delete (permanent if revoke): done');
  } catch (err) {
    console.error('Delete error:', err);
  }
}


async function main() {
  generateSecretToken();
 
  await authenticate();
  const config = await fetchConfig();
  setupUpdates();
  const me = await mtproto.call('users.getCurrentUser', {});
  const selfPeer = { _: 'inputPeerSelf' };
  await sendMessage(selfPeer, 'MTProto TL Client active!');
  await getHistory(selfPeer, 20);
  
  // await flood(selfPeer, 'testing', 10);
  // await bulkResolve(['telegram', 'durov']);
  // await createSecretChat(777000); // ex. user_id
  // await deleteMessages('me', [333], true); // ex. Message IDs
  // const init = await mtproto.call('initConnection', { ... }); // Full params from schema
  
  console.log('Session Complete. Listening for updates...');
  process.stdin.resume();
}
main().catch(console.error);
