# 🛒 Inventory & Sales Management System
### For Convenient Shopkeepers

!![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38BDF8?logo=tailwindcss&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)
---

## 📋 Overview

A full-stack **Inventory and Sales Management System for Convenient Shopkeepers** designed specifically for small convenience store owners and shopkeepers. This application helps manage product stock, track daily sales, visualise revenue trends, and generate downloadable reports — all behind a secure Firebase authentication layer.

**Problem Solved:** Small shop owners typically manage inventory on paper or in simple spreadsheets, leading to stock discrepancies, missed sales data, and no visibility into business trends. This system provides a digitised, centralised alternative that is accessible from any browser.

---

## ✨ Features

- 🔐 **Secure Authentication** — Firebase Email/Password login with protected routes
- 📦 **Stock Management** — Add, update, and monitor product inventory in real time
- 💰 **Daily Sales Recording** — Log individual sales transactions with product and quantity
- 📊 **Sales History** — Browse all past transactions with date filtering
- 📈 **Dashboard Analytics** — Visual charts showing revenue trends and top products (Chart.js)
- 📄 **PDF Report Generation** — Download sales/inventory summaries as PDF (ReportLab)
- 📊 **Excel Export** — Export data to `.xlsx` format (OpenPyXL)
- ⚙️ **Settings** — Application and user configuration

---

## 🧱 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Utility-first styling |
| **Chart.js** | Data visualisation |
| **React Router** | Client-side routing |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Flask 3.1** | Python web framework |
| **SQLAlchemy** | ORM for database access |
| **Flask-CORS** | Cross-origin request handling |
| **psycopg2** | PostgreSQL adapter |

### Database
| Technology | Purpose |
|-----------|---------|
| **PostgreSQL** | Primary relational database |

### Authentication
| Technology | Purpose |
|-----------|---------|
| **Firebase Authentication** | Email/password auth with JWT tokens |
| **Firebase Admin SDK** | Backend token verification |

### Reporting
| Technology | Purpose |
|-----------|---------|
| **ReportLab** | PDF generation |
| **OpenPyXL** | Excel `.xlsx` export |
| **Pillow** | Image processing for reports |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│  React + Vite + Tailwind + Chart.js + React Router          │
│  Auth state managed via Firebase SDK (AuthContext.jsx)      │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP (axios / fetch)
                           │ Authorization: Bearer <Firebase ID Token>
┌──────────────────────────▼──────────────────────────────────┐
│                   Flask REST API                             │
│  All routes protected by Firebase token verification        │
│  SQLAlchemy ORM ↔ PostgreSQL                                │
│  ReportLab / OpenPyXL for report generation                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
              ┌────────────┴──────────────┐
              │                           │
┌─────────────▼──────┐         ┌─────────▼──────────┐
│    PostgreSQL DB   │         │   Firebase Auth     │
│ Products / Sales   │         │ Identity Provider   │
└────────────────────┘         └────────────────────┘
```

**Authentication Flow:**
1. User logs in via `Login.jsx` → Firebase returns ID token
2. React stores token; every API call sends `Authorization: Bearer <token>`
3. Flask middleware verifies token with Firebase Admin SDK on every request
4. Authorised requests proceed to SQLAlchemy → PostgreSQL

---

## 📡 API Routes

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| `POST` | `/api/auth/verify` | Verify Firebase token and create session | No |
| `GET` | `/api/stocks` | List all products with current quantities | ✅ |
| `POST` | `/api/stocks` | Add a new product to inventory | ✅ |
| `PUT` | `/api/stocks/<id>` | Update product details or quantity | ✅ |
| `DELETE` | `/api/stocks/<id>` | Remove a product from inventory | ✅ |
| `GET` | `/api/sales` | List all sales with optional date filter | ✅ |
| `POST` | `/api/sales` | Record a new sale transaction | ✅ |
| `GET` | `/api/sales/daily` | Get today's sales summary | ✅ |
| `GET` | `/api/reports/pdf` | Generate and download PDF report | ✅ |
| `GET` | `/api/reports/excel` | Generate and download Excel export | ✅ |
| `GET` | `/api/dashboard` | Aggregated stats for dashboard charts | ✅ |

**Example Request — Add Stock:**
```http
POST /api/stocks
Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6...
Content-Type: application/json

{
  "product_name": "Parle-G Biscuits",
  "category": "Snacks",
  "quantity": 50,
  "price": 10.00,
  "reorder_level": 10
}
```

**Example Response:**
```json
{
  "id": 42,
  "product_name": "Parle-G Biscuits",
  "category": "Snacks",
  "quantity": 50,
  "price": 10.00,
  "reorder_level": 10,
  "created_at": "2026-06-19T10:30:00Z"
}
```

---

## ⚙️ Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- Firebase project with Authentication enabled

---

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/inventory-sales-system.git
cd inventory-sales-system
```

---

### 2. Backend Setup (Flask)
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate — Windows
venv\Scripts\activate
# Activate — macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables (see Environment Variables section below)
cp .env.example .env
# Edit .env with your actual values
```

---

### 3. Frontend Setup (React + Vite)
```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your Firebase config values
```

---

### 4. PostgreSQL Setup
```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database and user
CREATE DATABASE shopdb;
CREATE USER shopkeeper WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE shopdb TO shopkeeper;
\q
```

Run database migrations (from `backend/`):
```bash
flask db init
flask db migrate -m "initial"
flask db upgrade
```

---

### 5. Firebase Authentication Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Enable **Authentication → Sign-in method → Email/Password**
4. Go to **Project Settings → General** — copy Web App config to `frontend/.env`
5. Go to **Project Settings → Service Accounts** → Generate new private key → save as `backend/serviceAccountKey.json`
6. Add `backend/serviceAccountKey.json` to `.gitignore` (**never commit this file**)

---

### 6. Running the Application

**Backend (Flask):**
```bash
cd backend
source venv/bin/activate
flask run --port 5000
```

**Frontend (Vite):**
```bash
cd frontend
npm run dev
```

Open: http://localhost:5173

---

## 🔐 Environment Variables

### Backend — `backend/.env`
```env
# Database
DATABASE_URL=postgresql://shopkeeper:your_password@localhost/shopdb

# Flask
SECRET_KEY=your-very-long-random-secret-key-at-least-32-chars
FLASK_ENV=development

# Firebase (path to downloaded service account key)
FIREBASE_SERVICE_ACCOUNT_KEY_PATH=serviceAccountKey.json

# CORS — comma-separated allowed origins
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend — `frontend/.env`
```env
# Firebase Web App Configuration
# Get these from: Firebase Console → Project Settings → General → Your Apps
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Backend API URL
VITE_API_BASE_URL=http://localhost:5000
```

---

## 🖥️ Usage Guide

### Login
1. Navigate to `http://localhost:5173`
2. Enter your registered email and password
3. Click **Login** — you will be redirected to the Dashboard

### Add Stock
1. Go to **Stocks** in the navigation
2. Click **Add Product**
3. Fill in product name, category, quantity, price, and reorder level
4. Click **Save**

### Update Stock
1. In the Stocks table, click **Edit** on any row
2. Modify the quantity or other fields
3. Click **Update**

### Record a Sale
1. Go to **Daily Sales**
2. Select a product from the dropdown
3. Enter the quantity sold
4. Click **Record Sale** — stock is automatically decremented

### View Sales History
1. Go to **Sales History**
2. Use the date picker to filter by date range
3. View all transactions with totals

### Generate Reports
1. Go to **Reports**
2. Select report type (Inventory / Sales Summary / Date Range)
3. Click **Export PDF** or **Export Excel**
4. The file downloads automatically

---

## 🔒 Security Notes

> **⚠️ Important for deployment and contributors:**

- **Never commit `.env` files** — they contain database passwords and API keys
- **Never commit `serviceAccountKey.json`** — this grants admin access to your Firebase project
- **Rotate keys immediately** if you accidentally push them to a public repository
- **Enable HTTPS** in production — serve Flask behind nginx/gunicorn with SSL certificates
- **Restrict Firebase Auth** in the Firebase Console to only allow sign-in from your production domain
- **Set Firebase Firestore Security Rules** to require authentication
- Review `backend/requirements.txt` regularly with `pip-audit` to catch vulnerabilities

---

## 🔮 Future Enhancements

- [ ] **Multi-user / Role-based access** — Owner vs. Staff roles with different permissions
- [ ] **Barcode scanner integration** — scan products instead of typing names
- [ ] **Low stock alerts** — email/SMS notifications when quantity drops below reorder level
- [ ] **Supplier management** — track vendors and purchase orders
- [ ] **Mobile-responsive PWA** — offline support for recording sales without internet
- [ ] **Unit tests** — pytest for backend, Vitest for frontend
- [ ] **Docker support** — `docker-compose.yml` for one-command setup
- [ ] **Deploy to Railway / Render** — free tier cloud deployment guide
- [ ] **Data backup** — scheduled PostgreSQL backups to cloud storage
- [ ] **Multi-branch support** — manage inventory across multiple shop locations

---

## 👤 Author

**Harsha Vardhan S**  
Full Stack Developer

- GitHub: [@harshavardhan21-dev](https://github.com/harshavardhan21-dev)
- LinkedIn: [Harsha Vardhan S](https://www.linkedin.com/in/harsha-vardhan-s-7019212b8)
- Email: harshavardhan21.dev@gmail.com

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

*Built with ❤️ for small business owners who deserve modern tools.*
