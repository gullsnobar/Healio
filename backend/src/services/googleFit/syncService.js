const { google } = require('googleapis');
const User = require('../../models/User');
const FitnessData = require('../../models/FitnessData');
const { oauth2Client } = require('../../config/googleFit');

exports.syncFromGoogleFit = async (userId) => {
  const user = await User.findById(userId);
  if (!user?.googleFitConnected || !user.googleFitTokens) throw new Error('Google Fit not connected');
  oauth2Client.setCredentials({ access_token: user.googleFitTokens.accessToken, refresh_token: user.googleFitTokens.refreshToken });
  const fitness = google.fitness({ version: 'v1', auth: oauth2Client });
  const now = Date.now();
  const dayAgo = now - 24 * 60 * 60 * 1000;
  const [stepsRes, sleepRes, heartRes] = await Promise.all([
    fitness.users.dataset.aggregate({ userId: 'me', requestBody: { aggregateBy: [{ dataTypeName: 'com.google.step_count.delta' }], bucketByTime: { durationMillis: 86400000 }, startTimeMillis: dayAgo, endTimeMillis: now } }),
    fitness.users.sessions.list({ userId: 'me', activityType: 72, startTime: new Date(dayAgo).toISOString(), endTime: new Date(now).toISOString() }),
    fitness.users.dataset.aggregate({ userId: 'me', requestBody: { aggregateBy: [{ dataTypeName: 'com.google.heart_rate.bpm' }], bucketByTime: { durationMillis: 86400000 }, startTimeMillis: dayAgo, endTimeMillis: now } }),
  ]);
  const today = new Date(); today.setHours(0,0,0,0);
  const steps = stepsRes.data.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0;
  const data = await FitnessData.findOneAndUpdate({ user: userId, date: today }, { steps: { count: steps }, source: 'google_fit' }, { upsert: true, new: true });
  return data;
};

exports.connectGoogleFit = async (userId, code) => {
  const { tokens } = await oauth2Client.getToken(code);
  await User.findByIdAndUpdate(userId, { googleFitConnected: true, googleFitTokens: { accessToken: tokens.access_token, refreshToken: tokens.refresh_token, expiresAt: new Date(tokens.expiry_date) } });
  return { connected: true };
};
