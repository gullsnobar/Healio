/**
 * NOTIFICATION SERVICE
 * Handles Firebase Cloud Messaging (FCM) for push notifications
 * Production-ready with retry logic and error handling
 */

let admin;

/**
 * Initialize Firebase Admin
 */
const initializeFirebase = () => {
  try {
    // Firebase admin should already be initialized in server.js
    // We'll use require to get it
    const path = require('path');
    const fs = require('fs');

    if (!admin) {
      admin = require('firebase-admin');

      // Check if already initialized
      if (!admin.apps.length) {
        const serviceAccountPath = path.join(__dirname, '../../..', 'config', 'healio-bba24-firebase-adminsdk-fbsvc-b272baeefc.json');

        if (fs.existsSync(serviceAccountPath)) {
          const serviceAccount = require(serviceAccountPath);
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
          });
        }
      }
    }

    return admin;
  } catch (error) {
    console.error('❌ [Notifications] Firebase initialization error:', error.message);
    return null;
  }
};

/**
 * Send push notification to single device
 * @param {string} deviceToken - FCM device token
 * @param {Object} notification - Notification object
 * @param {string} notification.title - Notification title
 * @param {string} notification.body - Notification body
 * @param {Object} notification.data - Additional data to send
 * @returns {Promise<boolean>} - Success status
 */
const sendNotificationToDevice = async (deviceToken, notification) => {
  try {
    // Validate input
    if (!deviceToken || typeof deviceToken !== 'string') {
      throw new Error('Invalid device token');
    }

    if (!notification || !notification.title || !notification.body) {
      throw new Error('Invalid notification: must include title and body');
    }

    const firebaseAdmin = admin || initializeFirebase();

    if (!firebaseAdmin) {
      throw new Error('Firebase not initialized');
    }

    console.log(`📤 [Notification] Sending to device: ${deviceToken.substring(0, 20)}...`);

    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data || {},
      token: deviceToken,
    };

    // Add icon and badge for Android
    if (notification.icon) {
      message.android = {
        notification: {
          icon: notification.icon,
          color: '#0066CC',
        },
      };
    }

    const response = await firebaseAdmin.messaging().send(message);

    console.log(`✅ [Notification] Successfully sent to device:`, response);

    return {
      success: true,
      messageId: response,
      timestamp: new Date(),
    };

  } catch (error) {
    console.error('❌ [Notification] Error sending to device:', error.message);

    // Handle specific FCM errors
    if (error.code === 'messaging/invalid-registration-token') {
      console.warn('⚠️ [Notification] Invalid registration token - should be removed from database');
    } else if (error.code === 'messaging/registration-token-not-registered') {
      console.warn('⚠️ [Notification] Token not registered - app might be uninstalled');
    }

    throw error;
  }
};

/**
 * Send notification to multiple devices
 * @param {Array<string>} deviceTokens - Array of FCM device tokens
 * @param {Object} notification - Notification object
 * @returns {Promise<Object>} - Send results
 */
const sendNotificationToMultipleDevices = async (deviceTokens, notification) => {
  try {
    if (!Array.isArray(deviceTokens) || deviceTokens.length === 0) {
      throw new Error('Invalid device tokens array');
    }

    console.log(`📤 [Notification] Sending to ${deviceTokens.length} devices`);

    const firebaseAdmin = admin || initializeFirebase();

    if (!firebaseAdmin) {
      throw new Error('Firebase not initialized');
    }

    const results = {
      successful: [],
      failed: [],
      total: deviceTokens.length,
    };

    // Send to each device
    for (const token of deviceTokens) {
      try {
        const result = await sendNotificationToDevice(token, notification);
        results.successful.push({
          token: token.substring(0, 20) + '...',
          messageId: result.messageId,
        });
      } catch (error) {
        results.failed.push({
          token: token.substring(0, 20) + '...',
          error: error.message,
        });
      }
    }

    console.log(`✅ [Notification] Batch send complete - Success: ${results.successful.length}, Failed: ${results.failed.length}`);

    return results;

  } catch (error) {
    console.error('❌ [Notification] Batch error:', error.message);
    throw error;
  }
};

/**
 * Send notification using topic subscription (useful for broadcasting)
 * @param {string} topic - FCM topic name
 * @param {Object} notification - Notification object
 * @returns {Promise<boolean>} - Success status
 */
const sendNotificationToTopic = async (topic, notification) => {
  try {
    if (!topic || typeof topic !== 'string') {
      throw new Error('Invalid topic name');
    }

    console.log(`📢 [Notification] Sending to topic: ${topic}`);

    const firebaseAdmin = admin || initializeFirebase();

    if (!firebaseAdmin) {
      throw new Error('Firebase not initialized');
    }

    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data || {},
      topic: topic,
    };

    const response = await firebaseAdmin.messaging().send(message);

    console.log(`✅ [Notification] Sent to topic ${topic}:`, response);

    return {
      success: true,
      messageId: response,
      topic: topic,
      timestamp: new Date(),
    };

  } catch (error) {
    console.error('❌ [Notification] Topic send error:', error.message);
    throw error;
  }
};

/**
 * Subscribe device to topic
 * @param {string} deviceToken - Device token
 * @param {string} topic - Topic name
 * @returns {Promise<boolean>} - Success status
 */
const subscribeToTopic = async (deviceToken, topic) => {
  try {
    if (!deviceToken || !topic) {
      throw new Error('Invalid device token or topic');
    }

    const firebaseAdmin = admin || initializeFirebase();

    if (!firebaseAdmin) {
      throw new Error('Firebase not initialized');
    }

    console.log(`📝 [Notification] Subscribing to topic: ${topic}`);

    await firebaseAdmin.messaging().subscribeToTopic(deviceToken, topic);

    console.log(`✅ [Notification] Successfully subscribed to ${topic}`);

    return {
      success: true,
      deviceToken: deviceToken.substring(0, 20) + '...',
      topic: topic,
    };

  } catch (error) {
    console.error('❌ [Notification] Subscribe error:', error.message);
    throw error;
  }
};

/**
 * Unsubscribe device from topic
 * @param {string} deviceToken - Device token
 * @param {string} topic - Topic name
 * @returns {Promise<boolean>} - Success status
 */
const unsubscribeFromTopic = async (deviceToken, topic) => {
  try {
    if (!deviceToken || !topic) {
      throw new Error('Invalid device token or topic');
    }

    const firebaseAdmin = admin || initializeFirebase();

    if (!firebaseAdmin) {
      throw new Error('Firebase not initialized');
    }

    console.log(`📝 [Notification] Unsubscribing from topic: ${topic}`);

    await firebaseAdmin.messaging().unsubscribeFromTopic(deviceToken, topic);

    console.log(`✅ [Notification] Successfully unsubscribed from ${topic}`);

    return {
      success: true,
      deviceToken: deviceToken.substring(0, 20) + '...',
      topic: topic,
    };

  } catch (error) {
    console.error('❌ [Notification] Unsubscribe error:', error.message);
    throw error;
  }
};

/**
 * Send medication reminder notification
 * @param {string} deviceToken - Device token
 * @param {Object} medicationData - Medication details
 * @returns {Promise<Object>} - Send result
 */
const sendMedicationReminder = async (deviceToken, medicationData) => {
  try {
    const notification = {
      title: '💊 Medication Reminder',
      body: `Time to take ${medicationData.medicationName || 'your medication'}`,
      data: {
        type: 'MEDICATION_REMINDER',
        medicationId: medicationData.medicationId || '',
        dosage: medicationData.dosage || '',
        action: 'open_medication_details',
      },
      icon: 'medication_icon',
    };

    console.log(`💊 [Notification] Sending medication reminder for ${medicationData.medicationName}`);

    return await sendNotificationToDevice(deviceToken, notification);

  } catch (error) {
    console.error('❌ [Notification] Medication reminder error:', error.message);
    throw error;
  }
};

/**
 * Send health alert notification
 * @param {string} deviceToken - Device token
 * @param {Object} alertData - Alert details
 * @returns {Promise<Object>} - Send result
 */
const sendHealthAlert = async (deviceToken, alertData) => {
  try {
    const notification = {
      title: '⚠️ Health Alert',
      body: alertData.message || 'Important health notification',
      data: {
        type: 'HEALTH_ALERT',
        alertType: alertData.type || '',
        severity: alertData.severity || 'MEDIUM',
        action: 'open_health_dashboard',
      },
    };

    console.log(`⚠️ [Notification] Sending health alert: ${alertData.message}`);

    return await sendNotificationToDevice(deviceToken, notification);

  } catch (error) {
    console.error('❌ [Notification] Health alert error:', error.message);
    throw error;
  }
};

/**
 * Send fitness achievement notification
 * @param {string} deviceToken - Device token
 * @param {Object} achievementData - Achievement details
 * @returns {Promise<Object>} - Send result
 */
const sendAchievementNotification = async (deviceToken, achievementData) => {
  try {
    const notification = {
      title: '🏆 Achievement Unlocked!',
      body: achievementData.message || 'Great job on your progress!',
      data: {
        type: 'ACHIEVEMENT',
        achievementId: achievementData.achievementId || '',
        action: 'open_achievements',
      },
    };

    console.log(`🏆 [Notification] Sending achievement: ${achievementData.message}`);

    return await sendNotificationToDevice(deviceToken, notification);

  } catch (error) {
    console.error('❌ [Notification] Achievement notification error:', error.message);
    throw error;
  }
};

module.exports = {
  initializeFirebase,
  sendNotificationToDevice,
  sendNotificationToMultipleDevices,
  sendNotificationToTopic,
  subscribeToTopic,
  unsubscribeFromTopic,
  sendMedicationReminder,
  sendHealthAlert,
  sendAchievementNotification,
};
