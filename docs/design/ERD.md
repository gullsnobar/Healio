# Entity Relationship Diagram

## Entities
- **User** (1) --> (N) **Medication**
- **User** (1) --> (N) **Appointment**
- **User** (1) --> (N) **LabReport**
- **User** (1) --> (N) **FitnessData**
- **User** (1) --> (N) **WaterIntake**
- **User** (1) --> (N) **DietLog**
- **User** (1) --> (N) **TrustedContact**
- **User** (1) --> (N) **Notification**
- **User** (1) --> (N) **ChatHistory**
- **User** (1) --> (N) **Recommendation**
- **User** (1) --> (N) **HealthReport**
- **User** (1) --> (N) **ActivityLog**

## Key Relationships
- Medication has embedded adherenceHistory
- Appointment has embedded prescriptions
- LabReport has embedded results + aiAnalysis
- FitnessData has embedded steps, sleep, heartRate
- HealthReport references Medication via medicationAdherence
