import { create } from "zustand";
import type { InquiryInterface } from "@/features/inquiries/inquiry-queries";

interface InquiryModalState {
  selectedInquiry: InquiryInterface | null;
  detailsDialogOpen: boolean;
  approveDialogOpen: boolean;
  rejectDialogOpen: boolean;
  pendingAction: InquiryInterface | null;

  // Actions
  setSelectedInquiry: (inquiry: InquiryInterface | null) => void;
  setDetailsDialogOpen: (open: boolean) => void;
  setApproveDialogOpen: (open: boolean) => void;
  setRejectDialogOpen: (open: boolean) => void;
  setPendingAction: (inquiry: InquiryInterface | null) => void;

  // Composite actions
  openDetailsDialog: (inquiry: InquiryInterface) => void;
  closeDetailsDialog: () => void;
  openApproveDialog: (inquiry: InquiryInterface) => void;
  closeApproveDialog: () => void;
  openRejectDialog: (inquiry: InquiryInterface) => void;
  closeRejectDialog: () => void;
  resetAllDialogs: () => void;
}

export const useInquiryModalStore = create<InquiryModalState>((set) => ({
  selectedInquiry: null,
  detailsDialogOpen: false,
  approveDialogOpen: false,
  rejectDialogOpen: false,
  pendingAction: null,

  setSelectedInquiry: (inquiry) => set({ selectedInquiry: inquiry }),
  setDetailsDialogOpen: (open) => set({ detailsDialogOpen: open }),
  setApproveDialogOpen: (open) => set({ approveDialogOpen: open }),
  setRejectDialogOpen: (open) => set({ rejectDialogOpen: open }),
  setPendingAction: (inquiry) => set({ pendingAction: inquiry }),

  openDetailsDialog: (inquiry) =>
    set({ selectedInquiry: inquiry, detailsDialogOpen: true }),

  closeDetailsDialog: () =>
    set({ detailsDialogOpen: false, selectedInquiry: null }),

  openApproveDialog: (inquiry) =>
    set({
      pendingAction: inquiry,
      approveDialogOpen: true,
      detailsDialogOpen: false,
    }),

  closeApproveDialog: () =>
    set({ approveDialogOpen: false, pendingAction: null }),

  openRejectDialog: (inquiry) =>
    set({
      pendingAction: inquiry,
      rejectDialogOpen: true,
      detailsDialogOpen: false,
    }),

  closeRejectDialog: () =>
    set({ rejectDialogOpen: false, pendingAction: null }),

  resetAllDialogs: () =>
    set({
      selectedInquiry: null,
      detailsDialogOpen: false,
      approveDialogOpen: false,
      rejectDialogOpen: false,
      pendingAction: null,
    }),
}));
