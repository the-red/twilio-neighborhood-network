exports.handler = function(context, event, callback) {
  const opt = {
    language: 'ja-jp',
    voice: 'Polly.Mizuki',
  };
  const twiml = new Twilio.twiml.VoiceResponse();

  const listeners = require(Runtime.getAssets()['listeners.js'].path);
  const listenersCount = Object.keys(listeners).length;

  twiml.say(`関係者${listenersCount}人の、発音チェックを行います。`, opt);
  twiml.pause();

  Object.values(listeners).forEach(name => {
    twiml.say(`${name}からのお知らせです。`, opt);
    twiml.pause();
  });

  callback(null, twiml);
};
