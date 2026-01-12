# 🔥 Habit Tracker - Archivos Completos del Proyecto

## Estructura de Carpetas
```
habit-tracker/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── AddHabitForm.tsx
│   │   ├── HabitCard.tsx
│   │   └── DeleteConfirmModal.tsx
│   └── lib/
│       ├── types.ts
│       ├── date.ts
│       ├── streaks.ts
│       └── storage.ts
├── tests/
│   └── streaks.test.ts
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── vitest.config.ts
└── .gitignore
```

---

## 📄 package.json
```json
{
  "name": "habit-tracker",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest",
    "test:ui": "vitest --ui"
  },
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.33",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3",
    "vitest": "^1.2.0"
  }
}
```

---

## 📄 tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 📄 next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

---

## 📄 tailwind.config.ts
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
```

---

## 📄 postcss.config.js
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

## 📄 vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

---

## 📄 .gitignore
```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

---

## 📄 src/lib/types.ts
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

## 📄 src/lib/date.ts
```typescript
/**
 * Obtiene la fecha de hoy en formato YYYY-MM-DD en timezone local
 */
export function todayLocal(): string {
  const now = new Date();
  return formatDateLocal(now);
}

/**
 * Formatea una fecha a YYYY-MM-DD en timezone local
 */
export function formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Añade días a una fecha string YYYY-MM-DD
 */
export function addDays(dateStr: string, delta: number): string {
  const date = new Date(dateStr + 'T00:00:00');
  date.setDate(date.getDate() + delta);
  return formatDateLocal(date);
}

/**
 * Retorna un array de los últimos N días incluyendo hoy
 * [D-6, D-5, ..., D-1, Hoy]
 */
export function lastNDays(n: number): string[] {
  const today = todayLocal();
  const dates: string[] = [];
  
  for (let i = n - 1; i >= 0; i--) {
    dates.push(addDays(today, -i));
  }
  
  return dates;
}

/**
 * Obtiene el nombre corto del día de la semana (D, L, M, X, J, V, S)
 */
export function getDayLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const days = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  return days[date.getDay()];
}

/**
 * Verifica si una fecha es hoy
 */
export function isToday(dateStr: string): boolean {
  return dateStr === todayLocal();
}
```

---

## 📄 src/lib/streaks.ts
```typescript
import { addDays } from './date';

/**
 * Calcula la racha actual basándose en fechas de completions
 * 
 * Reglas:
 * - Si hoy está completado: contar consecutivos hacia atrás desde hoy
 * - Si hoy NO está completado: contar consecutivos hacia atrás desde ayer
 * 
 * @param completionDates Array de fechas YYYY-MM-DD (puede estar desordenado o con duplicados)
 * @param today Fecha de hoy YYYY-MM-DD
 * @returns Número de días consecutivos
 */
export function computeCurrentStreak(completionDates: string[], today: string): number {
  if (completionDates.length === 0) return 0;
  
  // Normalizar: eliminar duplicados y ordenar
  const uniqueDates = Array.from(new Set(completionDates)).sort();
  const dateSet = new Set(uniqueDates);
  
  // Determinar desde qué fecha empezar a contar
  const todayCompleted = dateSet.has(today);
  let checkDate = todayCompleted ? today : addDays(today, -1);
  
  let streak = 0;
  
  // Contar hacia atrás mientras haya días consecutivos
  while (dateSet.has(checkDate)) {
    streak++;
    checkDate = addDays(checkDate, -1);
  }
  
  return streak;
}

/**
 * Calcula la mejor racha histórica
 * 
 * @param completionDates Array de fechas YYYY-MM-DD
 * @returns Máxima racha de días consecutivos
 */
export function computeBestStreak(completionDates: string[]): number {
  if (completionDates.length === 0) return 0;
  
  // Normalizar: eliminar duplicados y ordenar
  const uniqueDates = Array.from(new Set(completionDates)).sort();
  
  if (uniqueDates.length === 0) return 0;
  if (uniqueDates.length === 1) return 1;
  
  let maxStreak = 1;
  let currentStreak = 1;
  
  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = uniqueDates[i - 1];
    const currDate = uniqueDates[i];
    const expectedNext = addDays(prevDate, 1);
    
    if (currDate === expectedNext) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  
  return maxStreak;
}

/**
 * Determina si la racha está en riesgo
 * 
 * Reglas:
 * - En riesgo SI: currentStreak > 0 Y hoy NO completado
 * - No en riesgo: currentStreak = 0 O hoy completado
 * 
 * @param currentStreak Racha actual
 * @param completedToday Si hoy está completado
 * @returns true si está en riesgo
 */
export function isStreakAtRisk(currentStreak: number, completedToday: boolean): boolean {
  return currentStreak > 0 && !completedToday;
}
```

---

## 📄 src/lib/storage.ts
```typescript
import type { StorageData, Habit, Completion } from './types';

const STORAGE_KEY = 'habit-tracker-data';
const CURRENT_VERSION = 1;

/**
 * Genera un UUID v4 (con fallback si crypto no está disponible)
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback simple
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Datos por defecto
 */
function getDefaultData(): StorageData {
  return {
    version: CURRENT_VERSION,
    habits: [],
    completions: [],
  };
}

/**
 * Lee datos del localStorage
 */
export function loadData(): StorageData {
  if (typeof window === 'undefined') {
    return getDefaultData();
  }
  
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return getDefaultData();
    }
    
    const data = JSON.parse(raw) as StorageData;
    
    // Migración de versión si es necesario
    if (data.version < CURRENT_VERSION) {
      return migrateData(data);
    }
    
    return data;
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return getDefaultData();
  }
}

/**
 * Guarda datos en localStorage
 */
export function saveData(data: StorageData): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
}

/**
 * Migración de datos entre versiones
 */
function migrateData(data: StorageData): StorageData {
  // Por ahora solo tenemos versión 1, pero esto permite futuras migraciones
  let migrated = { ...data };
  
  if (data.version < 1) {
    // Aquí irían migraciones de versión 0 a 1
    migrated.version = 1;
  }
  
  return migrated;
}

// ============ API de Habits ============

export function getHabits(): Habit[] {
  const data = loadData();
  return data.habits;
}

export function addHabit(name: string, color?: string): Habit {
  const data = loadData();
  const newHabit: Habit = {
    id: generateId(),
    name,
    color,
    createdAt: Date.now(),
  };
  
  data.habits.push(newHabit);
  saveData(data);
  
  return newHabit;
}

export function deleteHabit(habitId: string): void {
  const data = loadData();
  
  // Eliminar el hábito
  data.habits = data.habits.filter(h => h.id !== habitId);
  
  // Eliminar todas sus completions
  data.completions = data.completions.filter(c => c.habitId !== habitId);
  
  saveData(data);
}

// ============ API de Completions ============

export function getCompletions(): Completion[] {
  const data = loadData();
  return data.completions;
}

export function getCompletionsByHabit(habitId: string): Completion[] {
  const data = loadData();
  return data.completions.filter(c => c.habitId === habitId);
}

export function toggleCompletion(habitId: string, date: string): boolean {
  const data = loadData();
  
  // Buscar si ya existe
  const existingIndex = data.completions.findIndex(
    c => c.habitId === habitId && c.date === date
  );
  
  if (existingIndex !== -1) {
    // Ya existe, eliminar
    data.completions.splice(existingIndex, 1);
    saveData(data);
    return false;
  } else {
    // No existe, crear
    const newCompletion: Completion = {
      id: generateId(),
      habitId,
      date,
      createdAt: Date.now(),
    };
    data.completions.push(newCompletion);
    saveData(data);
    return true;
  }
}

export function isCompleted(habitId: string, date: string): boolean {
  const data = loadData();
  return data.completions.some(
    c => c.habitId === habitId && c.date === date
  );
}
```

---

## 📄 src/app/globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-50 text-gray-900;
}

/* Animación suave para el toggle */
@keyframes pop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.animate-pop {
  animation: pop 0.3s ease-in-out;
}
```

---

## 📄 src/app/layout.tsx
```typescript
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'Seguimiento de hábitos con rachas tipo Duolingo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

---

## 📄 src/app/page.tsx
```typescript
'use client';

import { useState, useEffect } from 'react';
import type { Habit } from '@/lib/types';
import { getHabits, addHabit, deleteHabit, isCompleted } from '@/lib/storage';
import { todayLocal } from '@/lib/date';
import AddHabitForm from '@/components/AddHabitForm';
import HabitCard from '@/components/HabitCard';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [deleteModal, setDeleteModal] = useState<{ habitId: string; habitName: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  // Cargar hábitos al montar
  useEffect(() => {
    setMounted(true);
    loadHabits();
  }, []);

  const loadHabits = () => {
    const loadedHabits = getHabits();
    setHabits(loadedHabits);
  };

  const handleAddHabit = (name: string, color?: string) => {
    addHabit(name, color);
    loadHabits();
  };

  const handleDeleteHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
      setDeleteModal({ habitId, habitName: habit.name });
    }
  };

  const confirmDelete = () => {
    if (deleteModal) {
      deleteHabit(deleteModal.habitId);
      loadHabits();
      setDeleteModal(null);
    }
  };

  // Calcular completados hoy
  const today = todayLocal();
  const completedToday = mounted ? habits.filter(h => isCompleted(h.id, today)).length : 0;
  const totalHabits = habits.length;

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mis hábitos
          </h1>
          {totalHabits > 0 && (
            <p className="text-gray-600">
              {completedToday}/{totalHabits} completados hoy
            </p>
          )}
        </header>

        {/* Form agregar hábito */}
        <AddHabitForm onAdd={handleAddHabit} />

        {/* Lista de hábitos */}
        {habits.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500 text-lg">
              No tienes hábitos todavía.
            </p>
            <p className="text-gray-400">
              Agrega tu primer hábito arriba para empezar.
            </p>
          </div>
        ) : (
          <div>
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onDelete={handleDeleteHabit}
                onUpdate={loadHabits}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      {deleteModal && (
        <DeleteConfirmModal
          habitName={deleteModal.habitName}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModal(null)}
        />
      )}
    </main>
  );
}
```

---

## 📄 src/components/AddHabitForm.tsx
```typescript
'use client';

import { useState, FormEvent } from 'react';

interface AddHabitFormProps {
  onAdd: (name: string, color?: string) => void;
}

const PRESET_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#84cc16', // lime
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
];

export default function AddHabitForm({ onAdd }: AddHabitFormProps) {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState<string | undefined>();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (name.trim()) {
      onAdd(name.trim(), selectedColor);
      setName('');
      setSelectedColor(undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nuevo hábito..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={50}
          aria-label="Nombre del hábito"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          aria-label="Agregar hábito"
        >
          Agregar
        </button>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => setSelectedColor(color === selectedColor ? undefined : color)}
            className={`w-8 h-8 rounded-full transition-transform ${
              color === selectedColor ? 'ring-2 ring-gray-900 ring-offset-2 scale-110' : ''
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Seleccionar color ${color}`}
          />
        ))}
      </div>
    </form>
  );
}
```

---

## 📄 src/components/HabitCard.tsx
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

## 📄 src/components/DeleteConfirmModal.tsx
```typescript
'use client';

interface DeleteConfirmModalProps {
  habitName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  habitName,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onCancel}
    >
      