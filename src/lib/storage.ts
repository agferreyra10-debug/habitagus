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
