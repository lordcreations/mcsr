# 🌍 Minecraft Ranked Leaderboard

A modern, responsive web leaderboard for Minecraft players featuring:

* 🏆 Player Elo Rankings
* 🗺️ Country Flags
* 🔒 Microsoft OAuth Authentication
* 🌓 Light/Dark Theme Support
* 📱 Fully Responsive for Mobile and Desktop

---

## ✨ Features

* Fetches real-time player data from the [MCSR Ranked API](https://mcsrranked.com/)
* Players sorted by Elo ranking
* Player dialog modal with additional info and tabs
* Country flag display next to usernames
* Microsoft OAuth login with secure token handling
* Customizable UI with Tailwind CSS
* Dark/light theme toggle
* Client-side only Minecraft profile requests

---

## 🧱 Tech Stack

| Layer      | Technology                |
| ---------- | ------------------------- |
| Framework  | Next.js (App Router)      |
| Styling    | Tailwind CSS              |
| Auth       | Microsoft Azure OAuth 2.0 |
| API Data   | MCSR Ranked API           |
| Hosting    | Vercel                    |
| State Mgmt | React Hooks               |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/lordcreations/mcsr.git
cd mcsr
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file:

```env
MICROSOFT_CLIENT_SECRET=
NEXT_PUBLIC_MICROSOFT_CLIENT_ID=
NEXT_PUBLIC_APP_URL=
DATABASE_URL=
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Authentication Flow

```text
Browser ----> [Your App] ----> Microsoft OAuth
                        <-- Access & Refresh Tokens
```

* Tokens are stored securely in HTTP-only cookies.
* Redirect URI must match Azure configuration.

---

## 🗂 Project Structure

```
root/
├── app/
│   ├── page.tsx              # Main leaderboard
│   └── api/auth/             # Auth callback + logout
├── components/
│   ├── Navbar.tsx            # Top nav bar
│   ├── PlayerDialog.tsx      # Player modal
├── lib/
│   └── countries.ts          # Country data
├── public/
│   └── flags/                # Country flag SVGs
├── styles/
│   └── globals.css           # Tailwind base styles
└── .env.local                # Local environment variables
```

---

## ☁️ Deployment

1. Push to GitHub
2. Connect repo to [Vercel](https://vercel.com/)
3. Add environment variables in the Vercel dashboard

No additional setup is needed for deployment.

---

## ❓ FAQ

**Q: Why does authentication fail only on Vercel?**
Make sure the callback URL is correctly set in Azure and `NEXT_PUBLIC_APP_URL`.

**Q: Can I use a different API instead of MCSR?**
Yes, replace the API fetch logic in the `page.tsx` file.

---

## 📄 License

MIT License. Use, modify, and distribute freely.
