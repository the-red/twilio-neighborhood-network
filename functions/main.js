exports.handler = function(context, event, callback) {
  const opt = {
    language: 'ja-JP',
    voice: 'Polly.Mizuki',
  };
  const twiml = new Twilio.twiml.VoiceResponse();

  const recorders = require(Runtime.getAssets()['recorders.js'].path);
  const listeners = require(Runtime.getAssets()['listeners.js'].path);
  const allUserNumbers = [...Object.keys(recorders), ...Object.keys(listeners)];

  console.log(event);

  if (!allUserNumbers.includes(event.From)) {
    twiml.reject();
    console.log('rejected!', event.From);
    callback(null, twiml);
    return;
  }

  const organization = context.ORGANIZATION || '電話連絡網';
  const gather = twiml.gather({
    action: '/process-gather',
    method: 'POST',
    numDigits: 1,
  });
  // TODO: 録音許可する人を限定
  gather.say(`こちらは、${organization}です。再生するには1を、録音するには3を押してください。`, opt);
  twiml.say('入力が確認できませんでした。', opt);

  console.log(twiml.toString());
  callback(null, twiml);
};
