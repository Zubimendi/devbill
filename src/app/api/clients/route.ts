import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import connectDB from "@/lib/mongodb";
import Client from "@/models/Client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const clients = await Client.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(session.user.id) } },
      {
        $lookup: {
          from: "invoices",
          localField: "_id",
          foreignField: "clientId",
          as: "invoices",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          company: 1,
          address: 1,
          phone: 1,
          createdAt: 1,
          invoiceCount: { $size: "$invoices" },
          totalBilled: { $sum: "$invoices.total" },
          lastInvoiceDate: { $max: "$invoices.createdAt" },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, email, company, address, phone } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { message: "Name and email are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const client = await Client.create({
      name,
      email,
      company: company || "",
      address: address || "",
      phone: phone || "",
      userId: session.user.id,
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "A client with this email already exists" },
        { status: 400 }
      );
    }
    console.error("Error creating client:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
