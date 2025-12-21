# Google OAuth Setup Guide

## Problem 1: Supabase URL Showing in Google Consent Screen

When users sign in with Google, they see "rwcyogbyxmwulmivgcgh.supabase.co" instead of your app name.

### Solution:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com
   - Select your project (or create one)

2. **Configure OAuth Consent Screen**
   - Navigate to: APIs & Services → OAuth consent screen
   - Click "Edit App"
   
3. **Update App Information**
   - **App name**: `Classroom` (or your preferred name)
   - **User support email**: Your email
   - **App logo**: Upload your app logo (optional)
   - **Application home page**: `https://your-app-name.vercel.app`
   - **Application privacy policy link**: `https://your-app-name.vercel.app/privacy` (create this page)
   - **Application terms of service link**: `https://your-app-name.vercel.app/terms` (create this page)
   - **Authorized domains**: Add `vercel.app` and your custom domain if you have one
   - **Developer contact information**: Your email

4. **Save Changes**
   - Click "Save and Continue"
   - Complete the scopes section (basic profile and email should already be there)
   - Save and return to dashboard

Now users will see your app name "Classroom" instead of the Supabase URL!

---

## Problem 2: OAuth Redirecting to Localhost Instead of Production

After signing in with Google, users are redirected to `http://localhost:3000` instead of your production URL.

### Solution:

#### Step 1: Update Environment Variables

In your `.env.local` file, add your production URL:

```env
NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app
```

**Replace `your-app-name.vercel.app` with your actual Vercel URL!**

#### Step 2: Add to Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add the following variable:
   - **Name**: `NEXT_PUBLIC_SITE_URL`
   - **Value**: `https://your-app-name.vercel.app` (your actual Vercel URL)
   - **Environments**: Production, Preview, Development (select all)
4. Click "Save"

#### Step 3: Redeploy Your App

After adding the environment variable in Vercel:
- Go to "Deployments" tab
- Click the three dots next to the latest deployment
- Click "Redeploy"

Or simply push a new commit to trigger a deployment.

---

## Step 4: Update Supabase OAuth Settings

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Update Redirect URLs**
   - Navigate to: Authentication → URL Configuration
   - Under "Redirect URLs", add:
     - `https://your-app-name.vercel.app/auth/callback` (production)
     - `http://localhost:3000/auth/callback` (development)
   - Click "Save"

3. **Site URL**
   - Set "Site URL" to: `https://your-app-name.vercel.app`
   - Click "Save"

---

## Step 5: Update Google OAuth Redirect URIs

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com
   - Select your project

2. **Update OAuth 2.0 Client**
   - Navigate to: APIs & Services → Credentials
   - Click on your OAuth 2.0 Client ID
   
3. **Add Authorized Redirect URIs**
   - Make sure you have:
     - `https://rwcyogbyxmwulmivgcgh.supabase.co/auth/v1/callback` (Supabase callback)
     - `https://your-app-name.vercel.app/auth/callback` (your app callback - optional)
   - Click "Save"

---

## Testing

### Local Development
1. Set `NEXT_PUBLIC_SITE_URL=http://localhost:3000` in `.env.local`
2. Make sure Supabase redirect URLs include `http://localhost:3000/auth/callback`
3. Test Google login

### Production
1. Set `NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app` in Vercel environment variables
2. Make sure Supabase redirect URLs include `https://your-app-name.vercel.app/auth/callback`
3. Deploy and test Google login

---

## Complete Checklist

- [ ] Google Cloud Console: Set app name to "Classroom"
- [ ] Google Cloud Console: Update OAuth consent screen with app info
- [ ] Google Cloud Console: Add authorized domains (vercel.app)
- [ ] Google Cloud Console: Update redirect URIs to include Supabase callback
- [ ] Local `.env.local`: Add `NEXT_PUBLIC_SITE_URL` with your production URL
- [ ] Vercel: Add `NEXT_PUBLIC_SITE_URL` environment variable
- [ ] Vercel: Redeploy the app
- [ ] Supabase: Add production callback URL to redirect URLs
- [ ] Supabase: Set Site URL to production URL
- [ ] Test login with Google on production

---

## Common Issues

### Issue: Still redirecting to localhost
**Solution**: Make sure `NEXT_PUBLIC_SITE_URL` is set in Vercel environment variables and you've redeployed.

### Issue: "redirect_uri_mismatch" error
**Solution**: Check that the Supabase callback URL is added to Google OAuth authorized redirect URIs:
`https://rwcyogbyxmwulmivgcgh.supabase.co/auth/v1/callback`

### Issue: Users see Supabase URL in consent screen
**Solution**: Update the OAuth consent screen app name in Google Cloud Console.

---

## Quick Fix Summary

1. **Add to `.env.local`**: `NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app`
2. **Add to Vercel**: Environment variable `NEXT_PUBLIC_SITE_URL`
3. **Redeploy app** on Vercel
4. **Update Google Cloud Console**: Set app name to "Classroom"
5. **Update Supabase**: Add production callback URL

Done! 🎉
