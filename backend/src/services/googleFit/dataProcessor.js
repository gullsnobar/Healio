exports.processStepData = (rawData) => {
  if (!rawData?.bucket) return { count: 0, distance: 0, calories: 0 };
  const points = rawData.bucket.flatMap(b => b.dataset?.[0]?.point || []);
  const count = points.reduce((sum, p) => sum + (p.value?.[0]?.intVal || 0), 0);
  return { count, distance: Math.round(count * 0.762), calories: Math.round(count * 0.04) };
};

exports.processSleepData = (sessions) => {
  if (!sessions?.length) return { duration: 0, quality: 'fair' };
  const totalMs = sessions.reduce((sum, s) => sum + (new Date(s.endTimeMillis) - new Date(s.startTimeMillis)), 0);
  const hours = totalMs / (1000 * 60 * 60);
  return { duration: Math.round(hours * 10) / 10, quality: hours >= 7 ? 'good' : hours >= 5 ? 'fair' : 'poor' };
};

exports.processHeartRateData = (rawData) => {
  if (!rawData?.bucket) return { resting: 0, average: 0 };
  const readings = rawData.bucket.flatMap(b => b.dataset?.[0]?.point || []).map(p => p.value?.[0]?.fpVal || 0).filter(v => v > 0);
  if (!readings.length) return { resting: 0, average: 0, min: 0, max: 0 };
  return { average: Math.round(readings.reduce((a, v) => a + v, 0) / readings.length), min: Math.min(...readings), max: Math.max(...readings), resting: Math.min(...readings) };
};
