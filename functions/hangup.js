exports.handler = function(context, event, callback) {
  const opt = {
    language: 'ja-jp',
    voice: 'Polly.Mizuki',
  };
  const twiml = new Twilio.twiml.VoiceResponse();
  twiml.say(`録音を終了しました。`, opt);
  twiml.pause();
  twiml.hangup();
  callback(null, twiml);
};
