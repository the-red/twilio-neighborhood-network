exports.handler = function(context, event, callback) {
  const opt = {
    language: 'ja-JP',
    voice: 'Polly.Mizuki',
  };
  const twiml = new Twilio.twiml.VoiceResponse();

  let message = '';
  const recorders = require(Runtime.getAssets()['recorders.js'].path);
  const listeners = require(Runtime.getAssets()['listeners.js'].path);

  if (listeners.includes(event.From)) {
    const organization = process.env.ORGANIZATION || '電話連絡網';
    message += `こちらは、${organization}です。`;
  }
  if (!recorders.includes(event.From)) {
    // TODO: 登録されてない番号の場合は<Reject>した方が良さそう

    message += `この電話には、特定の番号からの着信のみ受け付けています。`;
    twiml.say(message, opt);
    twiml.hangup();
    callback(null, twiml);
    return;
  }

  message += `ピーという発信音の後に、メッセージを録音してください。
	電話を切ると、関係者に録音内容が転送されます。`;
  twiml.say(message, opt);

  const Called = encodeURIComponent(event.Called);
  const Caller = encodeURIComponent(event.From);
  twiml.record({
    maxLength: 60,
    action: `/hangup`,
    recordingStatusCallback: `/dial?Called=${Called}&Caller=${Caller}`,
    recordingStatusCallbackMethod: 'GET',
  });

  callback(null, twiml);
};
