exports.handler = function(context, event, callback) {
  const opt = {
    language: 'ja-JP',
    voice: 'Polly.Mizuki',
  };
  const twiml = new Twilio.twiml.VoiceResponse();

  const recorders = require(Runtime.getAssets()['recorders.js'].path);

  if (event.Digits === '1') {
    twiml.redirect('/replay');
    callback(null, twiml);
    return;
  }

  if (event.Digits === '3' && recorders[event.From]) {
    twiml.redirect('/record');
    callback(null, twiml);
    return;
  }

  twiml.say('正しい番号が入力されませんでした。', opt);
  twiml.redirect('/main');
  callback(null, twiml);
};
