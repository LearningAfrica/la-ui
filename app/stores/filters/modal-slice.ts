import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/**
 * Augment this interface to register typed modals:
 *
 * ```ts
 * declare module '@/stores/filters/modal-slice' {
 *   interface ModalRegistry {
 *     'confirm-delete': { id: string; name: string };
 *     'edit-user': { userId: string };
 *   }
 * }
 * ```
 *
 * Then `useAppModal('confirm-delete')` will infer `data` as `{ id: string; name: string } | null`.
 * Unregistered keys still work but `data` falls back to `unknown`.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ModalRegistry {}

export type ModalData<K extends string> = K extends keyof ModalRegistry
  ? ModalRegistry[K]
  : unknown;

export interface ModalEntry {
  isOpen: boolean;
  data: unknown;
}

interface ModalState {
  modals: Record<string, ModalEntry>;
}

const initialState: ModalState = {
  modals: {},
};

export const defaultEntry: ModalEntry = { isOpen: false, data: null };

const modalSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<{ key: string; data?: unknown }>) {
      const { key, data } = action.payload;

      state.modals[key] = { isOpen: true, data: data ?? null };
    },
    closeModal(state, action: PayloadAction<string>) {
      const entry = state.modals[action.payload];

      if (entry) {
        entry.isOpen = false;
        entry.data = null;
      }
    },
    toggleModal(state, action: PayloadAction<string>) {
      const entry = state.modals[action.payload];

      if (entry) {
        entry.isOpen = !entry.isOpen;

        if (!entry.isOpen) entry.data = null;
      } else {
        state.modals[action.payload] = { isOpen: true, data: null };
      }
    },
    closeAllModals(state) {
      for (const key of Object.keys(state.modals)) {
        state.modals[key] = { ...defaultEntry };
      }
    },
  },
});

export const { openModal, closeModal, toggleModal, closeAllModals } =
  modalSlice.actions;

export default modalSlice.reducer;
