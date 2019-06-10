exports.handler = function(context, event, callback) {
  const opt = {
    language: 'ja-JP',
    voice: 'Polly.Mizuki',
  };
  const twiml = new Twilio.twiml.VoiceResponse();
  const client = context.getTwilioClient();

  (async () => {
    // TODO: 最新3件くらいは聞けるようにしたい
    const recordings = await client.recordings.list({ limit: 1 });
    const recording = recordings[0];
    console.log(Object.keys(recording));
    const RecordingUrl = `https://api.twilio.com/2010-04-01/Accounts/${context.ACCOUNT_SID}/Recordings/${
      recording.sid
    }`;

    const calls = await client.calls.list({ limit: 20 });
    const recordingCall = calls.find(c => c.sid === recording.callSid);
    console.log(recordingCall);
    const Recorder = recordingCall.from;

    const recorders = require(Runtime.getAssets()['recorders.js'].path);
    const name = recorders[Recorder];
    console.log(name);

    const { format } = require('date-fns');
    const { convertToTimeZone } = require('date-fns-timezone');
    const date = convertToTimeZone(recording.dateUpdated, { timeZone: 'Asia/Tokyo' });
    // TODO: date-fnsの日本語化機能を使ってもう少しスマートに書く
    const dateForSay = format(date, 'M月D日 A h時m分')
      .replace('AM', '午前')
      .replace('PM', '午後');

    twiml.say(`最新の録音、${dateForSay}、${name}からのお知らせを再生します。`, opt);
    twiml.pause();
    twiml.play(RecordingUrl);
    twiml.pause();
    twiml.say(`メッセージは以上です。`, opt);
    twiml.pause();

    callback(null, twiml);
  })();
};
