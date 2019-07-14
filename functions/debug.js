exports.handler = function(context, event, callback) {
  const twiml = new Twilio.twiml.VoiceResponse();

  // 全員の名前を音読させてチェック
  twiml.redirect('/say-all-names');

  callback(null, twiml);
};
