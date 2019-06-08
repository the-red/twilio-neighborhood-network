exports.handler = function(context, event, callback) {
  const opt = {
    language: 'ja-JP',
    voice: 'Polly.Mizuki',
  };
  const twiml = new Twilio.twiml.VoiceResponse();

  switch (event.Digits) {
    case '1':
      twiml.redirect('/replay');
      callback(null, twiml);
      break;

    case '3':
      twiml.redirect('/record');
      callback(null, twiml);
      break;

    default:
      twiml.say('正しい番号が入力されませんでした。', opt);
      twiml.redirect('/main');
      callback(null, twiml);
  }
};
