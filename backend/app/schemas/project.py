from datetime import datetime
from pydantic import BaseModel, HttpUrl


class ProjectImage(BaseModel):
    url: str
    alt: str | None = None
    is_primary: bool = False


class ProjectBase(BaseModel):
    title: str
    slug: str
    description: str
    long_description: str | None = None
    technologies: list[str] = []
    images: list[ProjectImage] = []
    github_url: str | None = None
    live_url: str | None = None
    is_featured: bool = False
    is_published: bool = False
    display_order: int = 0


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: str | None = None
    slug: str | None = None
    description: str | None = None
    long_description: str | None = None
    technologies: list[str] | None = None
    images: list[ProjectImage] | None = None
    github_url: str | None = None
    live_url: str | None = None
    is_featured: bool | None = None
    is_published: bool | None = None
    display_order: int | None = None


class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProjectListResponse(BaseModel):
    id: int
    title: str
    slug: str
    description: str
    technologies: list[str]
    images: list[ProjectImage]
    github_url: str | None
    live_url: str | None
    is_featured: bool
    display_order: int

    class Config:
        from_attributes = True
