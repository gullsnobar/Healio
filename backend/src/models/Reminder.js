const mongoose = require('mongoose');

// ─────────────────────────────────────────────────────────
// Unified Reminder Schema  –  Mongoose Discriminator Pattern
// ─────────────────────────────────────────────────────────
//
// WHY DISCRIMINATORS over conditional schemas:
//
// 1. Single collection ('reminders') — one query fetches all types, filterable by `reminderType`.
// 2. Type-specific validation — each discriminator enforces only its own required fields.
// 3. Backward compatible — existing Medication / Appointment / LabReport models are untouched.
//    This Reminder model sits alongside them; it manages *reminder scheduling*, not the
//    primary resource data. Medications keep their adherence history; reminders handle alerts.
// 4. Scalable — adding a new reminder type is just one new discriminator file.
// 5. Clean querying — Reminder.find() returns all types; MedicationReminder.find() scopes to type.
//
// ─────────────────────────────────────────────────────────

const baseReminderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Reminder title is required'],
      trim: true,
      maxlength: 200,
    },
    date: {
      type: Date,
      required: [true, 'Reminder date is required'],
    },
    time: {
      type: String,
      required: [true, 'Reminder time is required'],
      match: [/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    reminderType: {
      type: String,
      required: true,
      enum: ['medication', 'appointment', 'lab'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    repeat: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly'],
      default: 'none',
    },
    notificationSent: {
      type: Boolean,
      default: false,
    },
    snoozedUntil: {
      type: Date,
    },
    // Optional reference to the source document
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'sourceModel',
    },
    sourceModel: {
      type: String,
      enum: ['Medication', 'Appointment', 'LabReport'],
    },
  },
  {
    timestamps: true,
    discriminatorKey: 'reminderType',
  }
);

// ── Indexes ──
baseReminderSchema.index({ user: 1, reminderType: 1, date: 1 });
baseReminderSchema.index({ date: 1, time: 1, isActive: 1, notificationSent: 1 });

// ── Instance methods ──
baseReminderSchema.methods.markCompleted = function () {
  this.isCompleted = true;
  this.completedAt = new Date();
  return this.save();
};

baseReminderSchema.methods.snooze = function (minutes = 15) {
  const snoozeTo = new Date(Date.now() + minutes * 60 * 1000);
  this.snoozedUntil = snoozeTo;
  this.notificationSent = false;
  return this.save();
};

// ── Virtuals ──
baseReminderSchema.virtual('isPast').get(function () {
  return new Date(`${this.date.toISOString().split('T')[0]}T${this.time}`) < new Date();
});

baseReminderSchema.set('toJSON', { virtuals: true });
baseReminderSchema.set('toObject', { virtuals: true });

// ── Base model ──
const Reminder = mongoose.model('Reminder', baseReminderSchema);

// ─────────────────────────────────────────
// DISCRIMINATOR: Medication Reminder
// ─────────────────────────────────────────
const MedicationReminder = Reminder.discriminator(
  'medication',
  new mongoose.Schema({
    medicationName: { type: String, required: [true, 'Medication name is required'], trim: true },
    dosage: { type: String, required: [true, 'Dosage is required'] },
    dosageUnit: { type: String, enum: ['mg', 'ml', 'tablet', 'capsule', 'drops', 'units'], default: 'mg' },
    frequency: {
      type: String,
      enum: ['once_daily', 'twice_daily', 'three_daily', 'four_daily', 'weekly', 'as_needed', 'custom'],
      required: [true, 'Frequency is required'],
    },
    instructions: { type: String, trim: true },
  })
);

// ─────────────────────────────────────────
// DISCRIMINATOR: Appointment Reminder
// ─────────────────────────────────────────
const AppointmentReminder = Reminder.discriminator(
  'appointment',
  new mongoose.Schema({
    doctorName: { type: String, required: [true, 'Doctor name is required'], trim: true },
    specialty: { type: String, trim: true },
    location: { type: String, trim: true },
    appointmentType: { type: String, enum: ['in_person', 'video', 'phone'], default: 'in_person' },
  })
);

// ─────────────────────────────────────────
// DISCRIMINATOR: Lab Report Reminder
// ─────────────────────────────────────────
const LabReminder = Reminder.discriminator(
  'lab',
  new mongoose.Schema({
    labName: { type: String, required: [true, 'Lab name is required'], trim: true },
    reportType: { type: String, required: [true, 'Report type is required'], trim: true },
    testName: { type: String, trim: true },
    orderedBy: { type: String, trim: true },
  })
);

module.exports = {
  Reminder,
  MedicationReminder,
  AppointmentReminder,
  LabReminder,
};
