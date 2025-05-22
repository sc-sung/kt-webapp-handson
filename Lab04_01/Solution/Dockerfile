# Node.js 18 LTS 이미지 사용
FROM node:18-alpine AS build
WORKDIR /app

# 패키지 설치
COPY package*.json ./
RUN npm install --production

# 애플리케이션 복사
COPY index.js ./

# 실시간 실행
ENTRYPOINT ["node", "index.js"]