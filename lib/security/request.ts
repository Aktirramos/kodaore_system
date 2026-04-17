import { headers } from "next/headers";

export async function getRequestId() {
  const headerStore = await headers();
  const requestId = headerStore.get("x-request-id")?.trim();

  if (!requestId) {
    return null;
  }

  return requestId;
}
