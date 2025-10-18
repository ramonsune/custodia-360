import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    // Invocar Edge Function c360_mailer_dispatch
    const response = await fetch(
      `${supabaseUrl}/functions/v1/c360_mailer_dispatch`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${anonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Dispatch failed");
    }

    return NextResponse.json({
      success: true,
      result: data,
    });
  } catch (error: any) {
    console.error("Dispatch error:", error);
    return NextResponse.json(
      { error: error.message || "Internal error" },
      { status: 500 }
    );
  }
}
