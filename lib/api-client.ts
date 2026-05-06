// API client for NirnayAI dashboard — replaces localStorage with server calls

export async function fetchWorkspaces() {
  const res = await fetch("/api/workspaces");
  if (!res.ok) throw new Error("Failed to fetch workspaces");
  return res.json();
}

export async function createWorkspace(name: string) {
  const res = await fetch("/api/workspaces", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to create workspace");
  return res.json();
}

export async function deleteWorkspace(id: string) {
  const res = await fetch(`/api/workspaces?id=${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete workspace");
  return res.json();
}

export async function updateWorkspace(id: string, data: Record<string, unknown>) {
  const res = await fetch(`/api/workspaces/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update workspace");
  return res.json();
}

export async function addTenderDocuments(workspaceId: string, documents: { name: string; size: number; type: string }[]) {
  const res = await fetch(`/api/workspaces/${workspaceId}/documents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ documents }),
  });
  if (!res.ok) throw new Error("Failed to add documents");
  return res.json();
}

export async function updateDocumentStatus(workspaceId: string, documentId: string, status: string) {
  const res = await fetch(`/api/workspaces/${workspaceId}/documents`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ documentId, status }),
  });
  if (!res.ok) throw new Error("Failed to update document");
  return res.json();
}

export async function createBidder(workspaceId: string, name: string) {
  const res = await fetch(`/api/workspaces/${workspaceId}/bidders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to create bidder");
  return res.json();
}

export async function addBidderDocuments(workspaceId: string, bidderId: string, documents: { name: string; size: number; type: string }[]) {
  const res = await fetch(`/api/workspaces/${workspaceId}/bidders/${bidderId}/documents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ documents }),
  });
  if (!res.ok) throw new Error("Failed to add bidder documents");
  return res.json();
}

export async function saveEvaluation(workspaceId: string, bidderId: string, evalData: { overallVerdict: string; criteria: unknown[] }) {
  const res = await fetch(`/api/workspaces/${workspaceId}/bidders/${bidderId}/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(evalData),
  });
  if (!res.ok) throw new Error("Failed to save evaluation");
  return res.json();
}

export async function addClarification(workspaceId: string, role: string, content: string) {
  const res = await fetch(`/api/workspaces/${workspaceId}/clarifications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, content }),
  });
  if (!res.ok) throw new Error("Failed to add clarification");
  return res.json();
}

export async function addClarifications(workspaceId: string, entries: { role: string; content: string }[]) {
  const res = await fetch(`/api/workspaces/${workspaceId}/clarifications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entries }),
  });
  if (!res.ok) throw new Error("Failed to add clarifications");
  return res.json();
}
