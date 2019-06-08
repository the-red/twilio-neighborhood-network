exports.handler = function(context, event, callback) {
  const opt = {
    language: 'ja-JP',
    voice: 'Polly.Mizuki',
  };
  const twiml = new Twilio.twiml.VoiceResponse();

  const listeners = require(Runtime.getAssets()['listeners.js'].path);
  const message = `ピーという発信音の後に、メッセージを録音してください。
	電話を切ると、関係者${listeners.length}人に、録音内容が転送されます。`;
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
