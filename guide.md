https://github.com/lunelake/kt-webapp-handson

https://www.eliostruyf.com/running-net-azure-functions-macos-visual-studio-code/

## 선행 설치

### Visual Studio Code 설치

1. 공식 홈페이지 (https://code.visualstudio.com/)에서 설치 프로그램을 다운로드합니다.
2. 다운로드한 파일을 실행하여 설치 마법사의 안내에 따라 설치를 완료합니다.
3. 설치 후 VS Code를 실행하여 필요한 확장 프로그램(예: C#, .NET 등)을 추가로 설치합니다.

### .NET 8 설치

1. .NET 8 공식 다운로드 페이지 (https://dotnet.microsoft.com/en-us/download/dotnet/8.0)로 이동합니다.
2. 운영 체제에 맞는 설치 프로그램을 선택하고 다운로드합니다.
3. 다운로드한 파일을 실행하여 설치를 진행합니다.
4. 설치 완료 후, 터미널이나 명령 프롬프트에서 "dotnet --version" 명령어로 설치 상태를 확인합니다.

맥 설치 가이드 : https://dev.to/rusydy/setting-up-net-on-macos-a-step-by-step-guide-14db

### Azure CLI 설치
https://learn.microsoft.com/ko-kr/cli/azure/install-azure-cli-windows?view=azure-cli-latest&pivots=winget

```
brew update
brew install azure-cli
```


### Azure Function Core Tool 설치
https://github.com/Azure/azure-functions-core-tools/releases

```
brew tap azure/functions
brew install azure-functions-core-tools@4
```


### Docker Desktop 설치

- https://www.docker.com/products/docker-desktop 에서 설치
- 설치 후 Docker가 정상 실행 중인지 docker version 으로 확인