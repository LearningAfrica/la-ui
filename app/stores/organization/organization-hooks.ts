import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/stores/redux-store";
import { organizationActions } from "./organization-slice";
import type { MyOrganization } from "@/features/organizations/organization-queries";

export const useOrganizationStore = () => {
  const state = useSelector((s: RootState) => s.organization);
  const dispatch = useDispatch<AppDispatch>();

  return {
    ...state,
    setSelectedOrganization: (organization: MyOrganization | null) =>
      dispatch(organizationActions.setSelectedOrganization(organization)),
    clearSelectedOrganization: () =>
      dispatch(organizationActions.clearSelectedOrganization()),
  };
};
