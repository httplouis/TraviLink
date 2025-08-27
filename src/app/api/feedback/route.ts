import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-side key
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Expecting: { category, rating, subject, message, anonymous, contact, attachmentUrl }
    const { data, error } = await supabase
      .from("feedback")
      .insert({
        category: body.category,
        rating: body.rating,
        subject: body.subject || null,
        message: body.message,
        anonymous: body.anonymous,
        contact: body.contact || null,
        attachment_url: body.attachmentUrl || null,
      })
      .select("id")
      .single();

    if (error) throw error;
    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed" }, { status: 400 });
  }
}
