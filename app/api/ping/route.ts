import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createAdminClient();
    await supabase.from("products").select("id").limit(1);
    return NextResponse.json(
      { status: "ok", timestamp: new Date().toISOString() },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
