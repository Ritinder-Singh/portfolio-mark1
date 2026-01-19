from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import CurrentAdmin
from app.models.skill import Skill, SkillCategory
from app.schemas.skill import (
    SkillCreate,
    SkillUpdate,
    SkillResponse,
    SkillCategoryCreate,
    SkillCategoryUpdate,
    SkillCategoryResponse,
    SkillCategoryListResponse,
)

router = APIRouter(prefix="/skills", tags=["Skills"])


# Public endpoints - Categories
@router.get("/categories", response_model=list[SkillCategoryListResponse])
def list_skill_categories(
    db: Annotated[Session, Depends(get_db)],
):
    """List all published skill categories with their skills (public endpoint)."""
    categories = (
        db.query(SkillCategory)
        .filter(SkillCategory.is_published == True)
        .order_by(SkillCategory.display_order)
        .all()
    )

    # Filter out unpublished skills from each category
    for category in categories:
        category.skills = [s for s in category.skills if s.is_published]
        category.skills.sort(key=lambda s: s.display_order)

    return categories


@router.get("/categories/{slug}", response_model=SkillCategoryResponse)
def get_skill_category(
    slug: str,
    db: Annotated[Session, Depends(get_db)],
):
    """Get a single skill category by slug (public endpoint)."""
    category = (
        db.query(SkillCategory)
        .filter(SkillCategory.slug == slug, SkillCategory.is_published == True)
        .first()
    )

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill category not found"
        )

    # Filter unpublished skills
    category.skills = [s for s in category.skills if s.is_published]
    category.skills.sort(key=lambda s: s.display_order)

    return category


# Admin endpoints - Categories
@router.get("/admin/categories", response_model=list[SkillCategoryResponse])
def list_all_categories_admin(
    db: Annotated[Session, Depends(get_db)],
    admin: CurrentAdmin,
):
    """List all skill categories including unpublished (admin only)."""
    categories = (
        db.query(SkillCategory)
        .order_by(SkillCategory.display_order)
        .all()
    )
    return categories


@router.post("/categories", response_model=SkillCategoryResponse, status_code=status.HTTP_201_CREATED)
def create_skill_category(
    category_in: SkillCategoryCreate,
    db: Annotated[Session, Depends(get_db)],
    admin: CurrentAdmin,
):
    """Create a new skill category (admin only)."""
    existing = db.query(SkillCategory).filter(SkillCategory.slug == category_in.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A category with this slug already exists"
        )

    category = SkillCategory(**category_in.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)

    return category


@router.patch("/categories/{category_id}", response_model=SkillCategoryResponse)
def update_skill_category(
    category_id: int,
    category_in: SkillCategoryUpdate,
    db: Annotated[Session, Depends(get_db)],
    admin: CurrentAdmin,
):
    """Update a skill category (admin only)."""
    category = db.query(SkillCategory).filter(SkillCategory.id == category_id).first()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill category not found"
        )

    update_data = category_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(category, field, value)

    db.commit()
    db.refresh(category)

    return category


@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill_category(
    category_id: int,
    db: Annotated[Session, Depends(get_db)],
    admin: CurrentAdmin,
):
    """Delete a skill category and all its skills (admin only)."""
    category = db.query(SkillCategory).filter(SkillCategory.id == category_id).first()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill category not found"
        )

    db.delete(category)
    db.commit()


# Admin endpoints - Skills
@router.post("", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
def create_skill(
    skill_in: SkillCreate,
    db: Annotated[Session, Depends(get_db)],
    admin: CurrentAdmin,
):
    """Create a new skill (admin only)."""
    # Verify category exists
    category = db.query(SkillCategory).filter(SkillCategory.id == skill_in.category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill category not found"
        )

    skill = Skill(**skill_in.model_dump())
    db.add(skill)
    db.commit()
    db.refresh(skill)

    return skill


@router.patch("/{skill_id}", response_model=SkillResponse)
def update_skill(
    skill_id: int,
    skill_in: SkillUpdate,
    db: Annotated[Session, Depends(get_db)],
    admin: CurrentAdmin,
):
    """Update a skill (admin only)."""
    skill = db.query(Skill).filter(Skill.id == skill_id).first()

    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found"
        )

    update_data = skill_in.model_dump(exclude_unset=True)

    # If changing category, verify it exists
    if "category_id" in update_data:
        category = db.query(SkillCategory).filter(SkillCategory.id == update_data["category_id"]).first()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Skill category not found"
            )

    for field, value in update_data.items():
        setattr(skill, field, value)

    db.commit()
    db.refresh(skill)

    return skill


@router.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill(
    skill_id: int,
    db: Annotated[Session, Depends(get_db)],
    admin: CurrentAdmin,
):
    """Delete a skill (admin only)."""
    skill = db.query(Skill).filter(Skill.id == skill_id).first()

    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found"
        )

    db.delete(skill)
    db.commit()
