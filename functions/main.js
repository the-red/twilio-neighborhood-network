exports.handler = function(context, event, callback) {
  // TODO: 発信元による制御はここで行う
  // TODO: recorder外 && player外の番号からかかってきた場合はdeny

  const opt = {
    language: 'ja-JP',
    voice: 'Polly.Mizuki',
  };
  const twiml = new Twilio.twiml.VoiceResponse();

  const gather = twiml.gather({
    action: '/process-gather',
    method: 'POST',
    numDigits: 1,
  });
  gather.say('再生するには1を、録音するには3を押してください。', opt);
  twiml.say('入力が確認できませんでした。', opt);

  console.log(twiml.toString());
  callback(null, twiml);
};
