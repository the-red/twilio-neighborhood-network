exports.handler = function(context, event, callback) {
  const opt = {
    language: 'ja-jp',
    voice: 'Polly.Mizuki',
  };
  const twiml = new Twilio.twiml.VoiceResponse();
  const { RecordingUrl } = event;

  const organization = process.env.ORGANIZATION || '電話連絡網';
  twiml.say(`こんにちは。${organization}からのお知らせです。`, opt);
  twiml.play(RecordingUrl);

  let finalMessage = `メッセージは以上です。`;
  if (process.env.IS_RECORDER) {
    finalMessage += `この電話番号宛に電話をかけると、
  メッセージを録音し、関係者に録音内容が転送されます。
  緊急情報の共有に活用してください。`;
  }
  twiml.say(finalMessage, opt);

  callback(null, twiml);
};
