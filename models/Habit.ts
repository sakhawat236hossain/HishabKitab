import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHabit extends Document {
  userId: mongoose.Types.ObjectId | string;
  title: string;
  targetDays: number;
  createdAt: Date;
}

const HabitSchema: Schema<IHabit> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    targetDays: { type: Number, default: 30 },
  },
  { timestamps: true }
);

export const Habit: Model<IHabit> =
  mongoose.models.Habit || mongoose.model<IHabit>("Habit", HabitSchema);
