import { NextResponse } from "next/server";
import { getModules, getEnabledModules, updateModuleEnabled } from "@/lib/queries";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const enabledOnly = searchParams.get("enabled");
    
    if (enabledOnly === "true") {
      const modules = await getEnabledModules();
      return NextResponse.json(modules);
    }
    
    const modules = await getModules();
    return NextResponse.json(modules);
  } catch (error) {
    console.error("Error fetching modules:", error);
    return NextResponse.json(
      { error: "Failed to fetch modules" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, enabled } = await request.json();
    const module = await updateModuleEnabled(id, enabled);
    if (!module) {
      return NextResponse.json(
        { error: "Module not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(module);
  } catch (error) {
    console.error("Error updating module:", error);
    return NextResponse.json(
      { error: "Failed to update module" },
      { status: 500 }
    );
  }
}
