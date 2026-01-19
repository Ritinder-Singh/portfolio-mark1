from datetime import datetime
from pydantic import BaseModel, Field


# Skill schemas
class SkillBase(BaseModel):
    name: str
    proficiency: int = Field(ge=0, le=100, default=80)
    display_order: int = 0
    is_published: bool = True


class SkillCreate(SkillBase):
    category_id: int


class SkillUpdate(BaseModel):
    name: str | None = None
    category_id: int | None = None
    proficiency: int | None = Field(ge=0, le=100, default=None)
    display_order: int | None = None
    is_published: bool | None = None


class SkillResponse(SkillBase):
    id: int
    category_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Skill Category schemas
class SkillCategoryBase(BaseModel):
    name: str
    slug: str
    icon: str
    description: str | None = None
    display_order: int = 0
    is_published: bool = True


class SkillCategoryCreate(SkillCategoryBase):
    pass


class SkillCategoryUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    icon: str | None = None
    description: str | None = None
    display_order: int | None = None
    is_published: bool | None = None


class SkillCategoryResponse(SkillCategoryBase):
    id: int
    skills: list[SkillResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SkillCategoryListResponse(SkillCategoryBase):
    id: int
    skills: list[SkillResponse] = []

    class Config:
        from_attributes = True
