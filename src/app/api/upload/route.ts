import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { uploadFile } from "@/lib/storage";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/", "application/pdf"];

function isAllowedType(mimeType: string) {
  return ALLOWED_TYPES.some((type) =>
    type.endsWith("/") ? mimeType.startsWith(type) : mimeType === type
  );
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large (max 5MB)" },
        { status: 400 }
      );
    }

    if (!isAllowedType(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed" },
        { status: 400 }
      );
    }

    const path = `${session.user.id}/${Date.now()}-${sanitizeFileName(file.name)}`;
    const url = await uploadFile(file, path);

    return NextResponse.json({ url, path });
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
