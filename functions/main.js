exports.handler = function(context, event, callback) {
  const opt = {
    language: 'ja-JP',
    voice: 'Polly.Mizuki',
  };
  const twiml = new Twilio.twiml.VoiceResponse();

  const recorders = require(Runtime.getAssets()['recorders.js'].path);
  const listeners = require(Runtime.getAssets()['listeners.js'].path);

  console.log(event);

  if (!recorders[event.From] && !listeners[event.From]) {
    twiml.reject();
    console.log('rejected!', event.From);
    callback(null, twiml);
    return;
  }

  const organization = context.ORGANIZATION || '電話連絡網';
  const gather = twiml.gather({
    action: '/router',
    method: 'POST',
    numDigits: 1,
  });
  let message = `こちらは、${organization}です。ご希望の番号を押してください。
  聞き逃したメッセージを再生するには、1番を`;
  if (recorders[event.From]) {
    message += `。新しいメッセージを録音するには3番を`;
  }
  message += '押してください。';
  gather.say(message, opt);
  twiml.say('入力が確認できませんでした。', opt);

  console.log(twiml.toString());
  callback(null, twiml);
};
