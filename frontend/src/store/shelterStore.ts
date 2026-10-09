import { create } from "zustand";

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
  ) => void;

  resetShelters: () => void;
}

export const useShelterStore =
  create<ShelterStore>((set) => ({
    shelters: initialShelters,

    selectedShelter: null,

    selectShelter: (shelter) =>
      set({
        selectedShelter: shelter,
      }),

    updateShelter: (id, updates) =>
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
      }),

    resetShelters: () =>
      set({
        shelters: initialShelters,
        selectedShelter: null,
      }),
  }));