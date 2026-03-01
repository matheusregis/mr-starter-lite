"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              {user?.name?.[0]?.toUpperCase() ??
                user?.email?.[0]?.toUpperCase()}
            </div>
          </div>
          <CardTitle>You&apos;re in! 🎉</CardTitle>
          <CardDescription>
            Logged in as <strong>{user?.email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center text-sm text-muted-foreground">
          <p>This is the MR Starter Lite dashboard.</p>
          <p>
            The full version includes OAuth, email verification, password reset,
            roles, and more.
          </p>
          <Button variant="outline" className="w-full" onClick={logout}>
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
