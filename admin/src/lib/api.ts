const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new ApiError(response.status, error.detail || "Request failed");
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Auth
export const auth = {
  login: (email: string, password: string) =>
    request<{ access_token: string; token_type: string }>("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: undefined,
    }).then(() => {
      // OAuth2 form login needs special handling
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);
      return fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      }).then(async (res) => {
        if (!res.ok) {
          const error = await res.json().catch(() => ({ detail: "Login failed" }));
          throw new ApiError(res.status, error.detail);
        }
        return res.json();
      });
    }),
  me: () => request<User>("/auth/me"),
  register: (data: { email: string; password: string; full_name: string }) =>
    request<User>("/auth/register", { method: "POST", body: data }),
};

// Simpler login function
export async function login(email: string, password: string) {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Login failed" }));
    throw new ApiError(response.status, error.detail);
  }

  return response.json() as Promise<{ access_token: string; token_type: string }>;
}

export async function getMe() {
  return request<User>("/auth/me");
}

// Projects
export const projects = {
  list: () => request<Project[]>("/projects"),
  listAll: () => request<Project[]>("/projects/admin/all"),
  get: (slug: string) => request<Project>(`/projects/${slug}`),
  create: (data: ProjectCreate) =>
    request<Project>("/projects", { method: "POST", body: data }),
  update: (id: number, data: ProjectUpdate) =>
    request<Project>(`/projects/${id}`, { method: "PATCH", body: data }),
  delete: (id: number) =>
    request<void>(`/projects/${id}`, { method: "DELETE" }),
};

// Skills
export const skills = {
  listCategories: () => request<SkillCategory[]>("/skills/categories"),
  listAllCategories: () => request<SkillCategory[]>("/skills/admin/categories"),
  createCategory: (data: SkillCategoryCreate) =>
    request<SkillCategory>("/skills/categories", { method: "POST", body: data }),
  updateCategory: (id: number, data: SkillCategoryUpdate) =>
    request<SkillCategory>(`/skills/categories/${id}`, { method: "PATCH", body: data }),
  deleteCategory: (id: number) =>
    request<void>(`/skills/categories/${id}`, { method: "DELETE" }),
  create: (data: SkillCreate) =>
    request<Skill>("/skills", { method: "POST", body: data }),
  update: (id: number, data: SkillUpdate) =>
    request<Skill>(`/skills/${id}`, { method: "PATCH", body: data }),
  delete: (id: number) =>
    request<void>(`/skills/${id}`, { method: "DELETE" }),
};

// Contact
export const contact = {
  list: (params?: { is_read?: boolean; is_archived?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.is_read !== undefined) searchParams.set("is_read", String(params.is_read));
    if (params?.is_archived !== undefined) searchParams.set("is_archived", String(params.is_archived));
    const query = searchParams.toString();
    return request<ContactSubmission[]>(`/contact${query ? `?${query}` : ""}`);
  },
  get: (id: number) => request<ContactSubmission>(`/contact/${id}`),
  update: (id: number, data: { is_read?: boolean; is_archived?: boolean }) =>
    request<ContactSubmission>(`/contact/${id}`, { method: "PATCH", body: data }),
  delete: (id: number) =>
    request<void>(`/contact/${id}`, { method: "DELETE" }),
  stats: () => request<{ total: number; unread: number; archived: number }>("/contact/stats"),
  markAllRead: () => request<void>("/contact/mark-all-read", { method: "POST" }),
};

// Types
export type User = {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type ProjectImage = {
  url: string;
  alt?: string;
  is_primary: boolean;
};

export type Project = {
  id: number;
  title: string;
  slug: string;
  description: string;
  long_description?: string;
  technologies: string[];
  images: ProjectImage[];
  github_url?: string;
  live_url?: string;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type ProjectCreate = Omit<Project, "id" | "created_at" | "updated_at">;
export type ProjectUpdate = Partial<ProjectCreate>;

export type Skill = {
  id: number;
  name: string;
  category_id: number;
  proficiency: number;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type SkillCreate = Omit<Skill, "id" | "created_at" | "updated_at">;
export type SkillUpdate = Partial<SkillCreate>;

export type SkillCategory = {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  display_order: number;
  is_published: boolean;
  skills: Skill[];
  created_at: string;
  updated_at: string;
};

export type SkillCategoryCreate = Omit<SkillCategory, "id" | "skills" | "created_at" | "updated_at">;
export type SkillCategoryUpdate = Partial<SkillCategoryCreate>;

export type ContactSubmission = {
  id: number;
  first_name: string;
  last_name?: string;
  email: string;
  message: string;
  is_read: boolean;
  is_archived: boolean;
  ip_address?: string;
  created_at: string;
};
