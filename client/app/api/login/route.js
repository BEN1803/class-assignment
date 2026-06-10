import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const db = {
  host: process.env.DB_HOST || "sql107.infinityfree.com",
  user: process.env.DB_USER || "if0_42151313",
  password: process.env.DB_PASSWORD || "GCcUtx0lF8",
  database: process.env.DB_NAME || "if0_42151313_shoe_shop",
};
const JWT_SECRET = process.env.JWT_SECRET || "shoe_shop_jwt_secret_key_2024";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const connection = await mysql.createConnection(db);
    const [users] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);
    await connection.end();

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, fullname: user.fullname },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return NextResponse.json({
      message: "Login successful",
      token,
      user: { id: user.id, fullname: user.fullname, email: user.email },
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
