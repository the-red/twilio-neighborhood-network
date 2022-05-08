exports.handler = function (context, event, callback) {
  const opt = {
    language: 'ja-jp',
    voice: 'Polly.Mizuki',
  };
  const twiml = new Twilio.twiml.VoiceResponse();

  const members = require(Runtime.getAssets()['/recorders.js'].path);
  const membersCount = Object.keys(members).length;

  twiml.say(`関係者${membersCount}人の、発音チェックを行います。`, opt);
  twiml.pause();

  Object.values(members).forEach((name) => {
    twiml.say(`${name}からのお知らせです。`, opt);
    twiml.pause();
  });

  callback(null, twiml);
};
