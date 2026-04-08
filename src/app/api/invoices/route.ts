import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import connectDB from "@/lib/mongodb";
import Invoice from "@/models/Invoice";
import Client from "@/models/Client";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const filter: Record<string, unknown> = { userId: session.user.id };
    if (status && status !== "all") {
      filter.status = status;
    }

    const invoices = await Invoice.find(filter)
      .populate("clientId", "name email company")
      .sort({ createdAt: -1 });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
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

    const body = await req.json();
    const { 
      clientId, 
      items, 
      taxRate, 
      dueDate, 
      notes, 
      status, 
      currency,
      invoiceNumber,
      fromBusinessName,
      fromBusinessAddress,
      fromBusinessPhone,
      fromBusinessEmail
    } = body;

    if (!clientId || !items || items.length === 0 || !dueDate) {
      return NextResponse.json(
        { message: "Client, items, and due date are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify the client belongs to this user
    const client = await Client.findOne({
      _id: clientId,
      userId: session.user.id,
    });
    if (!client) {
      return NextResponse.json(
        { message: "Client not found" },
        { status: 404 }
      );
    }

    // Calculate totals
    const processedItems = items.map(
      (item: { description: string; quantity: number; rate: number }) => ({
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.quantity * item.rate,
      })
    );

    const subtotal = processedItems.reduce(
      (sum: number, item: { amount: number }) => sum + item.amount,
      0
    );
    const tax = taxRate || 0;
    const taxAmount = subtotal * (tax / 100);
    const total = subtotal + taxAmount;

    const invoice = await Invoice.create({
      clientId,
      userId: session.user.id,
      invoiceNumber,
      items: processedItems,
      subtotal,
      taxRate: tax,
      taxAmount,
      total,
      status: status || "draft",
      dueDate: new Date(dueDate),
      notes: notes || "",
      currency: currency || "USD",
      fromBusinessName,
      fromBusinessAddress,
      fromBusinessPhone,
      fromBusinessEmail
    });

    const populated = await Invoice.findById(invoice._id).populate(
      "clientId",
      "name email company"
    );

    return NextResponse.json(populated, { status: 201 });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
