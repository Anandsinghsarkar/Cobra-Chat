# COBRA Social Chat — Full Project

## Included
- Email/password signup + login
- Google login
- Forgot password by email
- Editable profile: name, unique username, profile image, bio, gender/privacy
- Firebase Storage gallery image upload
- Public user profiles
- World chat; profile opens from chat
- One-to-one private messages
- Verification badge controlled by admin
- XP, Level and ranks: Bronze, Silver, Gold, Platinum, Diamond, Master, Elite, Legend, Cobra
- Progressive rank profile-card styling; Level 100 unlocks Cobra Mode styling
- 10 normal chat themes and 20 total Premium themes
- Normal daily claim 50 XP
- Premium ₹49 / 30 days, 200 XP/day claim
- UPI QR generated from environment settings
- User UTR submission
- Admin manual payment approve/reject
- Protected admin page, all users, add XP, verify/unverify, rank override, ban/unban
- Audit log storage for admin actions

## Firebase setup
1. Firebase Console -> Project Settings -> General -> add/open a Web App.
2. Copy Firebase Web config values to Vercel Environment Variables using `.env.example` names.
3. Authentication -> Sign-in method: enable **Email/Password** and **Google**.
4. Build -> Realtime Database: create a database.
5. Build -> Storage: create a bucket.
6. Realtime Database -> Rules: paste `database.rules.json`.
7. Storage -> Rules: paste `storage.rules`.
8. Authentication -> Settings -> Authorized domains: add your `your-project.vercel.app` domain.

## Service Account JSON
Firebase Console -> Project Settings -> Service Accounts -> Firebase Admin SDK -> Generate new private key.
Put the complete JSON on ONE LINE in Vercel as `FIREBASE_SERVICE_ACCOUNT_JSON`.
Never upload this JSON to GitHub and never use `NEXT_PUBLIC_` for it.

## Vercel admin credentials
Set these only in Vercel -> Project -> Settings -> Environment Variables:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET` (long random secret)

Admin page: `/admin/login`

## Payment QR / Premium
Set:
- `UPI_ID=yourupi@bank`
- `UPI_NAME=Your Name`
- `PREMIUM_PRICE_INR=49`
- `PREMIUM_DAYS=30`
- `PREMIUM_DAILY_XP=200`
- `NORMAL_DAILY_XP=50`

Flow: Premium page -> UPI QR -> user pays -> submits UTR -> `/admin/payments` -> admin checks bank/payment provider -> Approve/Reject. Approval activates 30 days Premium. A submitted UTR alone is NOT proof of payment; verify it before approval.

## Rank XP ranges
- Bronze L1–10: 0–49,999 XP
- Silver L11–20: 50,000–119,999
- Gold L21–35: 120,000–249,999
- Platinum L36–50: 250,000–399,999
- Diamond L51–65: 400,000–579,999
- Master L66–80: 580,000–749,999
- Elite L81–90: 750,000–849,999
- Legend L91–99: 850,000–999,999
- Cobra L100: 1,000,000+

## Deploy
Upload the CONTENTS of this folder to the repository root, not only `app/`.
Vercel Framework Preset: Next.js. Root Directory: repository root/blank. Build Command: `npm run build`.
