import { useState, useEffect, useCallback } from "react";
import { API_ENDPOINTS } from "@/config";
import type { Project } from "@/types";

// API response types (matching backend schema)
interface ProjectImage {
  url: string;
  alt: string | null;
  is_primary: boolean;
}

interface ApiProject {
  id: number;
  title: string;
  slug: string;
  description: string;
  long_description: string | null;
  technologies: string[];
  images: ProjectImage[];
  github_url: string | null;
  live_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
}

// Transform API project to frontend format
function transformProject(apiProject: ApiProject): Project {
  const primaryImage = apiProject.images?.find((img) => img.is_primary);
  const firstImage = apiProject.images?.[0];
  const imageUrl =
    primaryImage?.url ||
    firstImage?.url ||
    `https://picsum.photos/seed/${apiProject.slug}/400/250`;

  return {
    id: apiProject.slug, // Use slug as ID for routing
    title: apiProject.title,
    description: apiProject.description,
    image: imageUrl,
    technologies: apiProject.technologies,
    liveUrl: apiProject.live_url || undefined,
    githubUrl: apiProject.github_url || undefined,
  };
}

interface UseProjectsResult {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProjects(): UseProjectsResult {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_ENDPOINTS.projects}?published_only=true`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiProject[] = await response.json();
      const transformedProjects = data.map(transformProject);

      // Sort by display_order
      transformedProjects.sort((a, b) => {
        const orderA = data.find((p) => p.slug === a.id)?.display_order || 0;
        const orderB = data.find((p) => p.slug === b.id)?.display_order || 0;
        return orderA - orderB;
      });

      setProjects(transformedProjects);
    } catch (err) {
      console.warn("Failed to fetch projects from API:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch projects");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, isLoading, error, refetch: fetchProjects };
}

interface UseProjectResult {
  project: Project | null;
  isLoading: boolean;
  error: string | null;
}

export function useProject(id: string): UseProjectResult {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_ENDPOINTS.projects}/${id}`);

        if (!response.ok) {
          throw new Error(response.status === 404 ? "Project not found" : `HTTP error! status: ${response.status}`);
        }

        const data: ApiProject = await response.json();
        setProject(transformProject(data));
      } catch (err) {
        console.warn("Failed to fetch project from API:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch project");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  return { project, isLoading, error };
}
