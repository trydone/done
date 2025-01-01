"use client";

import * as React from "react";
import { useZero } from "@rocicorp/zero/react";
import { useQuery } from "@rocicorp/zero/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Schema } from "@/schema";
import { ExternalLink, Upload } from "lucide-react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function WorkspaceSettingsPage() {
  const z = useZero<Schema>();
  const [workspace] = useQuery(z.query.workspace);
  const [isUploading, setIsUploading] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setIsUploading(true);

    try {
      const file = e.target.files[0];
      // Implement file upload logic here
      await z.mutate.workspace.update({
        id: workspace?.id,
        logoUrl: "uploaded-url",
      });
      toast.success("Logo updated successfully");
    } catch (error) {
      toast.error("Failed to upload logo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      await z.mutate.workspace.update({
        id: workspace?.id,
        name: e.target.value,
      });
      toast.success("Name updated successfully");
    } catch (error) {
      toast.error("Failed to update name");
    }
  };

  const handleFiscalMonthChange = async (month: string) => {
    try {
      await z.mutate.workspace.update({
        id: workspace?.id,
        fiscalYearStartMonth: month,
      });
      toast.success("Fiscal year start month updated");
    } catch (error) {
      toast.error("Failed to update fiscal year start month");
    }
  };

  const handleDelete = async () => {
    try {
      await z.mutate.workspace.delete({ id: workspace?.id });
      toast.success("Workspace scheduled for deletion");
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete workspace");
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Workspace Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your workspace preferences and configuration
        </p>
      </div>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
          <CardDescription>
            Configure your workspace identity settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo */}
          <div className="space-y-2">
            <Label>Logo</Label>
            <p className="text-sm text-muted-foreground">
              Recommended size is 256x256px
            </p>
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 rounded-lg border-2 border-dashed flex items-center justify-center">
                {workspace?.logoUrl ? (
                  <img
                    src={workspace.logoUrl}
                    alt="Logo"
                    className="max-h-full max-w-full"
                  />
                ) : (
                  <Upload className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <Button disabled={isUploading} asChild>
                <label className="cursor-pointer">
                  DO
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                </label>
              </Button>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              defaultValue={workspace?.name}
              onChange={handleNameChange}
              placeholder="Done"
            />
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label>URL</Label>
            <div className="flex items-center space-x-2">
              <Input
                value={`linear.app/${workspace?.slug ?? "get-done"}`}
                readOnly
                disabled
              />
              <Button variant="ghost" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time & Region */}
      <Card>
        <CardHeader>
          <CardTitle>Time & Region</CardTitle>
          <CardDescription>
            Configure regional and time-based settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Fiscal Year */}
          <div className="space-y-2">
            <Label>First month of the fiscal year</Label>
            <p className="text-sm text-muted-foreground">
              Used when grouping projects and issues quarterly, half-yearly, and
              yearly
            </p>
            <Select
              defaultValue={workspace?.fiscalYearStartMonth}
              onValueChange={handleFiscalMonthChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Region */}
          <div className="space-y-2">
            <Label>Region</Label>
            <p className="text-sm text-muted-foreground">
              Set when a workspace is created and cannot be changed.{" "}
              <a href="#" className="text-primary hover:underline">
                Read more
              </a>
            </p>
            <Input value="United States" disabled />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Delete workspace</h3>
              <p className="text-sm text-muted-foreground">
                Schedule workspace to be permanently deleted
              </p>
            </div>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete...</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Workspace</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. The workspace and all its data
                    will be permanently deleted.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="ghost"
                    onClick={() => setDeleteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete Workspace
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
