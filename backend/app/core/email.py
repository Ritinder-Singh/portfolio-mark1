"""Email service for sending notifications."""

import asyncio
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

import aiosmtplib

from app.core.config import settings

logger = logging.getLogger(__name__)


async def send_email(
    to_email: str,
    subject: str,
    body_html: str,
    body_text: str | None = None,
) -> bool:
    """
    Send an email asynchronously.

    Args:
        to_email: Recipient email address
        subject: Email subject
        body_html: HTML body content
        body_text: Plain text body (optional, will strip HTML if not provided)

    Returns:
        True if email was sent successfully, False otherwise
    """
    if not all([settings.SMTP_HOST, settings.SMTP_USER, settings.smtp_password]):
        logger.warning("Email not configured. Skipping email send.")
        return False

    try:
        message = MIMEMultipart("alternative")
        message["From"] = settings.EMAIL_FROM or settings.SMTP_USER
        message["To"] = to_email
        message["Subject"] = subject

        # Plain text version
        if body_text:
            message.attach(MIMEText(body_text, "plain"))

        # HTML version
        message.attach(MIMEText(body_html, "html"))

        await aiosmtplib.send(
            message,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER,
            password=settings.smtp_password,
            start_tls=True,
        )

        logger.info(f"Email sent successfully to {to_email}")
        return True

    except Exception as e:
        logger.error(f"Failed to send email: {e}")
        return False


async def send_contact_notification(
    first_name: str,
    last_name: str | None,
    email: str,
    message: str,
) -> bool:
    """
    Send notification email when someone submits the contact form.

    Args:
        first_name: Sender's first name
        last_name: Sender's last name (optional)
        email: Sender's email address
        message: Contact form message

    Returns:
        True if notification was sent successfully
    """
    if not settings.NOTIFICATION_EMAIL:
        logger.warning("NOTIFICATION_EMAIL not configured. Skipping notification.")
        return False

    full_name = f"{first_name} {last_name}".strip() if last_name else first_name

    subject = f"New Contact Form Submission from {full_name}"

    body_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: #0f172a; color: white; padding: 20px; border-radius: 8px 8px 0 0; }}
            .content {{ background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }}
            .field {{ margin-bottom: 15px; }}
            .label {{ font-weight: bold; color: #64748b; font-size: 12px; text-transform: uppercase; }}
            .value {{ margin-top: 5px; padding: 10px; background: white; border-radius: 4px; }}
            .message {{ white-space: pre-wrap; }}
            .footer {{ padding: 15px; text-align: center; color: #64748b; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2 style="margin: 0;">New Contact Form Submission</h2>
            </div>
            <div class="content">
                <div class="field">
                    <div class="label">Name</div>
                    <div class="value">{full_name}</div>
                </div>
                <div class="field">
                    <div class="label">Email</div>
                    <div class="value"><a href="mailto:{email}">{email}</a></div>
                </div>
                <div class="field">
                    <div class="label">Message</div>
                    <div class="value message">{message}</div>
                </div>
            </div>
            <div class="footer">
                This email was sent from your portfolio contact form.
            </div>
        </div>
    </body>
    </html>
    """

    body_text = f"""
New Contact Form Submission

Name: {full_name}
Email: {email}

Message:
{message}

---
This email was sent from your portfolio contact form.
    """

    return await send_email(
        to_email=settings.NOTIFICATION_EMAIL,
        subject=subject,
        body_html=body_html,
        body_text=body_text,
    )


def send_contact_notification_sync(
    first_name: str,
    last_name: str | None,
    email: str,
    message: str,
) -> bool:
    """Synchronous wrapper for send_contact_notification."""
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

    return loop.run_until_complete(
        send_contact_notification(first_name, last_name, email, message)
    )
