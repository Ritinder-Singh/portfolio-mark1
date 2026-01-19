"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Mail,
  MailOpen,
  Archive,
  Trash2,
  CheckCheck,
  X,
} from "lucide-react";
import { contact, type ContactSubmission } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Filter = "all" | "unread" | "archived";

export default function ContactPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null);

  const { data: stats } = useQuery({
    queryKey: ["contact", "stats"],
    queryFn: () => contact.stats(),
  });

  const { data: messages, isLoading } = useQuery({
    queryKey: ["contact", "messages", filter],
    queryFn: () => {
      if (filter === "unread") return contact.list({ is_read: false });
      if (filter === "archived") return contact.list({ is_archived: true });
      return contact.list();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { is_read?: boolean; is_archived?: boolean } }) =>
      contact.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => contact.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact"] });
      setSelectedMessage(null);
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => contact.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact"] });
    },
  });

  const handleSelectMessage = (message: ContactSubmission) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      updateMutation.mutate({ id: message.id, data: { is_read: true } });
    }
  };

  const handleArchive = (message: ContactSubmission) => {
    updateMutation.mutate({
      id: message.id,
      data: { is_archived: !message.is_archived },
    });
  };

  const handleDelete = (message: ContactSubmission) => {
    if (confirm("Delete this message? This cannot be undone.")) {
      deleteMutation.mutate(message.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground mt-1">
            Contact form submissions from your portfolio
          </p>
        </div>
        {stats && stats.unread > 0 && (
          <Button
            variant="outline"
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card
          className={cn(
            "cursor-pointer transition-colors",
            filter === "all" && "border-primary"
          )}
          onClick={() => setFilter("all")}
        >
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{stats?.total || 0}</p>
                <p className="text-sm text-muted-foreground">Total messages</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={cn(
            "cursor-pointer transition-colors",
            filter === "unread" && "border-primary"
          )}
          onClick={() => setFilter("unread")}
        >
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats?.unread || 0}</p>
                <p className="text-sm text-muted-foreground">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={cn(
            "cursor-pointer transition-colors",
            filter === "archived" && "border-primary"
          )}
          onClick={() => setFilter("archived")}
        >
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Archive className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{stats?.archived || 0}</p>
                <p className="text-sm text-muted-foreground">Archived</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message List & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              {filter === "all" && "All Messages"}
              {filter === "unread" && "Unread Messages"}
              {filter === "archived" && "Archived Messages"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-muted-foreground">Loading...</div>
            ) : messages?.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No messages
              </div>
            ) : (
              <div className="divide-y max-h-[500px] overflow-auto">
                {messages?.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                      selectedMessage?.id === message.id && "bg-muted",
                      !message.is_read && "bg-primary/5"
                    )}
                    onClick={() => handleSelectMessage(message)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {message.is_read ? (
                          <MailOpen className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Mail className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={cn(
                              "font-medium truncate",
                              !message.is_read && "text-primary"
                            )}
                          >
                            {message.first_name} {message.last_name}
                          </span>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {formatDate(message.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {message.email}
                        </p>
                        <p className="text-sm mt-1 line-clamp-2">
                          {message.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detail */}
        <Card>
          <CardContent className="p-6">
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {selectedMessage.first_name} {selectedMessage.last_name}
                    </h3>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(selectedMessage.created_at)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleArchive(selectedMessage)}
                      title={selectedMessage.is_archived ? "Unarchive" : "Archive"}
                    >
                      <Archive
                        className={cn(
                          "h-4 w-4",
                          selectedMessage.is_archived && "text-primary"
                        )}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(selectedMessage)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedMessage(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
                <div className="pt-4">
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                  >
                    Reply via Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a message to view details
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
