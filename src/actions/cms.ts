"use server";

import { prisma } from "src/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "src/actions/auth";

// #15 FIX: Helper to extract real client IP
async function getClientIp(): Promise<string> {
  try {
    const hdrs = await headers();
    return (
      hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      hdrs.get("x-real-ip") ||
      "unknown"
    );
  } catch {
    return "unknown";
  }
}

export async function getCMSContent(key: string, defaultValue: any) {
  try {
    const item = await prisma.cMSContent.findUnique({
      where: { id: key },
    });
    if (!item) return defaultValue;
    return JSON.parse(item.value);
  } catch (error) {
    console.error(`Error loading CMS key ${key}:`, error);
    return defaultValue;
  }
}

// #8 FIX: Uses session-based auth instead of client-supplied adminId
export async function updateCMSContent(key: string, value: any) {
  if (!key) {
    return { error: "CMS key is required" };
  }

  // Authenticate via session — no more trusting client-supplied IDs
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized: Admin privileges required." };
  }

  try {
    const valueString = JSON.stringify(value);

    const updated = await prisma.cMSContent.upsert({
      where: { id: key },
      update: { value: valueString },
      create: { id: key, value: valueString },
    });

    // Log the change with real IP
    const clientIp = await getClientIp();
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "CMS_UPDATE",
        details: `Updated CMS component '${key}'`,
        ipAddress: clientIp,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard/admin");
    return { success: true, updated };
  } catch (error: any) {
    console.error("CMS update error:", error);
    // #14 FIX: Generic error message
    return { error: "CMS update failed. Please try again." };
  }
}
