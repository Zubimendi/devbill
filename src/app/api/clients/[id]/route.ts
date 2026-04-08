import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import connectDB from "@/lib/mongodb";
import Client from "@/models/Client";

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

    // Combined query for client data and invoice stats
    const results = await Client.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id), userId: new mongoose.Types.ObjectId(session.user.id) } },
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
          totalBilled: { $sum: "$invoices.total" },
          totalPaid: {
            $sum: {
              $map: {
                input: { $filter: { input: "$invoices", as: "inv", cond: { $eq: ["$$inv.status", "paid"] } } },
                as: "paidInv",
                in: "$$paidInv.total"
              }
            }
          },
          totalOutstanding: {
            $sum: {
              $map: {
                input: { $filter: { input: "$invoices", as: "inv", cond: { $ne: ["$$inv.status", "paid"] } } },
                as: "unpaidInv",
                in: "$$unpaidInv.total"
              }
            }
          },
          recentInvoices: {
            $slice: [
              {
                $sortArray: {
                  input: "$invoices",
                  sortBy: { createdAt: -1 }
                }
              },
              5
            ]
          }
        },
      },
    ]);

    const client = results[0];

    if (!client) {
      return NextResponse.json(
        { message: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
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
    const updates = await req.json();
    await connectDB();

    const client = await Client.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!client) {
      return NextResponse.json(
        { message: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error("Error updating client:", error);
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

    const client = await Client.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!client) {
      return NextResponse.json(
        { message: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Client deleted" });
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
