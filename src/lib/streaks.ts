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
