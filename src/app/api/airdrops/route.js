import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { listAirdropsByUser } from "@/lib/airdrops";

export async function GET(request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) || 1;
  const search = (searchParams.get("search") || "").trim();

  const result = await listAirdropsByUser(session.user.id, page, undefined, search);

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
