"use client";

import * as React from "react";
import { useZero } from "@rocicorp/zero/react";
import { useQuery } from "@rocicorp/zero/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, MoreHorizontal, Plus, FolderPlus } from "lucide-react";
import { Schema } from "@/schema";
import { toast } from "sonner";

interface Label {
  id: string;
  name: string;
  color: string;
  usage: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function IssueLabelsPage() {
  const z = useZero<Schema>();
  const [labels] = useQuery(z.query.label);
  const [search, setSearch] = React.useState("");

  const filteredLabels = React.useMemo(() => {
    return labels.filter((label) =>
      label.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [labels, search]);

  const getColorClass = (name: string) => {
    switch (name.toLowerCase()) {
      case "bug":
        return "bg-red-500";
      case "feature":
        return "bg-purple-500";
      case "improvement":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleNewLabel = () => {
    // Implement new label creation
    toast.info("New label creation coming soon");
  };

  const handleNewGroup = () => {
    // Implement new group creation
    toast.info("New group creation coming soon");
  };

  return (
    <div className="container max-w-6xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Issue labels</h1>
        <p className="text-muted-foreground">
          Manage and organize your issue labels
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleNewGroup}>
            <FolderPlus className="h-4 w-4 mr-2" />
            New group
          </Button>
          <Button onClick={handleNewLabel}>
            <Plus className="h-4 w-4 mr-2" />
            New label
          </Button>
        </div>
      </div>

      {/* Labels Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLabels.map((label) => (
            <TableRow key={label.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${getColorClass(label.name)}`}
                  />
                  <span>{label.name}</span>
                </div>
              </TableCell>
              <TableCell>{label.usage}</TableCell>
              <TableCell>
                {new Date(label.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </TableCell>
              <TableCell>
                {new Date(label.updatedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit label</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Delete label
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
