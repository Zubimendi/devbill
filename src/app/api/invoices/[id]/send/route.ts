import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import connectDB from "@/lib/mongodb";
import Invoice from "@/models/Invoice";
import User from "@/models/User";
import { sendInvoiceEmail } from "@/lib/mail";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { to: customTo, subject, message } = await req.json().catch(() => ({}));

    // Fetch the invoice and ensure it belongs to the current user
    const invoice = await Invoice.findOne({
      _id: id,
      userId: session.user.id,
    }).populate("clientId");

    if (!invoice) {
      return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
    }

    // Fetch user settings for the email "from" name
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const businessName = user.businessName || user.name || "devbill User";
    const viewLink = `${process.env.NEXTAUTH_URL}/view/invoice/${invoice.secureToken}`;

    // Dispatch the email
    const mailResult = await sendInvoiceEmail({
      to: customTo || invoice.clientId.email,
      clientName: invoice.clientId.name,
      invoiceNumber: invoice.invoiceNumber,
      dueDate: new Date(invoice.dueDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      totalAmount: `$${invoice.total.toLocaleString("en-US", {
        minimumFractionDigits: 2,
      })}`,
      viewLink,
      businessName,
      subject,
      customMessage: message,
    });

    if (!mailResult.success) {
      return NextResponse.json(
        { message: "Failed to send email", error: mailResult.error },
        { status: 500 }
      );
    }

    // Update invoice status if it was currently "draft"
    if (invoice.status === "draft") {
      invoice.status = "sent";
      await invoice.save();
    }

    return NextResponse.json({ message: "Invoice sent successfully" });
  } catch (error) {
    console.error("Send route error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
