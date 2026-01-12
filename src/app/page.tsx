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

