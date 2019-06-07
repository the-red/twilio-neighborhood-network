exports.handler = function(context, event, callback) {
  const twiml = new Twilio.twiml.VoiceResponse();
  const client = context.getTwilioClient();
  const { Called, Caller, RecordingUrl } = event;

  // const listeners = [Caller]; // デバッグ用
  const file = Runtime.getAssets()['listeners.js'].path;
  const listeners = require(file);

  listeners.forEach(toNumber => {
    client.calls.create(
      {
        url: `https://${context.DOMAIN}/play?RecordingUrl=${RecordingUrl}`,
        method: 'GET',
        to: toNumber,
        from: Called,
      },
      (err, result) => {
        console.log('Created calls using callback');
        console.log(result.sid);

        // 少し待機してから発信（うまく動いてない？）
        twiml.pause({ length: 10 });
        callback(null, twiml);
      }
    );
  });
  // TODO: 不在時の再ダイヤルオプション
};
