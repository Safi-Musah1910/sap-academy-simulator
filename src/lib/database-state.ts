export function isDatabaseUnavailable(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    message.includes("table") ||
    message.includes("does not exist") ||
    message.includes("database") ||
    message.includes("connection") ||
    message.includes("prepared statement")
  );
}

export function logDatabaseFallback(scope: string, error: unknown) {
  if (isDatabaseUnavailable(error)) {
    console.warn(`[database fallback] ${scope}:`, error);
    return;
  }

  throw error;
}
