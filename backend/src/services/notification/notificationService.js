const { createAndSendNotification } = require('./pushService');

exports.notifyMedicationReminder = (userId, medication, time) =>
  createAndSendNotification(userId, { title: 'Medication Reminder', body: 'Time to take ' + medication.name + ' (' + medication.dosage + ')', type: 'medication', data: { medicationId: medication._id.toString(), time }, priority: 'high' });

exports.notifyMissedDose = (userId, medication) =>
  createAndSendNotification(userId, { title: 'Missed Dose Alert', body: 'You missed your dose of ' + medication.name, type: 'medication', data: { medicationId: medication._id.toString() }, priority: 'high' });

exports.notifyAppointmentReminder = (userId, appointment) =>
  createAndSendNotification(userId, { title: 'Appointment Reminder', body: 'Appointment with Dr. ' + appointment.doctorName + ' tomorrow', type: 'appointment', data: { appointmentId: appointment._id.toString() } });

exports.notifyRefillReminder = (userId, medication) =>
  createAndSendNotification(userId, { title: 'Refill Reminder', body: medication.name + ' is running low', type: 'refill', data: { medicationId: medication._id.toString() } });

exports.notifyNewRecommendation = (userId, recommendation) =>
  createAndSendNotification(userId, { title: 'New Health Recommendation', body: recommendation.title, type: 'recommendation', data: { recommendationId: recommendation._id.toString() } });
