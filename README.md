
# 🚀 Sigma Hawk Backend

> Travel companion matching platform backend API

## 📋 Quick Start

### Prerequisites
- Node.js (v18+ or LTS is desirable)
- PostgreSQL
- pnpm

### Setup
```bash
# 1. Install dependencies
pnpm install

# 2. Setup environment
cp .env.example .env  # แก้ไขค่า config หรือ นำไฟล์จากเพื่อนของคุณ

# 3. Setup database
pnpx prisma init --db # optional: for newly created docker only
pnpx prisma migrate reset
pnpx prisma migrate dev

# 4. Start development server
pnpm dev
```

## 📚 Documentation

- **[📖 Setup Guide](SETUP_GUIDE.md)** - คู่มือ setup โครงการสำหรับ developer ใหม่
- **[📬 Postman Testing](docs/POSTMAN_TESTING_GUIDE.md)** - วิธีทดสอบ API ด้วย Postman
- **[🧪 Manual Testing](docs/TESTING_GUIDE.md)** - วิธีทดสอบด้วย cURL และ manual testing
- **[📝 Test Data Examples](docs/TEST_DATA_EXAMPLES.md)** - ตัวอย่างข้อมูลสำหรับการทดสอบ
- **[🚀 Deployment Guide](DEPLOYMENT_CHECKLIST.md)** - checklist สำหรับ deployment

## 🛠 Available Commands

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpx prisma init --db # optional: for newly created docker only
pnpx prisma migrate reset
pnpx prisma migrate dev

# Testing
pnpm test             # Run unit tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Generate coverage report
```

## 🏗 Project Structure

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

## 🔑 Key Features

- **Authentication & Authorization** - JWT-based auth with refresh tokens
- **User Management** - Registration, profile management, interests & travel styles
- **Group Management** - Create and join travel groups
- **Database** - PostgreSQL with Prisma ORM
- **Testing** - Jest unit tests + Postman integration tests
- **Type Safety** - Full TypeScript support

## 🗄️ Database Schema

### Core Tables
- `User` - ผู้ใช้งาน
- `Group` - กลุ่มการเดินทาง
- `Interest` - ความสนใจ (SEA, MOUNTAIN, CULTURE, etc.)
- `TravelStyle` - รูปแบบการเดินทาง (BUDGET, LUXURY, etc.)

### Junction Tables
- `UserInterest` - ความสนใจของผู้ใช้
- `UserTravelStyle` - รูปแบบการเดินทางของผู้ใช้
- `GroupInterest` - ความสนใจของกลุ่ม
- `Belongs` - สมาชิกในกลุ่ม

## 🧪 Testing

### Quick Test
```bash
# Health check
curl http://localhost:3000/health

# Register user
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
    "interests": ["SEA"],
    "travel_styles": ["BUDGET"]
  }'
```

### Automated Testing
```bash
# Run all tests
pnpm test

# API testing with Newman
./postman/run-tests.sh
```

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sigma_hawk_db"

# JWT Secrets
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"

# Server
PORT=3000
NODE_ENV=development
```

## 👥 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Pull Request Guidelines
- ใช้ [PR Template](.github/pull_request_template.md)
- ทดสอบให้ครบตาม checklist
- อัพเดต documentation ถ้าจำเป็น

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/G08SE25-Kikkaksaranungkukuk/sigma-hawk-tua-backend/issues)
- **Documentation:** [docs/](docs/)
- **Team:** Contact via Discord/Line group

---

Made with ❤️ by Sigma Hawk Tour Team
