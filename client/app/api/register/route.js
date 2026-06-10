import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const db = {
  host: process.env.DB_HOST || "sql107.infinityfree.com",
  user: process.env.DB_USER || "if0_42151313",
  password: process.env.DB_PASSWORD || "GCcUtx0lF8",
  database: process.env.DB_NAME || "if0_42151313_shoe_shop",
};

export async function POST(req) {
  try {
    const { fullname, email, phonenumber, address, password } = await req.json();
    if (!fullname || !email || !phonenumber || !address || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const connection = await mysql.createConnection(db);
    const [existing] = await connection.execute("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      await connection.end();
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await connection.execute(
      "INSERT INTO users (fullname, email, phonenumber, address, password) VALUES (?, ?, ?, ?, ?)",
      [fullname, email, phonenumber, address, hashedPassword]
    );
    await connection.end();

    return NextResponse.json({ message: "User registered successfully", userId: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
