exports.handler = function(context, event, callback) {
  const opt = {
    language: 'ja-JP',
    voice: 'Polly.Mizuki',
  };
  const twiml = new Twilio.twiml.VoiceResponse();

  const listeners = require(Runtime.getAssets()['listeners.js'].path);
  const listenersCount = Object.keys(listeners).length;

  const message = `ピーという発信音の後に、メッセージを録音してください。
	電話を切ると、関係者${listenersCount}人に、録音内容が転送されます。`;
  twiml.say(message, opt);

  const Caller = encodeURIComponent(event.From);
  twiml.record({
    maxLength: context.MAX_RECORDING_LENGTH || 50,
    action: `/hangup`,
    recordingStatusCallback: `/dial?Caller=${Caller}`,
    recordingStatusCallbackMethod: 'GET',
  });

  callback(null, twiml);
};
