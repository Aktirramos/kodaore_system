import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sites = await prisma.site.count();

    return NextResponse.json(
      {
        status: "ok",
        service: "kodaore-system",
        timestamp: new Date().toISOString(),
        db: {
          status: "ok",
          sites,
        },
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        status: "degraded",
        service: "kodaore-system",
        timestamp: new Date().toISOString(),
        db: {
          status: "error",
        },
      },
      { status: 503 },
    );
  }
}
