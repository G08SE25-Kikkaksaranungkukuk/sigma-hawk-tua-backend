## 🎯 **Rating System แบบ Pre-calculated Database**

### **การเปลี่ยนแปลงใหม่:**

#### **🗄️ Database Schema:**
- **ratings table**: เก็บ individual ratings + calculated TK scores
- **user_rating_aggregates table**: เก็บค่าเฉลี่ย, median, min/max ที่คำนวณไว้แล้ว

#### **🔄 Auto-Update Process:**
เมื่อมีการ **Create/Update/Delete** rating:
1. คำนวณ TK score และบันทึกใน `ratings` table
2. **Recalculate** aggregate statistics ทันที
3. อัปเดต `user_rating_aggregates` table

---

## 📊 **ตัวอย่างการทำงาน:**

### **Step 1: User A ให้คะแนน User B**
```json
POST /api/v1/rating/user/2/rating
{
  "trust_score": 4.5,
  "engagement_score": 4.0,
  "experience_score": 3.5
}
```

**สิ่งที่เกิดขึ้นในฐานข้อมูล:**
1. **ratings table**: บันทึก rating + TK = 4.075
2. **user_rating_aggregates table**: สร้าง/อัปเดต aggregate สำหรับ user_id=2
   ```sql
   INSERT INTO user_rating_aggregates (
     user_id, average_total_score, total_ratings_count, ...
   ) VALUES (2, 4.075, 1, ...)
   ```

### **Step 2: User C ให้คะแนน User B เพิ่ม**
```json
POST /api/v1/rating/user/2/rating  
{
  "trust_score": 5.0,
  "engagement_score": 3.5,
  "experience_score": 4.0
}
```

**สิ่งที่เกิดขึ้น:**
1. **ratings table**: บันทึก rating ใหม่ + TK = 4.225
2. **user_rating_aggregates table**: อัปเดตทันที
   ```sql
   UPDATE user_rating_aggregates SET
     average_total_score = (4.075 + 4.225) / 2 = 4.15,
     total_ratings_count = 2,
     median_total_score = 4.15,
     ...
   WHERE user_id = 2
   ```

### **Step 3: ดูผลลัพธ์**
```bash
GET /api/v1/rating/user/2/rating/stats
```

**Response (อ่านจาก aggregate table - เร็วมาก!):**
```json
{
  "success": true,
  "data": {
    "user_id": 2,
    "average_trust_score": 4.75,
    "average_engagement_score": 3.75, 
    "average_experience_score": 3.75,
    "average_total_score": 4.15,
    "total_ratings_count": 2
  }
}
```

---

## ⚡ **ข้อดีของระบบใหม่:**

### **🚀 Performance:**
- **Query เร็วขึ้น**: อ่านจาก 1 row แทนที่จะต้องคำนวณจาก multiple rows
- **Scalable**: แม้มี 1000+ ratings ก็ยังเร็ว
- **Real-time**: aggregate อัปเดตทันทีที่มี rating ใหม่

### **📊 Advanced Analytics:**
- **Pre-calculated Median**: ไม่ต้องคำนวณใหม่ทุกครั้ง
- **Min/Max Tracking**: เก็บค่าสูงสุด/ต่ำสุดไว้
- **Timestamp**: รู้ว่าอัปเดตล่าสุดเมื่อไหร่

### **🔧 Database Consistency:**
- **Atomic Updates**: การอัปเดต rating + aggregate เป็น transaction เดียว
- **No Race Conditions**: ไม่มีปัญหาการคำนวณซ้ำ
- **Always Accurate**: aggregate data ตรงกับ raw data เสมอ

---

## 🧪 **การทดสอบ:**

### **1. ทดสอบ Single Rating:**
```bash
# ให้คะแนนครั้งแรก
POST /api/v1/rating/user/2/rating
{"trust_score": 4.0, "engagement_score": 4.0, "experience_score": 4.0}

# ตรวจสอบผล (TK = 4.0)
GET /api/v1/rating/user/2/rating/stats
```

### **2. ทดสอบ Multiple Ratings:**
```bash
# User B ให้คะแนน User 2
POST /api/v1/rating/user/2/rating (with User B token)
{"trust_score": 5.0, "engagement_score": 3.0, "experience_score": 3.0}

# User C ให้คะแนน User 2  
POST /api/v1/rating/user/2/rating (with User C token)
{"trust_score": 3.0, "engagement_score": 5.0, "experience_score": 5.0}

# ดูผลรวม
GET /api/v1/rating/user/2/rating/detailed-stats
```

### **3. ทดสอบ Update/Delete:**
```bash
# แก้ไขคะแนน
PUT /api/v1/rating/user/2/rating
{"trust_score": 4.5}

# ลบคะแนน
DELETE /api/v1/rating/user/2/rating

# ตรวจสอบว่า aggregate อัปเดตถูกต้อง
GET /api/v1/rating/user/2/rating/stats
```

### **4. ทดสอบ Leaderboard:**
```bash
# ดู top 10 users
GET /api/v1/rating/leaderboard?limit=10
```

---

## 📈 **Database Tables:**

### **ratings table:**
```sql
id | user_id | rater_id | trust_score | engagement_score | experience_score | total_score | created_at | updated_at
1  | 2       | 1        | 4.5         | 4.0              | 3.5              | 4.075       | 2025-11-08 | 2025-11-08
2  | 2       | 3        | 5.0         | 3.5              | 4.0              | 4.225       | 2025-11-08 | 2025-11-08
```

### **user_rating_aggregates table:**
```sql
id | user_id | avg_trust | avg_engagement | avg_experience | avg_total | median_total | min_total | max_total | count | last_updated
1  | 2       | 4.75      | 3.75           | 3.75           | 4.15      | 4.15         | 4.075     | 4.225     | 2     | 2025-11-08
```

ระบบใหม่พร้อมใช้งาน! **คำนวณเสร็จแล้วเก็บในฐานข้อมูล** ✅