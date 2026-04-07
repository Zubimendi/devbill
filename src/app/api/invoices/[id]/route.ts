import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import connectDB from "@/lib/mongodb";
import Invoice from "@/models/Invoice";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const invoice = await Invoice.findOne({
      _id: id,
      userId: session.user.id,
    }).populate("clientId", "name email company address phone");

    if (!invoice) {
      return NextResponse.json(
        { message: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    await connectDB();

    // If items are updated, recalculate totals
    if (body.items) {
      const processedItems = body.items.map(
        (item: { description: string; quantity: number; rate: number }) => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.quantity * item.rate,
        })
      );
      body.items = processedItems;
      body.subtotal = processedItems.reduce(
        (sum: number, item: { amount: number }) => sum + item.amount,
        0
      );
      const tax = body.taxRate || 0;
      body.taxAmount = body.subtotal * (tax / 100);
      body.total = body.subtotal + body.taxAmount;
    }

    const invoice = await Invoice.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      body,
      { new: true, runValidators: true }
    ).populate("clientId", "name email company address phone");

    if (!invoice) {
      return NextResponse.json(
        { message: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const invoice = await Invoice.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!invoice) {
      return NextResponse.json(
        { message: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Invoice deleted" });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
