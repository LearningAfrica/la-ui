import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MyOrganization } from "@/features/organizations/organization-queries";

export interface OrganizationState {
  selectedOrganization: MyOrganization | null;
}

const initialState: OrganizationState = {
  selectedOrganization: null,
};

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setSelectedOrganization(
      state,
      action: PayloadAction<MyOrganization | null>
    ) {
      state.selectedOrganization = action.payload;
    },
    clearSelectedOrganization(state) {
      state.selectedOrganization = null;
    },
  },
});

export const organizationActions = organizationSlice.actions;

export default organizationSlice.reducer;
