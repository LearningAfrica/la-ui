import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MyOrganization } from "@/features/organizations/organization-queries";

interface OrganizationState {
  selectedOrganization: MyOrganization | null;
  setSelectedOrganization: (organization: MyOrganization | null) => void;
  clearSelectedOrganization: () => void;
}

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set) => ({
      selectedOrganization: null,
      setSelectedOrganization: (organization) =>
        set({ selectedOrganization: organization }),
      clearSelectedOrganization: () => set({ selectedOrganization: null }),
    }),
    {
      name: "organization-storage",
    }
  )
);
