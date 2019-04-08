exports.handler = function(context, event, callback) {
  const opt = {
    language: 'ja-JP',
  };
  const twiml = new Twilio.twiml.VoiceResponse();

  const file = Runtime.getAssets()['recorders.js'].path;
  const recorders = require(file);
  if (!recorders.includes(event.From)) {
    twiml.say(`申し訳ありません。この電話は、特定の番号からの着信のみ受け付けています。`, opt);
    twiml.hangup();
    callback(null, twiml);
    return;
  }

  const organization = process.env.ORGANIZATION || '電話連絡網';
  twiml.say(
    `こんにちは。${organization}です。
	ピーという発信音の後に、メッセージを録音してください。
	電話を切ると、関係者に録音内容が転送されます。`,
    opt
  );

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
