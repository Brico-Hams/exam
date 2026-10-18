param(
    [switch]$SkipWebBuild
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Push-Location $root
try {
    if (-not $env:JAVA_HOME -or -not (Test-Path (Join-Path $env:JAVA_HOME 'bin\javac.exe'))) {
        throw 'Set JAVA_HOME to a JDK 21 installation. Java 8 is not compatible.'
    }
    $javaVersion = (& (Join-Path $env:JAVA_HOME 'bin\javac.exe') -version | Out-String)
    if ($LASTEXITCODE -ne 0 -or $javaVersion -notmatch 'javac 21[.]') { throw "JDK 21 required. Found: $javaVersion" }
    $sdk = $env:ANDROID_HOME
    if (-not $sdk) { $sdk = $env:ANDROID_SDK_ROOT }
    if (-not $sdk -or -not (Test-Path (Join-Path $sdk 'platforms\android-36\android.jar'))) {
        throw 'Set ANDROID_HOME to an Android SDK containing platforms;android-36. Install and accept licenses yourself.'
    }
    $apksigner = Join-Path $sdk 'build-tools\35.0.0\apksigner.bat'
    $aapt = Join-Path $sdk 'build-tools\35.0.0\aapt.exe'
    if (-not (Test-Path $apksigner) -or -not (Test-Path $aapt)) {
        throw 'Android SDK build-tools;35.0.0 is required for verification.'
    }
    if (-not $SkipWebBuild) {
        & npm.cmd run android:sync:public
        if ($LASTEXITCODE -ne 0) { throw 'Web build or Capacitor sync failed.' }
    }
    Push-Location (Join-Path $root 'android')
    try {
        & .\gradlew.bat --no-daemon --max-workers=2 assembleDebug
        if ($LASTEXITCODE -ne 0) { throw 'Gradle assembleDebug failed.' }
    } finally { Pop-Location }
    $apk = Join-Path $root 'android\app\build\outputs\apk\debug\app-debug.apk'
    & $apksigner verify --verbose --print-certs $apk
    if ($LASTEXITCODE -ne 0) { throw 'APK signature verification failed.' }
    $badging = (& $aapt dump badging $apk | Out-String)
    if ($LASTEXITCODE -ne 0 -or $badging -notmatch "package: name='com.hamexamprep.app'" -or
        $badging -notmatch "sdkVersion:'24'" -or $badging -notmatch "targetSdkVersion:'36'") {
        throw 'APK manifest verification failed.'
    }
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $archive = [IO.Compression.ZipFile]::OpenRead($apk)
    try {
        foreach ($file in (Get-ChildItem (Join-Path $root 'dist') -Recurse -File)) {
            $relative = $file.FullName.Substring((Join-Path $root 'dist').Length + 1).Replace('\', '/')
            $entry = $archive.GetEntry("assets/public/$relative")
            if (-not $entry) { throw "Missing APK web asset: $relative" }
            $stream = $entry.Open()
            $sha = [Security.Cryptography.SHA256]::Create()
            try {
                $actual = [BitConverter]::ToString($sha.ComputeHash($stream)).Replace('-', '')
                if ($actual -ne (Get-FileHash $file.FullName -Algorithm SHA256).Hash) {
                    throw "Stale APK web asset: $relative"
                }
            } finally { $sha.Dispose(); $stream.Dispose() }
        }
    } finally { $archive.Dispose() }
    $output = Join-Path $root 'artifacts\android'
    New-Item -ItemType Directory -Force -Path $output | Out-Null
    $destination = Join-Path $output 'EA5KAO-Ham-Exam-1.0.0-debug.apk'
    Copy-Item $apk $destination -Force
    $hash = (Get-FileHash $destination -Algorithm SHA256).Hash.ToLowerInvariant()
    "$hash  EA5KAO-Ham-Exam-1.0.0-debug.apk" | Set-Content (Join-Path $output 'SHA256SUMS.txt') -Encoding ASCII
    $badging | Set-Content (Join-Path $output 'android-manifest.txt') -Encoding UTF8
    $commit = (& git rev-parse HEAD | Out-String).Trim()
    if ($LASTEXITCODE -ne 0) { throw 'Cannot identify source commit.' }
    [ordered]@{
        builtAtUtc = (Get-Date).ToUniversalTime().ToString('o')
        commit = $commit
        variant = 'debug'
        applicationId = 'com.hamexamprep.app'
        versionName = '1.0'
        versionCode = 1
        minSdk = 24
        targetSdk = 36
        sha256 = $hash
        bytes = (Get-Item $destination).Length
        webAssetsVerified = $true
        deviceTested = $false
        distribution = 'Testing only. Debug-signed; not a Google Play release.'
    } | ConvertTo-Json | Set-Content (Join-Path $output 'build-info.json') -Encoding UTF8
    Write-Output "Verified APK: $destination"
    Write-Output "SHA-256: $hash"
} finally { Pop-Location }
