/**
 * AI SUGGESTION ENGINE SERVICE
 * Rule-based AI that generates personalized health suggestions
 * Production-ready with validation and logging
 */

/**
 * Health suggestion level enum
 */
const SUGGESTION_LEVELS = {
  LOW_PRIORITY: 'low',
  MEDIUM_PRIORITY: 'medium',
  HIGH_PRIORITY: 'high',
  CRITICAL: 'critical',
};

/**
 * Generate health suggestions based on user data
 * @param {Object} userData - User health data
 * @param {number} userData.steps - Daily steps walked
 * @param {number} userData.sleepHours - Hours of sleep
 * @param {number} userData.missedDoses - Number of missed medication doses
 * @param {number} userData.waterIntake - Water intake in liters
 * @param {number} userData.heartRate - Heart rate (optional, BPM)
 * @returns {Object} - Suggestions with priority levels
 */
const generateHealthSuggestions = (userData) => {
  try {
    console.log('📊 [Suggestions] Generating suggestions for user data:', userData);

    // Validate input
    if (!userData || typeof userData !== 'object') {
      throw new Error('Invalid user data: must be an object');
    }

    const suggestions = {
      activity: [],
      sleep: [],
      medication: [],
      hydration: [],
      critical: [],
    };

    const allSuggestions = [];

    // ===== ACTIVITY SUGGESTIONS =====
    const steps = parseInt(userData.steps) || 0;

    if (steps < 1000) {
      allSuggestions.push({
        type: 'activity',
        priority: SUGGESTION_LEVELS.HIGH_PRIORITY,
        title: '🚶 Very Low Activity',
        message: 'You\'ve walked less than 1000 steps today. Try a short walk!',
        actionItems: [
          'Take a 10-minute walk',
          'Use stairs instead of elevators',
          'Do light stretching exercises',
        ],
      });
    } else if (steps < 3000) {
      allSuggestions.push({
        type: 'activity',
        priority: SUGGESTION_LEVELS.MEDIUM_PRIORITY,
        title: '🚴 Increase Activity',
        message: 'You\'re below the recommended 10,000 steps. Let\'s boost your activity!',
        actionItems: [
          'Aim for 5,000 more steps',
          'Do 20-minute moderate exercise',
          'Park farther away to walk more',
        ],
      });
    } else if (steps < 8000) {
      allSuggestions.push({
        type: 'activity',
        priority: SUGGESTION_LEVELS.LOW_PRIORITY,
        title: '✨ Almost there!',
        message: 'Getting close to 10,000 steps! Keep moving.',
        actionItems: [
          'Continue regular activity',
          'Aim for final 2,000 steps',
        ],
      });
    } else if (steps >= 10000) {
      allSuggestions.push({
        type: 'activity',
        priority: SUGGESTION_LEVELS.LOW_PRIORITY,
        title: '🏆 Great Job!',
        message: 'You\'ve reached your daily step goal! Excellent activity level.',
        actionItems: [
          'Maintain this consistency',
          'Stay active throughout the day',
        ],
      });
    }

    // ===== SLEEP SUGGESTIONS =====
    const sleepHours = parseFloat(userData.sleepHours) || 0;

    if (sleepHours < 4) {
      allSuggestions.push({
        type: 'sleep',
        priority: SUGGESTION_LEVELS.CRITICAL,
        title: '😴 Critical Sleep Deficit',
        message: 'You\'re severely sleep deprived. This affects your health!',
        actionItems: [
          'Aim for sleep TONIGHT',
          'Reduce screen time before bed',
          'Create a calming bedtime routine',
          'Consider consulting a doctor if persistent',
        ],
      });
    } else if (sleepHours < 6) {
      allSuggestions.push({
        type: 'sleep',
        priority: SUGGESTION_LEVELS.HIGH_PRIORITY,
        title: '🌙 Insufficient Sleep',
        message: 'You need more sleep for optimal health. Recommended: 7-9 hours.',
        actionItems: [
          'Go to bed 30 minutes earlier',
          'Avoid caffeine after 2 PM',
          'Keep bedroom cool and dark',
        ],
      });
    } else if (sleepHours < 7) {
      allSuggestions.push({
        type: 'sleep',
        priority: SUGGESTION_LEVELS.MEDIUM_PRIORITY,
        title: '⏰ Good Sleep',
        message: 'Your sleep is decent. Try to reach 7-9 hours for better health.',
        actionItems: [
          'Gradually increase sleep duration',
          'Maintain consistent sleep schedule',
        ],
      });
    } else if (sleepHours <= 9) {
      allSuggestions.push({
        type: 'sleep',
        priority: SUGGESTION_LEVELS.LOW_PRIORITY,
        title: '✅ Excellent Sleep',
        message: 'Great sleep quality! Keep maintaining this routine.',
        actionItems: [
          'Continue your sleep schedule',
        ],
      });
    } else {
      allSuggestions.push({
        type: 'sleep',
        priority: SUGGESTION_LEVELS.MEDIUM_PRIORITY,
        title: '😴 Too Much Sleep',
        message: 'You\'re sleeping more than 9 hours. This might indicate fatigue.',
        actionItems: [
          'Gradually reduce sleep duration',
          'Increase physical activity',
          'Check with a healthcare provider',
        ],
      });
    }

    // ===== MEDICATION SUGGESTIONS =====
    const missedDoses = parseInt(userData.missedDoses) || 0;

    if (missedDoses >= 5) {
      allSuggestions.push({
        type: 'medication',
        priority: SUGGESTION_LEVELS.CRITICAL,
        title: '⚠️ Critical: Multiple Missed Doses',
        message: 'You\'ve missed 5+ medication doses. This is serious!',
        actionItems: [
          'Take your next dose immediately',
          'Set phone reminders for next doses',
          'Contact your doctor if concerned',
          'Keep medication in visible location',
        ],
      });
    } else if (missedDoses >= 3) {
      allSuggestions.push({
        type: 'medication',
        priority: SUGGESTION_LEVELS.HIGH_PRIORITY,
        title: '🚨 Warning: Multiple Missed Doses',
        message: `You've missed ${missedDoses} medication doses. Don't miss more!`,
        actionItems: [
          'Enable medication reminders',
          'Use the app notifications',
          'Set alarms on your phone',
          'Speak to your pharmacist',
        ],
      });
    } else if (missedDoses === 2) {
      allSuggestions.push({
        type: 'medication',
        priority: SUGGESTION_LEVELS.MEDIUM_PRIORITY,
        title: '⏰ Reminder: Missed 2 Doses',
        message: 'You\'ve missed 2 medication doses this week. Try not to miss any more.',
        actionItems: [
          'Set up reminders',
          'Take next dose on time',
        ],
      });
    } else if (missedDoses === 1) {
      allSuggestions.push({
        type: 'medication',
        priority: SUGGESTION_LEVELS.LOW_PRIORITY,
        title: '📌 Reminder: 1 Missed Dose',
        message: 'You missed one dose. Make sure to take your next dose on time!',
        actionItems: [
          'Set reminder for next dose',
        ],
      });
    } else if (missedDoses === 0) {
      allSuggestions.push({
        type: 'medication',
        priority: SUGGESTION_LEVELS.LOW_PRIORITY,
        title: '💊 Perfect Medication Adherence!',
        message: 'Great job! You haven\'t missed any doses. Keep it up!',
        actionItems: [
          'Maintain this consistency',
          'Continue your routine',
        ],
      });
    }

    // ===== HYDRATION SUGGESTIONS =====
    const waterIntake = parseFloat(userData.waterIntake) || 0;

    if (waterIntake < 1) {
      allSuggestions.push({
        type: 'hydration',
        priority: SUGGESTION_LEVELS.CRITICAL,
        title: '💧 Critical: Severe Dehydration',
        message: 'You\'ve had less than 1 liter of water. Drink water immediately!',
        actionItems: [
          'Drink water right now',
          'Aim for 2-3 liters today',
          'Keep water bottle nearby',
        ],
      });
    } else if (waterIntake < 2) {
      allSuggestions.push({
        type: 'hydration',
        priority: SUGGESTION_LEVELS.HIGH_PRIORITY,
        title: '💦 Low Hydration',
        message: `You've only had ${waterIntake}L of water. Aim for 2-3 liters daily.`,
        actionItems: [
          'Drink more water throughout the day',
          'Set hydration reminders',
          'Drink water with each meal',
        ],
      });
    } else if (waterIntake < 2.5) {
      allSuggestions.push({
        type: 'hydration',
        priority: SUGGESTION_LEVELS.MEDIUM_PRIORITY,
        title: '💧 Good Hydration',
        message: 'Your water intake is good! Try to reach 2.5-3 liters.',
        actionItems: [
          'Drink just a bit more water',
          'Add herbal tea or water-rich foods',
        ],
      });
    } else if (waterIntake <= 3.5) {
      allSuggestions.push({
        type: 'hydration',
        priority: SUGGESTION_LEVELS.LOW_PRIORITY,
        title: '✅ Excellent Hydration',
        message: 'Perfect water intake! You\'re well-hydrated.',
        actionItems: [
          'Maintain this hydration level',
        ],
      });
    } else {
      allSuggestions.push({
        type: 'hydration',
        priority: SUGGESTION_LEVELS.MEDIUM_PRIORITY,
        title: '⚠️ Excessive Water Intake',
        message: `You've consumed ${waterIntake}L of water (over 3.5L). This is excessive.`,
        actionItems: [
          'Reduce water intake slightly',
          'Consult doctor if swelling occurs',
        ],
      });
    }

    // ===== HEART RATE SUGGESTIONS (OPTIONAL) =====
    if (userData.heartRate) {
      const heartRate = parseInt(userData.heartRate) || 0;

      if (heartRate < 60 && heartRate > 0) {
        allSuggestions.push({
          type: 'heartRate',
          priority: SUGGESTION_LEVELS.MEDIUM_PRIORITY,
          title: '❤️ Low Heart Rate',
          message: `Your heart rate is ${heartRate} BPM (low).`,
          actionItems: [
            'Consult with a healthcare provider',
            'Monitor your vitals regularly',
          ],
        });
      } else if (heartRate > 100) {
        allSuggestions.push({
          type: 'heartRate',
          priority: SUGGESTION_LEVELS.HIGH_PRIORITY,
          title: '⚠️ Elevated Heart Rate',
          message: `Your heart rate is ${heartRate} BPM (elevated). Relax and rest.`,
          actionItems: [
            'Take deep breaths',
            'Sit down and relax',
            'Consult doctor if persistent',
          ],
        });
      }
    }

    // Organize suggestions by priority
    suggestions.critical = allSuggestions.filter(s => s.priority === SUGGESTION_LEVELS.CRITICAL);
    suggestions.high = allSuggestions.filter(s => s.priority === SUGGESTION_LEVELS.HIGH_PRIORITY);
    suggestions.medium = allSuggestions.filter(s => s.priority === SUGGESTION_LEVELS.MEDIUM_PRIORITY);
    suggestions.low = allSuggestions.filter(s => s.priority === SUGGESTION_LEVELS.LOW_PRIORITY);

    console.log(`✅ [Suggestions] Generated ${allSuggestions.length} suggestions`);

    return {
      success: true,
      total: allSuggestions.length,
      suggestions: allSuggestions,
      priorityBreakdown: {
        critical: suggestions.critical.length,
        high: suggestions.high.length,
        medium: suggestions.medium.length,
        low: suggestions.low.length,
      },
    };

  } catch (error) {
    console.error('❌ [Suggestions] Error:', error.message);
    throw error;
  }
};

/**
 * Detect critical health issues for alerts
 * @param {Object} userData - User health data
 * @returns {Array} - Array of alerts
 */
const detectHealthIssues = (userData) => {
  try {
    console.log('🔍 [Health Issues] Detecting critical issues...');

    const alerts = [];

    const steps = parseInt(userData.steps) || 0;
    const sleepHours = parseFloat(userData.sleepHours) || 0;
    const missedDoses = parseInt(userData.missedDoses) || 0;
    const waterIntake = parseFloat(userData.waterIntake) || 0;

    // Activity alert
    if (steps < 500) {
      alerts.push({
        type: 'ACTIVITY_ALERT',
        severity: 'HIGH',
        message: 'Low activity detected - Please move around',
        timestamp: new Date(),
      });
    }

    // Sleep alert
    if (sleepHours < 4) {
      alerts.push({
        type: 'SLEEP_ALERT',
        severity: 'CRITICAL',
        message: 'Severe sleep deprivation detected',
        timestamp: new Date(),
      });
    }

    // Medication alert
    if (missedDoses >= 3) {
      alerts.push({
        type: 'MEDICATION_ALERT',
        severity: 'CRITICAL',
        message: `Missed medication alert - ${missedDoses} doses missed`,
        timestamp: new Date(),
      });
    }

    // Hydration alert
    if (waterIntake < 1) {
      alerts.push({
        type: 'HYDRATION_ALERT',
        severity: 'HIGH',
        message: 'Severe dehydration - Drink water immediately',
        timestamp: new Date(),
      });
    }

    console.log(`✅ [Health Issues] Detected ${alerts.length} alerts`);

    return alerts;

  } catch (error) {
    console.error('❌ [Health Issues] Error:', error.message);
    throw error;
  }
};

module.exports = {
  generateHealthSuggestions,
  detectHealthIssues,
  SUGGESTION_LEVELS,
};
