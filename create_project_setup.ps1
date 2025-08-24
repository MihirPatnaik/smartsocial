# ========================
# SmartSocial Project Setup Script
# ========================

# Base folder
$basePath = "D:\datasenceai\src\smartsocial"

# Folders to process
$folders = @("agents", "components", "pages", "server", "types", "utils")

# Files to exclude from overwrite
$excludeFiles = @(
    "agents\imageAgents.ts",
    "components\ChatBox.tsx",
    "pages\smartsocial.tsx",
    "server\claudeProxy.ts"
)
$excludeRoot = @("D:\datasenceai\server.ts")

# Create placeholder files if they don't exist
foreach ($folder in $folders) {
    $folderPath = Join-Path $basePath $folder

    if (-not (Test-Path $folderPath)) {
        New-Item -Path $folderPath -ItemType Directory | Out-Null
    }

    $fileName = "placeholder_" + $folder + ".txt"  # placeholder name
    $filePath = Join-Path $folderPath $fileName

    if ($excludeFiles -contains "$folder\$fileName") {
        Write-Host "Skipping excluded file: $folder\$fileName"
    } elseif (-not (Test-Path $filePath)) {
        "This is a placeholder for $folder folder" | Out-File -Encoding utf8 $filePath
        Write-Host "Created: $filePath"
    }
}

# Root-level excluded files check
foreach ($rootFile in $excludeRoot) {
    if (Test-Path $rootFile) {
        Write-Host "Skipping excluded root file: $rootFile"
    }
}

# Create .gitignore in root
$gitignorePath = "D:\datasenceai\.gitignore"
@"
# Node modules
node_modules/

# Environment files
.env
.env.local
.env.*.local
.env.bckup.txt
.env.local.backup

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build output
dist/
build/

# System files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
"@ | Out-File -Encoding utf8 $gitignorePath
Write-Host "Created: .gitignore"

# Create .env.example
$envExamplePath = "D:\datasenceai\.env.example"
@"
# API Keys (replace with your own values)
VITE_OPENAI_API_KEY=your_openai_key_here
VITE_CLAUDE_API_KEY=your_claude_key_here
"@ | Out-File -Encoding utf8 $envExamplePath
Write-Host "Created: .env.example"

Write-Host "✅ Project setup complete."
