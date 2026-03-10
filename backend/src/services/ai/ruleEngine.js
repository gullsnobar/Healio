// ──────────────────────────────────────────────────────────
// HEALIO — Rule-Based AI Recommendation Engine
// Evaluates aggregated user health data against a library
// of clinical / wellness rules and returns structured
// recommendations.  Zero external dependencies.
// ──────────────────────────────────────────────────────────

/**
 * Run every rule against the aggregated health data and return
 * an array of { type, category, severity, priority, title,
 * description, actionItems[], basedOn{} } objects.
 */
const evaluate = (data) => {
  const recommendations = [];

  // ───── FITNESS / STEPS ─────
  if (data.avgSteps !== null) {
    if (data.avgSteps < 2000) {
      recommendations.push({
        type: 'fitness',
        category: 'fitness',
        severity: 'critical',
        priority: 'high',
        title: 'Very Low Physical Activity',
        description: `Your average daily step count is only ${data.avgSteps.toLocaleString()}. Prolonged inactivity increases the risk of heart disease, obesity, and mental health issues. Even short 5-minute walks every hour can make a meaningful difference.`,
        actionItems: [
          { text: 'Set a reminder to stand and walk for 5 min every hour' },
          { text: 'Take a 10-minute walk after dinner tonight' },
        ],
        basedOn: { metric: 'avgSteps', value: data.avgSteps, threshold: 2000 },
      });
    } else if (data.avgSteps < 4000) {
      recommendations.push({
        type: 'fitness',
        category: 'fitness',
        severity: 'warning',
        priority: 'high',
        title: 'Increase Your Daily Steps',
        description: `You're averaging ${data.avgSteps.toLocaleString()} steps/day. Health experts recommend at least 7,000–10,000 steps. Try adding a brisk 15-minute walk after each meal to close the gap.`,
        actionItems: [
          { text: 'Walk for 15 minutes after lunch' },
          { text: 'Use stairs instead of elevators' },
        ],
        basedOn: { metric: 'avgSteps', value: data.avgSteps, threshold: 4000 },
      });
    } else if (data.avgSteps < 7000) {
      recommendations.push({
        type: 'fitness',
        category: 'fitness',
        severity: 'info',
        priority: 'medium',
        title: 'Almost There — Keep Moving!',
        description: `You're averaging ${data.avgSteps.toLocaleString()} steps. You're close to the 7,000-step healthy baseline. A short evening walk could push you over the line.`,
        actionItems: [
          { text: 'Add a 20-minute evening walk to your routine' },
        ],
        basedOn: { metric: 'avgSteps', value: data.avgSteps, threshold: 7000 },
      });
    } else if (data.avgSteps >= 8000) {
      recommendations.push({
        type: 'fitness',
        category: 'fitness',
        severity: 'info',
        priority: 'low',
        title: 'Great Job Staying Active! 🎉',
        description: `Averaging ${data.avgSteps.toLocaleString()} steps/day is excellent. Keep up the great work — consistency is the key to long-term health. Consider adding strength exercises for a balanced routine.`,
        actionItems: [
          { text: 'Try adding two 15-min strength sessions per week' },
        ],
        basedOn: { metric: 'avgSteps', value: data.avgSteps, threshold: 8000 },
      });
    }
  }

  // Multi-day low activity pattern
  if (data.lowActivityStreak >= 3) {
    recommendations.push({
      type: 'fitness',
      category: 'fitness',
      severity: 'warning',
      priority: 'high',
      title: 'Low Activity for Multiple Days',
      description: `Your step count has been below 4,000 for ${data.lowActivityStreak} consecutive days. Prolonged sedentary behaviour is linked to metabolic issues. Start with a simple daily walking routine to break the pattern.`,
      actionItems: [
        { text: 'Commit to a 20-minute walk each morning this week' },
        { text: 'Set hourly reminders to move around' },
      ],
      basedOn: { metric: 'lowActivityStreak', value: data.lowActivityStreak, threshold: 3 },
    });
  }

  // ───── CALORIES / DIET ─────
  if (data.avgCaloriesConsumed > 0) {
    const calorieLimit = data.recommendedCalories || 2000;
    if (data.avgCaloriesConsumed > calorieLimit * 1.25) {
      recommendations.push({
        type: 'diet',
        category: 'diet',
        severity: 'warning',
        priority: 'high',
        title: 'Calorie Intake Exceeds Recommended Limit',
        description: `You're consuming an average of ${data.avgCaloriesConsumed.toLocaleString()} kcal/day — about ${Math.round(((data.avgCaloriesConsumed - calorieLimit) / calorieLimit) * 100)}% over your ${calorieLimit.toLocaleString()} kcal target. Consider smaller portions and swapping sugary snacks for fruits.`,
        actionItems: [
          { text: 'Replace one sugary snack with fresh fruit daily' },
          { text: 'Drink water before meals to reduce overeating' },
        ],
        basedOn: { metric: 'avgCaloriesConsumed', value: data.avgCaloriesConsumed, threshold: calorieLimit * 1.25 },
      });
    } else if (data.avgCaloriesConsumed > calorieLimit) {
      recommendations.push({
        type: 'diet',
        category: 'diet',
        severity: 'info',
        priority: 'medium',
        title: 'Slightly Over Your Calorie Target',
        description: `You're averaging ${data.avgCaloriesConsumed.toLocaleString()} kcal/day against a ${calorieLimit.toLocaleString()} kcal goal. Minor adjustments like lighter dinners can bring you back on track.`,
        actionItems: [
          { text: 'Opt for grilled over fried foods at dinner' },
        ],
        basedOn: { metric: 'avgCaloriesConsumed', value: data.avgCaloriesConsumed, threshold: calorieLimit },
      });
    } else if (data.avgCaloriesConsumed < calorieLimit * 0.6 && data.dietDays >= 3) {
      recommendations.push({
        type: 'diet',
        category: 'diet',
        severity: 'warning',
        priority: 'medium',
        title: 'Very Low Calorie Intake Detected',
        description: `You're only consuming about ${data.avgCaloriesConsumed.toLocaleString()} kcal/day. Eating too little can slow your metabolism and weaken your immune system. Make sure you're eating balanced meals.`,
        actionItems: [
          { text: 'Ensure three balanced meals plus a healthy snack daily' },
        ],
        basedOn: { metric: 'avgCaloriesConsumed', value: data.avgCaloriesConsumed, threshold: calorieLimit * 0.6 },
      });
    }
  }

  // Low protein
  if (data.avgProtein > 0 && data.avgProtein < 40) {
    recommendations.push({
      type: 'diet',
      category: 'diet',
      severity: 'info',
      priority: 'medium',
      title: 'Increase Protein Intake',
      description: `Your average protein is ${data.avgProtein}g/day. Adults generally need 0.8–1 g per kg of body weight. Consider adding eggs, chicken, lentils, or yoghurt to your meals.`,
      actionItems: [
        { text: 'Add a protein source to every meal' },
      ],
      basedOn: { metric: 'avgProtein', value: data.avgProtein, threshold: 40 },
    });
  }

  // ───── HYDRATION ─────
  if (data.avgWater !== null && data.avgWater > 0) {
    if (data.avgWater < 1000) {
      recommendations.push({
        type: 'lifestyle',
        category: 'hydration',
        severity: 'critical',
        priority: 'high',
        title: 'Critically Low Water Intake',
        description: `You're averaging only ${data.avgWater}ml of water per day. Severe dehydration can cause headaches, fatigue, dizziness, and kidney problems. Aim for at least 2,000–2,500 ml daily.`,
        actionItems: [
          { text: 'Drink a full glass of water right now' },
          { text: 'Set reminders every 2 hours to drink water' },
        ],
        basedOn: { metric: 'avgWater', value: data.avgWater, threshold: 1000 },
      });
    } else if (data.avgWater < 2000) {
      recommendations.push({
        type: 'lifestyle',
        category: 'hydration',
        severity: 'warning',
        priority: 'medium',
        title: 'Stay Hydrated',
        description: `You're drinking about ${data.avgWater}ml daily. The recommended intake is 2,000–2,500 ml. Proper hydration improves energy levels, digestion, and skin health.`,
        actionItems: [
          { text: 'Keep a water bottle at your desk' },
          { text: 'Drink a glass of water before each meal' },
        ],
        basedOn: { metric: 'avgWater', value: data.avgWater, threshold: 2000 },
      });
    } else if (data.avgWater >= 2500) {
      recommendations.push({
        type: 'lifestyle',
        category: 'hydration',
        severity: 'info',
        priority: 'low',
        title: 'Excellent Hydration! 💧',
        description: `You're drinking ${data.avgWater}ml daily — well above the recommended minimum. Keep it up!`,
        actionItems: [],
        basedOn: { metric: 'avgWater', value: data.avgWater, threshold: 2500 },
      });
    }
  }

  // ───── SLEEP ─────
  if (data.avgSleep > 0) {
    if (data.avgSleep < 5) {
      recommendations.push({
        type: 'lifestyle',
        category: 'sleep',
        severity: 'critical',
        priority: 'high',
        title: 'Severely Insufficient Sleep',
        description: `You're averaging only ${data.avgSleep} hours of sleep. Adults need 7-9 hours. Chronic sleep deprivation weakens your immune system, impairs cognition, and increases heart disease risk.`,
        actionItems: [
          { text: 'Set a consistent bedtime at least 7.5 hours before your alarm' },
          { text: 'Avoid screens for 30 minutes before bed' },
        ],
        basedOn: { metric: 'avgSleep', value: data.avgSleep, threshold: 5 },
      });
    } else if (data.avgSleep < 7) {
      recommendations.push({
        type: 'lifestyle',
        category: 'sleep',
        severity: 'warning',
        priority: 'medium',
        title: 'Improve Your Sleep Duration',
        description: `You're getting about ${data.avgSleep} hours. Aiming for 7-8 hours can boost mood, focus, and overall recovery.`,
        actionItems: [
          { text: 'Go to bed 30 minutes earlier tonight' },
          { text: 'Keep your bedroom cool and dark' },
        ],
        basedOn: { metric: 'avgSleep', value: data.avgSleep, threshold: 7 },
      });
    } else if (data.avgSleep >= 7 && data.avgSleep <= 9) {
      recommendations.push({
        type: 'lifestyle',
        category: 'sleep',
        severity: 'info',
        priority: 'low',
        title: 'Healthy Sleep Pattern 🌙',
        description: `Averaging ${data.avgSleep} hours of sleep is right in the recommended range. Great job maintaining a healthy sleep routine!`,
        actionItems: [],
        basedOn: { metric: 'avgSleep', value: data.avgSleep, threshold: 7 },
      });
    }
  }

  // ───── MEDICATION ADHERENCE ─────
  if (data.medicationCount > 0) {
    if (data.adherenceRate < 50) {
      recommendations.push({
        type: 'medication',
        category: 'medication',
        severity: 'critical',
        priority: 'high',
        title: 'Critical: Medication Adherence Very Low',
        description: `Your adherence rate is only ${data.adherenceRate}%. Missing more than half your doses can make treatment ineffective or dangerous. Please review your reminder settings and consult your doctor if side effects are an issue.`,
        actionItems: [
          { text: 'Enable push notifications for all medication reminders' },
          { text: 'Place medications next to something you use daily (e.g., toothbrush)' },
          { text: 'Talk to your doctor if side effects are causing you to skip doses' },
        ],
        basedOn: { metric: 'adherenceRate', value: data.adherenceRate, threshold: 50 },
      });
    } else if (data.adherenceRate < 80) {
      recommendations.push({
        type: 'medication',
        category: 'medication',
        severity: 'warning',
        priority: 'high',
        title: 'Medication Adherence Needs Improvement',
        description: `Your adherence is at ${data.adherenceRate}%. For most treatments to be effective, adherence should be above 80%. Consider adjusting your reminder timings to fit your daily routine.`,
        actionItems: [
          { text: 'Set medication reminders 15 min before your usual routine' },
          { text: 'Use the app\'s snooze feature instead of dismissing reminders' },
        ],
        basedOn: { metric: 'adherenceRate', value: data.adherenceRate, threshold: 80 },
      });
    } else if (data.adherenceRate >= 95) {
      recommendations.push({
        type: 'medication',
        category: 'medication',
        severity: 'info',
        priority: 'low',
        title: 'Excellent Medication Adherence! 💊',
        description: `${data.adherenceRate}% adherence rate is outstanding. Consistent medication usage is one of the most important factors in treatment success. Keep it up!`,
        actionItems: [],
        basedOn: { metric: 'adherenceRate', value: data.adherenceRate, threshold: 95 },
      });
    }

    // Missed doses today
    if (data.todayMissedDoses >= 2) {
      recommendations.push({
        type: 'medication',
        category: 'medication',
        severity: 'warning',
        priority: 'high',
        title: 'Multiple Missed Doses Today',
        description: `You've missed ${data.todayMissedDoses} medication dose(s) today. If you've just forgotten, take them as soon as possible (unless your doctor advises otherwise). Consider adjusting your reminder schedule.`,
        actionItems: [
          { text: 'Check your medication list and take any due doses now' },
          { text: 'Reschedule reminders to times you\'re more likely to be free' },
        ],
        basedOn: { metric: 'todayMissedDoses', value: data.todayMissedDoses, threshold: 2 },
      });
    }

    // Refill alert
    if (data.lowStockMedications > 0) {
      recommendations.push({
        type: 'medication',
        category: 'medication',
        severity: 'warning',
        priority: 'medium',
        title: 'Medication Refill Needed Soon',
        description: `${data.lowStockMedications} of your medications are running low on stock. Plan ahead to avoid missing doses due to empty prescriptions.`,
        actionItems: [
          { text: 'Visit your pharmacy or schedule a refill this week' },
        ],
        basedOn: { metric: 'lowStockMedications', value: data.lowStockMedications, threshold: 0 },
      });
    }
  }

  // ───── BMI (if profile data available) ─────
  if (data.bmi > 0) {
    if (data.bmi < 18.5) {
      recommendations.push({
        type: 'lifestyle',
        category: 'general',
        severity: 'warning',
        priority: 'medium',
        title: 'Underweight — Consider Nutrition Counselling',
        description: `Your BMI is ${data.bmi.toFixed(1)}, which is below the healthy range (18.5–24.9). Consider increasing your calorie intake with nutrient-dense foods and consulting a healthcare provider.`,
        actionItems: [
          { text: 'Add healthy fats like nuts, avocado, and olive oil to meals' },
        ],
        basedOn: { metric: 'bmi', value: data.bmi, threshold: 18.5 },
      });
    } else if (data.bmi >= 25 && data.bmi < 30) {
      recommendations.push({
        type: 'lifestyle',
        category: 'general',
        severity: 'info',
        priority: 'medium',
        title: 'Overweight Range — Watch Your Diet & Activity',
        description: `Your BMI is ${data.bmi.toFixed(1)}, which falls in the overweight category. A combination of balanced eating and regular exercise can help.`,
        actionItems: [
          { text: 'Aim for 150 minutes of moderate exercise per week' },
          { text: 'Track your meals to stay within calorie goals' },
        ],
        basedOn: { metric: 'bmi', value: data.bmi, threshold: 25 },
      });
    } else if (data.bmi >= 30) {
      recommendations.push({
        type: 'lifestyle',
        category: 'general',
        severity: 'warning',
        priority: 'high',
        title: 'Obesity Risk — Take Action',
        description: `Your BMI is ${data.bmi.toFixed(1)}, which is in the obese range. This increases risks for heart disease, diabetes, and joint issues. Please consult your physician about a weight-management plan.`,
        actionItems: [
          { text: 'Schedule a consultation with your doctor' },
          { text: 'Start with low-impact exercise like walking or swimming' },
        ],
        basedOn: { metric: 'bmi', value: data.bmi, threshold: 30 },
      });
    }
  }

  // ───── CALORIES BURNED vs CONSUMED ─────
  if (data.avgCaloriesBurned > 0 && data.avgCaloriesConsumed > 0) {
    const surplus = data.avgCaloriesConsumed - data.avgCaloriesBurned;
    if (surplus > 500) {
      recommendations.push({
        type: 'diet',
        category: 'diet',
        severity: 'warning',
        priority: 'medium',
        title: 'Large Calorie Surplus Detected',
        description: `You're consuming about ${surplus.toLocaleString()} kcal more than you burn daily. Over time this leads to weight gain. Increase activity or reduce portions.`,
        actionItems: [
          { text: 'Add 30 minutes of brisk walking to burn extra calories' },
          { text: 'Reduce dinner portion size by 20%' },
        ],
        basedOn: { metric: 'calorieSurplus', value: surplus, threshold: 500 },
      });
    }
  }

  // ───── MEAL LOGGING CONSISTENCY ─────
  if (data.dietDays < 3 && data.activeDays >= 5) {
    recommendations.push({
      type: 'diet',
      category: 'diet',
      severity: 'info',
      priority: 'low',
      title: 'Log Your Meals More Consistently',
      description: `You've only logged meals for ${data.dietDays} day(s) this week. Tracking nutrition helps you make better food choices and reach your health goals.`,
      actionItems: [
        { text: 'Log at least your main meals (breakfast, lunch, dinner)' },
      ],
      basedOn: { metric: 'dietDays', value: data.dietDays, threshold: 3 },
    });
  }

  // ───── HEART RATE (if available) ─────
  if (data.avgRestingHR > 0) {
    if (data.avgRestingHR > 100) {
      recommendations.push({
        type: 'checkup',
        category: 'general',
        severity: 'critical',
        priority: 'high',
        title: 'Elevated Resting Heart Rate',
        description: `Your resting heart rate averages ${data.avgRestingHR} bpm, which is above the normal range (60–100 bpm). This may indicate stress, dehydration, or an underlying condition. Consider seeing a doctor.`,
        actionItems: [
          { text: 'Schedule a check-up with your doctor' },
          { text: 'Practice deep breathing exercises for 5 minutes daily' },
        ],
        basedOn: { metric: 'avgRestingHR', value: data.avgRestingHR, threshold: 100 },
      });
    }
  }

  // ───── BLOOD PRESSURE (if available) ─────
  if (data.latestBP) {
    const { systolic, diastolic } = data.latestBP;
    if (systolic >= 140 || diastolic >= 90) {
      recommendations.push({
        type: 'checkup',
        category: 'general',
        severity: 'critical',
        priority: 'high',
        title: 'High Blood Pressure Reading',
        description: `Your latest BP reading is ${systolic}/${diastolic} mmHg, which is above the normal range. Consult your healthcare provider. Reduce sodium intake and manage stress.`,
        actionItems: [
          { text: 'Reduce salt in your meals' },
          { text: 'Schedule a follow-up with your doctor' },
        ],
        basedOn: { metric: 'bloodPressure', value: `${systolic}/${diastolic}`, threshold: '140/90' },
      });
    }
  }

  return recommendations;
};

/**
 * Build a daily health summary object from aggregated data.
 */
const buildDailySummary = (data) => ({
  date: new Date().toISOString().slice(0, 10),
  steps: { value: data.todaySteps ?? 0, goal: data.stepsGoal ?? 10000, status: getStatus(data.todaySteps, data.stepsGoal ?? 10000) },
  calories: {
    consumed: data.todayCaloriesConsumed ?? 0,
    burned: data.todayCaloriesBurned ?? 0,
    goal: data.recommendedCalories ?? 2000,
  },
  water: { value: data.todayWater ?? 0, goal: data.waterGoal ?? 2500, status: getStatus(data.todayWater, data.waterGoal ?? 2500) },
  sleep: { value: data.todaySleep ?? 0, goal: 8, status: getSleepStatus(data.todaySleep) },
  medication: {
    taken: data.todayTakenDoses ?? 0,
    missed: data.todayMissedDoses ?? 0,
    total: data.todayTotalDoses ?? 0,
    adherence: data.todayTotalDoses ? Math.round((data.todayTakenDoses / data.todayTotalDoses) * 100) : 100,
  },
  overallScore: computeDayScore(data),
});

/**
 * Build weekly activity feedback from aggregated week data.
 */
const buildWeeklyFeedback = (data) => {
  const feedback = [];

  // Steps trend
  if (data.weeklyStepsTrend === 'improving') {
    feedback.push({ category: 'fitness', sentiment: 'positive', message: `Your step count improved this week — up to an average of ${data.avgSteps.toLocaleString()} steps/day. Keep the momentum going!` });
  } else if (data.weeklyStepsTrend === 'declining') {
    feedback.push({ category: 'fitness', sentiment: 'negative', message: `Your activity declined this week (avg ${data.avgSteps.toLocaleString()} steps). Try to get back on track with short daily walks.` });
  }

  // Sleep trend
  if (data.avgSleep >= 7) {
    feedback.push({ category: 'sleep', sentiment: 'positive', message: `Great sleep this week — averaging ${data.avgSleep} hours/night.` });
  } else if (data.avgSleep > 0 && data.avgSleep < 6) {
    feedback.push({ category: 'sleep', sentiment: 'negative', message: `Sleep was low this week at ${data.avgSleep} hours/night. Prioritise rest.` });
  }

  // Medication
  if (data.adherenceRate >= 90) {
    feedback.push({ category: 'medication', sentiment: 'positive', message: `Excellent medication adherence at ${data.adherenceRate}%.` });
  } else if (data.adherenceRate < 70 && data.medicationCount > 0) {
    feedback.push({ category: 'medication', sentiment: 'negative', message: `Medication adherence dropped to ${data.adherenceRate}%. Consistent dosing is critical.` });
  }

  // Hydration
  if (data.avgWater >= 2000) {
    feedback.push({ category: 'hydration', sentiment: 'positive', message: `Hydration on point — averaging ${data.avgWater}ml/day.` });
  } else if (data.avgWater > 0 && data.avgWater < 1500) {
    feedback.push({ category: 'hydration', sentiment: 'negative', message: `Low water intake this week (${data.avgWater}ml avg). Drink more fluids.` });
  }

  // Diet
  if (data.dietDays >= 5) {
    feedback.push({ category: 'diet', sentiment: 'positive', message: `Good meal tracking — you logged ${data.dietDays} out of 7 days.` });
  } else if (data.dietDays > 0 && data.dietDays < 3) {
    feedback.push({ category: 'diet', sentiment: 'negative', message: `Only logged meals on ${data.dietDays} day(s). Consistent tracking helps you make better choices.` });
  }

  return feedback;
};

// ─── Helpers ────────────────────────────────────────────
function getStatus(value, goal) {
  if (!goal) return 'no_data';
  const pct = value / goal;
  if (pct >= 1) return 'achieved';
  if (pct >= 0.7) return 'on_track';
  if (pct >= 0.4) return 'needs_improvement';
  return 'low';
}

function getSleepStatus(hours) {
  if (!hours) return 'no_data';
  if (hours >= 7) return 'achieved';
  if (hours >= 6) return 'on_track';
  return 'needs_improvement';
}

function computeDayScore(data) {
  let score = 50; // base
  const steps = data.todaySteps ?? 0;
  const stepsGoal = data.stepsGoal ?? 10000;
  score += Math.min(15, Math.round((steps / stepsGoal) * 15));

  const water = data.todayWater ?? 0;
  const waterGoal = data.waterGoal ?? 2500;
  score += Math.min(10, Math.round((water / waterGoal) * 10));

  const sleep = data.todaySleep ?? 0;
  score += sleep >= 7 ? 10 : sleep >= 5 ? 5 : 0;

  if (data.todayTotalDoses > 0) {
    const medPct = (data.todayTakenDoses ?? 0) / data.todayTotalDoses;
    score += Math.round(medPct * 15);
  } else {
    score += 15;
  }

  return Math.min(100, Math.max(0, score));
}

module.exports = { evaluate, buildDailySummary, buildWeeklyFeedback };
