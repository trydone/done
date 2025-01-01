"use client";

import * as React from "react";
import { useZero } from "@rocicorp/zero/react";
import { useQuery } from "@rocicorp/zero/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DollarSign,
  Settings,
  Users,
  Tag,
  FileText,
  Clock,
  Slack,
  ActivitySquare,
  Filter,
  TimerReset,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Schema } from "@/schema";
import { toast } from "sonner";
import Link from "next/link";

export default function GeneralSettingsPage() {
  const z = useZero<Schema>();
  const [area] = useQuery(z.query.area);

  const handleTimezoneChange = async (value: string) => {
    try {
      await z.mutate.area.update({
        id: area?.id,
        timezone: value,
      });
      toast.success("Timezone updated successfully");
    } catch (error) {
      toast.error("Failed to update timezone");
    }
  };

  const handleDeleteArea = async () => {
    try {
      await z.mutate.area.delete({ id: area?.id });
      toast.success("Area scheduled for deletion");
    } catch (error) {
      toast.error("Failed to delete area");
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8 max-w-4xl">
      {/* Area Identity */}
      <Card>
        <CardHeader>
          <CardTitle>Area Identity</CardTitle>
          <CardDescription>
            Configure how your area appears and is identified
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Icon & Name</label>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-green-500/20">
                  <DollarSign className="h-4 w-4 text-green-500" />
                </div>
                <Input defaultValue="Product" />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">
                Identifier
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
          href="/settings/general"
          className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted"
        >
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">General</div>
              <div className="text-sm text-muted-foreground">
                Timezone, estimates, and broader settings
              </div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4" />
        </Link>

        <Link
          href="/settings/members"
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
            <span className="text-sm text-muted-foreground">2 members</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </Link>

        {/* Additional navigation items... */}
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
          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-medium">Change team visibility</h3>
              <p className="text-sm text-muted-foreground">
                Control who can see and join this team
              </p>
            </div>
            <Button variant="outline" disabled>
              Available on Business
            </Button>
          </div>

          <div className="flex items-center justify-between py-3 border-t">
            <div>
              <h3 className="font-medium">Delete team</h3>
              <p className="text-sm text-muted-foreground">
                Permanently remove this team and all of its data
              </p>
            </div>
            <Button variant="destructive" onClick={handleDeleteArea}>
              Delete team...
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
