import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  shelters as initialShelters,
} from "../data/mockData";

import type { Shelter } from "../data/mockData";

interface ShelterStore {
  shelters: Shelter[];

  selectedShelter: Shelter | null;

  selectShelter: (shelter: Shelter | null) => void;

  updateShelter: (
    id: string,
    updates: Partial<Shelter>
  ) => boolean;

  resetShelters: () => void;
}

export const useShelterStore = create<ShelterStore>()(
  persist(
    (set, get) => ({
      shelters: initialShelters,

      selectedShelter: null,

      selectShelter: (shelter) =>
        set({
          selectedShelter: shelter,
        }),

      updateShelter: (id, updates) => {
        const existingShelter = get().shelters.find(
          (shelter) => shelter.id === id
        );
        if (!existingShelter) return false;

        const capacity = updates.capacity ?? existingShelter.capacity;
        const occupied = updates.occupied ?? existingShelter.occupied;
        if (
          !Number.isSafeInteger(capacity) ||
          !Number.isSafeInteger(occupied) ||
          capacity < 0 ||
          occupied < 0 ||
          occupied > capacity
        ) {
          return false;
        }

        set((state) => {
          const shelters = state.shelters.map((shelter) =>
            shelter.id === id
              ? {
                  ...shelter,
                  ...updates,
                }
              : shelter
          );

          return {
            shelters,
            selectedShelter:
              state.selectedShelter?.id === id
                ? {
                    ...state.selectedShelter,
                    ...updates,
                  }
                : state.selectedShelter,
          };
        });
        return true;
      },

      resetShelters: () =>
        set({
          shelters: initialShelters,
          selectedShelter: null,
        }),
    }),
    { name: "trustlens-shelter-management" }
  )
);