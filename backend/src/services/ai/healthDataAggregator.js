// ──────────────────────────────────────────────────────────
// HEALIO — Health Data Aggregator
// Collects and normalises data from every health-related
// collection (Fitness, DietLog, WaterIntake, Medication,
// User profile) into a single flat object consumed by the
// Rule Engine.
// ──────────────────────────────────────────────────────────

const FitnessData = require('../../models/FitnessData');
const DietLog = require('../../models/DietLog');
const WaterIntake = require('../../models/WaterIntake');
const Medication = require('../../models/Medication');
const User = require('../../models/User');

/**
 * Aggregate all health data for a user over a given period.
 * Returns a flat object the rule engine can evaluate.
 *
 * @param {ObjectId|string} userId
 * @param {number} days — look-back window (default 7)
 */
const aggregate = async (userId, days = 7) => {
  // ── Date boundaries ──
  const now = new Date();
  const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999);
  const periodStart = new Date(todayStart);
  periodStart.setDate(periodStart.getDate() - (days - 1));

  // ── Parallel DB queries ──
  const [user, fitnessArr, dietArr, waterArr, medications] = await Promise.all([
    User.findById(userId).select('name dateOfBirth gender weight height healthConditions').lean(),
    FitnessData.find({ user: userId, date: { $gte: periodStart, $lte: todayEnd } }).sort({ date: 1 }).lean(),
    DietLog.find({ user: userId, date: { $gte: periodStart, $lte: todayEnd } }).sort({ date: 1 }).lean(),
    WaterIntake.find({ user: userId, date: { $gte: periodStart, $lte: todayEnd } }).sort({ date: 1 }).lean(),
    Medication.find({ user: userId, isActive: true }).lean(),
  ]);

  // ── Profile / BMI ──
  const weight = user?.weight || 0;                // kg
  const height = user?.height || 0;                // cm
  const bmi = weight > 0 && height > 0 ? weight / ((height / 100) ** 2) : 0;
  const age = user?.dateOfBirth ? Math.floor((Date.now() - new Date(user.dateOfBirth).getTime()) / 31557600000) : 0;

  // Recommended daily calories (Harris-Benedict estimate, simplified)
  let recommendedCalories = 2000;
  if (weight > 0 && height > 0 && age > 0) {
    if (user?.gender === 'male') {
      recommendedCalories = Math.round(66.5 + 13.75 * weight + 5.003 * height - 6.755 * age);
    } else {
      recommendedCalories = Math.round(655.1 + 9.563 * weight + 1.85 * height - 4.676 * age);
    }
  }

  // ── Fitness aggregation ──
  const activeDays = fitnessArr.length || 1;
  const avgSteps = Math.round(fitnessArr.reduce((a, d) => a + (d.steps?.count || 0), 0) / activeDays);
  const avgSleep = +(fitnessArr.reduce((a, d) => a + (d.sleep?.duration || 0), 0) / activeDays).toFixed(1);
  const avgCaloriesBurned = Math.round(fitnessArr.reduce((a, d) => a + (d.calories?.burned || 0), 0) / activeDays);
  const stepsGoal = fitnessArr[0]?.steps?.goal || 10000;

  // Resting heart rate
  const hrValues = fitnessArr.filter((d) => d.heartRate?.resting > 0).map((d) => d.heartRate.resting);
  const avgRestingHR = hrValues.length ? Math.round(hrValues.reduce((a, v) => a + v, 0) / hrValues.length) : 0;

  // Latest blood pressure
  const bpDay = [...fitnessArr].reverse().find((d) => d.bloodPressure?.systolic > 0);
  const latestBP = bpDay ? { systolic: bpDay.bloodPressure.systolic, diastolic: bpDay.bloodPressure.diastolic } : null;

  // Low-activity streak (consecutive days with < 4000 steps, from most recent)
  let lowActivityStreak = 0;
  for (let i = fitnessArr.length - 1; i >= 0; i--) {
    if ((fitnessArr[i].steps?.count || 0) < 4000) lowActivityStreak++;
    else break;
  }

  // Weekly trend (compare first half vs second half averages)
  let weeklyStepsTrend = 'stable';
  if (fitnessArr.length >= 4) {
    const mid = Math.floor(fitnessArr.length / 2);
    const firstHalf = fitnessArr.slice(0, mid).reduce((a, d) => a + (d.steps?.count || 0), 0) / mid;
    const secondHalf = fitnessArr.slice(mid).reduce((a, d) => a + (d.steps?.count || 0), 0) / (fitnessArr.length - mid);
    if (secondHalf > firstHalf * 1.15) weeklyStepsTrend = 'improving';
    else if (secondHalf < firstHalf * 0.85) weeklyStepsTrend = 'declining';
  }

  // ── Today's fitness ──
  const todayFitness = fitnessArr.find((d) => new Date(d.date) >= todayStart);
  const todaySteps = todayFitness?.steps?.count || 0;
  const todayCaloriesBurned = todayFitness?.calories?.burned || 0;
  const todaySleep = todayFitness?.sleep?.duration || 0;

  // ── Diet aggregation ──
  const dietDays = dietArr.length;
  const avgCaloriesConsumed = dietDays ? Math.round(dietArr.reduce((a, d) => a + (d.totalCalories || 0), 0) / dietDays) : 0;
  const avgProtein = dietDays ? Math.round(dietArr.reduce((a, d) => a + (d.totalProtein || 0), 0) / dietDays) : 0;

  const todayDiet = dietArr.find((d) => new Date(d.date) >= todayStart);
  const todayCaloriesConsumed = todayDiet?.totalCalories || 0;

  // ── Water aggregation ──
  const waterDays = waterArr.length || 1;
  const avgWater = Math.round(waterArr.reduce((a, d) => a + (d.totalAmount || 0), 0) / waterDays);
  const todayWater = waterArr.find((d) => new Date(d.date) >= todayStart)?.totalAmount || 0;
  const waterGoal = waterArr[0]?.goal || 2500;

  // ── Medication adherence ──
  const medicationCount = medications.length;
  const adherenceRate = medicationCount
    ? Math.round(medications.reduce((a, m) => {
        // Virtual field may not work on lean queries — calculate manually
        const history = m.adherenceHistory || [];
        const total = history.length || 1;
        const taken = history.filter((h) => h.status === 'taken').length;
        return a + (taken / total) * 100;
      }, 0) / medicationCount)
    : 100;

  // Today's doses
  let todayTakenDoses = 0;
  let todayMissedDoses = 0;
  let todayTotalDoses = 0;
  medications.forEach((m) => {
    const todayEntries = (m.adherenceHistory || []).filter((h) => new Date(h.date) >= todayStart);
    todayTakenDoses += todayEntries.filter((h) => h.status === 'taken').length;
    todayMissedDoses += todayEntries.filter((h) => h.status === 'missed').length;
    todayTotalDoses += m.times?.length || 1;
  });

  // Low stock
  const lowStockMedications = medications.filter((m) => {
    const r = m.refillReminder;
    return r?.enabled && r.currentStock > 0 && r.currentStock <= (r.daysBeforeRefill || 7);
  }).length;

  return {
    // Profile
    userName: user?.name || '',
    age,
    weight,
    height,
    bmi,
    healthConditions: user?.healthConditions || [],
    recommendedCalories,

    // Fitness (period averages)
    avgSteps,
    avgSleep,
    avgCaloriesBurned,
    avgRestingHR,
    latestBP,
    activeDays: fitnessArr.length,
    lowActivityStreak,
    weeklyStepsTrend,
    stepsGoal,

    // Fitness (today)
    todaySteps,
    todayCaloriesBurned,
    todaySleep,

    // Diet
    avgCaloriesConsumed,
    avgProtein,
    todayCaloriesConsumed,
    dietDays,

    // Hydration
    avgWater,
    todayWater,
    waterGoal,

    // Medication
    medicationCount,
    adherenceRate,
    todayTakenDoses,
    todayMissedDoses,
    todayTotalDoses,
    lowStockMedications,

    // Meta
    period: { start: periodStart, end: todayEnd, days },
  };
};

module.exports = { aggregate };
