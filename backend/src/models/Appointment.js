const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  doctorName: { type: String, required: [true, 'Doctor name is required'], trim: true },
  specialty: { type: String, trim: true },
  hospital: { type: String, trim: true },
  location: { address: String, coordinates: { lat: Number, lng: Number } },
  date: { type: Date, required: [true, 'Appointment date is required'] },
  time: { type: String, required: [true, 'Appointment time is required'] },
  duration: { type: Number, default: 30 },
  type: { type: String, enum: ['in_person', 'video', 'phone'], default: 'in_person' },
  status: { type: String, enum: ['upcoming', 'completed', 'cancelled', 'rescheduled', 'no_show'], default: 'upcoming' },
  reason: { type: String },
  notes: { type: String },
  prescriptions: [{ medication: String, dosage: String, instructions: String }],
  followUp: { needed: { type: Boolean, default: false }, date: Date, notes: String },
  reminderSent: { type: Boolean, default: false },
  attachments: [{ name: String, url: String, type: String }],
}, { timestamps: true });

appointmentSchema.index({ user: 1, date: 1 });
module.exports = mongoose.model('Appointment', appointmentSchema);
