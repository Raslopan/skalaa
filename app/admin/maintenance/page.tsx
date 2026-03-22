"use client";

import { useState, useEffect } from "react";
import { properties } from "@/lib/mock-data";
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
} from "lucide-react";
import { format } from "date-fns";

interface MaintenanceTask {
  id: string;
  propertyId: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in-progress" | "completed";
  assignee: string;
  dueDate: Date;
  createdAt: Date;
}

const initialTasks: MaintenanceTask[] = [
  {
    id: "task-1",
    propertyId: "prop-1",
    title: "AC Unit Maintenance",
    description: "Annual HVAC inspection and filter replacement",
    priority: "medium",
    status: "pending",
    assignee: "John Technician",
    dueDate: new Date(2026, 2, 20),
    createdAt: new Date(2026, 2, 10),
  },
  {
    id: "task-2",
    propertyId: "prop-2",
    title: "Hot Tub Repair",
    description: "Fix water heater malfunction",
    priority: "high",
    status: "in-progress",
    assignee: "Mike Plumber",
    dueDate: new Date(2026, 2, 18),
    createdAt: new Date(2026, 2, 12),
  },
  {
    id: "task-3",
    propertyId: "prop-3",
    title: "Smoke Detector Check",
    description: "Replace batteries and test all smoke detectors",
    priority: "urgent",
    status: "pending",
    assignee: "Sarah Safety",
    dueDate: new Date(2026, 2, 16),
    createdAt: new Date(2026, 2, 14),
  },
  {
    id: "task-4",
    propertyId: "prop-4",
    title: "Deck Staining",
    description: "Annual deck maintenance and staining",
    priority: "low",
    status: "completed",
    assignee: "Tom Carpenter",
    dueDate: new Date(2026, 2, 15),
    createdAt: new Date(2026, 2, 5),
  },
  {
    id: "task-5",
    propertyId: "prop-1",
    title: "Pool Cleaning",
    description: "Weekly pool maintenance and chemical balancing",
    priority: "medium",
    status: "completed",
    assignee: "Pool Service Co.",
    dueDate: new Date(2026, 2, 14),
    createdAt: new Date(2026, 2, 7),
  },
];

const priorityColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

const statusColors = {
  pending: "bg-gray-100 text-gray-800",
  "in-progress": "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
};

const statusIcons = {
  pending: Clock,
  "in-progress": Wrench,
  completed: CheckCircle2,
};

export default function MaintenancePage() {
  const [mounted, setMounted] = useState(false);
  const [tasks, setTasks] = useState<MaintenanceTask[]>(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterProperty, setFilterProperty] = useState<string>("all");
  const [newTask, setNewTask] = useState({
    propertyId: "",
    title: "",
    description: "",
    priority: "medium" as MaintenanceTask["priority"],
    assignee: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddTask = () => {
    const task: MaintenanceTask = {
      id: `task-${Date.now()}`,
      ...newTask,
      status: "pending",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    };
    setTasks((prev) => [task, ...prev]);
    setIsDialogOpen(false);
    setNewTask({
      propertyId: "",
      title: "",
      description: "",
      priority: "medium",
      assignee: "",
    });
  };

  const updateTaskStatus = (taskId: string, status: MaintenanceTask["status"]) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status } : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus !== "all" && task.status !== filterStatus) return false;
    if (filterProperty !== "all" && task.propertyId !== filterProperty) return false;
    return true;
  });

  const getPropertyName = (propertyId: string) => {
    return properties.find((p) => p.id === propertyId)?.name || "Unknown";
  };

  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const inProgressCount = tasks.filter((t) => t.status === "in-progress").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const urgentCount = tasks.filter(
    (t) => t.priority === "urgent" && t.status !== "completed"
  ).length;

  if (!mounted) {
    return (
      <div className="p-6 lg:p-8">
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
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
                  value={newTask.propertyId}
                  onValueChange={(value) =>
                    setNewTask({ ...newTask, propertyId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
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
              <div className="grid gap-4 sm:grid-cols-2">
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
                <div className="space-y-2">
                  <Label>Assignee</Label>
                  <Input
                    placeholder="e.g., John Smith"
                    value={newTask.assignee}
                    onChange={(e) =>
                      setNewTask({ ...newTask, assignee: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddTask}
                disabled={!newTask.propertyId || !newTask.title}
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
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterProperty} onValueChange={setFilterProperty}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  {properties.map((property) => (
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
                const StatusIcon = statusIcons[task.status];
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
                          {task.status}
                        </Badge>
                      </div>
                      <p className="mb-2 text-sm text-muted-foreground">
                        {task.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {getPropertyName(task.propertyId)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {task.assignee}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due: {format(task.dueDate, "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                    {task.status !== "completed" && (
                      <div className="flex gap-2">
                        {task.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateTaskStatus(task.id, "in-progress")}
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
