# git-save.ps1
# Helper script for Git add + commit + push with safety checks

Write-Host "🔍 Checking Git status..."
git status

Write-Host ""
$commitMsg = Read-Host "✍️  Enter commit message"

if ([string]::IsNullOrWhiteSpace($commitMsg)) {
    Write-Host "❌ Commit message cannot be empty. Aborting."
    exit 1
}

# Stage changes (all tracked modifications/deletions)
git add -u

# Stage all new files/folders (anywhere in repo)
git add .

# Commit with your message
git commit -m "$commitMsg"

# Push to remote
git push

Write-Host "✅ Changes committed and pushed to GitHub successfully!"
