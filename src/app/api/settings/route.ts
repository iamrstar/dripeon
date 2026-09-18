import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import dbConnect from "@/lib/mongodb";
import Setting from "@/models/Setting";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const settings = await Setting.find({}).lean();
    
    // Convert array to key-value object for easy frontend consumption
    const settingsObj: any = {};
    settings.forEach((s: any) => {
      settingsObj[s.key] = s.value;
    });

    return NextResponse.json({ success: true, settings: settingsObj });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}
