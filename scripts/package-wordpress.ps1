$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Push-Location $root
try {
    & npm run build:public
    if ($LASTEXITCODE -ne 0) { throw 'Public web build failed.' }
    $commit = (& git rev-parse HEAD | Out-String).Trim()
    if ($LASTEXITCODE -ne 0) { throw 'Cannot identify source commit.' }
    $output = Join-Path $root 'artifacts\wordpress'
    New-Item -ItemType Directory -Path $output -Force | Out-Null
    $name = "BricoHams-radio-examenes-$($commit.Substring(0, 7)).zip"
    $zipPath = Join-Path $output $name
    if (Test-Path $zipPath) { throw "Package already exists: $zipPath. Preserve it or choose a new source commit." }
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $dist = Join-Path $root 'dist'
    $archive = [IO.Compression.ZipFile]::Open($zipPath, [IO.Compression.ZipArchiveMode]::Create)
    $inventory = @()
    try {
        foreach ($file in Get-ChildItem $dist -Recurse -File) {
            $relative = $file.FullName.Substring($dist.Length + 1).Replace('\', '/')
            $entry = "radio-examenes/$relative"
            [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $file.FullName, $entry, [IO.Compression.CompressionLevel]::Optimal) | Out-Null
            $inventory += [ordered]@{
                path = $entry
                bytes = $file.Length
                sha256 = (Get-FileHash $file.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
            }
        }
    } finally { $archive.Dispose() }
    $archive = [IO.Compression.ZipFile]::OpenRead($zipPath)
    try {
        if ($archive.Entries.Count -ne $inventory.Count) { throw 'ZIP entry count mismatch.' }
        foreach ($item in $inventory) {
            $entry = $archive.GetEntry($item.path)
            if (-not $entry) { throw "Missing ZIP entry: $($item.path)" }
            $stream = $entry.Open()
            $sha = [Security.Cryptography.SHA256]::Create()
            try {
                $hash = [BitConverter]::ToString($sha.ComputeHash($stream)).Replace('-', '').ToLowerInvariant()
            } finally { $stream.Dispose(); $sha.Dispose() }
            if ($hash -ne $item.sha256) { throw "ZIP checksum mismatch: $($item.path)" }
        }
    } finally { $archive.Dispose() }
    $hash = (Get-FileHash $zipPath -Algorithm SHA256).Hash.ToLowerInvariant()
    "$hash  $name" | Set-Content (Join-Path $output "$name.sha256") -Encoding ASCII
    [ordered]@{
        builtAtUtc = (Get-Date).ToUniversalTime().ToString('o')
        commit = $commit
        workingTreeDirty = [bool]((& git status --porcelain | Out-String).Trim())
        mode = 'public'
        package = $name
        sha256 = $hash
        bytes = (Get-Item $zipPath).Length
        zipEntriesVerified = $inventory.Count
        files = $inventory
        wordpressPlugin = $false
        deployedToWordPress = $false
    } | ConvertTo-Json -Depth 5 | Set-Content (Join-Path $output "$name.json") -Encoding UTF8
    Copy-Item (Join-Path $root 'docs\WORDPRESS.md') (Join-Path $output 'WORDPRESS.md') -Force
    Write-Output "Verified web package: $zipPath"
    Write-Output "SHA-256: $hash"
    Write-Output "Verified entries: $($inventory.Count)"
} finally { Pop-Location }
