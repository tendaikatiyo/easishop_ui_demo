import { NextRequest, NextResponse } from "next/server";
import {
  getProductsByBarcode,
  searchProducts,
} from "@/lib/products";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const barcode = req.nextUrl.searchParams.get("barcode") === "1";

  if (!q) {
    return NextResponse.json({ products: [] });
  }

  try {
    let products;
    if (barcode) {
      const byBarcode = await getProductsByBarcode(q);
      products = byBarcode.length ? byBarcode : await searchProducts(q);
    } else {
      products = await searchProducts(q);
    }
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 502 });
  }
}
