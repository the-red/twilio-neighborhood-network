exports.handler = function(context, event, callback) {
  const opt = {
    language: 'ja-jp',
    voice: 'Polly.Mizuki',
  };
  const twiml = new Twilio.twiml.VoiceResponse();
  const { Recorder, RecordingUrl } = event;

  const organization = context.ORGANIZATION || '電話連絡網';
  const recorders = require(Runtime.getAssets()['/recorders.js'].path);
  const name = recorders[Recorder];

  twiml.say(`こんにちは。${organization}、${name}からのお知らせです。`, opt);
  twiml.pause();
  twiml.play(RecordingUrl);
  twiml.pause();

  let finalMessage = `メッセージは以上です。`;
  if (context.IS_RECORDER) {
    finalMessage += `この電話番号宛に電話をかけると、
  メッセージを録音し、関係者に録音内容が転送されます。
  緊急情報の共有に活用してください。`;
  }

  twiml.say(finalMessage, opt);
  twiml.pause();

  callback(null, twiml);
};
