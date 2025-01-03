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

type Props = {
  params: { workspaceSlug: string };
};

export default function Page({ params: { workspaceSlug } }: Props) {
  const z = useZero<Schema>();
  const router = useRouter();
  const [teams] = useQuery(z.query.team);
  const [search, setSearch] = React.useState("");

  const filteredTeams = React.useMemo(() => {
    return teams.filter((team) =>
      team.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [teams, search]);

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
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTeams.map((team) => (
            <TableRow key={team.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{team.name}</span>
                </div>
              </TableCell>

              <TableCell>
                {new Date(team.created_at).toLocaleDateString(undefined, {
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
