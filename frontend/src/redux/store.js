import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';
import medicationSlice from './slices/medicationSlice';
import appointmentSlice from './slices/appointmentSlice';
import labReportSlice from './slices/labReportSlice';
import fitnessSlice from './slices/fitnessSlice';
import chatbotSlice from './slices/chatbotSlice';
import recommendationSlice from './slices/recommendationSlice';
import trustedContactSlice from './slices/trustedContactSlice';
import reportSlice from './slices/reportSlice';
import notificationSlice from './slices/notificationSlice';
import { apiMiddleware } from './middleware/apiMiddleware';

const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    medication: medicationSlice,
    appointment: appointmentSlice,
    labReport: labReportSlice,
    fitness: fitnessSlice,
    chatbot: chatbotSlice,
    recommendation: recommendationSlice,
    trustedContact: trustedContactSlice,
    report: reportSlice,
    notification: notificationSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(apiMiddleware),
});

export default store;
