/**
 * Serializes a plain object to FormData, handling type coercion for
 * Django's multipart/form-data parser.
 *
 * - Strings are appended as-is
 * - Numbers and booleans are converted via String()
 * - Arrays are appended as repeated keys using bracket notation (e.g. tags[0], tags[1])
 * - Nested objects use bracket notation (e.g. address[city])
 * - File/Blob values are appended as-is
 * - undefined/null values are skipped
 */
export function toFormData(data: Record<string, unknown>): FormData {
  const formData = new FormData();

  appendToFormData(formData, data, "");

  return formData;
}

function appendToFormData(
  formData: FormData,
  data: unknown,
  parentKey: string
): void {
  if (data === undefined || data === null) {
    return;
  }

  if (data instanceof File || data instanceof Blob) {
    formData.append(parentKey, data);
  } else if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const key = parentKey ? `${parentKey}[${index}]` : String(index);

      appendToFormData(formData, item, key);
    });
  } else if (typeof data === "object" && !(data instanceof Date)) {
    for (const [key, value] of Object.entries(data)) {
      const fullKey = parentKey ? `${parentKey}[${key}]` : key;

      appendToFormData(formData, value, fullKey);
    }
  } else {
    formData.append(parentKey, String(data));
  }
}
