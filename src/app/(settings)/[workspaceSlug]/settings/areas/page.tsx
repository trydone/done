"use client";

import * as React from "react";
import { useZero } from "@rocicorp/zero/react";
import { useQuery } from "@rocicorp/zero/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, DollarSign, Plus } from "lucide-react";
import { Schema } from "@/schema";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface Area {
  id: string;
  name: string;
  isPro: boolean;
  visibility: "Workspace" | "Private" | "Public";
  memberCount: number;
  issueCount: number;
  createdAt: Date;
}

export default function TeamsPage() {
  const z = useZero<Schema>();
  const router = useRouter();
  const [areas] = useQuery(z.query.area);
  const [search, setSearch] = React.useState("");

  const filteredAreas = React.useMemo(() => {
    return areas.filter((area) =>
      area.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [areas, search]);

  const handleCreateTeam = () => {
    router.push("/teams/new");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Teams</h1>
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
        <Button onClick={handleCreateTeam}>
          <Plus className="h-4 w-4 mr-2" />
          Create team
        </Button>
      </div>

      {/* Teams Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Issues</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAreas.map((area) => (
            <TableRow key={area.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {area.isPro && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20">
                      <DollarSign className="h-3 w-3 text-green-500" />
                    </div>
                  )}
                  <span className="font-medium">{area.name}</span>
                  {area.isPro && (
                    <Badge variant="secondary" className="text-xs">
                      PRO
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {area.visibility}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-muted-foreground">
                  {area.memberCount}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-muted-foreground">{area.issueCount}</span>
              </TableCell>
              <TableCell>
                {new Date(area.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
