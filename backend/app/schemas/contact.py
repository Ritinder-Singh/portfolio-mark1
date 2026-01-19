from datetime import datetime
from pydantic import BaseModel, EmailStr


class ContactSubmissionBase(BaseModel):
    first_name: str
    last_name: str | None = None
    email: EmailStr
    message: str


class ContactSubmissionCreate(ContactSubmissionBase):
    pass


class ContactSubmissionUpdate(BaseModel):
    is_read: bool | None = None
    is_archived: bool | None = None


class ContactSubmissionResponse(ContactSubmissionBase):
    id: int
    is_read: bool
    is_archived: bool
    ip_address: str | None
    created_at: datetime

    class Config:
        from_attributes = True


class ContactSubmissionPublicResponse(BaseModel):
    success: bool
    message: str
