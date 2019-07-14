#! /usr/bin/env node
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
const outputFile = __dirname + '/twilio-log.csv';

const japaneseStatus = (status, direction, recording) => {
  if (status === 'completed' && direction === 'Inbound') {
    if (recording) {
      return '録音済';
    } else {
      return '録音なし';
    }
  }
  switch (status) {
    case 'completed':
      return '再生済';
    case 'no-answer':
    case 'failed':
      return '応答なし';
    case 'busy':
      return '通話中';
    default:
      return status;
  }
};

const recordingMap = csv.input(callRecordingLog, { bom: true }).reduce((map, log) => {
  log.Url = `https://api.twilio.com/2010-04-01/Accounts/${log.AccountSid}/Recordings/${log.Sid}.mp3`;
  map[log.CallSid] = log;
  return map;
}, {});

const twilioLogs = csv.input(callLog).map(log => {
  const recording = recordingMap[log.Sid];
  const convertedData = {
    タイプ: log.Direction === 'Inbound' ? 'Twilioへ着信' : 'Twilioから発信',
    開始時間: formatDateTime(log.StartTime),
    終了時間: formatDateTime(log.EndTime),
    発信元: addresses[log.From],
    発信元番号: formatTel(log.From),
    宛先: addresses[log.To],
    宛先番号: formatTel(log.To),
    ステータス: japaneseStatus(log.Status, log.Direction, recording),
    料金: log.Price,
    通話秒数: log.Duration,
    録音秒数: recording && recording.Duration,
    録音URL: recording && recording.Url,
    詳細URL: `https://jp.twilio.com/console/voice/calls/logs/${log.Sid}`,
  };
  return { ...convertedData, ...log };
});

csv.output(outputFile, twilioLogs);
console.log(`output: ${outputFile}`);
