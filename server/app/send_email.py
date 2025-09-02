import smtplib
import ssl
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import SMTP_SERVER, SMTP_PORT, SMTP_EMAIL, SMTP_PASSWORD, FRONTEND_URL

def send_reset_email(to_email: str, reset_token: str):
    try:
        # Create email
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "Password Reset Request"
        msg["From"] = SMTP_EMAIL
        msg["To"] = to_email

        reset_link = f"{FRONTEND_URL}/reset-password?email={to_email}&token={reset_token}"

        text = f"Hi,\n\nClick the link below to reset your password:\n{reset_link}\n\nThis link will expire in 15 minutes."
        html = f"""
        <html>
          <body>
            <p>Hi,<br>
               Click the link below to reset your password:<br>
               <a href="{reset_link}">Reset Password</a>
            </p>
            <p>This link will expire in 15 minutes.</p>
          </body>
        </html>
        """

        msg.attach(MIMEText(text, "plain"))
        msg.attach(MIMEText(html, "html"))

        # Send email
        context = ssl.create_default_context()
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls(context=context)
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, to_email, msg.as_string())

        return True
    except Exception as e:
        print(f"Email send failed: {e}")
        return False
