import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";

const db = {
  host: process.env.DB_HOST || "sql107.infinityfree.com",
  user: process.env.DB_USER || "if0_42151313",
  password: process.env.DB_PASSWORD || "GCcUtx0lF8",
  database: process.env.DB_NAME || "if0_42151313_shoe_shop",
};
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
    const connection = await mysql.createConnection(db);
    const [users] = await connection.execute(
      "SELECT id, fullname, email, phonenumber, address, created_at FROM users WHERE id = ?",
      [user.id]
    );
    await connection.end();

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(users[0]);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
