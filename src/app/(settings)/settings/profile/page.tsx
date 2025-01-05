"use client";

import { useQuery } from "@rocicorp/zero/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Lock, Mail, Shield } from "lucide-react";
import { toast } from "sonner";
import { useZero } from "@/hooks/use-zero";
import { useLogin } from "@/hooks/use-login";
import { ChangeEvent, useState } from "react";

export default function Page() {
  const login = useLogin();
  const zero = useZero();
  const [session] = useQuery(
    zero.query.session
      .where("id", login.loginState?.decoded.sub || "")
      .one()
      .related("user"),
  );
  const [isUploading, setIsUploading] = useState(false);

  const user = session?.user?.[0];

  const handleNameChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      await zero.mutate.user.update({
        id: user?.id,
        name: e.target.value,
      });
      toast.success("Name updated successfully");
    } catch (error) {
      toast.error("Failed to update name");
    }
  };

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setIsUploading(true);

    try {
      const file = e.target.files[0];
      // Implement your file upload logic here
      await zero.mutate.user.update({
        id: user?.id,
        avatar: "uploaded-url",
      });
      toast.success("Profile picture updated successfully");
    } catch (error) {
      toast.error("Failed to upload user picture");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEmailChange = () => {
    // Implement email change modal/flow
    toast.info("Email change functionality coming soon");
  };

  const handlePasswordChange = () => {
    // Implement password change modal/flow
    toast.info("Password change functionality coming soon");
  };

  const handleVerificationAdd = () => {
    // Implement 2FA setup modal/flow
    toast.info("2FA setup functionality coming soon");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="container max-w-3xl mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Update your user information and picture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>
                        {user?.name ? getInitials(user.name) : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleAvatarUpload}
                      disabled={isUploading}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>Click to change user picture</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex-1">
              <label className="text-sm font-medium">Preferred name</label>
              <Input
                placeholder="Enter your name"
                defaultValue={user?.name}
                onChange={handleNameChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <h3 className="font-medium">Email</h3>
              </div>
              <p className="text-sm text-muted-foreground">{user?.username}</p>
            </div>
            <Button variant="outline" onClick={handleEmailChange}>
              Change email
            </Button>
          </div>

          {/* Password */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <h3 className="font-medium">Password</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Change your password to login to your account
              </p>
            </div>
            <Button variant="outline" onClick={handlePasswordChange}>
              Change password
            </Button>
          </div>

          {/* 2FA */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <h3 className="font-medium">2-step verification</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Add an additional layer of security to your account during login
              </p>
            </div>
            <Button variant="outline" onClick={handleVerificationAdd}>
              Add verification
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
