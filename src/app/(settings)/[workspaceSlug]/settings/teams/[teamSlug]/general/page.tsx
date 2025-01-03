"use client";

import * as React from "react";
import { useZero } from "@rocicorp/zero/react";
import { useQuery } from "@rocicorp/zero/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, ChevronRight } from "lucide-react";
import { Schema } from "@/schema";
import { toast } from "sonner";
import Link from "next/link";

type Props = {
  params: { workspaceSlug: string; teamSlug: string };
};

export default function Page({ params: { workspaceSlug, teamSlug } }: Props) {
  const z = useZero<Schema>();
  const [team] = useQuery(z.query.team);

  const handleDeleteTeam = async () => {
    try {
      await z.mutate.team.delete({ id: team?.id });
      toast.success("Team scheduled for deletion");
    } catch (error) {
      toast.error("Failed to delete team");
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8 max-w-4xl">
      {/* Team Identity */}
      <Card>
        <CardHeader>
          <CardTitle>Team settings</CardTitle>
          <CardDescription>
            Configure how your team appears and is identified
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Name</label>
              <div className="flex items-center gap-2">
                <Input defaultValue="Product" />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">
                Slug
                <span className="text-muted-foreground ml-2 text-sm font-normal">
                  Used in issue IDs
                </span>
              </label>
              <Input defaultValue="PRO" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Links */}
      <div className="space-y-2">
        <Link
          href={`/${workspaceSlug}/settings/teams/${teamSlug}/members`}
          className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted"
        >
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">Members</div>
              <div className="text-sm text-muted-foreground">
                Manage team members
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* <span className="text-sm text-muted-foreground">2 members</span> */}
            <ChevronRight className="h-4 w-4" />
          </div>
        </Link>
      </div>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-t">
            <div>
              <h3 className="font-medium">Delete team</h3>
              <p className="text-sm text-muted-foreground">
                Permanently remove this team and all of its data
              </p>
            </div>
            <Button variant="destructive" onClick={handleDeleteTeam}>
              Delete team...
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
