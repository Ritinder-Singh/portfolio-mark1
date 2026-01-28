import logging
from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import CurrentAdmin
from app.core.email import send_contact_notification
from app.models.contact import ContactSubmission
from app.schemas.contact import (
    ContactSubmissionCreate,
    ContactSubmissionUpdate,
    ContactSubmissionResponse,
    ContactSubmissionPublicResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/contact", tags=["Contact"])


# Public endpoint
@router.post("", response_model=ContactSubmissionPublicResponse, status_code=status.HTTP_201_CREATED)
async def submit_contact_form(
    submission_in: ContactSubmissionCreate,
    request: Request,
    background_tasks: BackgroundTasks,
    db: Annotated[Session, Depends(get_db)],
):
    """Submit a contact form (public endpoint)."""
    # Get client info
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent", "")[:500]

    submission = ContactSubmission(
        first_name=submission_in.first_name,
        last_name=submission_in.last_name,
        email=submission_in.email,
        message=submission_in.message,
        ip_address=client_ip,
        user_agent=user_agent,
    )

    db.add(submission)
    db.commit()

    # Send email notification in background
    background_tasks.add_task(
        send_contact_notification,
        first_name=submission_in.first_name,
        last_name=submission_in.last_name,
        email=submission_in.email,
        message=submission_in.message,
    )
    logger.info(f"Contact form submitted by {submission_in.email}, notification queued")

    return ContactSubmissionPublicResponse(
        success=True,
        message="Thank you for your message. I'll get back to you soon!"
    )


# Admin endpoints
@router.get("", response_model=list[ContactSubmissionResponse])
def list_contact_submissions(
    db: Annotated[Session, Depends(get_db)],
    admin: CurrentAdmin,
    is_read: bool | None = Query(None, description="Filter by read status"),
    is_archived: bool | None = Query(None, description="Filter by archived status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
):
    """List all contact submissions (admin only)."""
    query = db.query(ContactSubmission)

    if is_read is not None:
        query = query.filter(ContactSubmission.is_read == is_read)

    if is_archived is not None:
        query = query.filter(ContactSubmission.is_archived == is_archived)

    submissions = (
        query.order_by(ContactSubmission.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return submissions


@router.get("/stats")
def get_contact_stats(
    db: Annotated[Session, Depends(get_db)],
    admin: CurrentAdmin,
):
    """Get contact submission statistics (admin only)."""
    total = db.query(ContactSubmission).count()
    unread = db.query(ContactSubmission).filter(ContactSubmission.is_read == False).count()
    archived = db.query(ContactSubmission).filter(ContactSubmission.is_archived == True).count()

    return {
        "total": total,
        "unread": unread,
        "archived": archived,
    }


@router.get("/{submission_id}", response_model=ContactSubmissionResponse)
def get_contact_submission(
    submission_id: int,
    db: Annotated[Session, Depends(get_db)],
    admin: CurrentAdmin,
):
    """Get a single contact submission (admin only)."""
    submission = db.query(ContactSubmission).filter(ContactSubmission.id == submission_id).first()

    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact submission not found"
        )

    return submission


@router.patch("/{submission_id}", response_model=ContactSubmissionResponse)
def update_contact_submission(
    submission_id: int,
    submission_in: ContactSubmissionUpdate,
    db: Annotated[Session, Depends(get_db)],
    admin: CurrentAdmin,
):
    """Update a contact submission (mark as read/archived) (admin only)."""
    submission = db.query(ContactSubmission).filter(ContactSubmission.id == submission_id).first()

    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact submission not found"
        )

    update_data = submission_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(submission, field, value)

    db.commit()
    db.refresh(submission)

    return submission


@router.delete("/{submission_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact_submission(
    submission_id: int,
    db: Annotated[Session, Depends(get_db)],
    admin: CurrentAdmin,
):
    """Delete a contact submission (admin only)."""
    submission = db.query(ContactSubmission).filter(ContactSubmission.id == submission_id).first()

    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact submission not found"
        )

    db.delete(submission)
    db.commit()


@router.post("/mark-all-read", status_code=status.HTTP_200_OK)
def mark_all_as_read(
    db: Annotated[Session, Depends(get_db)],
    admin: CurrentAdmin,
):
    """Mark all contact submissions as read (admin only)."""
    db.query(ContactSubmission).filter(ContactSubmission.is_read == False).update(
        {"is_read": True}
    )
    db.commit()

    return {"message": "All submissions marked as read"}
