const User = require('../models/User');
const { generateHealthReport } = require('../services/report/reportGenerator');
const { createAndSendNotification } = require('../services/notification/pushService');

exports.run = async () => {
  const users = await User.find({ isActive: true });
  const end = new Date(); const start = new Date(); start.setDate(end.getDate() - 7);
  for (const user of users) {
    try {
      await generateHealthReport(user._id, 'weekly', start, end);
      await createAndSendNotification(user._id, { title: 'Weekly Health Report', body: 'Your weekly health report is ready!', type: 'system' });
    } catch {}
  }
};
