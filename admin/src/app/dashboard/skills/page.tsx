"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, Eye, EyeOff } from "lucide-react";
import { skills, type SkillCategory, type Skill } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function SkillsPage() {
  const queryClient = useQueryClient();
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null);
  const [editingSkill, setEditingSkill] = useState<{ skill: Skill | null; categoryId: number } | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isCreatingSkill, setIsCreatingSkill] = useState<number | null>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["skills", "categories", "all"],
    queryFn: () => skills.listAllCategories(),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => skills.deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["skills"] }),
  });

  const deleteSkillMutation = useMutation({
    mutationFn: (id: number) => skills.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["skills"] }),
  });

  const toggleCategoryPublishedMutation = useMutation({
    mutationFn: ({ id, is_published }: { id: number; is_published: boolean }) =>
      skills.updateCategory(id, { is_published }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["skills"] }),
  });

  const toggleSkillPublishedMutation = useMutation({
    mutationFn: ({ id, is_published }: { id: number; is_published: boolean }) =>
      skills.update(id, { is_published }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["skills"] }),
  });

  const handleToggleCategoryPublished = (category: SkillCategory) => {
    toggleCategoryPublishedMutation.mutate({
      id: category.id,
      is_published: !category.is_published,
    });
  };

  const handleToggleSkillPublished = (skill: Skill) => {
    toggleSkillPublishedMutation.mutate({
      id: skill.id,
      is_published: !skill.is_published,
    });
  };

  const toggleCategory = (id: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCategories(newExpanded);
  };

  const handleDeleteCategory = (category: SkillCategory) => {
    if (confirm(`Delete "${category.name}" and all its skills? This cannot be undone.`)) {
      deleteCategoryMutation.mutate(category.id);
    }
  };

  const handleDeleteSkill = (skill: Skill) => {
    if (confirm(`Delete "${skill.name}"? This cannot be undone.`)) {
      deleteSkillMutation.mutate(skill.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Skills</h1>
          <p className="text-muted-foreground mt-1">
            Manage your skill categories and individual skills
          </p>
        </div>
        <Button onClick={() => setIsCreatingCategory(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Category Form Modal */}
      {(isCreatingCategory || editingCategory) && (
        <CategoryForm
          category={editingCategory}
          onClose={() => {
            setIsCreatingCategory(false);
            setEditingCategory(null);
          }}
        />
      )}

      {/* Skill Form Modal */}
      {(isCreatingSkill !== null || editingSkill) && (
        <SkillForm
          skill={editingSkill?.skill || null}
          categoryId={editingSkill?.categoryId || isCreatingSkill!}
          onClose={() => {
            setIsCreatingSkill(null);
            setEditingSkill(null);
          }}
        />
      )}

      {isLoading ? (
        <div className="text-muted-foreground">Loading skills...</div>
      ) : categories?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No skill categories yet</p>
            <Button onClick={() => setIsCreatingCategory(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create your first category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {categories?.map((category) => (
            <Card key={category.id}>
              <CardHeader className="p-4">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleCategory(category.id)}
                  >
                    {expandedCategories.has(category.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <span className="text-sm text-muted-foreground">
                        ({category.skills.length} skills)
                      </span>
                      {!category.is_published && (
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">
                          Draft
                        </span>
                      )}
                    </div>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsCreatingSkill(category.id)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Skill
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleCategoryPublished(category)}
                      title={category.is_published ? "Deactivate category" : "Activate category"}
                    >
                      {category.is_published ? (
                        <Eye className="h-4 w-4 text-green-500" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingCategory(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(category)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedCategories.has(category.id) && (
                <CardContent className="pt-0 pb-4">
                  {category.skills.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No skills in this category yet
                    </p>
                  ) : (
                    <div className="space-y-2 ml-11">
                      {category.skills.map((skill) => (
                        <div
                          key={skill.id}
                          className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{skill.name}</span>
                              {!skill.is_published && (
                                <span className="text-xs bg-background px-2 py-0.5 rounded">
                                  Draft
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 h-2 bg-background rounded-full overflow-hidden max-w-xs">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${skill.proficiency}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {skill.proficiency}%
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleToggleSkillPublished(skill)}
                              title={skill.is_published ? "Deactivate skill" : "Activate skill"}
                            >
                              {skill.is_published ? (
                                <Eye className="h-3 w-3 text-green-500" />
                              ) : (
                                <EyeOff className="h-3 w-3 text-muted-foreground" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                setEditingSkill({ skill, categoryId: category.id })
                              }
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDeleteSkill(skill)}
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Category Form Component
function CategoryForm({
  category,
  onClose,
}: {
  category: SkillCategory | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const isEditing = !!category;

  const [formData, setFormData] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    icon: category?.icon || "code",
    description: category?.description || "",
    display_order: category?.display_order || 0,
    is_published: category?.is_published ?? true,
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => skills.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: typeof formData) => skills.updateCategory(category!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData({ ...formData, slug });
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Category" : "New Category"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Frontend Development"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug</label>
              <div className="flex gap-2">
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="frontend"
                  required
                />
                <Button type="button" variant="outline" onClick={generateSlug}>
                  Generate
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Icon</label>
              <Input
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="code, layout, server, tool"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              />
              <span className="text-sm">Published</span>
            </label>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Skill Form Component
function SkillForm({
  skill,
  categoryId,
  onClose,
}: {
  skill: Skill | null;
  categoryId: number;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const isEditing = !!skill;

  const [formData, setFormData] = useState({
    name: skill?.name || "",
    category_id: skill?.category_id || categoryId,
    proficiency: skill?.proficiency || 80,
    display_order: skill?.display_order || 0,
    is_published: skill?.is_published ?? true,
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => skills.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: typeof formData) => skills.update(skill!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Skill" : "New Skill"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="React, TypeScript, etc."
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Proficiency ({formData.proficiency}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.proficiency}
                onChange={(e) =>
                  setFormData({ ...formData, proficiency: parseInt(e.target.value) })
                }
                className="w-full"
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              />
              <span className="text-sm">Published</span>
            </label>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
