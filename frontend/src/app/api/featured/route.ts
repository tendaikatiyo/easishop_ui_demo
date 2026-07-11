import { NextRequest, NextResponse } from "next/server";
import { getFeaturedProducts } from "@/lib/products";

export async function GET(req: NextRequest) {
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? "12");

  try {
    const products = await getFeaturedProducts(
      Number.isFinite(limit) ? Math.min(limit, 24) : 12
    );
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Featured fetch failed" }, { status: 502 });
  }
}
