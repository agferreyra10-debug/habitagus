```typescript
export interface Habit {
  id: string;
  name: string;
  color?: string;
  createdAt: number;
}

export interface Completion {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  createdAt: number;
}

export interface StorageData {
  version: number;
  habits: Habit[];
  completions: Completion[];
}

export interface StreakInfo {
  currentStreak: number;
  bestStreak: number;
  isAtRisk: boolean;
  completedToday: boolean;
}
```

---
