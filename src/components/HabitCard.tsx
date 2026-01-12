```typescript
'use client';

import { useState } from 'react';
import type { Habit } from '@/lib/types';
import { lastNDays, getDayLabel, isToday, todayLocal } from '@/lib/date';
import { isCompleted, toggleCompletion, getCompletionsByHabit } from '@/lib/storage';
import { computeCurrentStreak, computeBestStreak, isStreakAtRisk } from '@/lib/streaks';

interface HabitCardProps {
  habit: Habit;
  onDelete: (habitId: string) => void;
  onUpdate: () => void;
}

export default function HabitCard({ habit, onDelete, onUpdate }: HabitCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const today = todayLocal();
  const last7Days = lastNDays(7);
  
  // Obtener completions y calcular rachas
  const completions = getCompletionsByHabit(habit.id);
  const completionDates = completions.map(c => c.date);
  const todayCompleted = isCompleted(habit.id, today);
  
  const currentStreak = computeCurrentStreak(completionDates, today);
  const bestStreak = computeBestStreak(completionDates);
  const atRisk = isStreakAtRisk(currentStreak, todayCompleted);

  const handleToggleToday = () => {
    toggleCompletion(habit.id, today);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    onUpdate();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1">
          {habit.color && (
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: habit.color }}
            />
          )}
          <h3 className="text-lg font-semibold text-gray-900">{habit.name}</h3>
        </div>
        <button
          onClick={() => onDelete(habit.id)}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
          aria-label="Eliminar hábito"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Toggle hoy */}
      <button
        onClick={handleToggleToday}
        className={`w-full mb-4 py-3 px-4 rounded-lg font-medium transition-all ${
          todayCompleted
            ? 'bg-green-500 text-white hover:bg-green-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } ${isAnimating ? 'animate-pop' : ''}`}
        aria-label={todayCompleted ? 'Desmarcar hoy' : 'Completar hoy'}
      >
        {todayCompleted ? '✓ Completado hoy' : 'Completar hoy'}
      </button>

      {/* Rachas */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <span className="font-semibold text-gray-900">
            {currentStreak} {currentStreak === 1 ? 'día' : 'días'}
          </span>
        </div>
        <span className="text-gray-500">
          Mejor: {bestStreak}
        </span>
      </div>

      {/* Badge en riesgo */}
      {atRisk && (
        <div className="mb-4 p-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          ⚠️ Mantén tu racha hoy
        </div>
      )}

      {/* Grilla últimos 7 días */}
      <div className="grid grid-cols-7 gap-1">
        {last7Days.map((date) => {
          const completed = isCompleted(habit.id, date);
          const isTodayDate = isToday(date);
          
          return (
            <div key={date} className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1">
                {getDayLabel(date)}
              </div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  completed
                    ? 'bg-green-500 text-white'
                    : isTodayDate
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'bg-gray-100'
                }`}
                aria-label={`${date} ${completed ? 'completado' : 'no completado'}`}
              >
                {completed && (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---
