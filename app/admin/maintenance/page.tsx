"use client";

import { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
  User,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import type { Property, MaintenanceTask } from "@/lib/queries";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const priorityColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

const statusColors = {
  pending: "bg-gray-100 text-gray-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
};

const statusIcons = {
  pending: Clock,
  in_progress: Wrench,
  completed: CheckCircle2,
};

export default function MaintenancePage() {
  const [mounted, setMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterProperty, setFilterProperty] = useState<string>("all");
  const [newTask, setNewTask] = useState({
    property_id: "",
    title: "",
    description: "",
    priority: "medium" as MaintenanceTask["priority"],
  });

  const { data: tasks, isLoading: tasksLoading } = useSWR<MaintenanceTask[]>("/api/maintenance", fetcher);
  const { data: properties } = useSWR<Property[]>("/api/properties", fetcher);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddTask = async () => {
    try {
      const response = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTask,
          status: "pending",
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }),
      });
      if (response.ok) {
        mutate("/api/maintenance");
        setIsDialogOpen(false);
        setNewTask({
          property_id: "",
          title: "",
          description: "",
          priority: "medium",
        });
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const updateTaskStatus = async (taskId: string, status: MaintenanceTask["status"]) => {
    try {
      const response = await fetch("/api/maintenance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, status }),
      });
      if (response.ok) {
        mutate("/api/maintenance");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const filteredTasks = (tasks || []).filter((task) => {
    if (filterStatus !== "all" && task.status !== filterStatus) return false;
    if (filterProperty !== "all" && task.property_id !== filterProperty) return false;
    return true;
  });

  const getPropertyName = (propertyId: string) => {
    return (properties || []).find((p) => p.id === propertyId)?.name || "Unknown";
  };

  const pendingCount = (tasks || []).filter((t) => t.status === "pending").length;
  const inProgressCount = (tasks || []).filter((t) => t.status === "in_progress").length;
  const completedCount = (tasks || []).filter((t) => t.status === "completed").length;
  const urgentCount = (tasks || []).filter(
    (t) => t.priority === "urgent" && t.status !== "completed"
  ).length;

  if (!mounted || tasksLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Maintenance
          </h1>
          <p className="mt-2 text-muted-foreground">
            Track and manage property upkeep tasks
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Maintenance Task</DialogTitle>
              <DialogDescription>
                Add a new maintenance task for one of your properties
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Property</Label>
                <Select
                  value={newTask.property_id}
                  onValueChange={(value) =>
                    setNewTask({ ...newTask, property_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {(properties || []).map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Task Title</Label>
                <Input
                  placeholder="e.g., Fix leaky faucet"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe the maintenance task..."
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value: MaintenanceTask["priority"]) =>
                    setNewTask({ ...newTask, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddTask}
                disabled={!newTask.property_id || !newTask.title}
              >
                Create Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Pending</CardDescription>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>In Progress</CardDescription>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Completed</CardDescription>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
          </CardContent>
        </Card>
        <Card className={urgentCount > 0 ? "border-red-200 bg-red-50" : ""}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Urgent</CardDescription>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{urgentCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Maintenance Tasks</CardTitle>
              <CardDescription>All property maintenance requests</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterProperty} onValueChange={setFilterProperty}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  {(properties || []).map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Wrench className="mb-2 h-8 w-8" />
                <p>No maintenance tasks found</p>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const StatusIcon = statusIcons[task.status] || Clock;
                return (
                  <div
                    key={task.id}
                    className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{task.title}</h3>
                        <Badge className={priorityColors[task.priority]}>
                          {task.priority}
                        </Badge>
                        <Badge className={statusColors[task.status]}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {task.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="mb-2 text-sm text-muted-foreground">
                        {task.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {getPropertyName(task.property_id)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due: {format(new Date(task.due_date), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                    {task.status !== "completed" && (
                      <div className="flex gap-2">
                        {task.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateTaskStatus(task.id, "in_progress")}
                          >
                            Start
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => updateTaskStatus(task.id, "completed")}
                        >
                          Complete
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
