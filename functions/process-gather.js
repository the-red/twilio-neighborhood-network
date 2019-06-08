exports.handler = function(context, event, callback) {
  const opt = {
    language: 'ja-JP',
    voice: 'Polly.Mizuki',
  };
  const twiml = new Twilio.twiml.VoiceResponse();

  switch (event.Digits) {
    case '1':
      // TODO: 再生機能を作る
      twiml.say('再生機能の実装まで、今しばらくお待ちください。', opt);
      break;
    case '3':
      twiml.redirect('/record');
      break;
    default:
      twiml.say('正しい番号が入力されませんでした。', opt);
      twiml.redirect('/main');
  }

  callback(null, twiml);
};
