import { NextResponse } from "next/server";
import { getMaintenanceTasks, createMaintenanceTask, updateMaintenanceTask } from "@/lib/queries";

export async function GET() {
  try {
    const tasks = await getMaintenanceTasks();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching maintenance tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch maintenance tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const task = await createMaintenanceTask(data);
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating maintenance task:", error);
    return NextResponse.json(
      { error: "Failed to create maintenance task" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...data } = await request.json();
    const task = await updateMaintenanceTask(id, data);
    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(task);
  } catch (error) {
    console.error("Error updating maintenance task:", error);
    return NextResponse.json(
      { error: "Failed to update maintenance task" },
      { status: 500 }
    );
  }
}
