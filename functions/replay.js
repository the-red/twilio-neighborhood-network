exports.handler = function(context, event, callback) {
  const opt = {
    language: 'ja-JP',
    voice: 'Polly.Mizuki',
  };
  const twiml = new Twilio.twiml.VoiceResponse();
  const client = context.getTwilioClient();

  (async () => {
    const recordings = await client.recordings.list({ limit: 1 });
    const recording = recordings[0];
    const RecordingUrl = `https://api.twilio.com/2010-04-01/Accounts/${context.ACCOUNT_SID}/Recordings/${
      recording.sid
    }`;

    const { format } = require('date-fns');
    const { convertToTimeZone } = require('date-fns-timezone');
    const date = convertToTimeZone(recording.dateUpdated, { timeZone: 'Asia/Tokyo' });
    const dateForSay = format(date, 'M月D日 A H時m分')
      .replace('AM', '午前')
      .replace('PM', '午後');

    twiml.say(`最新の録音メッセージを再生します。${dateForSay}`, opt);
    twiml.play(RecordingUrl);
    twiml.pause();
    twiml.say(`メッセージは以上です。`, opt);
    twiml.pause();

    callback(null, twiml);
  })();
};
