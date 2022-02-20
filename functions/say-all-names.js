exports.handler = function (context, event, callback) {
  const opt = {
    language: 'ja-jp',
    voice: 'Polly.Mizuki',
  };
  const twiml = new Twilio.twiml.VoiceResponse();

  const recorders = require(Runtime.getAssets()['/recorders.js'].path);
  const recordersCount = Object.keys(recorders).length;

  twiml.say(`関係者${recordersCount}人の、発音チェックを行います。`, opt);
  twiml.pause();

  Object.values(recorders).forEach((name) => {
    twiml.say(`${name}からのお知らせです。`, opt);
    twiml.pause();
  });

  callback(null, twiml);
};
