import mongoose from "mongoose";
import { Habit } from "@/models/Habit";

const defaultHabits = [
  { title: "Apply 10 Jobs", targetDays: 30 },
  { title: "Do at least 2 GitHub commits", targetDays: 30 },
  { title: "Wake up early", targetDays: 30 },
  { title: "Pray 5 times", targetDays: 30 },
  { title: "Read 10 pages of a book", targetDays: 30 },
  { title: "Drink 2L of water", targetDays: 30 },
  { title: "Exercise for 30 minutes", targetDays: 30 },
  { title: "Learn a new skill", targetDays: 30 },
  { title: "Meditate for 10 minutes", targetDays: 30 },
  { title: "Limit social media to 1 hour", targetDays: 30 },
];

export async function seedDefaultHabits(userId: mongoose.Types.ObjectId | string) {
  try {
    const habitsToInsert = defaultHabits.map((habit) => ({
      userId,
      ...habit,
    }));

    await Habit.insertMany(habitsToInsert);
    console.log(`Successfully seeded ${defaultHabits.length} habits for user ${userId}`);
  } catch (error) {
    console.error("Error seeding default habits:", error);
  }
}
