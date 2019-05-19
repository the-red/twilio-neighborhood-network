require('dotenv').config();
const csv = require('./csv');

const { format } = require('date-fns');
const { convertToTimeZone } = require('date-fns-timezone');
const timeZone = 'Asia/Tokyo';
const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
const formatDateTime = dateTime => format(convertToTimeZone(new Date(dateTime), { timeZone }), dateTimeFormat);

const { formatIncompletePhoneNumber } = require('libphonenumber-js');
const formatTel = e164Number => formatIncompletePhoneNumber(e164Number.replace('+81', '0'), 'JP');

const addresses = require(`../assets-production/${process.env.ORGANIZATION}/addresses`);
const callRecordingLog = __dirname + '/call-recording-log.csv';
const callLog = __dirname + '/call-log.csv';

const recordingMap = csv(callRecordingLog, { bom: true }).reduce((map, log) => {
  log.Url = `https://api.twilio.com/2010-04-01/Accounts/${log.AccountSid}/Recordings/${log.Sid}.mp3`;
  map[log.CallSid] = log;
  return map;
}, {});

const twilioLogs = csv(callLog).map(log => {
  log.開始時間 = formatDateTime(log.StartTime);
  log.終了時間 = formatDateTime(log.EndTime);
  log.発信元番号 = formatTel(log.From);
  log.宛先番号 = formatTel(log.To);
  log.発信元 = addresses[log.From];
  log.宛先 = addresses[log.To];
  log.詳細URL = `https://jp.twilio.com/console/voice/calls/logs/${log.Sid}`;
  if (recordingMap[log.Sid]) {
    log.録音URL = recordingMap[log.Sid].Url;
    log.録音秒数 = recordingMap[log.Sid].Duration;
  }
  return log;
});
const firstLog = twilioLogs.find(_ => _.発信元 !== process.env.ORGANIZATION);
console.log(firstLog);
