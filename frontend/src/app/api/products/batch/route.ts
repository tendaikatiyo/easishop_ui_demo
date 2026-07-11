import { NextRequest, NextResponse } from "next/server";
import { getProductsByIds } from "@/lib/products";

export async function GET(req: NextRequest) {
  const idsParam = req.nextUrl.searchParams.get("ids")?.trim() ?? "";
  const ids = idsParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (!ids.length) {
    return NextResponse.json({ products: [] });
  }

  try {
    const map = await getProductsByIds(ids);
    const products = ids.map((id) => map[id]).filter(Boolean);
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Batch lookup failed" }, { status: 502 });
  }
}
