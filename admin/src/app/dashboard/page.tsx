"use client";

import { useQuery } from "@tanstack/react-query";
import { FolderKanban, Sparkles, Mail, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projects, skills, contact } from "@/lib/api";
import Link from "next/link";

export default function DashboardPage() {
  const { data: projectList } = useQuery({
    queryKey: ["projects", "all"],
    queryFn: () => projects.listAll(),
  });

  const { data: skillCategories } = useQuery({
    queryKey: ["skills", "categories", "all"],
    queryFn: () => skills.listAllCategories(),
  });

  const { data: contactStats } = useQuery({
    queryKey: ["contact", "stats"],
    queryFn: () => contact.stats(),
  });

  const totalSkills = skillCategories?.reduce(
    (acc, cat) => acc + cat.skills.length,
    0
  ) || 0;

  const stats = [
    {
      title: "Total Projects",
      value: projectList?.length || 0,
      icon: FolderKanban,
      href: "/dashboard/projects",
      description: `${projectList?.filter((p) => p.is_published).length || 0} published`,
    },
    {
      title: "Skills",
      value: totalSkills,
      icon: Sparkles,
      href: "/dashboard/skills",
      description: `${skillCategories?.length || 0} categories`,
    },
    {
      title: "Messages",
      value: contactStats?.total || 0,
      icon: Mail,
      href: "/dashboard/contact",
      description: `${contactStats?.unread || 0} unread`,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to your portfolio admin panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/projects?action=new">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FolderKanban className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">New Project</p>
                    <p className="text-sm text-muted-foreground">Add a project</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/skills?action=new">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">New Skill</p>
                    <p className="text-sm text-muted-foreground">Add a skill</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/contact?filter=unread">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Unread Messages</p>
                    <p className="text-sm text-muted-foreground">
                      {contactStats?.unread || 0} messages
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <a href="http://localhost:8081" target="_blank" rel="noopener noreferrer">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">View Portfolio</p>
                    <p className="text-sm text-muted-foreground">Open live site</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </a>
        </div>
      </div>
    </div>
  );
}
