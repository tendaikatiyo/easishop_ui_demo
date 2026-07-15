import { NextRequest, NextResponse } from "next/server";
import { suggestLocalCatalog } from "@/lib/local-catalog";

/** Desktop search typeahead — offline catalog suggestions while live API is empty. */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const suggestions = suggestLocalCatalog(q, 8);
    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ error: "Suggest failed" }, { status: 502 });
  }
}
