## Lab 04_01: Node.js 애플리케이션으로 컨테이너 이미지 생성 및 Azure에 배포

이 실습에서는 Node.js 콘솔 애플리케이션을 사용하여 컨테이너 이미지를 생성하고, Azure Container Registry(ACR)에 푸시한 후, Azure Container Instance(ACI)와 Azure Container Apps에 배포하는 방법을 학습합니다.

---

### 실습 구조

1. **Exercise 1: Node.js 애플리케이션 작성 및 Docker 이미지 생성**
2. **Exercise 2: Azure Container Registry에 이미지 빌드 및 푸시 후 Container Instance 배포**
3. **Exercise 3: Azure Container Apps 환경 생성 및 컨테이너 앱 배포**

## 아키텍처 다이어그램
![Architecture diagram](https://microsoftlearning.github.io/AZ-204-DevelopingSolutionsforMicrosoftAzure/Instructions/Labs/media/Lab05-Diagram.png)
※ ACR에 컨테이너 이미지를 푸시한 뒤, 간단 테스트용은 Azure Container Instance로, 운영·마이크로서비스용은 Azure Container Apps로 배포합니다.

## 사전 준비


### Docker Desktop 설치

- https://www.docker.com/products/docker-desktop 에서 설치
- 설치 후 Docker가 정상 실행 중인지 docker version 으로 확인

### Node js 설치

**Windows (MSI 설치)**

1. https://nodejs.org/ 에 접속
2. “LTS” 버전의 Windows Installer(.msi) 다운로드
3. 실행 후 안내에 따라 “다음(Next)” → “설치(Install)” → “완료(Finish)”


**macOS**
```
brew update
brew install node
```

**설치 확인**
```
node -v
npm -v
```

---

## Exercise 1: Node.js 애플리케이션 작성 및 Docker 이미지 생성

### 작업 1: 프로젝트 초기화

1. **프로젝트 초기화**

   ```bash
   # 실습 디렉터리로 이동
   cd (랩루트경로)\Lab04_01\Starter

   # Node.js 콘솔 앱 생성
   npm init -y

   ```
2. **`index.js` 파일 생성 및 코드 작성**

   ```js
   // index.js
   const os = require('os');

   console.log('현재 호스트 이름:', os.hostname());
   console.log('네트워크 인터페이스:');
   const nets = os.networkInterfaces();
   for (const name of Object.keys(nets)) {
     for (const net of nets[name]) {
       console.log(`  [${name}] ${net.address} (${net.family})`);
     }
   }
   ```
3. **로컬 실행 테스트**

   ```bash
   node index.js
   ```

   * 예상 출력: 호스트 이름과 IP 주소 목록
4. **`Dockerfile` 작성**

   ```dockerfile
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
   ```
5. **이미지 빌드 및 ZIP 생성**

   ```bash
   # ZIP으로 묶어 Cloud Shell로 업로드 준비
   Compress-Archive -Path .\* -DestinationPath .\lab05.zip
   ```
## 작업 2: Container Registry 리소스 생성

1. Azure 포털이 열려있는 브라우저 창으로 전환합니다.
2. Cloud Shell 아이콘![아이콘](https://microsoftlearning.github.io/AZ-204-DevelopingSolutionsforMicrosoftAzure/Instructions/Labs/media/az204_lab_CloudShell.png)을 선택하여 Cloud Shell을 엽니다. (기본이 PowerShell이라면 Cloud Shell 메뉴에서 "Switch to Bash"를 선택하고 확인합니다.)
3. 처음 Cloud Shell을 사용하는 경우, "No storage account required"를 선택한 후 "Apply"를 클릭합니다.
4. Cloud Shell 창에서 **파일 관리(Manage files)** 아이콘을 클릭하고 드롭다운 메뉴에서 **업로드(Upload)**를 선택합니다.
5. Open 대화 상자에서 (랩루트폴더):Lab04_01\Starter (빈 디렉터리)로 이동하여 Lab04_01.zip 파일을 선택한 후 **열기(Open)**을 클릭합니다. 파일은 Cloud Shell의 홈 디렉터리(~/)로 업로드됩니다.
6. Cloud Shell 명령 프롬프트에서 아래 명령어를 실행하여 ipcheck라는 새 디렉터리를 생성합니다:
   ```bash
   mkdir ~/ipcheck
   ```
7. 업로드한 ZIP 파일의 내용을 새 디렉터리에 추출합니다:
   ```bash
   unzip ~/Lab04_01.zip -d ~/ipcheck
   ```
8. ipcheck 디렉터리 내의 모든 파일에 대해 읽기 및 실행 권한을 부여합니다:
   ```bash
   chmod -R +xr ~/ipcheck
   ```
9. 현재 디렉터리를 ipcheck로 변경합니다:
   ```bash
   cd ~/ipcheck
   ```
10. Container Registry 리소스에 사용할 고유한 값으로 변수 생성:
      ```bash
      registryName=conregistry$RANDOM
      ```
11. 생성한 이름의 사용 가능 여부를 확인합니다:
      ```bash
      az acr check-name --name $registryName
      ```
      만약 이름이 사용 불가능하다면, 다시 명령어를 실행하여 고유한 값을 생성합니다.
12. Basic SKU를 사용하여 Container Registry 리소스를 생성합니다:
      ```bash
      az acr create --resource-group KT-AppServiceHandsOn --name $registryName --sku Basic
      ```
      생성 작업이 완료될 때까지 기다립니다.

---

## 작업 3: Container Registry 메타데이터 저장

포털의 Cloud Shell 명령 프롬프트에서 다음 명령어를 실행하여 구독에 있는 모든 Container Registry 목록을 가져옵니다:

```bash
az acr list --resource-group KT-AppServiceHandsOn
```

그 후, 아래 명령어를 실행하여 가장 최근에 생성된 Container Registry의 이름을 확인합니다:

```bash
az acr list --resource-group KT-AppServiceHandsOn --query "max_by([], &creationDate).name" --output tsv
```

다음으로, 해당 Registry 이름을 변수에 할당합니다:

```bash
acrName=$(az acr list --resource-group KT-AppServiceHandsOn --query "max_by([], &creationDate).name" --output tsv)
```

출력이 제대로 되는지 확인합니다:

```bash
echo $acrName
```

---

## 작업 4: Container Registry에 Docker 컨테이너 이미지 배포

1. Cloud Shell에서 작업 디렉터리를 ipcheck 폴더로 변경합니다:

   ```bash
   cd ~/ipcheck
   ```

2. 현재 디렉터리의 파일 목록을 확인합니다:

   ```bash
   dir
   ```

3. 소스 코드를 Container Registry로 업로드하고, Container Registry 작업으로 Docker 이미지 빌드를 실행합니다:

   ```bash
   az acr build --registry $acrName --image ipcheck:latest .
   ```

   ※ 빌드 작업이 완료될 때까지 기다린 후, Cloud Shell 창을 닫습니다.

---

## 작업 5: Container Registry에서 컨테이너 이미지 검증

1. Azure 포털의 내비게이션 창에서 “리소스 그룹” 링크를 선택합니다.
2. 이전에 생성한 리소스 그룹 “KT-AppServiceHandsOn”를 엽니다.
3. “KT-AppServiceHandsOn” 리소스 그룹 내에서 생성한 Container Registry를 선택합니다.
4. Container Registry 블레이드의 “서비스(Services)” 섹션에서 “리포지토리(Repositories)” 링크를 클릭합니다.
5. ipcheck 이미지 리포지토리를 선택한 후, 최신 태그를 선택합니다.
6. 선택한 컨테이너 이미지 버전의 메타데이터를 검토합니다.

---

### Review

이번 실습에서는 nodejs 콘솔 애플리케이션을 사용하여 머신의 IP 주소를 표시하고, Dockerfile을 이용해 애플리케이션을 컨테이너 이미지로 패키징한 후 Container Registry에 배포하였습니다. 또한, Container Registry 메타데이터를 저장하고, Azure 포털을 통해 이미지의 메타데이터를 검증하는 과정을 익혔습니다.


## Exercise 2: Azure Container Instance 배포

이번 실습에서는 두 가지 방법을 사용하여 Azure Container Instance에 컨테이너 이미지를 배포합니다.

### Task 1: Container Registry 관리자 사용자 활성화
1. KT-AppServiceHandsOn 리소스 그룹(Resource Group)에서 이전 실습에서 생성한 컨테이너 레지스트리를 선택합니다.
2. 액세스 키(Access keys) 블레이드로 이동합니다.
3. 사용 관리자(Admin user) 섹션의 스위치를 전환하여 활성화합니다.

### Task 2: 자동으로 Container Instance에 컨테이너 배포
1. Container Registry 블레이드의 서비스(Services) 섹션에서 리포지토리(Repositories)를 선택합니다.
2. ipcheck 이미지가 포함된 리포지토리를 선택합니다.
3. ipcheck 창에서 최신 태그 항목에 있는 메뉴(...)를 클릭하고 인스턴스 실행(Run instance)을 선택합니다.
4. 컨테이너 인스턴스 생성(Create container instance) 블레이드에서 다음 설정을 수행합니다:
   - 컨테이너 이름(Container name): managedcompute 입력
   - 컨테이너 이미지(Container image): 기본값 유지
   - 운영 체제(OS type): Linux 선택
   - 구독(Subscription): 기본값 유지
   - 리소스 그룹(Resource group): KT-AppServiceHandsOn 선택
   - 지역(Location): Korea Central 선택
   - 코어 수(Number of cores): 2 선택
   - 메모리 (GB)(Memory (GB)): 4 입력
   - 공용 IP 주소(Public IP address): No 선택
5. 설정을 확인한 후 만들기(Create)를 선택하여 배포합니다.
6. 컨테이너 인스턴스 생성이 완료될 때까지 기다립니다.

### Task 3: 배포 검증
1. Azure 포털의 리소스 그룹(Resource groups)에서 KT-AppServiceHandsOn 리소스 그룹을 선택합니다.
2. manualcompute 컨테이너 인스턴스를 선택합니다.
3. 컨테이너 인스턴스(Container Instances) 블레이드에서 설정(Settings) 섹션의 컨테이너(Containers) 링크를 선택합니다.
4. 이벤트(Events)와 로그(Logs) 탭을 통해 컨테이너 실행 상태와 로그를 검토합니다.
   - manualcompute 인스턴스는 작업 완료 후 종료(성공한 종료)가 허용됩니다.
   - managedcompute 인스턴스는 항상 실행 중이어야 하므로 반복 재시작될 수 있습니다.

### Review
이번 실습에서는 자동 및 수동 배포 방법을 통해 Azure Container Instance에 컨테이너 이미지를 배포하고, 배포된 인스턴스의 실행 상태와 로그를 확인하는 방법을 학습했습니다.

## Exercise 3: Container Apps 환경 생성 및 컨테이너 앱 배포

이번 실습에서는 보안이 강화된 Container Apps 환경을 생성하고, 컨테이너 앱을 배포하는 방법을 학습합니다.

---

### Task 1: 환경 준비
1. Azure 포털에 로그인합니다.
2. Cloud Shell 아이콘을 선택하고 Bash 환경을 실행합니다.
3. 아래 명령어로 Azure Container Apps CLI 확장을 설치 및 업그레이드합니다:
   ```bash
   az extension add --name containerapp --upgrade
   ```
4. Microsoft.App 네임스페이스를 등록합니다:
   ```bash
   az provider register --namespace Microsoft.App
   ```
   ※ Container Apps 리소스는 Microsoft.Web 네임스페이스에서 Microsoft.App 네임스페이스로 이전되었습니다.
5. Azure Monitor Log Analytics 작업공간에 사용할 Microsoft.OperationalInsights 제공자를 등록합니다:
   ```bash
   az provider register --namespace Microsoft.OperationalInsights
   ```
   ※ 각 제공자 등록은 몇 분 정도 소요될 수 있습니다.
6. 이후 실습에 사용할 환경 변수를 설정합니다:
   ```bash
   myRG=KT-AppServiceHandsOn
   myAppContEnv=azwebapp-env-$RANDOM
   ```

---

### Task 2: Container Apps 환경 생성
보안 경계를 형성하여 동일 환경 내에 배포된 컨테이너 앱들은 동일한 가상 네트워크와 Log Analytics 작업공간을 공유합니다.

Cloud Shell에서 아래 명령어를 실행하여 Container Apps 환경을 생성합니다:
```bash
az containerapp env create \
    --name $myAppContEnv \
    --resource-group $myRG \
    --location eastasia
```

---

### Task 3: 컨테이너 앱 생성 및 배포
컨테이너 앱 환경 생성이 완료되면, 샘플 컨테이너 이미지를 사용하여 앱을 배포합니다.

아래 명령어를 Cloud Shell에서 실행합니다:
```bash
az containerapp create \
    --name my-container-app \
    --resource-group $myRG \
    --environment $myAppContEnv \
    --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
    --target-port 80 \
    --ingress external \
    --query properties.configuration.ingress.fqdn
```
※ --ingress 옵션을 외부로 설정하여 공개 요청이 가능하도록 합니다. 명령어 실행 후 반환되는 링크를 통해 앱 실행 상태를 확인할 수 있습니다.

---

### Review
이번 실습에서는 보안이 강화된 Container Apps 환경 내에서 컨테이너 앱을 배포하고, 외부에서 접근 가능한 링크를 통해 애플리케이션 상태를 검증하는 과정을 학습했습니다.