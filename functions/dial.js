exports.handler = async function (context, event, callback) {
  const twiml = new Twilio.twiml.VoiceResponse();
  const client = context.getTwilioClient();
  const { Caller, RecordingUrl } = event;

  const listeners = require(Runtime.getAssets()['/listeners.js'].path);
  const Recorder = encodeURIComponent(Caller);

  // 一斉配信前に3秒待つ（録音した人自身が一呼吸おけるように）
  await new Promise((r) => setTimeout(r, 3000));

  const promises = Object.keys(listeners).map((toNumber) =>
    client.calls.create({
      url: `https://${context.DOMAIN}/play?Recorder=${Recorder}&RecordingUrl=${RecordingUrl}`,
      method: 'GET',
      to: toNumber,
      from: context.CALLER_ID,
    })
  );
  try {
    const results = await Promise.allSettled(promises);
    console.log('Created calls using callback');
    console.log(results.map((_) => _.sid).join(','));
    callback(null, twiml);
  } catch (err) {
    console.log(err);
    callback(err);
  }
};
