# 1. مرحلة البناء
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# تثبيت كل المكتبات (بما فيها tsc و drizzle-kit)
RUN npm install
COPY . .
# تنفيذ سكريبت البناء "npx tsc" كما هو معرف عندك
RUN npm run build

# 2. مرحلة التشغيل
FROM node:20-alpine
WORKDIR /app

# نسخ الملفات الضرورية فقط من مرحلة البناء
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
# نسخ مجلد الميغريشن لأنك تستدعي البرمجة داخل السيرفر
COPY --from=builder /app/src/db/migrations ./dist/db/migrations

# فتح المنفذ
EXPOSE 3000

# تشغيل التطبيق باستخدام سكريبت start المعرف عندك (node dist/index.js)
CMD ["npm", "start"]