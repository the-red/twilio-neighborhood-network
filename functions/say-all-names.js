exports.handler = function(context, event, callback) {
  const opt = {
    language: 'ja-jp',
    voice: 'Polly.Mizuki',
  };
  const twiml = new Twilio.twiml.VoiceResponse();

  const recorders = require(Runtime.getAssets()['recorders.js'].path);
  Object.values(recorders).forEach(name => {
    twiml.say(`${name}からのお知らせです。`, opt);
    twiml.pause();
  });

  callback(null, twiml);
};
