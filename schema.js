const TL_SCHEMA = {
  constructors: {
    'int?': { id: null, type: 'Int', params: [] },
    'long?': { id: null, type: 'Long', params: [] },
    'double?': { id: null, type: 'Double', params: [] },
    'string?': { id: null, type: 'String', params: [] },
    'vector {t:Type} # [ t ]': { id: 0x1cb5c415, type: 'Vector t', params: [] },
    'int128 4*[ int ]': { id: null, type: 'Int128', params: [] },
    'int256 8*[ int ]': { id: null, type: 'Int256', params: [] },
    'resPQ#05162463': { id: 0x05162463, type: 'ResPQ', params: [
      { name: 'nonce', type: 'int128' },
      { name: 'server_nonce', type: 'int128' },
      { name: 'pq', type: 'bytes' },
      { name: 'server_public_key_fingerprints', type: 'Vector<long>' }
    ] },
    'p_q_inner_data_dc#a9f55f95': { id: 0xa9f55f95, type: 'P_Q_inner_data', params: [
      { name: 'pq', type: 'bytes' },
      { name: 'p', type: 'bytes' },
      { name: 'q', type: 'bytes' },
      { name: 'nonce', type: 'int128' },
      { name: 'server_nonce', type: 'int128' },
      { name: 'new_nonce', type: 'int256' },
      { name: 'dc', type: 'int' }
    ] },
    'p_q_inner_data_temp_dc#56fddf88': { id: 0x56fddf88, type: 'P_Q_inner_data', params: [
      { name: 'pq', type: 'bytes' },
      { name: 'p', type: 'bytes' },
      { name: 'q', type: 'bytes' },
      { name: 'nonce', type: 'int128' },
      { name: 'server_nonce', type: 'int128' },
      { name: 'new_nonce', type: 'int256' },
      { name: 'dc', type: 'int' },
      { name: 'expires_in', type: 'int' }
    ] },
    'server_DH_params_ok#d0e8075c': { id: 0xd0e8075c, type: 'Server_DH_Params', params: [
      { name: 'nonce', type: 'int128' },
      { name: 'server_nonce', type: 'int128' },
      { name: 'encrypted_answer', type: 'bytes' }
    ] },
    'server_DH_inner_data#b5890dba': { id: 0xb5890dba, type: 'Server_DH_inner_data', params: [
      { name: 'nonce', type: 'int128' },
      { name: 'server_nonce', type: 'int128' },
      { name: 'g', type: 'int' },
      { name: 'dh_prime', type: 'bytes' },
      { name: 'g_a', type: 'bytes' },
      { name: 'server_time', type: 'int' }
    ] },
    'client_DH_inner_data#6643b654': { id: 0x6643b654, type: 'Client_DH_Inner_Data', params: [
      { name: 'nonce', type: 'int128' },
      { name: 'server_nonce', type: 'int128' },
      { name: 'retry_id', type: 'long' },
      { name: 'g_b', type: 'bytes' }
    ] },
    'dh_gen_ok#3bcbf734': { id: 0x3bcbf734, type: 'Set_client_DH_params_answer', params: [
      { name: 'nonce', type: 'int128' },
      { name: 'server_nonce', type: 'int128' },
      { name: 'new_nonce_hash1', type: 'int128' }
    ] },
    'dh_gen_retry#46dc1fb9': { id: 0x46dc1fb9, type: 'Set_client_DH_params_answer', params: [
      { name: 'nonce', type: 'int128' },
      { name: 'server_nonce', type: 'int128' },
      { name: 'new_nonce_hash2', type: 'int128' }
    ] },
    'dh_gen_fail#a69dae02': { id: 0xa69dae02, type: 'Set_client_DH_params_answer', params: [
      { name: 'nonce', type: 'int128' },
      { name: 'server_nonce', type: 'int128' },
      { name: 'new_nonce_hash3', type: 'int128' }
    ] },
    'bind_auth_key_inner#75a3f765': { id: 0x75a3f765, type: 'BindAuthKeyInner', params: [
      { name: 'nonce', type: 'long' },
      { name: 'temp_auth_key_id', type: 'long' },
      { name: 'perm_auth_key_id', type: 'long' },
      { name: 'temp_session_id', type: 'long' },
      { name: 'expires_at', type: 'int' }
    ] },
    'rpc_result#f35c6d01': { id: 0xf35c6d01, type: 'RpcResult', params: [
      { name: 'req_msg_id', type: 'long' },
      { name: 'result', type: 'Object' }
    ] },
    'rpc_error#2144ca19': { id: 0x2144ca19, type: 'RpcError', params: [
      { name: 'error_code', type: 'int' },
      { name: 'error_message', type: 'string' }
    ] },
    'rpc_answer_unknown#5e2ad36e': { id: 0x5e2ad36e, type: 'RpcDropAnswer', params: [] },
    'rpc_answer_dropped_running#cd78e586': { id: 0xcd78e586, type: 'RpcDropAnswer', params: [] },
    'rpc_answer_dropped#a43ad8b7': { id: 0xa43ad8b7, type: 'RpcDropAnswer', params: [
      { name: 'msg_id', type: 'long' },
      { name: 'seq_no', type: 'int' },
      { name: 'bytes', type: 'int' }
    ] },
    'future_salt#0949d9dc': { id: 0x0949d9dc, type: 'FutureSalt', params: [
      { name: 'valid_since', type: 'int' },
      { name: 'valid_until', type: 'int' },
      { name: 'salt', type: 'long' }
    ] },
    'future_salts#ae500895': { id: 0xae500895, type: 'FutureSalts', params: [
      { name: 'req_msg_id', type: 'long' },
      { name: 'now', type: 'int' },
      { name: 'salts', type: 'vector<future_salt>' }
    ] },
    'pong#347773c5': { id: 0x347773c5, type: 'Pong', params: [
      { name: 'msg_id', type: 'long' },
      { name: 'ping_id', type: 'long' }
    ] },
    'destroy_session_ok#e22045fc': { id: 0xe22045fc, type: 'DestroySessionRes', params: [
      { name: 'session_id', type: 'long' }
    ] },
    'destroy_session_none#62d350c9': { id: 0x62d350c9, type: 'DestroySessionRes', params: [
      { name: 'session_id', type: 'long' }
    ] },
    'new_session_created#9ec20908': { id: 0x9ec20908, type: 'NewSession', params: [
      { name: 'first_msg_id', type: 'long' },
      { name: 'unique_id', type: 'long' },
      { name: 'server_salt', type: 'long' }
    ] },
    'msg_container#73f1f8dc': { id: 0x73f1f8dc, type: 'MessageContainer', params: [
      { name: 'messages', type: 'vector<%Message>' }
    ] },
    'message': { id: null, type: 'Message', params: [
      { name: 'msg_id', type: 'long' },
      { name: 'seqno', type: 'int' },
      { name: 'bytes', type: 'int' },
      { name: 'body', type: 'Object' }
    ] },
    'msg_copy#e06046b2': { id: 0xe06046b2, type: 'MessageCopy', params: [
      { name: 'orig_message', type: 'Message' }
    ] },
    'gzip_packed#3072cfa1': { id: 0x3072cfa1, type: 'Object', params: [
      { name: 'packed_data', type: 'bytes' }
    ] },
    'msgs_ack#62d6b459': { id: 0x62d6b459, type: 'MsgsAck', params: [
      { name: 'msg_ids', type: 'Vector<long>' }
    ] },
    'bad_msg_notification#a7eff811': { id: 0xa7eff811, type: 'BadMsgNotification', params: [
      { name: 'bad_msg_id', type: 'long' },
      { name: 'bad_msg_seqno', type: 'int' },
      { name: 'error_code', type: 'int' }
    ] },
    'bad_server_salt#edab447b': { id: 0xedab447b, type: 'BadMsgNotification', params: [
      { name: 'bad_msg_id', type: 'long' },
      { name: 'bad_msg_seqno', type: 'int' },
      { name: 'error_code', type: 'int' },
      { name: 'new_server_salt', type: 'long' }
    ] },
    'msg_resend_req#7d861a08': { id: 0x7d861a08, type: 'MsgResendReq', params: [
      { name: 'msg_ids', type: 'Vector<long>' }
    ] },
    'msgs_state_req#da69fb52': { id: 0xda69fb52, type: 'MsgsStateReq', params: [
      { name: 'msg_ids', type: 'Vector<long>' }
    ] },
    'msgs_state_info#04deb57d': { id: 0x04deb57d, type: 'MsgsStateInfo', params: [
      { name: 'req_msg_id', type: 'long' },
      { name: 'info', type: 'bytes' }
    ] },
    'msgs_all_info#8cc0d131': { id: 0x8cc0d131, type: 'MsgsAllInfo', params: [
      { name: 'msg_ids', type: 'Vector<long>' },
      { name: 'info', type: 'bytes' }
    ] },
    'msg_detailed_info#276d3ec6': { id: 0x276d3ec6, type: 'MsgDetailedInfo', params: [
      { name: 'msg_id', type: 'long' },
      { name: 'answer_msg_id', type: 'long' },
      { name: 'bytes', type: 'int' },
      { name: 'status', type: 'int' }
    ] },
    'msg_new_detailed_info#809db6df': { id: 0x809db6df, type: 'MsgDetailedInfo', params: [
      { name: 'answer_msg_id', type: 'long' },
      { name: 'bytes', type: 'int' },
      { name: 'status', type: 'int' }
    ] },
    'destroy_auth_key_ok#f660e1d4': { id: 0xf660e1d4, type: 'DestroyAuthKeyRes', params: [] },
    'destroy_auth_key_none#0a9f2259': { id: 0x0a9f2259, type: 'DestroyAuthKeyRes', params: [] },
    'destroy_auth_key_fail#ea109b13': { id: 0xea109b13, type: 'DestroyAuthKeyRes', params: [] },
    'http_wait#9299359f': { id: 0x9299359f, type: 'HttpWait', params: [
      { name: 'max_delay', type: 'int' },
      { name: 'wait_after', type: 'int' },
      { name: 'max_wait', type: 'int' }
    ] }
  },
  methods: {
    'req_pq_multi#be7e8ef1': { id: 0xbe7e8ef1, type: 'ResPQ', params: [
      { name: 'nonce', type: 'int128' }
    ] },
    'req_DH_params#d712e4be': { id: 0xd712e4be, type: 'Server_DH_Params', params: [
      { name: 'nonce', type: 'int128' },
      { name: 'server_nonce', type: 'int128' },
      { name: 'p', type: 'bytes' },
      { name: 'q', type: 'bytes' },
      { name: 'public_key_fingerprint', type: 'long' },
      { name: 'encrypted_data', type: 'bytes' }
    ] },
    'set_client_DH_params#f5045f1f': { id: 0xf5045f1f, type: 'Set_client_DH_params_answer', params: [
      { name: 'nonce', type: 'int128' },
      { name: 'server_nonce', type: 'int128' },
      { name: 'encrypted_data', type: 'bytes' }
    ] },
    'rpc_drop_answer#58e4a740': { id: 0x58e4a740, type: 'RpcDropAnswer', params: [
      { name: 'req_msg_id', type: 'long' }
    ] },
    'get_future_salts#b921bd04': { id: 0xb921bd04, type: 'FutureSalts', params: [
      { name: 'num', type: 'int' }
    ] },
    'ping#7abe77ec': { id: 0x7abe77ec, type: 'Pong', params: [
      { name: 'ping_id', type: 'long' }
    ] },
    'ping_delay_disconnect#f3427b8c': { id: 0xf3427b8c, type: 'Pong', params: [
      { name: 'ping_id', type: 'long' },
      { name: 'disconnect_delay', type: 'int' }
    ] },
    'destroy_session#e7512126': { id: 0xe7512126, type: 'DestroySessionRes', params: [
      { name: 'session_id', type: 'long' }
    ] },
    'destroy_auth_key#d1435160': { id: 0xd1435160, type: 'DestroyAuthKeyRes', params: [] }
  }
};

module.exports = TL_SCHEMA;
