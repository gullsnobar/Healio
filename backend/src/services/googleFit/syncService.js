const { google } = require('googleapis');
const User = require('../../models/User');
const FitnessData = require('../../models/FitnessData');
const { oauth2Client } = require('../../config/googleFit');

exports.syncFromGoogleFit = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user?.googleFitConnected || !user.googleFitTokens) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const existing = await FitnessData.findOne({ user: userId, date: today });
      if (existing) return existing;
      const fallback = await FitnessData.findOneAndUpdate(
        { user: userId, date: today },
        {
          steps: { count: 0, goal: 10000 },
          sleep: { duration: 0, goal: 8 },
          calories: { burned: 0, goal: 2500 },
          source: 'manual',
        },
        { upsert: true, new: true }
      );
      return fallback;
    }

    // Set credentials including refresh token for automatic refresh
    oauth2Client.setCredentials({
      access_token: user.googleFitTokens.accessToken,
      refresh_token: user.googleFitTokens.refreshToken,
      expiry_date: user.googleFitTokens.expiresAt,
    });

    const fitness = google.fitness({ version: 'v1', auth: oauth2Client });
    const now = Date.now();
    const dayAgo = now - 24 * 60 * 60 * 1000;

    // Fetch data with proper aggregation queries as per Google Fit API best practices
    const [stepsRes, sleepRes, heartRes, caloriesRes] = await Promise.all([
      // Steps: Data type com.google.step_count.delta aggregated daily
      fitness.users.dataset.aggregate({
        userId: 'me',
        requestBody: {
          aggregateBy: [{ dataTypeName: 'com.google.step_count.delta' }],
          bucketByTime: { durationMillis: 86400000 }, // 1 day in milliseconds
          startTimeMillis: dayAgo,
          endTimeMillis: now,
        },
      }).catch(err => {
        console.error('[GoogleFit] Steps fetch failed:', err.message);
        return { data: { bucket: [] } };
      }),

      // Sleep: Use sessions query for sleep data
      fitness.users.sessions.list({
        userId: 'me',
        activityType: 72, // Sleep activity type
        startTime: new Date(dayAgo).toISOString(),
        endTime: new Date(now).toISOString(),
      }).catch(err => {
        console.error('[GoogleFit] Sleep fetch failed:', err.message);
        return { data: { session: [] } };
      }),

      // Heart Rate: Data type com.google.heart_rate.bpm aggregated
      fitness.users.dataset.aggregate({
        userId: 'me',
        requestBody: {
          aggregateBy: [{ dataTypeName: 'com.google.heart_rate.bpm' }],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: dayAgo,
          endTimeMillis: now,
        },
      }).catch(err => {
        console.error('[GoogleFit] Heart rate fetch failed:', err.message);
        return { data: { bucket: [] } };
      }),

      // Calories Burned: Data type com.google.calories.expended
      fitness.users.dataset.aggregate({
        userId: 'me',
        requestBody: {
          aggregateBy: [{ dataTypeName: 'com.google.calories.expended' }],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: dayAgo,
          endTimeMillis: now,
        },
      }).catch(err => {
        console.error('[GoogleFit] Calories fetch failed:', err.message);
        return { data: { bucket: [] } };
      }),
    ]);

    // Extract values from responses with proper error handling
    const steps = stepsRes.data.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0;
    const heartRate = heartRes.data.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.fpVal || 0;
    const caloriesBurned = caloriesRes.data.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.fpVal || 0;

    // Calculate sleep duration from sessions
    let sleepDuration = 0;
    if (sleepRes.data.session && sleepRes.data.session.length > 0) {
      sleepRes.data.session.forEach((session) => {
        const duration = (session.endTimeMillis - session.startTimeMillis) / (1000 * 60 * 60); // Convert to hours
        sleepDuration += duration;
      });
      sleepDuration = Math.round(sleepDuration * 10) / 10; // Round to 1 decimal place
    }

    // Prepare today's date for database operation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Save synced data to database
    const data = await FitnessData.findOneAndUpdate(
      { user: userId, date: today },
      {
        steps: { count: Math.round(steps), goal: 10000 },
        sleep: { duration: sleepDuration, goal: 8 },
        calories: { burned: Math.round(caloriesBurned), goal: 2500 },
        heartRate: { average: Math.round(heartRate) },
        source: 'google_fit',
        lastSyncTime: new Date(),
      },
      { upsert: true, new: true }
    );

    console.log(`[GoogleFit] Sync successful for user ${userId}:`, {
      steps,
      sleep: sleepDuration,
      calories: caloriesBurned,
      heartRate,
    });

    return data;
  } catch (error) {
    console.error('[GoogleFit] Sync error:', error.message);
    throw new Error(`Google Fit sync failed: ${error.message}`);
  }
};

exports.connectGoogleFit = async (userId, code) => {
  try {
    if (!code) {
      throw new Error('Authorization code is required');
    }

    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token) {
      throw new Error('Failed to obtain access token');
    }

    // Update user with Google Fit tokens
    const user = await User.findByIdAndUpdate(
      userId,
      {
        googleFitConnected: true,
        googleFitTokens: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token || null,
          expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        },
      },
      { new: true }
    );

    console.log(`[GoogleFit] Connected successfully for user ${userId}`);
    return { connected: true, user: { id: user._id, email: user.email } };
  } catch (error) {
    console.error('[GoogleFit] Connection error:', error.message);
    throw new Error(`Google Fit connection failed: ${error.message}`);
  }
};
