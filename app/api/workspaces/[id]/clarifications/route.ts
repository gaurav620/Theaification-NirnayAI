import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// POST /api/workspaces/[id]/clarifications — add a clarification log entry
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  // body can contain a single entry or multiple entries
  if (Array.isArray(body.entries)) {
    const logs = await Promise.all(
      body.entries.map((entry: { role: string; content: string }) =>
        prisma.clarificationLog.create({
          data: {
            role: entry.role,
            content: entry.content,
            fileWorkspaceId: id,
          },
        })
      )
    );
    return NextResponse.json(logs, { status: 201 });
  }

  const log = await prisma.clarificationLog.create({
    data: {
      role: body.role,
      content: body.content,
      fileWorkspaceId: id,
    },
  });

  return NextResponse.json(log, { status: 201 });
}
