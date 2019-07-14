exports.handler = function(context, event, callback) {
  const twiml = new Twilio.twiml.VoiceResponse();
  const client = context.getTwilioClient();
  const { Caller, RecordingUrl } = event;

  const listeners = require(Runtime.getAssets()['listeners.js'].path);
  const Recorder = encodeURIComponent(Caller);

  Object.keys(listeners).forEach(toNumber => {
    client.calls.create(
      {
        url: `https://${context.DOMAIN}/play?Recorder=${Recorder}&RecordingUrl=${RecordingUrl}`,
        method: 'GET',
        to: toNumber,
        from: context.CALLER_ID,
      },
      (err, result) => {
        if (err) {
          console.log(err);
          callback(err);
          return;
        }
        console.log('Created calls using callback');
        console.log(result.sid);

        // 少し待機してから発信（うまく動いてない？）
        twiml.pause({ length: 10 });
        callback(null, twiml);
      }
    );
  });
};
