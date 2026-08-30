# COBRA Social Chat

Firebase + Next.js social chat project for Vercel.

## Main features
- Email/password + Google authentication
- Email password reset and password change
- Editable profile + gallery profile image
- World chat and private messaging
- Live online/offline + last seen
- Edit message, unsend message, permanent delete message
- Delete private chat from your own view
- Public profiles accessible from World Chat
- XP / Level / Bronze to Cobra rank system
- Rank-specific evolving profile cards; Level 100 has COBRA MODE
- 10 normal themes, 20 Premium themes; theme changes the complete app background and chat accents
- Instagram-style fixed bottom icon navigation: World, People, Premium, Settings, Logout
- Admin panel: all users, verification, XP, rank override, ban/unban
- UPI QR + UTR manual approval system
- 10 Premium plans

## Premium plans
| Plan | Price | Days | Daily XP |
|---|---:|---:|---:|
| Starter | ₹49 | 30 | 200 |
| Bronze+ | ₹99 | 30 | 500 |
| Silver+ | ₹180 | 30 | 1,000 |
| Gold+ | ₹299 | 30 | 1,300 |
| Platinum+ | ₹449 | 30 | 1,600 |
| Diamond+ | ₹699 | 30 | 2,000 |
| Master+ | ₹999 | 30 | 2,500 |
| Elite+ | ₹1,499 | 30 | 3,000 |
| Legend+ | ₹1,999 | 30 | 4,000 |
| Cobra+ | ₹2,999 | 30 | 5,000 |

All Premium plans unlock 20 themes, Premium card effects and Premium badge. The selected plan's daily XP is used for the 24-hour claim.

## Firebase
Enable Authentication (Email/Password + Google), Realtime Database and Storage. Paste `database.rules.json` and `storage.rules` into Firebase console.

## Vercel environment variables
Set Firebase public config, `FIREBASE_SERVICE_ACCOUNT_JSON`, `FIREBASE_DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `UPI_ID`, `UPI_NAME`, and `NORMAL_DAILY_XP=50`.

Do not upload real service-account JSON or admin passwords to GitHub.

## Payment safety
A UTR entered by a user is not proof of payment. Before clicking Approve, verify the transaction and exact amount in the merchant/bank/payment account you control.
