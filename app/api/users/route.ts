import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      username,
      phone,
      creditCardNumber,
      bank,
      amountDue,
      dueMonth,
      overduePeriodInDays,
      status,
    } = body;

    // Validate required fields
    if (!username || !phone || !creditCardNumber || !bank || amountDue === undefined || !dueMonth) {
      return NextResponse.json(
        { error: "Missing required fields: username, phone, creditCardNumber, bank, amountDue, dueMonth" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        username,
        phone,
        creditCardNumber,
        bank,
        amountDue: parseFloat(amountDue),
        dueMonth,
        overduePeriodInDays: overduePeriodInDays ? parseInt(overduePeriodInDays) : 0,
        status: status || "pending",
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: unknown) {
    // Handle unique constraint violation (duplicate phone)
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "A user with this phone number already exists" },
        { status: 409 }
      );
    }

    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
