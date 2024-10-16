# ใช้ภาพต้นทางที่ติดตั้ง Bun แล้ว
FROM oven/bun:latest

# ตั้งค่า working directory ใน container เป็น /app
WORKDIR /app

# คัดลอกไฟล์ทั้งหมดจากเครื่องไปยัง container
COPY . .

# คัดลอกไฟล์ environment ไปยัง container
COPY .env .env

# ติดตั้ง dependencies ด้วย Bun
RUN bun install

# สร้าง production build ของแอปพลิเคชัน
RUN bun run build

# เปิด port 3000
EXPOSE 3000

# รันแอปพลิเคชันด้วย Bun
CMD ["bun", "next", "start"]
