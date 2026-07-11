import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/products";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "Lookup failed" }, { status: 502 });
  }
}
