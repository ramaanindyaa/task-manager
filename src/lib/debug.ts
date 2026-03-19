export function devLog(label: string, payload?: unknown) {
  if (process.env.NODE_ENV !== "development") return;

  if (payload === undefined) {
    console.log(`[DEBUG] ${label}`);
    return;
  }

  console.log(`[DEBUG] ${label}`, payload);
}

export function devError(label: string, payload?: unknown) {
  if (process.env.NODE_ENV !== "development") return;

  if (payload === undefined) {
    console.error(`[DEBUG] ${label}`);
    return;
  }

  console.error(`[DEBUG] ${label}`, payload);
}
