# 🌿 ISIGO: Budget Tracker

A minimalist personal budget planner with a mint-green design. Set your salary, add your bills, and see what to pay first, what's left, and how your budget is trending. Bill reminders arrive on your phone as push notifications, even when the app is closed.

## Features
- **Home page**: continue an existing budget or create a new one. Keep several budgets (for example "October budget", "Side income").
- **Budget setup**: monthly salary or bi-monthly pay (two paydays a month), with your own currency symbol.
- **Bills**: name, amount, due day and category. Sorted so the most urgent bill comes first, with Overdue / Due today / In N days labels. Mark bills paid each month.
- **Quick Spend**: a shortcut page for unplanned expenses such as a spontaneous hangout, food, a gift or an emergency.
- **Dashboard**: status (Healthy, Tight or Critical), a donut chart, category bars, a per-paycheck breakdown for bi-monthly pay, and a weekly/monthly trend line that shows when you had extra or came up short.
- **Savings Tracker**: set a goal with a target amount and time frame (months or years), log what you save, and see completion rings, progress bars and whether you are on track.
- **Tips**: advice that changes with your budget situation.
- **Reminders**: web push notifications at 9:00 AM, N days before a bill is due and on the due day itself.
- **Installable**: works as a Progressive Web App (Android: Install app; iPhone: Add to Home Screen).

## How it works
- The app (`public/`) is plain HTML, CSS and JavaScript. Your budget data stays in your browser's local storage.
- A small Node.js server (`server.js`, Express and `web-push`) stores each device's push subscription and its upcoming reminders, and sends the notifications on time.
- The server only stores the push address and reminder text (bill name, amount, time), never your salary or full budget.

## Run locally
```bash
npm install
npm start        # http://localhost:3000
```

## Deploy
1. Push this repository to GitHub.
2. Create a Web Service on a Node host with HTTPS (Render, Railway, Fly.io). Build command `npm install`, start command `npm start`.
3. Generate keys once with `npm run keys` and set these environment variables:
   - `VAPID_PUBLIC`
   - `VAPID_PRIVATE`
   - `VAPID_SUBJECT` (for example `mailto:you@email.com`)
4. Optional: attach a persistent disk and set `DATA_FILE=/data/data.json` so reminders survive restarts.
5. Free hosting tiers sleep when idle, which delays alerts. Use a paid instance or a keep-alive ping.

## On your phone
- **Android**: open the site in Chrome, choose Install app, then Reminders > Enable notifications.
- **iPhone (iOS 16.4+)**: Safari > Share > Add to Home Screen, open it from the home screen, then Reminders > Enable notifications.
- Use **Send test** on the Reminders page to confirm it works.

## Tech stack
HTML, CSS, vanilla JavaScript, Service Worker and Web Push (VAPID), Node.js, Express.
