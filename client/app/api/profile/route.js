import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const JWT_SECRET = process.env.JWT_SECRET || "shoe_shop_jwt_secret_key_2024";

function authenticateToken(req) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function GET(req) {
  const user = authenticateToken(req);
  if (!user) {
    return NextResponse.json({ error: "Access denied" }, { status: 401 });
  }

  try {
    const { data: profile, error } = await supabase
      .from("users")
      .select("id, fullname, email, phonenumber, address, created_at")
      .eq("id", user.id)
      .maybeSingle();

    if (error) throw error;
    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Profile error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
