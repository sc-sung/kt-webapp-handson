# Lab 01: Azure App Service로 웹 애플리케이션 구축

이 실습에서는 Azure의 App Service로 웹 애플리케이션을 구축 및 배포 방법을 다룹니다. 백엔드 API와 프론트엔드 웹앱을 각각 Azure App Service에 배포하고, Azure Storage를 연동하여 이미지를 저장/조회하는 과정을 실습합니다.

## 실습 목표
- Azure Storage 계정 생성 및 Blob 컨테이너 구성
- 샘플 이미지 업로드
- Azure App Service에 백엔드 API 및 프론트엔드 웹앱 배포
- 환경 변수 설정 및 배포 자동화 경험

## 아키텍처 다이어그램
![Architecture diagram](https://microsoftlearning.github.io/AZ-204-DevelopingSolutionsforMicrosoftAzure/Instructions/Labs/media/Lab01-Diagram.png)

---

## 실습 시나리오
1. **백엔드 API 구축**: Azure Storage와 연동되는 ASP.NET API를 App Service에 배포합니다.
2. **프론트엔드 웹앱 구축**: API와 연동되는 ASP.NET 웹앱을 App Service에 배포합니다.
3. **이미지 업로드 및 갤러리 확인**: Storage에 이미지를 업로드하고, 웹앱에서 이미지를 확인합니다.

## Exercise 1: 백엔드 API 구축

### Task 1: Azure 포털 접속 및 리소스 준비
- Azure 포털(https://portal.azure.com)에 로그인합니다.

1. 포털 왼쪽 탐색 메뉴에서 **리소스 그룹** 선택
2. **+ 만들기** 클릭
3. **기본** 탭에서:
   - 구독: 기본값 유지
   - 리소스 이름: `KT-AppServiceHandsOn`
   - 지역: `(Asia Pacific) Korea Central`
   
   ![Image.png](./images/Image1.png)
4. **검토 + 만들기** 클릭 → **만들기** 클릭 후 리소스 그룹 생성 완료 대기
5. 완료 후 **리소스 이동** 클릭하여 리소스 그룹 블레이드로 이동

### Task 2: 스토리지 계정 생성

1. Azure 포털 상단의 **리소스, 서비스, 문서 검색** 텍스트 상자에 "Storage Accounts"를 입력하고, 결과 목록에서 **스토리지 계정**를 선택합니다.
2. **스토리지 계정** 블레이드에서 **+ 만들기** 버튼을 클릭합니다.
3. **스토리지 계정 만들기** 블레이드의 **기본** 탭에서 다음 작업을 수행한 후 **검토 + 만들기**를 선택합니다:

    - **구독**: 드롭다운 목록에서 기본값 유지
    - **리소스 그룹**: **KT-AppServiceHandsOn**를 선택
    - **스토리지 계정 이름**: `imgstor[본인이름]` 입력
    - **지역**: 드롭다운 목록에서 `(Asia Pacific) Korea Central` 선택
    - **기본 서비스**: 변경 없음
    - **성능**: Standard 옵션 선택
    - **중복 저장**: 드롭다운 목록에서 **로컬 중복 저장 (LRS)** 선택
![alt text](./images/image2.png)
4. 설정을 확인한 후 **검토 + 만들기**를 클릭합니다.
5. **만들기**를 클릭합니다.
6. 완료 후 **리소스 이동** 클릭하여 리소스 그룹 블레이드로 이동
7. 스토리지 계정 블레이드 내 **Security + networking** 섹션에서 **Access keys**를 선택합니다.
1. **Access keys** 블레이드에서 임의의 **Connection string**을 선택한 후 **Show** 버튼을 클릭하여 값을 확인합니다.
1. 표시된 연결 문자열 값을 복사하여 기록합니다.
1. 메모장을 열고 복사한 연결 문자열을 붙여넣습니다. 이 값은 이후 실습에 사용됩니다.

### Task 3: 샘플 Blob 업로드

1. 스토리지 계정 블레이드 내 "데이터 저장소" 섹션에서 "컨테이너" 링크를 선택합니다.
2. 컨테이너 블레이드에서 "+ 컨테이너"를 선택합니다.
3. 새 컨테이너 창에서:
    - "이름" 텍스트 상자에 "images"를 입력합니다.
    - "만들기"를 선택합니다.
4. 생성된 "images" 컨테이너로 이동합니다.
5. "images" 블레이드에서 "업로드"를 선택합니다.
6. Blob 업로드 창에서:
    - 파일 섹션에서 "파일 찾아보기"를 선택하거나 드래그 앤 드롭 기능을 사용합니다.
    - 파일 탐색기 창에서 (랩경로루트)\Labs01\Starter\Images로 이동하여 "grilledcheese.jpg" 파일을 선택한 후 "열기"를 선택합니다.
    - "파일이 이미 존재하는 경우 덮어쓰기" 체크 박스가 선택되어 있는지 확인합니다.
7. "업로드"를 선택하고 Blob 업로드가 완료될 때까지 기다립니다.

### Task 4: 웹 앱 생성
1. Azure 포털의 왼쪽 내비게이션 창에서 **리소스 만들기**를 선택합니다.
2. **리소스 만들기** 블레이드의 *서비스 및 마켓플레이스 검색* 텍스트 상자에 **웹 앱**을 입력하고 Enter 키를 누릅니다.
3. 마켓플레이스 검색 결과에서 **웹 앱** 항목을 선택합니다.
4. **웹 앱** 블레이드에서 **생성**을 클릭합니다.
5. **웹 앱 만들기** 블레이드의 **기본** 탭에서 다음과 같이 설정합니다:
    - **구독**: 기본값 유지
    - **리소스 그룹**: **<리소스 그룹 이름>** 선택
    - **이름**: `imgapi[본인이름]` 입력
    - **고유 기본 호스트 이름 보안**: 비활성화
    - **배포 방식**: **코드** 선택
    - **런타임 스택**: **.NET 8 (LTS)** 선택
    - **운영 체제**: **Windows** 선택
    - **지역**: **(Asia Pacific) Korea Central** 선택
    - **Windows 계획 ((Asia Pacific) Korea Central)**: **새로 만들기**를 선택한 후, 이름에 **KTAppServiceHandsOn** 입력하고 **확인** 클릭
    - **요금제**: **표준 S1** 선택
    ![alt text](./images/image3.png)
6. **모니터링 + 보안** 탭에서, **Application Insights 사용** 옵션을 **아니오**로 선택한 후 **검토 + 만들기**를 클릭합니다.
7. **검토 + 만들기** 탭에서 선택한 옵션들을 검토하고 **만들기**을 클릭하여 웹앱을 생성합니다. (생성이 완료될 때까지 기다립니다.)
8. 생성 완료 후, **개요** 블레이드에서 **리소스로 이동** 버튼을 클릭하여 새로 생성된 웹앱의 블레이드로 이동합니다.

### Task 5: 웹앱 구성

1. 완료 후 **리소스 이동** 클릭하여 리소스 그룹 블레이드로 이동
1. App Service 블레이드의 Settings 섹션에서 **환경 변수** 링크를 선택합니다.
2. **앱 설정** 탭에서 **+ 추가** 버튼을 클릭합니다.
3. 팝업 창에서 다음 정보를 입력합니다:  
    - **이름**: StorageConnectionString  
    - **값**: 이전에 복사한 스토리지 연결 문자열을 붙여넣습니다.  
    - **배포 슬롯 설정**: 기본값 유지.
4. 팝업 창을 닫고 앱 설정 섹션으로 돌아가려면 **적용**을 클릭합니다.
5. 앱 설정 섹션 하단에서 **적용**을 선택합니다.  
    ※ 앱 설정을 업데이트할 때 앱이 재시작된다는 경고가 나타나면 **확인**을 클릭하고 설정이 저장될 때까지 기다립니다.
6. App Service URL을 확인하려면 **개요** 링크로 이동하여 **기본 도메인** 아래의 값을 복사한 다음 메모장에 붙여넣습니다.  
    - 복사한 도메인 앞에 **https://**를 추가합니다.  
    - 이 URL은 이후 실습 단계에서 사용됩니다.

참고: 현재 이 URL을 방문하면 자리 표시자 웹페이지가 표시됩니다. 웹앱에 아직 코드가 배포되지 않았기 때문에 이후 단계에서 배포 작업을 수행합니다.

### Task 6: ASP.NET 웹 애플리케이션을 Web Apps에 배포

1. 작업 표시줄에서 Visual Studio Code 아이콘을 선택합니다.
2. 파일 메뉴에서 **Open Folder**를 선택합니다.
3. 파일 탐색기 창에서 `Starter/API` 폴더로 이동하여 **Select Folder**를 클릭합니다.
   > 참고: 빌드 및 디버그 자산 추가 관련 프롬프트는 무시합니다.
4. VS Code 탐색기에서 `Controllers` 폴더를 확장한 후 `ImagesController.cs` 파일을 엽니다.
5. 26번째 줄의 `GetCloudBlobContainer` 메서드를 확인합니다.
6. 36번째 줄의 `Get` 메서드를 확인합니다.
7. 68번째 줄의 `Post` 메서드를 확인합니다.
8. 작업 표시줄에서 터미널 아이콘을 선택합니다.
9. 터미널에서 다음 명령어를 실행하여 Azure CLI에 로그인합니다:
   ```pwsh
   az login
   ```
   - Microsoft Edge 창에서 계정 정보를 입력하여 인증을 완료합니다.
10. 로그인 후 터미널로 돌아가 명령 실행이 완료될 때까지 기다립니다.
11. 다음 명령어로 `<리소스-그룹이름>` 리소스 그룹 내 앱 목록을 조회합니다:
    ```pwsh
    az webapp list --resource-group KT-AppServiceHandsOn
    ```
12. `imgapi`로 시작하는 앱만 필터링합니다:
    ```pwsh
    az webapp list --resource-group KT-AppServiceHandsOn --query "[?starts_with(name, 'imgapi')]"
    ```
13. 실제 앱 이름만 출력합니다:
    ```pwsh
    az webapp list --resource-group KT-AppServiceHandsOn --query "[?starts_with(name, 'imgapi')].{Name:name}" --output tsv
    ```
15. `api.zip`을 웹앱에 배포합니다:
    ```pwsh
    az webapp deployment source config-zip --resource-group KT-AppServiceHandsOn --src api.zip --name <앱이름>
    ```
    > 참고: `<앱이름>`을 실제 웹앱 이름으로 교체합니다.
16. 배포가 완료될 때까지 기다립니다.
17. Azure 포털에서 리소스 그룹 메뉴를 클릭하고 `KT-AppServiceHandsOn`을 선택합니다.
18. `imgapi[본인이름]` 웹앱을 선택하고 App Service 블레이드에서 **Browse**를 클릭합니다.
19. JSON 배열로 이미지 URL을 확인합니다.
20. Visual Studio Code 및 터미널을 종료합니다.


### Review
Azure Storage 및 App Service에 백엔드 API를 배포하고, Blob 컨테이너에서 이미지를 조회하는 API 호출을 검증했습니다.

---

## Exercise 2: 프론트엔드 웹앱 구축

### Task 1: 웹앱 생성
1. Azure 포털 왼쪽 탐색 메뉴에서 **리소스 만들기** 를 선택합니다.
2. **검색 서비스 및 마켓플레이스** 상자에 **웹 앱** 을 입력하고 Enter를 누릅니다.
3. 검색 결과에서 **웹 앱** 을 선택하고 **만들기(Create)** 를 클릭합니다.
4. **기본** 탭에서 다음과 같이 설정합니다.
   - 구독(Subscription): 기본값 유지
   - 리소스 그룹(Resource group): **KT-AppServiceHandsOn** 선택
   - 이름(Name): `imgweb[본인이름]` 입력
   - 호스트 이름 보안(Secure unique default hostname): 비활성화
   - 게시(Publish): **코드(Code)**
   - 런타임 스택(Runtime stack): **.NET 8 (LTS)**
   - 운영 체제(Operating System): **Windows**
   - 지역(Region): **(Asia Pacific) Korea Central**
   - Windows 계획(Windows Plan): **KTAppServiceHandsOn (S1)**
5. **모니터링 + 보안** 탭에서 **Application Insights 사용** 옵션을 **아니오** 로 설정하고 **검토 + 만들기** 를 클릭합니다.
6. **검토 + 만들기** 탭에서 설정을 확인한 뒤 **만들기** 를 클릭합니다.
7. 생성이 완료되면 **개요** 블레이드에서 **리소스로 이동** 버튼을 클릭하여 새 웹앱 블레이드로 이동합니다.

### Task 2: 웹앱 구성 (ApiUrl 환경 변수 설정)

1. App Service 블레이드의 Settings 섹션에서 **환경 변수** 링크를 선택합니다.
2. **앱 설정** 탭에서 **+ 추가** 버튼을 클릭합니다.
3. 팝업 창에서 다음 정보를 입력합니다:
    - **이름**: ApiUrl  
    - **값**: 이전에 복사한 웹앱 URL (프로토콜 포함, 예: https://yourwebapp.azurewebsites.net/)
    - **배포 슬롯 설정**: 기본값 그대로 사용
4. **확인** 버튼을 선택합니다.
5. 상단 메뉴에서 **적용**을 클릭한 후, 설정이 완료될 때까지 기다립니다.

### Task 3: ASP.NET 웹 애플리케이션을 Web Apps에 배포

1. 작업 표시줄에서 Visual Studio Code 아이콘을 선택합니다.
2. 파일 메뉴에서 **폴더 열기**를 선택합니다.
3. 파일 탐색기 창에서 Allfiles (랩경로루트)\Labs01\Starter\Web 폴더로 이동하여 **폴더 선택**을 클릭합니다.  
    ※ 필요 자산 추가 및 해결되지 않은 종속성 복원 관련 프롬프트는 무시하세요.
4. VS Code 탐색기에서 **Pages** 폴더를 확장한 후 **Index.cshtml.cs** 파일을 엽니다.
5. 편집기에서 **IndexModel** 클래스의 30번째 줄에 있는 **OnGetAsync** 메서드를 확인하여 API로부터 이미지 목록을 가져오는 코드를 점검합니다.
6. 41번째 줄에 있는 **OnPostAsync** 메서드를 확인하여 업로드된 이미지를 백엔드 API로 스트리밍하는 코드를 점검합니다.
7. 작업 표시줄에서 터미널 아이콘을 선택합니다.
8. 열린 터미널에서 다음 명령어를 입력하고 엔터 키를 눌러 Azure CLI에 로그인합니다:
```pwsh
az login
```
9. Microsoft Edge 브라우저 창에서 Microsoft 계정의 이메일 주소와 비밀번호를 입력한 후 **로그인**을 선택합니다. 터미널로 돌아가 로그인 완료를 기다립니다.
10. 다음 명령어를 입력하여 KT-AppServiceHandsOn 리소스 그룹 내 모든 앱을 나열합니다:
```pwsh
az webapp list --resource-group KT-AppServiceHandsOn
```
11. 이름이 imgweb*로 시작하는 앱을 확인하려면 다음 명령어를 입력합니다:
```pwsh
az webapp list --resource-group KT-AppServiceHandsOn --query "[?starts_with(name, 'imgweb')]"
```
12. imgweb* 프리픽스를 가진 단일 앱의 이름만 출력하려면 다음 명령어를 입력합니다:
```pwsh
az webapp list --resource-group KT-AppServiceHandsOn --query "[?starts_with(name, 'imgweb')].{Name:name}" --output tsv
```
14. 다음 명령어를 입력하여 web.zip 파일을 이전에 생성한 웹앱에 배포합니다. <웹앱 이름> 부분은 실제 웹앱 이름으로 대체합니다:
```pwsh
az webapp deployment source config-zip --resource-group KT-AppServiceHandsOn --src web.zip --name <웹앱 이름>
```
15. 배포가 완료될 때까지 기다립니다.
16. Azure 포털의 왼쪽 내비게이션 창에서 **리소스 그룹**을 선택합니다.
17. **KT-AppServiceHandsOn** 리소스 그룹을 선택합니다.
18. 생성한 **imgweb[본인이름]** 웹앱을 선택한 후 App Service 블레이드에서 **Browse**를 클릭합니다.
19. 이미지 갤러리 목록에서 이전에 스토리지에 업로드된 이미지가 하나 존재하는지 확인합니다.
20. Contoso Photo Gallery 웹페이지의 “새 이미지 업로드” 섹션에서 다음 작업을 수행합니다:
    a. **Browse** 버튼을 선택합니다.  
    b. 파일 탐색기에서 Allfiles (랩경로루트)\Labs01\Starter\Images 폴더로 이동하여 **banhmi.jpg** 파일을 선택하고 **열기**를 클릭합니다.  
    c. **Upload** 버튼을 선택합니다.
21. 갤러리 이미지 목록이 새 이미지로 업데이트되었는지 확인합니다. (필요에 따라 브라우저를 새로 고침할 수 있습니다.)
22. 현재 실행 중인 Visual Studio Code와 터미널을 종료합니다.

### Review

이번 실습에서는 Azure 웹앱을 생성하고 기존 웹 애플리케이션의 코드를 클라우드 리소스에 배포하였습니다.

---

## Exercise 3: VS Code Extension을 이용한 프론트엔드 웹앱 배포

### Task 1: VS Code App Service Extension 설치
1. VS Code 좌측 Activity Bar에서 **Extensions** 뷰를 엽니다.
2. 검색창에 `Azure App Service`를 입력하고, **Azure App Service** 확장을 설치합니다.
3. 설치 후 VS Code를 재시작합니다.

### Task 2: 프로젝트 코드 변경
1. ****Starter/Web** 폴더를 VS Code에서 엽니다.
2. `Pages/Index.cshtml` 파일을 열고, Images 텍스트가 있는 영역에 `From VS Code`라는 문구를 추가해줍니다.
   ```html
    <h1 class="display-1">
        Images - From VS Code
    </h1>
   ```
3. 터미널을 열어 아래의 코드를 입력해 프로젝트를 게시해줍니다.
    ```
    dotnet publish -c Release -o publish
    ```

### Task 3: Azure 로그인 및 웹앱 연결
1. VS Code 우측 하단의 Azure 아이콘(하기)에서 **Sign in to Azure** 링크를 클릭합니다.
2. 브라우저에서 Azure 로그인 절차를 완료합니다.
3. **Azure** 뷰에서 **App Service** 섹션을 확장하고, `KT-AppServiceHandsOn` 리소스 그룹 아래의 `imgweb[본인이름]` 웹앱을 찾습니다.

### Task 4: Extension을 통한 배포
1. **imgweb[본인이름]** 웹앱을 우클릭하고, **Deploy to Web App...**을 선택합니다.
2. 배포할 폴더로 `publish` 폴더를 지정합니다.
3. 생성된 `publish` 폴더를 선택한 후, 배포 확인 메시지가 나타나면 **Deploy**를 클릭하고 진행 상황을 확인합니다.
4. 배포가 완료되면 뜨는 메시지 팝업에서 **Browse Website**를 클릭해 웹사이트를 획인합니다.
![alt text](./images/image6.png) 

### Task 5: 결과 확인
- 브라우저에서 웹앱 페이지가 로드되면, 페이지에서 `From VS Code` 텍스트를 확인합니다.
- 변경된 코드가 정상적으로 반영되었는지 검증합니다.

### Task 6: 업데이트 배포
1. VS Code 좌측에서 다시 Explorer를 선택합니다.
1. `Pages/Index.cshtml` 파일을 다시 열고, Images 텍스트가 있는 영역에 `From VS Code`라는 문구를 추가해줍니다.
   ```html
    <h1 class="display-1">
        Images - From VS Code 업데이트
    </h1>
   ```
3. 터미널에 아래의 코드를 입력해 프로젝트를 게시해줍니다.
    ```
    dotnet publish -c Release -o publish
    ```
4. Explorer의 publish 폴더에서 오른쪽 클릭을 하고 **Deploy to Web App...** 을 선택합니다.

5. 상단 팔레트에서 **imgweb[본인이름]** 웹앱을 클릭해 배포합니다.
![alt text](./images/image5.png)

6. 배포가 완료되면 웹사이트에 `Images - From VS Code 업데이트` 문구가 있는 지 확인합니다.


### Review
- VS Code App Service 확장을 사용하여 코드 변경 후 웹앱을 배포하고, 배포된 변경 내용을 확인했습니다.