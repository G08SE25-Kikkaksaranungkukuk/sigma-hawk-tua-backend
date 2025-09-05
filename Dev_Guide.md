# Dev_Guid.md
> Development Guideline สำหรับทีมพัฒนา Web Application (Tourism Project)

---

## 🧭 Git & Branching
- ใช้ **GitHub flow + PR Review**
- Branch naming:
  - `feature/<scope>` → ฟีเจอร์ใหม่
  - `fix/<scope>` → แก้บั๊ก
  - `chore/<scope>` → งานสนับสนุน
- ห้าม `push` ตรงไปที่ `main` หรือ `develop` ใครทำตูดมึงบาน
- ใช้ **Pull Request (PR)** เท่านั้น พร้อม Reviewer ≥ 2 (อย่างน้อย 1 Senior) 
- Commit message ต้องเป็น **Conventional Commit**: เขียน commit msg ดีๆ ไม่งั้นกุ reject
  - `feat: add search destination`
  - `fix: booking cancel error`
  - `chore: update eslint config`

---

## 🔍 Code Review Policy
**Reviewer ต้องตรวจสอบ:**
- Architecture/Logic ถูกต้อง
- Code อ่านง่าย, มี Comment เท่าที่จำเป็น
- Test ครอบคลุมและทำงานได้
- Performance/SQL Query เหมาะสม
- Security & Validation ครบถ้วน
- UI มี Accessibility ขั้นพื้นฐาน (a11y)

**PR Checklist**
- [ ] มี Test ครอบคลุม
- [ ] อัปเดต Docs/ADR/OpenAPI
- [ ] Screenshots/GIF (สำหรับ UI)
- [ ] Migration/Seed data backward compatible
- [ ] Feature flag เปิด/ปิดได้ (ถ้าเกี่ยวข้อง)

---

## 🧪 Testing Rules
- **Unit Test** → `Vitest/Jest`
- **API Test** → `Supertest`
- **E2E Test** → `Playwright`
- **Accessibility Test** → `axe-core`
- **Performance Test** → `Lighthouse CI`

ทุก PR ต้องมี test อย่างน้อย 1 ระดับ

---

## 🏗️ Coding Standards
- ใช้ `TypeScript --strict` (ห้าม `any` โดยไม่จำเป็น) ถ้าใช้งี้กลับไปใช้ js ครับ T^T
- Lint/Format → `ESLint + Prettier`
- Business Logic แยกไว้ที่ **Service Layer**
- ห้าม Hardcode secret/config → ใช้ `.env` หรือ Secret Manager ดูตาม .env.example เลยจู้ววว
- UI Components → ต้องเป็น **Pure/Controlled Components**
- PR เล็ก (300-500 lines change) มากกว่านั้นกุ reject

---

## 🔐 Security & Privacy
- Input Validation ด้วย `zod` / `class-validator`
- ใช้ `Helmet`, CSRF protection (ถ้า session-based)
- Rate limiting endpoint สำคัญ
- จัดการ Secret ผ่าน Secret Manager เท่านั้น
- Logging PII ต้อง **mask** หรือ anonymize

---

## 🚀 CI/CD & Release
- **CI Pipeline (ทุก PR)**:
  1. Type check (`tsc --noEmit`)
  2. ESLint & Prettier check
  3. Unit/Integration/E2E tests
  4. Build + Security scan (Trivy, npm audit)
  5. Preview deploy (Vercel/Netlify สำหรับ FE)

- **Release**:
  - ใช้ Semantic Versioning (SemVer)
  - Auto Changelog จาก Conventional Commits
  - Deploy Prod ต้องผ่าน Manual Approval (≥2 คน)

---

## 📚 Documentation
หลักๆคือเขียน docs ดีๆ
- ทุก Feature/Decision → บันทึกเป็น **ADR**
- OpenAPI spec → อัปเดตเมื่อ API เปลี่ยน
- Wiki รวม:
  - Setup Dev
  - Run/Debug/Test
  - ERD, Endpoint List
  - Incident Playbook

---

## 👥 Team Practice
- Sprint = 2 สัปดาห์ (Scrum)
- Ceremonies: Planning, Daily, Review, Retrospective
- Pair Programming/Mob Programming สำหรับ Feature สำคัญ
- Knowledge Sharing (Guild) 30 นาที/สัปดาห์

---

## 📝 Summary
- ห้าม push ลง `main` โดยตรง
- ทุกงานต้องผ่าน PR + Review
- ทุก Feature ต้องมี Test
- รักษา Code Quality, Security, Documentation

---
