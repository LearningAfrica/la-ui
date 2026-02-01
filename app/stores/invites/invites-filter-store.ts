import { create } from "zustand";
import type { OrganizationMembershipRole } from "@/features/organizations/organization-queries";

interface InvitesFilterState {
  page: number;
  page_size: number;
  role?: OrganizationMembershipRole;
  status?: "pending" | "accepted" | "declined" | "expired";
  search: string;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setRole: (role?: OrganizationMembershipRole) => void;
  setStatus: (status?: "pending" | "accepted" | "declined" | "expired") => void;
  setSearch: (search: string) => void;
  resetFilters: () => void;
}

const defaultState = {
  page: 1,
  page_size: 10,
  role: undefined,
  status: undefined,
  search: "",
};

export const useInvitesFilterStore = create<InvitesFilterState>()((set) => ({
  ...defaultState,
  setPage: (page) => set({ page }),
  setPageSize: (page_size) => set({ page_size, page: 1 }),
  setRole: (role) => set({ role, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  setSearch: (search) => set({ search, page: 1 }),
  resetFilters: () => set(defaultState),
}));
