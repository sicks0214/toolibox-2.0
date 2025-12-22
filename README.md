# TooliBox 3.0 - Free Tools in one box

TooliBox is a free online tool aggregation platform providing 30+ tools for text processing, file conversion, image editing, and more.

## 🚀 Features

- **5 Categories**: Text Tools, File Tools, Image Tools, Generate Tools, Developer Tools
- **Microservices Architecture**: Independent frontend services for each tool category
- **Backend API Processing**: All PDF/Image/Text processing handled securely on the server
- **Multilingual**: English and Chinese support with easy language switching
- **Feedback System**: Complete feedback submission with PostgreSQL storage and Cloudflare R2 backup
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **No Sign-up Required**: All tools are free to use without registration

## 📦 Project Structure (v3.0)

```
toolibox/
├── frontend/
│   ├── main/              # Main navigation hub (port 3000)
│   └── pdf-tools/         # PDF tools microservice (port 3001)
│
├── backend/               # Unified backend API (port 8000)
│   ├── src/
│   │   ├── routes/        # API routes (auth, feedback, pdf, etc.)
│   │   ├── controllers/   # Request handlers (pdfController, etc.)
│   │   ├── middleware/    # Express middleware (upload, auth, cors)
│   │   └── services/      # Business logic (R2 backup, etc.)
│   └── prisma/            # Database schema
│
├── nginx/                 # Nginx reverse proxy configuration
├── docker-compose.yml     # Container orchestration
└── docs/                  # Documentation
    ├── Toolibox Main.md
    └── Toolibox_3.0_VPS.md
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Internationalization**: next-intl
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **File Upload**: Multer
- **PDF Processing**: pdf-lib
- **Storage**: Cloudflare R2
- **Scheduler**: node-cron

## 🎯 Implemented Features

### ✅ Completed
- Main navigation and landing pages
- User authentication (JWT-based)
- Feedback system with R2 backup
- **PDF Merge** (backend API processing)
- **PDF Split** (backend API processing)
- **PDF Compress** (backend API processing)
- AI-powered text simplification (DeepSeek)

### ⏳ Coming Soon
- Image tools (compress, resize, convert)
- Text tools (case converter, word counter)
- And 20+ more tools...

## 🚦 Getting Started (Local Development)

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm or yarn

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd toolibox
```

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env to set NEXT_PUBLIC_API_URL
npm run dev
```

The frontend will run on `http://localhost:3000`

### 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env to configure database and R2 credentials
```

Configure your `.env` file:

```env
DATABASE_URL="postgresql://toolibox_user:your_password@localhost:5432/toolibox"
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=toolibox-feedback
PORT=8000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 4. Database Setup

```bash
# Create PostgreSQL database
sudo -u postgres psql
CREATE DATABASE toolibox;
CREATE USER toolibox_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE toolibox TO toolibox_user;
\q

# Run Prisma migrations
cd backend
npx prisma migrate dev
npx prisma generate
```

### 5. Start Backend Server

```bash
cd backend
npm run dev
```

The backend API will run on `http://localhost:8000`

### 6. Access the Application

Open your browser and navigate to:
- Frontend: `http://localhost:3000`
- API Health Check: `http://localhost:8000/api/health`

## 📝 Available Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Backend

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create and apply migrations

## 🌐 Deployment

### VPS Deployment

1. **Install Dependencies**

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install Nginx
sudo apt install nginx
```

2. **Setup Database**

```bash
sudo -u postgres psql
CREATE DATABASE toolibox;
CREATE USER toolibox_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE toolibox TO toolibox_user;
\q
```

3. **Deploy Application**

```bash
# Clone repository
cd /var/www
git clone <your-repo>
cd toolibox

# Build frontend
cd frontend
npm install
npm run build

# Setup backend
cd ../backend
npm install
npx prisma migrate deploy
npm run build

# Use PM2 to manage processes
npm install -g pm2
pm2 start dist/app.js --name toolibox-api
pm2 startup
pm2 save
```

4. **Configure Nginx**

```bash
sudo cp nginx/toolibox.conf /etc/nginx/sites-available/toolibox
sudo ln -s /etc/nginx/sites-available/toolibox /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

5. **Setup SSL**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d toolibox.com -d www.toolibox.com
```

## 🔒 Environment Variables

### Frontend

- `NEXT_PUBLIC_API_URL` - Backend API URL

### Backend

- `DATABASE_URL` - PostgreSQL connection string
- `R2_ACCOUNT_ID` - Cloudflare R2 account ID
- `R2_ACCESS_KEY_ID` - R2 access key
- `R2_SECRET_ACCESS_KEY` - R2 secret key
- `R2_BUCKET_NAME` - R2 bucket name
- `PORT` - Server port (default: 8000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS

## 📊 Database Schema

```sql
CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) NOT NULL,
  subject VARCHAR(200),
  message TEXT NOT NULL,
  tool_name VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  user_agent TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW(),
  backed_up_to_r2 BOOLEAN DEFAULT FALSE
);
```

## 🤝 Contributing

This is a private project. Contact the project owner for contribution guidelines.

## 📄 License

All rights reserved © 2025 TooliBox

## 🐛 Known Issues

- All 30 tools are placeholders and not yet implemented
- Backup cron job only runs in production mode

## 📮 Support

For support, email feedback@toolibox.com or use the feedback form on the website.

---

Built with ❤️ using Next.js and Node.js
