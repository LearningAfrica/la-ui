import { API_BASE_URL } from "../api";

export const createLogoItemUrl = (
  logoBase: string | null | undefined,
  logoWith: string | null | undefined
): string => {
  const base = logoBase ?? "";
  const relative = logoWith ?? "";

  if (!base && !relative) return "";

  if (base.includes("localhost")) {
    return `${API_BASE_URL}${relative}`;
  }

  return base;
};
