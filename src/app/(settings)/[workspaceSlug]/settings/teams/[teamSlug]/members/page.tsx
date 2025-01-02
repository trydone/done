"use client";

import * as React from "react";
import { useZero } from "@rocicorp/zero/react";
import { useQuery } from "@rocicorp/zero/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, MoreHorizontal, Plus, Search } from "lucide-react";
import { Schema } from "@/schema";
import { toast } from "sonner";
import Link from "next/link";

interface Member {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "Admin" | "Member";
  avatarUrl?: string;
}

type Props = {
  params: { workspaceSlug: string; teamSlug: string };
};

export default function Page({ params: { workspaceSlug, teamSlug } }: Props) {
  const z = useZero<Schema>();
  const [members] = useQuery(z.query.team_member);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("All");

  const filteredMembers = React.useMemo(() => {
    return members.filter(
      (member) =>
        member.user.name.toLowerCase().includes(search.toLowerCase()) ||
        member.user.login.toLowerCase().includes(search.toLowerCase()),
    );
  }, [members, search]);

  const handleLeave = async (memberId: string) => {
    try {
      await z.mutate.member.delete({ id: memberId });
      toast.success("Member removed successfully");
    } catch (error) {
      toast.error("Failed to remove member");
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/teams" className="hover:opacity-80">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div className="flex items-center space-x-3">
          <div className="h-6 w-6 rounded bg-green-500/20 flex items-center justify-center">
            <span className="text-green-500">$</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Product team members
          </h1>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-4 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32">
              <SelectValue>{filter}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Member">Member</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add a member
        </Button>
      </div>

      {/* Members Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.avatarUrl} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {member.username}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {member.user.login}
              </TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleLeave(member.id)}
                      className="text-red-600"
                    >
                      Leave team...
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
