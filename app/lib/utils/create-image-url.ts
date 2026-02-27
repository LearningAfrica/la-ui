import { API_BASE_URL } from "../api";

export const createLogoItemUrl = (logoBase: string, logoWith: string) => {
  if (logoBase.includes("localhost")) {
    return `${API_BASE_URL}${logoWith}`;
  }

  return logoBase;
};
