import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const db = {
  host: process.env.DB_HOST || "sql107.infinityfree.com",
  user: process.env.DB_USER || "if0_42151313",
  password: process.env.DB_PASSWORD || "GCcUtx0lF8",
  database: process.env.DB_NAME || "if0_42151313_shoe_shop",
};

export async function GET() {
  try {
    const connection = await mysql.createConnection(db);
    const [products] = await connection.execute("SELECT * FROM products ORDER BY created_at DESC");
    await connection.end();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
