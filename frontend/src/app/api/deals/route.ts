import { NextResponse } from "next/server";
import { getDeals } from "@/lib/products";

export async function GET() {
  try {
    const products = await getDeals();
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Deals fetch failed" }, { status: 502 });
  }
}
