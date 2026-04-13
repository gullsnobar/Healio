import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Switch,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAppTheme } from "../../styles/ThemeContext";
import DatePickerField from "../common/DatePickerField";
import Button from "../common/Button";
import Dropdown from "../common/Dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomTimePicker from "../common/CustomTimePicker";

const { width: SCREEN_W } = Dimensions.get("window");
const IS_SMALL = SCREEN_W < 400;

const MED_TYPES = ["Capsule", "Tablet", "Drops", "Syrup", "Injection", "Other"];
const DOSAGE_UNITS = ["mg", "ml", "tablets", "capsules", "drops", "units"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 * MedicationTimeInput Component
 * Time picker with AM/PM toggle for medication scheduling
 * On web: HTML time input + AM/PM toggle buttons
 * On native: Native DateTimePicker with AM/PM support
 */
const MedicationTimeInput = ({ value, onChange, colors, style }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [webInputValue, setWebInputValue] = useState("");

  // Parse time value
  const parseTimeValue = (input) => {
    if (!input) return undefined;
    if (input instanceof Date) return input;
    if (typeof input === "string" && /^[0-9]{2}:[0-9]{2}/.test(input)) {
      const parsed = new Date(`1970-01-01T${input}:00`);
      return Number.isNaN(parsed.getTime()) ? undefined : parsed;
    }
    // Handle "HH:MM AM/PM" format
    if (
      typeof input === "string" &&
      /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.test(input)
    ) {
      const match = input.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      let hour = parseInt(match[1]);
      const minute = parseInt(match[2]);
      const ampm = match[3].toUpperCase();
      if (ampm === "PM" && hour !== 12) hour += 12;
      if (ampm === "AM" && hour === 12) hour = 0;
      const parsed = new Date();
      parsed.setHours(hour, minute, 0, 0);
      return parsed;
    }
    const parsed = new Date(input);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  };

  const formatTimeForISO = (time) => {
    if (!time) return "";
    const hours = String(time.getHours()).padStart(2, "0");
    const minutes = String(time.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatTime = (time) => {
    if (!time) return "";
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const normalizedValue = parseTimeValue(value);
  const displayValue = normalizedValue ? formatTime(normalizedValue) : "";

  // Handle native picker changes (Android/iOS)
  const handleChange = (event, selectedTime) => {
    const eventType = event?.type;
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (eventType === "dismissed") {
      return;
    }
    if (selectedTime) {
      onChange(selectedTime);
    }
  };

  // Web platform: custom time picker
  if (Platform.OS === "web") {
    return (
      <View style={[s.timeInputContainer, style]}>
        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          style={{
            flex: 1,
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#1E293B",
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: "#334155",
            paddingHorizontal: 16,
            height: 52,
          }}
        >
          <Text style={{ color: "#F8FAFC", fontSize: 15 }}>
            {typeof value === "string" && value
              ? value
              : displayValue || "Select Time"}
          </Text>
          <Ionicons name="time-outline" size={20} color="#14B8A6" />
        </TouchableOpacity>
        <CustomTimePicker
          visible={showTimePicker}
          value={displayValue}
          onConfirm={(timeString) => {
            onChange(timeString);
            setShowTimePicker(false);
          }}
          onCancel={() => setShowTimePicker(false)}
        />
      </View>
    );
  }

  // Native platforms: TouchableOpacity with DateTimePicker
  return (
    <View style={[s.timeInputContainer, style]}>
      <TouchableOpacity
        style={[
          s.nativeTimeInput,
          {
            width: "100%",
            backgroundColor: "#1E293B",
            borderColor: "#334155",
          },
        ]}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <Ionicons
          name="time-outline"
          size={18}
          color={displayValue ? colors.primary : colors.textTertiary}
          style={{ marginRight: 8 }}
        />
        <Text
          style={[
            s.nativeTimeText,
            {
              color: displayValue ? "#F8FAFC" : "#64748B",
            },
          ]}
        >
          {displayValue || "Select Time"}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={normalizedValue || new Date()}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
};

/* Dropdown picker modal – defined outside to avoid stale closure issues */
const DropdownModal = ({
  visible,
  onClose,
  items,
  onSelect,
  selected,
  cardBg,
  textColor,
  primaryColor,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <TouchableOpacity
      style={s.modalOverlay}
      activeOpacity={1}
      onPress={onClose}
    >
      <View style={[s.modalCard, { backgroundColor: cardBg }]}>
        {items.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              s.modalItem,
              selected === item && { backgroundColor: "rgba(20,184,166,0.12)" },
            ]}
            onPress={() => {
              onSelect(item);
              onClose();
            }}
          >
            <Text
              style={[
                s.modalItemText,
                { color: selected === item ? primaryColor : textColor },
                selected === item && { fontWeight: "700" },
              ]}
            >
              {item}
            </Text>
            {selected === item && (
              <Ionicons name="checkmark" size={18} color={primaryColor} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </TouchableOpacity>
  </Modal>
);

const AddMedicationForm = ({ onSubmit, initialData }) => {
  const { colors } = useAppTheme();
  const [form, setForm] = useState({
    name: initialData?.name || "",
    type: initialData?.type || "Capsule",
    dosage: initialData?.dosage || "",
    dosageUnit: initialData?.dosageUnit || "mg",
    amount: initialData?.amount || "",
    frequency: initialData?.frequency || "Daily",
    times: initialData?.times
      ? initialData.times.map((t) => (typeof t === "string" ? t : t.time))
      : ["8:00 AM"],
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    selectedDays: initialData?.selectedDays || [0, 2, 4], // Mon, Wed, Fri
    alarmEnabled: initialData?.alarmEnabled ?? true,
    doctorName: initialData?.prescribedBy || initialData?.doctorName || "",
    notes: initialData?.instructions || initialData?.notes || "",
  });

  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showUnitMenu, setShowUnitMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleDay = (index) => {
    const next = form.selectedDays.includes(index)
      ? form.selectedDays.filter((d) => d !== index)
      : [...form.selectedDays, index];
    update("selectedDays", next);
  };

  const addTime = () => update("times", [...form.times, "12:00 PM"]);
  const removeTime = (index) => {
    if (form.times.length <= 1) return;
    update(
      "times",
      form.times.filter((_, i) => i !== index),
    );
  };
  const updateTime = (index, value) => {
    const next = [...form.times];
    next[index] = value;
    update("times", next);
  };

  const handleSubmit = async () => {
    if (!form.name.trim())
      return Alert.alert("Validation", "Medication name is required");
    if (!form.dosage.trim())
      return Alert.alert("Validation", "Dosage is required");
    setLoading(true);
    try {
      await onSubmit?.({
        ...form,
        name: form.name.trim(),
        dosage: form.dosage.trim(),
        amount: form.amount.trim(),
        startDate: form.startDate.trim(),
        endDate: form.endDate.trim() || null,
        doctorName: form.doctorName.trim(),
        notes: form.notes.trim(),
      });
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || !form.name.trim() || !form.dosage.trim();

  return (
    <ScrollView
      contentContainerStyle={s.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Section: Medication Info */}
      <Text style={[s.sectionLabel, { color: colors.textTertiary }]}>
        Medication Info
      </Text>

      {/* Name */}
      <View
        style={[
          s.inputWrap,
          { backgroundColor: "#1E293B", borderColor: "#334155" },
        ]}
      >
        <TextInput
          style={[s.input, { color: "#F8FAFC" }]}
          placeholder="Medicine Name *"
          placeholderTextColor="#64748B"
          value={form.name}
          onChangeText={(v) => update("name", v)}
          onFocus={() => setFocusedField("name")}
          onBlur={() => setFocusedField(null)}
        />
      </View>

      {/* Type dropdown */}
      <Dropdown
        label="Type"
        value={form.type}
        options={MED_TYPES}
        placeholder="Select type"
        onSelect={(value) => update("type", value)}
        required
      />

      {/* Dose + Unit */}
      <View style={s.rowGap}>
        <View
          style={[
            s.inputWrap,
            { flex: 1, backgroundColor: "#1E293B", borderColor: "#334155" },
          ]}
        >
          <TextInput
            style={[s.input, { color: "#F8FAFC" }]}
            placeholder="Dose *"
            placeholderTextColor="#64748B"
            keyboardType="numeric"
            value={form.dosage}
            onChangeText={(v) => update("dosage", v)}
            onFocus={() => setFocusedField("dosage")}
            onBlur={() => setFocusedField(null)}
          />
        </View>
        <View style={{ flex: 0.6 }}>
          <Dropdown
            label="Unit"
            value={form.dosageUnit}
            options={DOSAGE_UNITS}
            placeholder="Unit"
            onSelect={(value) => update("dosageUnit", value)}
          />
        </View>
      </View>

      {/* Amount */}
      <View
        style={[
          s.inputWrap,
          { backgroundColor: "#1E293B", borderColor: "#334155" },
        ]}
      >
        <TextInput
          style={[s.input, { color: "#F8FAFC" }]}
          placeholder="Amount (e.g. 1 pill)"
          placeholderTextColor="#64748B"
          value={form.amount}
          onChangeText={(v) => update("amount", v)}
          onFocus={() => setFocusedField("amount")}
          onBlur={() => setFocusedField(null)}
        />
      </View>

      {/* Section: Reminders */}
      <Text
        style={[s.sectionLabel, { marginTop: 8, color: colors.textTertiary }]}
      >
        Reminders
      </Text>

      {/* Start Date */}
      <Dropdown
        label="Start Date"
        value={form.startDate}
        placeholder="Select start date"
        mode="date"
        onChange={(value) => update("startDate", value)}
      />

      {/* Day chips */}
      <View style={s.dayRow}>
        {DAYS.map((day, i) => (
          <TouchableOpacity
            key={day}
            style={[
              s.dayChip,
              form.selectedDays.includes(i) && {
                backgroundColor: colors.primaryLight,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => toggleDay(i)}
          >
            <Text
              style={[
                s.dayChipText,
                { color: colors.textSecondary },
                form.selectedDays.includes(i) && { color: colors.primary },
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Times */}
      {form.times.map((time, i) => (
        <View key={i} style={s.timeRow}>
          <MedicationTimeInput
            value={time}
            onChange={(value) => updateTime(i, value)}
            colors={colors}
            style={{ flex: 1, marginBottom: 0 }}
          />
          {form.times.length > 1 && (
            <TouchableOpacity
              onPress={() => removeTime(i)}
              style={s.removeTimeBtn}
            >
              <Ionicons name="close-circle" size={22} color="#99F6E4" />
            </TouchableOpacity>
          )}
        </View>
      ))}
      <TouchableOpacity onPress={addTime} style={s.addTimeBtn}>
        <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
        <Text style={[s.addTimeText, { color: colors.primary }]}>Add Time</Text>
      </TouchableOpacity>

      {/* Alarm toggle */}
      <View
        style={[
          s.alarmRow,
          { backgroundColor: colors.cardAlt, borderColor: colors.border },
        ]}
      >
        <View>
          <Text style={[s.alarmTitle, { color: colors.text }]}>
            Turn on Alarm
          </Text>
          <Text style={[s.alarmSub, { color: colors.textTertiary }]}>
            Get notified at scheduled times
          </Text>
        </View>
        <Switch
          value={form.alarmEnabled}
          onValueChange={(v) => update("alarmEnabled", v)}
          trackColor={{ false: colors.border, true: "#99F6E4" }}
          thumbColor={form.alarmEnabled ? colors.primary : colors.textTertiary}
        />
      </View>

      {/* Section: Additional (collapsed by default – always visible) */}
      <Text
        style={[s.sectionLabel, { marginTop: 8, color: colors.textTertiary }]}
      >
        Additional
      </Text>

      <View
        style={[
          s.inputWrap,
          { backgroundColor: "#1E293B", borderColor: "#334155" },
        ]}
      >
        <TextInput
          style={[s.input, { color: "#F8FAFC" }]}
          placeholder="Doctor Name"
          placeholderTextColor="#64748B"
          value={form.doctorName}
          onChangeText={(v) => update("doctorName", v)}
          onFocus={() => setFocusedField("doctor")}
          onBlur={() => setFocusedField(null)}
        />
      </View>

      <View
        style={[
          s.inputWrap,
          {
            minHeight: 80,
            alignItems: "flex-start",
            backgroundColor: "#1E293B",
            borderColor: "#334155",
          },
        ]}
      >
        <TextInput
          style={[
            s.input,
            { textAlignVertical: "top", paddingTop: 14, color: "#F8FAFC" },
          ]}
          placeholder="Notes"
          placeholderTextColor="#64748B"
          multiline
          numberOfLines={3}
          value={form.notes}
          onChangeText={(v) => update("notes", v)}
          onFocus={() => setFocusedField("notes")}
          onBlur={() => setFocusedField(null)}
        />
      </View>

      {/* Save button */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={{
          backgroundColor: "rgb(15, 118, 110)",
          borderRadius: 14,
          paddingVertical: 16,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 8,
          marginTop: 8,
          opacity: disabled || loading ? 0.6 : 1,
        }}
      >
        <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
        <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>
          {initialData ? "Update Medicine" : "Save Medicine"}
        </Text>
      </TouchableOpacity>
      <Text style={[s.buttonDesc, { color: colors.textTertiary }]}>
        {initialData
          ? "Update your medication details and schedule"
          : "Add this medicine to your daily routine"}
      </Text>
    </ScrollView>
  );
};

const s = StyleSheet.create({
  container: {
    padding: IS_SMALL ? 16 : 24,
    paddingBottom: 48,
    backgroundColor: "#0F172A",
  },
  sectionLabel: {
    fontSize: IS_SMALL ? 13 : 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 15,
    letterSpacing: 0.2,
    height: "100%",
    ...(Platform.OS === "web" ? { outlineStyle: "none" } : {}),
  },
  dropdownWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    paddingHorizontal: IS_SMALL ? 12 : 16,
    height: IS_SMALL ? 52 : 56,
    marginBottom: 14,
    borderWidth: 1.5,
  },
  dropdownValue: { fontSize: IS_SMALL ? 14 : 15, fontWeight: "500" },
  dropdownPlaceholder: { fontSize: IS_SMALL ? 14 : 15 },
  rowGap: { flexDirection: "row", gap: IS_SMALL ? 8 : 10 },
  dayRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: IS_SMALL ? 6 : 8,
    marginBottom: 16,
  },
  dayChip: {
    paddingHorizontal: IS_SMALL ? 12 : 14,
    paddingVertical: IS_SMALL ? 8 : 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  dayChipText: { fontSize: IS_SMALL ? 12 : 13, fontWeight: "600" },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: IS_SMALL ? 6 : 8,
    marginBottom: 10,
  },
  removeTimeBtn: { padding: 4 },
  addTimeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  addTimeText: { fontSize: IS_SMALL ? 13 : 14, fontWeight: "600" },
  alarmRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    padding: IS_SMALL ? 14 : 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  alarmTitle: { fontSize: IS_SMALL ? 14 : 15, fontWeight: "700" },
  alarmSub: { fontSize: 12, marginTop: 2 },
  buttonDesc: {
    fontSize: IS_SMALL ? 12 : 13,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
  },

  /* MedicationTimeInput styles */
  timeInputContainer: {
    width: "100%",
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1.5,
    height: 52,
    marginBottom: 14,
  },
  ampmContainer: {
    flexDirection: "row",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderLeftWidth: 0,
    overflow: "hidden",
  },
  ampmButton: {
    paddingHorizontal: IS_SMALL ? 12 : 16,
    paddingVertical: IS_SMALL ? 8 : 10,
    borderWidth: 1,
    borderLeftWidth: 0,
    justifyContent: "center",
    alignItems: "center",
    minWidth: IS_SMALL ? 40 : 50,
  },
  ampmText: {
    fontSize: IS_SMALL ? 12 : 13,
    fontWeight: "600",
  },
  nativeTimeInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: IS_SMALL ? 12 : 16,
    height: "100%",
    borderWidth: 1.5,
  },
  nativeTimeText: {
    flex: 1,
    fontSize: IS_SMALL ? 14 : 15,
    letterSpacing: 0.2,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 40,
  },
  modalCard: {
    borderRadius: 16,
    paddingVertical: 8,
    maxHeight: 400,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  modalItemActive: { backgroundColor: "rgba(20,184,166,0.08)" },
  modalItemText: { fontSize: 16 },
});

export default AddMedicationForm;
