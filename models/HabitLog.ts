import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHabitLog extends Document {
  userId: mongoose.Types.ObjectId | string;
  habitId: mongoose.Types.ObjectId | string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

const HabitLogSchema: Schema<IHabitLog> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    habitId: { type: Schema.Types.ObjectId, ref: "Habit", required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Compound index to ensure one log per habit per date
HabitLogSchema.index({ habitId: 1, date: 1 }, { unique: true });

export const HabitLog: Model<IHabitLog> =
  mongoose.models.HabitLog || mongoose.model<IHabitLog>("HabitLog", HabitLogSchema);
