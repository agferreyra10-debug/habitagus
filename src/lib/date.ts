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
