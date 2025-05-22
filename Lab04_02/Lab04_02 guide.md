## Lab 04_02: Playwright으로 웹사이트의 스크린샷 얻기

이 실습에서는 Playwright 도커 이미지를 사용하여 컨테이너 이미지를 생성하고, Azure Container Registry(ACR)에 푸시한 후, Azure Container Apps에 배포하고 API를 사용합니다.

---

### 실습 구조

1. **Exercise 1: Node.js 애플리케이션 작성 및 Docker 이미지 생성**
2. **Exercise 2: Azure Container Registry에 이미지 빌드 및 푸시 후 Container Instance 배포**
3. **Exercise 3: Azure Container Apps 환경 생성 및 컨테이너 앱 배포**

## 사전 준비

## Exercise 1: Node.js 애플리케이션 작성 및 Docker 이미지 생성

### 작업 1: 프로젝트 초기화

1. **프로젝트 초기화**

   ```bash
   # 실습 디렉터리로 이동
   cd (랩루트경로)\Lab04_02\Starter

   # Node.js 콘솔 앱 생성
   npm init -y

   ```

2. **npm 설치**
   ```bash
   npm install express
   npm install @playwright/test
   npx playwright install
   ```

2. **`server.js` 파일 생성 및 코드 작성**

   ```js
   const { chromium } = require('playwright');
   const express = require('express');
   const app = express();

   app.get('/screenshot', async (req, res) => {
      const url = req.query.url;
      if (!url) return res.status(400).send('Missing url param');

      const browser = await chromium.launch();
      const page = await browser.newPage();
      await page.goto(url);
      const buffer = await page.screenshot();
      await browser.close();

      res.type('image/png').send(buffer);
   });

   app.listen(3000, () => console.log('Server running on port 3000'));
   ```
3. **로컬 실행 테스트**

   ```bash
   node server.js
   ```

4. 별도의 터미널을 엽니다. 그리고 hn.png 파일을 열어 스크린샷이 제대로 생성되었는 지 확인합니다.

   ```
   curl "localhost:3000/screenshot?url=https://naver.com" --output hn.png
   ```

   * 예상 출력: 호스트 이름과 IP 주소 목록
4. **`Dockerfile` 작성**

   ```dockerfile
   # Base image with Node.js and Playwright dependencies
   FROM mcr.microsoft.com/playwright:v1.42.1-jammy

   # Set working directory
   WORKDIR /app

   # Copy package files and install dependencies
   COPY package*.json ./
   RUN npm install

   # Copy source code
   COPY . .

   # Expose port (e.g., 3000)
   EXPOSE 3000

   # Default command
   CMD ["node", "server.js"]
   ```
5. **이미지 빌드 및 ZIP 생성**

   ```bash
   # ZIP으로 묶어 Cloud Shell로 업로드 준비
   Compress-Archive -Path .\* -DestinationPath .\lab04_02.zip
   ```

## 작업 2: Container Registry 리소스 생성

1. Cloud Shell 또는 로컬 터미널에서 Azure CLI를 실행합니다.
2. 다음 명령어를 사용하여 Container Registry를 생성합니다. (리소스 그룹 이름은 “KT-AppServiceHandsOn”, 등록 이름은 고유해야 하며, 비용 절감을 위해 sku는 Basic을 사용합니다.)

   ```bash
   az acr create --resource-group KT-AppServiceHandsOn --name acrplaywright[이름] --sku Basic
   ```
3. 생성이 완료되면, 아래 명령어로 리소스가 잘 생성되었는지 확인합니다:
   ```bash
   az acr list --resource-group KT-AppServiceHandsOn --output table
   ```
   
4.`az acr login` 명령으로 **Azure Container Registry (ACR)**에 도커 클라이언트를 인증시킵니다.

   ```bash
   az acr login --name acrplaywright[이름]
   ```

5. 도커를 빌드하고, 태그하고 푸시합니다.

   ```bash
   docker build -t my-playwright-app .
   docker tag my-playwright-app acrplaywright[이름].azurecr.io/my-playwright-app:v1
   docker push acrplaywright[이름].azurecr.io/my-playwright-app:v1

   ```

## Exercise 3: Azure Container Apps 환경 생성 및 컨테이너 앱 배포 (포털 사용)

### 작업 1: 컨테이너 앱 리소스 생성

1. Azure Portal(https://portal.azure.com)에 로그인합니다.
2. 좌측 메뉴에서 “Container Apps”를 검색하고 선택합니다.
3. “+ 만들기” 버튼을 클릭합니다.
4. 기본 정보 섹션에서 다음 항목을 입력합니다.
   - 구독 및 리소스 그룹: 기존 리소스 그룹 “KT-AppServiceHandsOn”을 선택합니다.
   - 이름: playwrightapp
   - 지역: Korea Central

### 작업 2: 컨테이너 이미지와 ACR 연동 설정

1. “컨테이너 앱” 섹션에서 새로운 환경을 생성하거나 기존 환경을 선택합니다.
2. “배포” 단계에서 “컨테이너 이미지” 항목에 아래 정보를 입력합니다.
   - 이미지 소스: “Azure Container Registry” 선택
   - ACR 등록: 기존 ACR(예: acrplaywright[이름].azurecr.io) 선택
   - 이미지: “my-playwright-app”
   - 태그: “v1”

3. “수신” 탭으로 이동합니다.
4. 수신 트래픽에서 “어디서나 트래픽 허용”을 클릭합니다.
5. 검토+만들기 => 만들기를 클릭해 리소스를 생성합니다.
6. 리소스로 이동을 눌러 해당 리소스에 이동합니다.
7. 어플리케이션 URL 주소를 복사해 브라우저에 붙여 넣습니다.
8. {URL 주소}/screenshot?url=https://www.naver.com을 입력하고 엔터를 누릅니다.
9. 네이버 사이트의 스크린샷이 제대로 나오는 지 확인합니다.