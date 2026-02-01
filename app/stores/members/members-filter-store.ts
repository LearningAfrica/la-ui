import { create } from "zustand";
import type { OrganizationMembershipRole } from "@/features/organizations/organization-queries";

interface MembersFilterState {
  page: number;
  page_size: number;
  role?: OrganizationMembershipRole;
  is_active?: boolean;
  search: string;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setRole: (role?: OrganizationMembershipRole) => void;
  setIsActive: (isActive?: boolean) => void;
  setSearch: (search: string) => void;
  resetFilters: () => void;
}

const defaultState = {
  page: 1,
  page_size: 10,
  role: undefined,
  is_active: undefined,
  search: "",
};

export const useMembersFilterStore = create<MembersFilterState>()((set) => ({
  ...defaultState,
  setPage: (page) => set({ page }),
  setPageSize: (page_size) => set({ page_size, page: 1 }),
  setRole: (role) => set({ role, page: 1 }),
  setIsActive: (is_active) => set({ is_active, page: 1 }),
  setSearch: (search) => set({ search, page: 1 }),
  resetFilters: () => set(defaultState),
}));
