import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// POST /api/workspaces/[id]/bidders/[bidderId]/evaluate — store evaluation result
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; bidderId: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { bidderId } = await params;
  const body = await request.json();

  // Check if evaluation already exists
  const existing = await prisma.evaluation.findUnique({
    where: { bidderId },
  });
  if (existing) {
    // Delete existing and recreate
    await prisma.evaluation.delete({ where: { id: existing.id } });
  }

  const evaluation = await prisma.evaluation.create({
    data: {
      bidderId,
      overallVerdict: body.overallVerdict,
      criteria: {
        create: body.criteria.map((c: {
          id: string;
          description: string;
          category: string;
          mandatory: boolean;
          verdict: string;
          sourceDocument: string;
          extractedValue: string;
          reason: string;
          confidence: string;
        }) => ({
          criterionId: c.id,
          description: c.description,
          category: c.category,
          mandatory: c.mandatory,
          verdict: c.verdict,
          sourceDocument: c.sourceDocument,
          extractedValue: c.extractedValue,
          reason: c.reason,
          confidence: c.confidence,
        })),
      },
    },
    include: { criteria: true },
  });

  return NextResponse.json(evaluation, { status: 201 });
}
