const HealthReport = require('../../models/HealthReport');
const Medication = require('../../models/Medication');
const FitnessData = require('../../models/FitnessData');
const Appointment = require('../../models/Appointment');
const LabReport = require('../../models/LabReport');

exports.generateHealthReport = async (userId, type, startDate, endDate) => {
  const [medications, fitness, appointments, labs] = await Promise.all([
    Medication.find({ user: userId, isActive: true }),
    FitnessData.find({ user: userId, date: { $gte: startDate, $lte: endDate } }),
    Appointment.find({ user: userId, date: { $gte: startDate, $lte: endDate } }),
    LabReport.find({ user: userId, date: { $gte: startDate, $lte: endDate } }),
  ]);
  const medAdherence = medications.length ? Math.round(medications.reduce((a, m) => a + m.adherenceRate, 0) / medications.length) : 0;
  const avgSteps = fitness.length ? Math.round(fitness.reduce((a, f) => a + (f.steps?.count || 0), 0) / fitness.length) : 0;
  const avgSleep = fitness.length ? Math.round(fitness.reduce((a, f) => a + (f.sleep?.duration || 0), 0) / fitness.length * 10) / 10 : 0;
  const score = Math.min(100, Math.round(medAdherence * 0.35 + Math.min(avgSteps / 100, 35) + Math.min(avgSleep / 8 * 30, 30)));
  const report = await HealthReport.create({
    user: userId, type, period: { start: startDate, end: endDate },
    medicationAdherence: { overall: medAdherence, byMedication: medications.map(m => ({ medication: m._id, name: m.name, rate: m.adherenceRate })) },
    fitnessMetrics: { avgSteps, avgSleep },
    appointmentsSummary: { total: appointments.length, completed: appointments.filter(a => a.status === 'completed').length, missed: appointments.filter(a => a.status === 'no_show').length },
    labSummary: { testsCount: labs.length, normalCount: labs.filter(l => l.overallStatus === 'normal').length, abnormalCount: labs.filter(l => l.overallStatus === 'abnormal').length },
    score,
  });
  return report;
};
