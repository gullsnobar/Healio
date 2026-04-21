const Medication = require('../../models/Medication');
const Appointment = require('../../models/Appointment');
const FitnessData = require('../../models/FitnessData');
const LabReport = require('../../models/LabReport');
const Recommendation = require('../../models/Recommendation');
const DietLog = require('../../models/DietLog');
const WaterIntake = require('../../models/WaterIntake');
const HealthInsight = require('../../models/HealthInsight');

exports.getDashboardData = async (req, res, next) => {
  try {
    const parseDate = (value) => {
      if (!value) return null;
      const d = new Date(value);
      // Invalid date -> null
      if (Number.isNaN(d.getTime())) return null;
      return d;
    };

    const baseDate = parseDate(req.query?.date) || new Date();

    const today = new Date(baseDate); today.setHours(0,0,0,0);
    const endOfDay = new Date(baseDate); endOfDay.setHours(23,59,59,999);
    const weekAgo = new Date(today); weekAgo.setDate(today.getDate() - 6); weekAgo.setHours(0,0,0,0);
    const monthStart = new Date(today); monthStart.setDate(today.getDate() - 27); monthStart.setHours(0,0,0,0);

    const [medications, appointments, fitness, recentReports, recommendations, todayDiet, todayWater, weeklyFitness, monthlyFitness, insights] = await Promise.all([
      Medication.find({ user: req.userId, isActive: true }),
      Appointment.find({ user: req.userId, date: { $gte: today }, status: 'upcoming' }).sort({ date: 1 }).limit(5),
      FitnessData.findOne({ user: req.userId, date: { $gte: today, $lte: endOfDay } }),
      LabReport.find({ user: req.userId }).sort({ date: -1 }).limit(3),
      Recommendation.find({ user: req.userId, isDismissed: false }).sort({ createdAt: -1 }).limit(5),
      DietLog.findOne({ user: req.userId, date: { $gte: today, $lte: endOfDay } }),
      WaterIntake.findOne({ user: req.userId, date: today }),
      FitnessData.find({ user: req.userId, date: { $gte: weekAgo, $lte: endOfDay } }).sort({ date: 1 }),
      FitnessData.find({ user: req.userId, date: { $gte: monthStart, $lte: endOfDay } }).sort({ date: 1 }),
      HealthInsight.find({ user: req.userId, isDismissed: false }).sort({ createdAt: -1 }).limit(3),
    ]);

    const adherenceRate = medications.length ? Math.round(medications.reduce((a, m) => a + m.adherenceRate, 0) / medications.length) : 0;

    // Today's medication dose tracking
    const todayAdherence = medications.map((m) => {
      const todayEntries = m.adherenceHistory.filter((h) => h.date >= today);
      const taken = todayEntries.filter((h) => h.status === 'taken').length;
      return { id: m._id, name: m.name, dosage: m.dosage, times: m.times, taken, total: m.times?.length || 1 };
    });

    // Weekly progress (for chart)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyProgress = { labels: [], steps: [], calories: [], sleep: [] };
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekAgo); d.setDate(weekAgo.getDate() + i);
      weeklyProgress.labels.push(dayNames[d.getDay()]);
      const entry = weeklyFitness.find((e) => {
        const ed = new Date(e.date);
        return ed.getFullYear() === d.getFullYear() && ed.getMonth() === d.getMonth() && ed.getDate() === d.getDate();
      });
      weeklyProgress.steps.push(entry?.steps?.count || 0);
      weeklyProgress.calories.push(entry?.calories?.burned || 0);
      weeklyProgress.sleep.push(entry?.sleep?.duration || 0);
    }

    const monthlyProgress = { labels: ['W1', 'W2', 'W3', 'W4'], values: [] };
    for (let i = 0; i < 4; i++) {
      const start = new Date(monthStart); start.setDate(monthStart.getDate() + i * 7); start.setHours(0,0,0,0);
      const end = new Date(monthStart); end.setDate(monthStart.getDate() + (i + 1) * 7 - 1); end.setHours(23,59,59,999);
      const bucket = monthlyFitness.filter((e) => e.date >= start && e.date <= end);
      const avgSteps = bucket.length ? Math.round(bucket.reduce((a, d) => a + (d.steps?.count || 0), 0) / bucket.length) : 0;
      monthlyProgress.values.push(avgSteps);
    }

    // Meal summary
    const mealSummary = todayDiet
      ? { meals: todayDiet.meals.length, totalCalories: todayDiet.totalCalories, protein: todayDiet.totalProtein, carbs: todayDiet.totalCarbs, fat: todayDiet.totalFat }
      : { meals: 0, totalCalories: 0, protein: 0, carbs: 0, fat: 0 };

    res.json({
      success: true,
      data: {
        medications: { count: medications.length, adherenceRate, todayDoses: todayAdherence },
        appointments: { upcoming: appointments },
        fitness: {
          steps: fitness?.steps?.count || 0,
          stepsGoal: fitness?.steps?.goal || 10000,
          caloriesBurned: fitness?.calories?.burned || 0,
          sleep: fitness?.sleep?.duration || 0,
          water: todayWater?.totalAmount || 0,
          waterGoal: todayWater?.goal || 2500,
          exercise: fitness?.exercise || [],
        },
        mealSummary,
        weeklyProgress,
        monthlyProgress,
        recentReports,
        recommendations,
        healthInsights: insights,
      },
    });
  } catch (error) { next(error); }
};

exports.getHealthScore = async (req, res, next) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(); weekAgo.setDate(today.getDate() - 7);

    const [medications, weeklyFitness] = await Promise.all([
      Medication.find({ user: req.userId, isActive: true }),
      FitnessData.find({ user: req.userId, date: { $gte: weekAgo } }),
    ]);

    const adherence = medications.length ? medications.reduce((a, m) => a + m.adherenceRate, 0) / medications.length : 50;
    const avgSteps = weeklyFitness.length ? weeklyFitness.reduce((a, f) => a + (f.steps?.count || 0), 0) / weeklyFitness.length : 0;
    const fitnessScore = Math.min(30, avgSteps / 333);

    const score = Math.min(100, Math.round(adherence * 0.4 + fitnessScore + 30));
    res.json({ success: true, data: { score, breakdown: { medicationAdherence: Math.round(adherence), fitnessActivity: Math.round(fitnessScore * 100 / 30), healthMetrics: 50 } } });
  } catch (error) { next(error); }
};

exports.getQuickStats = async (req, res, next) => {
  try {
    const [medCount, aptCount, reportCount] = await Promise.all([
      Medication.countDocuments({ user: req.userId, isActive: true }),
      Appointment.countDocuments({ user: req.userId, date: { $gte: new Date() }, status: 'upcoming' }),
      LabReport.countDocuments({ user: req.userId }),
    ]);
    res.json({ success: true, data: { activeMedications: medCount, upcomingAppointments: aptCount, labReports: reportCount } });
  } catch (error) { next(error); }
};
