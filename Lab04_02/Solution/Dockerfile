# syntax=docker/dockerfile:1
FROM mcr.microsoft.com/playwright:v1.42.1-jammy

# 작업 디렉터리 설정
WORKDIR /app

# 패키지 파일만 복사하고 패키지 설치
COPY package.json package-lock.json* ./
RUN npm ci

# 서버 소스 및 Playwright, Express 설치
COPY server.js ./
RUN npm install express @playwright/test && npx playwright install

# 포트 노출
EXPOSE 3000

# 실행 명령
CMD ["node", "server.js"]