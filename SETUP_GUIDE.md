# 🚀 Setup Guide สำหรับ Sigma Hawk Backend

## 📋 Prerequisites

ต้องติดตั้งโปรแกรมเหล่านี้ก่อน:
- Node.js (v18 หรือใหม่กว่า)
- pnpm (`npm install -g pnpm`)
- PostgreSQL Database
- Git

## 🔧 ขั้นตอนการ Setup

### 1. Clone Repository
```bash
git clone https://github.com/G08SE25-Kikkaksaranungkukuk/sigma-hawk-tua-backend.git
cd sigma-hawk-tua-backend
```

### 2. Switch to Development Branch
```bash
git checkout enum-to-table
```

### 3. Install Dependencies
```bash
pnpm install
```

### 4. Setup Environment Variables
สร้างไฟล์ `.env` และใส่ค่าตามตัวอย่าง:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/sigma_hawk_db"

# JWT Secrets
JWT_ACCESS_SECRET="your-super-secret-access-key-here"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"

# Server
PORT=3000
NODE_ENV=development

# Redis (optional for caching)
REDIS_URL="redis://localhost:6379"
```

**🔑 วิธีสร้าง JWT Secrets:**
```bash
# สร้าง random secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 5. Setup Database

#### Option A: ใช้ Local PostgreSQL
```bash
# สร้าง database
createdb sigma_hawk_db

# หรือใช้ psql
psql -U postgres
CREATE DATABASE sigma_hawk_db;
\q
```

#### Option B: ใช้ Docker
```bash
docker run --name postgres-sigma-hawk \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=sigma_hawk_db \
  -p 5432:5432 \
  -d postgres:15
```

### 6. Run Database Migrations
```bash
# Generate Prisma Client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed initial data
pnpm db:seed
```

### 7. Start Development Server
```bash
pnpm dev
```

Server จะรันที่: http://localhost:3000

## ✅ ตรวจสอบว่า Setup สำเร็จ

### 1. Health Check
```bash
curl http://localhost:3000/health
```
**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-09-09T14:30:00.000Z",
  "database": "connected"
}
```

### 2. ตรวจสอบ Seed Data
```bash
curl http://localhost:3000/api/interests
curl http://localhost:3000/api/travel-styles
```

### 3. ทดสอบ Registration
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "password": "Test123@",
    "phone": "0812345678",
    "birth_date": "1995-01-01",
    "sex": "male",
    "interests": ["SEA", "MOUNTAIN"],
    "travel_styles": ["BUDGET"]
  }'
```

## 🧪 Testing Setup

### 1. Install Testing Dependencies (ถ้ายังไม่มี)
```bash
pnpm install --save-dev jest @types/jest ts-jest supertest @types/supertest
```

### 2. Run Unit Tests
```bash
pnpm test
```

### 3. Postman Testing
1. Import collection: `postman/Sigma-Hawk-Auth-Tests.postman_collection.json`
2. Import environment: `postman/Sigma-Hawk-Backend.postman_environment.json`
3. เลือก environment "Sigma Hawk Backend"
4. Run collection

### 4. Automated API Testing
```bash
# ติดตั้ง Newman
npm install -g newman

# รันการทดสอบ
./postman/run-tests.sh
```

## 🗄️ Database Commands

### Reset Database (ถ้าจำเป็น)
```bash
# Drop all tables and recreate
pnpm db:reset

# หรือ reset และ seed ใหม่
pnpm db:reset && pnpm db:seed
```

### View Database
```bash
# เปิด Prisma Studio
pnpm db:studio
```

### Manual Database Operations
```bash
# Push schema changes without migration
pnpm db:push

# Generate migration only
pnpm db:migrate dev --create-only
```

## 📂 Project Structure

```
sigma-hawk-tua-backend/
├── apps/
│   ├── controllers/     # API Controllers
│   ├── services/        # Business Logic
│   ├── repository/      # Data Access Layer
│   ├── middlewares/     # Express Middlewares
│   ├── routes/          # API Routes
│   ├── types/           # TypeScript Types
│   └── utils/           # Utilities
├── prisma/
│   ├── schema.prisma    # Database Schema
│   ├── seed.ts          # Seed Data
│   └── migrations/      # Database Migrations
├── tests/               # Test Files
├── postman/             # Postman Collections
└── docs/                # Documentation
```

## 🐛 Common Issues & Solutions

### 1. Database Connection Error
```bash
# ตรวจสอบ DATABASE_URL ใน .env
# ตรวจสอบว่า PostgreSQL รันอยู่
sudo service postgresql start

# หรือถ้าใช้ Docker
docker start postgres-sigma-hawk
```

### 2. Migration Errors
```bash
# Reset database และ run migration ใหม่
pnpm db:reset
pnpm db:migrate
pnpm db:seed
```

### 3. Port Already in Use
```bash
# ค้นหาและ kill process ที่ใช้ port 3000
lsof -ti:3000 | xargs kill -9

# หรือเปลี่ยน port ใน .env
PORT=3001
```

### 4. Missing Dependencies
```bash
# Clear cache และ reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 5. Prisma Client Issues
```bash
# Regenerate Prisma Client
pnpm db:generate
```

## 📞 Support

ถ้ามีปัญหาให้ติดต่อ:
1. สร้าง Issue ใน GitHub Repository
2. ส่งข้อความใน Discord/Line Group
3. หรือส่งอีเมลไปที่ team lead

## 🎯 Ready to Code!

หลังจากทำตามขั้นตอนแล้ว คุณจะสามารถ:
- ✅ พัฒนา API endpoints ใหม่
- ✅ รันและทดสอบ authentication
- ✅ ใช้ Prisma ORM กับ database
- ✅ รัน unit tests และ integration tests
- ✅ ใช้ Postman สำหรับ API testing

Happy Coding! 🚀
