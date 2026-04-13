# Date & Time Picker Components

This document explains how to use the improved date and time picker components in your React Native app.

## 🚀 **What's New**

Replaced long scrolling dropdown lists with native date/time picker modals for a professional mobile UX.

### **Before (Poor UX):**
- Long scrolling list of 30+ dates
- Every 30-minute interval for 24 hours
- Tedious scrolling and selection

### **After (Professional UX):**
- Native iOS/Android date/time picker modals
- Clean input fields with formatted display
- Single tap to open picker
- Modern mobile UI/UX standards

## 📦 **Installation**

The required library is already installed:
```json
"@react-native-community/datetimepicker": "^7.6.2"
```

## 🧩 **Components**

### **DateInput Component**
```jsx
import DateInput from '../components/common/DateInput';

<DateInput
  label="Date of Birth"
  value={dateOfBirth}
  onChange={setDateOfBirth}
  placeholder="Select Date of Birth"
  required={true}
  minimumDate={new Date('1900-01-01')}
  maximumDate={new Date()}
/>
```

### **TimeInput Component**
```jsx
import TimeInput from '../components/common/TimeInput';

<TimeInput
  label="Appointment Time"
  value={appointmentTime}
  onChange={setAppointmentTime}
  placeholder="Select Time"
  required={true}
/>
```

### **Dropdown Component (Updated)**
The Dropdown component now automatically uses DateInput/TimeInput when `mode` is set:

```jsx
import Dropdown from '../components/common/Dropdown';

// Date picker
<Dropdown
  mode="date"
  label="Start Date"
  value={startDate}
  onChange={setStartDate}
  placeholder="Select start date"
  required
/>

// Time picker
<Dropdown
  mode="time"
  label="Reminder Time"
  value={reminderTime}
  onChange={setReminderTime}
  placeholder="Select time"
  required
/>

// Regular dropdown (unchanged)
<Dropdown
  label="Priority"
  options={['Low', 'Medium', 'High']}
  value={priority}
  onChange={setPriority}
  placeholder="Select priority"
/>
```

## 🎨 **UI Features**

### **Clean Input Design:**
- Rounded corners with proper padding
- Icons for visual context (calendar/time)
- Placeholder text guidance
- Required field indicators (*)
- Theme-aware colors (dark/light mode)

### **Native Picker Behavior:**
- **iOS:** Spinner-style picker in slide-up modal with "Done" button
- **Android:** System date/time dialog
- **Cross-platform:** Consistent API, platform-specific UX

### **Formatted Display:**
- **Date:** "Apr 8, 2024" (localized format)
- **Time:** "03:30 PM" (12-hour format with AM/PM)

## 📱 **Usage Examples**

### **1. Profile Form (Date of Birth)**
```jsx
const [dateOfBirth, setDateOfBirth] = useState(null);

<DateInput
  label="Date of Birth"
  value={dateOfBirth}
  onChange={setDateOfBirth}
  placeholder="Select your date of birth"
  minimumDate={new Date('1900-01-01')}
  maximumDate={new Date()}
/>
```

### **2. Appointment Booking**
```jsx
const [appointmentDate, setAppointmentDate] = useState(new Date());
const [appointmentTime, setAppointmentTime] = useState(new Date());

<Dropdown
  mode="date"
  label="Appointment Date"
  value={appointmentDate}
  onChange={setAppointmentDate}
  placeholder="Select appointment date"
  required
/>

<Dropdown
  mode="time"
  label="Appointment Time"
  value={appointmentTime}
  onChange={setAppointmentTime}
  placeholder="Select appointment time"
  required
/>
```

### **3. Medication Reminder**
```jsx
const [startDate, setStartDate] = useState(new Date());
const [reminderTime, setReminderTime] = useState(new Date());

<Dropdown
  mode="date"
  label="Start Date"
  value={startDate}
  onChange={setStartDate}
  placeholder="When to start reminders"
  minDate={new Date()}
/>

<Dropdown
  mode="time"
  label="Daily Reminder Time"
  value={reminderTime}
  onChange={setReminderTime}
  placeholder="What time to remind"
/>
```

## 🔧 **Component Props**

### **DateInput Props:**
```jsx
{
  label?: string,           // Field label
  value?: Date,            // Selected date
  onChange: (date: Date) => void,  // Callback when date changes
  placeholder?: string,    // Placeholder text
  required?: boolean,      // Show required indicator
  minimumDate?: Date,      // Minimum selectable date
  maximumDate?: Date,      // Maximum selectable date
  style?: ViewStyle        // Custom container styles
}
```

### **TimeInput Props:**
```jsx
{
  label?: string,           // Field label
  value?: Date,            // Selected time
  onChange: (time: Date) => void,  // Callback when time changes
  placeholder?: string,    // Placeholder text
  required?: boolean,      // Show required indicator
  style?: ViewStyle        // Custom container styles
}
```

### **Dropdown Props (Date/Time Mode):**
```jsx
{
  mode: 'date' | 'time',    // Use native picker
  label?: string,           // Field label
  value?: Date,            // Selected date/time
  onChange: (value: Date) => void,  // Callback
  placeholder?: string,    // Placeholder text
  required?: boolean,      // Show required indicator
  minDate?: Date,          // Minimum date (date mode only)
  maxDate?: Date,          // Maximum date (date mode only)
  style?: ViewStyle        // Custom styles
}
```

## 🛠 **Migration Guide**

### **From Old Dropdown (Scrolling Lists):**
```jsx
// OLD - Don't use this anymore
<Dropdown
  type="date"  // or mode="date"
  value="2024-04-08"
  onSelect={(dateString) => setDate(dateString)}
/>
```

### **To New Native Picker:**
```jsx
// NEW - Use this instead
<Dropdown
  mode="date"
  value={new Date(dateString)}
  onChange={(date) => setDate(date.toISOString().split('T')[0])}
/>
```

Or use DateInput/TimeInput directly:
```jsx
<DateInput
  value={dateObject}
  onChange={setDateObject}
/>
```

## ✅ **Forms Updated**

The following forms have been updated to use native pickers:
- ✅ Profile Screen (Date of Birth)
- ✅ Add Medication Form (Start Date)
- ✅ Add Appointment Form (Date & Time)
- ✅ Edit Appointment Form (Date & Time)
- ✅ Upload Lab Report (Report Date)
- ✅ Manual Fitness Entry (Entry Date)
- ✅ Reminder Form (Date & Time fields)

## 🎯 **Best Practices**

1. **Use Date Objects:** Store dates as Date objects, not strings
2. **Provide Constraints:** Set minDate/maxDate for better UX
3. **Handle Validation:** Check for required fields before submission
4. **Consistent Styling:** Use the same placeholder patterns
5. **Accessibility:** Native pickers are automatically accessible

## 🚨 **Important Notes**

- **Existing API Integration:** All existing form validation and API calls remain unchanged
- **Backward Compatibility:** Old dropdown usage still works for text options
- **Platform Differences:** iOS uses spinner modals, Android uses system dialogs
- **Theme Support:** Components automatically adapt to dark/light themes

## 🐛 **Troubleshooting**

### **Picker Not Showing:**
- Ensure `@react-native-community/datetimepicker` is installed
- Check that `value` is a valid Date object

### **iOS Modal Issues:**
- Make sure the modal is properly positioned
- Check for conflicting modal presentations

### **Android Dialog Issues:**
- Ensure proper permissions (usually not needed for date/time)
- Check for theme conflicts

---

**Result:** Professional, native-feeling date/time selection that matches modern mobile app standards! 🎉