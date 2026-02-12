# Email Setup Guide for Taskager

## Gmail Configuration (Recommended)

To send verification emails, you need to set up Gmail App Passwords.

### Step 1: Enable 2-Step Verification

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Scroll to "How you sign in to Google"
4. Click on **2-Step Verification**
5. Follow the prompts to enable 2-Step Verification

### Step 2: Generate App Password

1. After enabling 2-Step Verification, go back to **Security**
2. Scroll to "How you sign in to Google"
3. Click on **App passwords**
4. You might need to sign in again
5. Select app: Choose **Mail**
6. Select device: Choose **Other** and type "Taskager"
7. Click **Generate**
8. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Update .env File

Add the following to your `backend/.env` file:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

**Important:** 
- Use your actual Gmail address for `EMAIL_USER`
- Use the 16-character app password (without spaces) for `EMAIL_PASSWORD`
- DO NOT use your regular Gmail password

### Step 4: Test the Configuration

1. Start your backend server: `cd backend && npm run dev`
2. Register a new user in the frontend
3. Check your email inbox for the verification email

## Alternative Email Services

### Outlook/Hotmail

```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your_email@outlook.com
EMAIL_PASSWORD=your_password
```

### Custom SMTP Server

```env
EMAIL_HOST=smtp.your-domain.com
EMAIL_PORT=587
EMAIL_USER=noreply@your-domain.com
EMAIL_PASSWORD=your_smtp_password
```

## Troubleshooting

### Email not sending?

1. **Check your .env file**: Make sure all email variables are set correctly
2. **Verify App Password**: Make sure you used the app-specific password, not your regular password
3. **Check server logs**: Look for error messages in the terminal
4. **Firewall issues**: Make sure port 587 is not blocked
5. **Less secure apps**: For Gmail, app passwords should work without this setting

### Common Errors

**"Invalid login"** → Check if you're using the app password correctly

**"Connection timeout"** → Check your internet connection and firewall settings

**"535 Authentication failed"** → Wrong email or password

## Security Notes

- Never commit your `.env` file to Git
- Use environment variables in production
- Rotate app passwords periodically
- Use a dedicated email account for sending automated emails

## Production Recommendations

For production, consider using:
- **SendGrid** - Free tier: 100 emails/day
- **Mailgun** - Free tier: 5,000 emails/month
- **AWS SES** - Very cheap, reliable
- **Postmark** - Great deliverability

These services provide better deliverability and more features than Gmail.
