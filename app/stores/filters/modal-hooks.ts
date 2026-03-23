import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  openModal,
  closeModal,
  toggleModal,
  defaultEntry,
  type ModalData,
} from "@/stores/filters/modal-slice";

export function useAppModal<K extends string>(key: K) {
  const dispatch = useAppDispatch();
  const entry = useAppSelector(
    (state) => state.modals.modals[key] ?? defaultEntry
  );

  const open = useCallback(
    (data?: ModalData<K>) => dispatch(openModal({ key, data })),
    [dispatch, key]
  );

  const close = useCallback(() => dispatch(closeModal(key)), [dispatch, key]);

  const toggle = useCallback(() => dispatch(toggleModal(key)), [dispatch, key]);

  return useMemo(
    () => ({
      isOpen: entry.isOpen,
      data: entry.data as ModalData<K> | null,
      open,
      close,
      toggle,
    }),
    [entry.isOpen, entry.data, open, close, toggle]
  );
}
