# EHS ERP - Quick Start Commands

## 🚀 First Time Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
```bash
# Copy environment template
cp .env.example .env.local

# Then edit .env.local with your Supabase credentials
```

### 3. Supabase Setup
Follow the guide in `supabase/SETUP_GUIDE.md`

---

## 🔧 Development Commands

### Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Lint Code
```bash
npm run lint
```

---

## 📁 Project Structure

```
ehs-erp/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth pages (login, register, forgot-password)
│   │   ├── (dashboard)/        # Protected dashboard pages
│   │   └── (landing)/          # Public landing page
│   ├── components/             # Reusable UI components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities and configurations
│   ├── server/                 # Server actions and queries
│   └── types/                  # TypeScript type definitions
├── supabase/
│   ├── migrations/             # Database schema SQL files
│   └── seeds/                  # Seed data SQL files
└── public/                     # Static assets
```

---

## 🔑 Default Admin Credentials

After running the seed scripts:

- **Email**: `admin@ehs.edu.pk`
- **Password**: `Admin@123456`

⚠️ **Change the password immediately after first login!**

---

## 🛠️ Useful URLs

| Page | URL |
|------|-----|
| Landing Page | http://localhost:3000 |
| Login | http://localhost:3000/login |
| Dashboard | http://localhost:3000/dashboard |
| Forgot Password | http://localhost:3000/forgot-password |

---

## 📖 Next Steps After Setup

1. ✅ Create Supabase project
2. ✅ Configure environment variables
3. ✅ Run database migrations
4. ✅ Create admin user
5. 🔄 Build dashboard layout
6. 🔄 Build Sessions management
7. 🔄 Build Classes & Sections
8. 🔄 Build Students management
9. 🔄 Build Fee management
