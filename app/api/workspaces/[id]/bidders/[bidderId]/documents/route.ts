import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// POST /api/workspaces/[id]/bidders/[bidderId]/documents — add docs to a bidder
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; bidderId: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { bidderId } = await params;
  const body = await request.json();

  const docs = await Promise.all(
    body.documents.map((doc: { name: string; size: number; type: string }) =>
      prisma.document.create({
        data: {
          name: doc.name,
          size: doc.size,
          type: doc.type,
          bidderId,
        },
      })
    )
  );

  return NextResponse.json(docs, { status: 201 });
}
