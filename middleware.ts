import { NextRequest, NextResponse } from "next/server";

function buildRequestId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const existingRequestId = requestHeaders.get("x-request-id")?.trim();
  const requestId = existingRequestId && existingRequestId.length > 0 ? existingRequestId : buildRequestId();

  requestHeaders.set("x-request-id", requestId);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("x-request-id", requestId);

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
