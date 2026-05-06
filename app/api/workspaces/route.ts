import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Helper: get or create the DB user from Clerk session
async function getOrCreateUser(clerkId: string, email?: string, name?: string) {
  let user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId,
        email: email || `${clerkId}@clerk.user`,
        name: name || "Officer",
      },
    });
  }
  return user;
}

// GET /api/workspaces — list all workspaces for the authenticated user
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getOrCreateUser(userId);

  const workspaces = await prisma.fileWorkspace.findMany({
    where: { userId: user.id },
    include: {
      tenderDocs: true,
      bidders: {
        include: {
          docs: true,
          evaluation: {
            include: { criteria: true },
          },
        },
      },
      clarificationLogs: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(workspaces);
}

// POST /api/workspaces — create a new workspace
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getOrCreateUser(userId);
  const body = await request.json();

  const workspace = await prisma.fileWorkspace.create({
    data: {
      name: body.name,
      userId: user.id,
    },
    include: {
      tenderDocs: true,
      bidders: { include: { docs: true, evaluation: { include: { criteria: true } } } },
      clarificationLogs: true,
    },
  });

  return NextResponse.json(workspace, { status: 201 });
}

// DELETE /api/workspaces — delete a workspace
export async function DELETE(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getOrCreateUser(userId);
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("id");

  if (!workspaceId) return NextResponse.json({ error: "Missing workspace id" }, { status: 400 });

  // Verify ownership
  const workspace = await prisma.fileWorkspace.findFirst({
    where: { id: workspaceId, userId: user.id },
  });

  if (!workspace) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.fileWorkspace.delete({ where: { id: workspaceId } });

  return NextResponse.json({ success: true });
}
