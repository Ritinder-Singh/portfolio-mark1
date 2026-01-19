from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import CurrentAdmin
from app.models.project import Project
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    ProjectListResponse,
)

router = APIRouter(prefix="/projects", tags=["Projects"])


# Public endpoints
@router.get("", response_model=list[ProjectListResponse])
def list_projects(
    db: Annotated[Session, Depends(get_db)],
    technology: str | None = Query(None, description="Filter by technology"),
    featured: bool | None = Query(None, description="Filter by featured status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
):
    """List all published projects (public endpoint)."""
    query = db.query(Project).filter(Project.is_published == True)

    if technology:
        query = query.filter(Project.technologies.contains([technology]))

    if featured is not None:
        query = query.filter(Project.is_featured == featured)

    projects = (
        query.order_by(Project.display_order, Project.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return projects


@router.get("/{slug}", response_model=ProjectResponse)
def get_project(
    slug: str,
    db: Annotated[Session, Depends(get_db)],
    preview: bool = Query(False, description="Include unpublished (requires auth)"),
):
    """Get a single project by slug (public endpoint)."""
    query = db.query(Project).filter(Project.slug == slug)

    if not preview:
        query = query.filter(Project.is_published == True)

    project = query.first()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    return project


# Admin endpoints
@router.get("/admin/all", response_model=list[ProjectResponse])
def list_all_projects_admin(
    db: Annotated[Session, Depends(get_db)],
    admin: CurrentAdmin,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
):
    """List all projects including unpublished (admin only)."""
    projects = (
        db.query(Project)
        .order_by(Project.display_order, Project.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return projects


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: ProjectCreate,
    db: Annotated[Session, Depends(get_db)],
    admin: CurrentAdmin,
):
    """Create a new project (admin only)."""
    # Check for duplicate slug
    existing = db.query(Project).filter(Project.slug == project_in.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A project with this slug already exists"
        )

    project = Project(
        title=project_in.title,
        slug=project_in.slug,
        description=project_in.description,
        long_description=project_in.long_description,
        technologies=project_in.technologies,
        images=[img.model_dump() for img in project_in.images],
        github_url=project_in.github_url,
        live_url=project_in.live_url,
        is_featured=project_in.is_featured,
        is_published=project_in.is_published,
        display_order=project_in.display_order,
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return project


@router.patch("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project_in: ProjectUpdate,
    db: Annotated[Session, Depends(get_db)],
    admin: CurrentAdmin,
):
    """Update a project (admin only)."""
    project = db.query(Project).filter(Project.id == project_id).first()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    update_data = project_in.model_dump(exclude_unset=True)

    # Handle images separately if provided
    if "images" in update_data and update_data["images"] is not None:
        update_data["images"] = [img.model_dump() if hasattr(img, 'model_dump') else img for img in update_data["images"]]

    for field, value in update_data.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)

    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    db: Annotated[Session, Depends(get_db)],
    admin: CurrentAdmin,
):
    """Delete a project (admin only)."""
    project = db.query(Project).filter(Project.id == project_id).first()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    db.delete(project)
    db.commit()


@router.post("/{project_id}/reorder", response_model=ProjectResponse)
def reorder_project(
    project_id: int,
    new_order: int,
    db: Annotated[Session, Depends(get_db)],
    admin: CurrentAdmin,
):
    """Change the display order of a project (admin only)."""
    project = db.query(Project).filter(Project.id == project_id).first()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    project.display_order = new_order
    db.commit()
    db.refresh(project)

    return project
