import { useState, useEffect, useCallback } from "react";
import { API_ENDPOINTS } from "@/config";
import { SKILL_CATEGORIES } from "@/constants";
import type { SkillCategory } from "@/types";

// API response types (matching backend schema)
interface ApiSkill {
  id: number;
  name: string;
  category_id: number;
  proficiency: number;
  display_order: number;
  is_published: boolean;
}

interface ApiSkillCategory {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string | null;
  display_order: number;
  is_published: boolean;
  skills: ApiSkill[];
}

// Transform API category to frontend format
function transformCategory(apiCategory: ApiSkillCategory): SkillCategory {
  return {
    id: apiCategory.slug,
    title: apiCategory.name,
    icon: apiCategory.icon,
    skills: apiCategory.skills
      .filter((skill) => skill.is_published)
      .sort((a, b) => a.display_order - b.display_order)
      .map((skill) => ({
        name: skill.name,
      })),
  };
}

interface UseSkillsResult {
  categories: SkillCategory[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSkills(): UseSkillsResult {
  const [categories, setCategories] = useState<SkillCategory[]>(SKILL_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_ENDPOINTS.skillCategories}?published_only=true`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiSkillCategory[] = await response.json();

      // Transform and sort by display_order
      const transformedCategories = data
        .filter((cat) => cat.is_published)
        .sort((a, b) => a.display_order - b.display_order)
        .map(transformCategory);

      setCategories(transformedCategories);
    } catch (err) {
      console.warn("Failed to fetch skills from API, using fallback data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch skills");
      // Keep using fallback data (already set as initial state)
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  return { categories, isLoading, error, refetch: fetchSkills };
}
