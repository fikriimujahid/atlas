"use client";

import SEO from "@/components/seo/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, FileJson, Clock, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="flex-1 p-8">
      <SEO title="Dashboard" description="Your JSON-AI Dashboard" />
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's your recent activity.</p>
          </div>
          <Button className="gap-2">
            <PlusCircle className="w-4 h-4" /> New Operation
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Formats Today</CardTitle>
              <FileJson className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Queries</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34</div>
              <p className="text-xs text-muted-foreground">16 remaining on free tier</p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-xl font-semibold tracking-tight mt-10">Recent Files</h2>
        <div className="border rounded-md">
          <div className="p-4 text-center text-muted-foreground">
             No recent files. Try formatting some JSON data!
          </div>
        </div>

      </div>
    </div>
  );
}
