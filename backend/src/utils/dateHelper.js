exports.formatDate = (date) => new Date(date).toISOString().split('T')[0];
exports.getStartOfDay = (date = new Date()) => { const d = new Date(date); d.setHours(0,0,0,0); return d; };
exports.getEndOfDay = (date = new Date()) => { const d = new Date(date); d.setHours(23,59,59,999); return d; };
exports.addDays = (date, days) => { const d = new Date(date); d.setDate(d.getDate() + days); return d; };
exports.daysBetween = (d1, d2) => Math.ceil(Math.abs(new Date(d2) - new Date(d1)) / (1000 * 60 * 60 * 24));
exports.isToday = (date) => { const t = new Date(); const d = new Date(date); return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear(); };
