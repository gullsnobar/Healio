# HUGGING FACE INTEGRATION TEST (PowerShell)
# For Windows users - quick test script
# Run: .\test-huggingface-integration.ps1

Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     HUGGING FACE INTEGRATION TEST - QUICK START            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Test 1: Check if .env file exists and has the key
Write-Host "TEST 1: Checking .env Configuration" -ForegroundColor Blue
Write-Host "━" * 60 -ForegroundColor Blue

if (Test-Path ".\.env") {
    $envContent = Get-Content ".\.env" | Select-String "HuggingFace_API_KEY"
    if ($envContent) {
        Write-Host "✅ PASSED: HuggingFace_API_KEY found in .env" -ForegroundColor Green
        Write-Host "   Key is configured and ready`n" -ForegroundColor Green
    } else {
        Write-Host "❌ FAILED: HuggingFace_API_KEY not found in .env" -ForegroundColor Red
        Write-Host "   Add this line to your .env file:" -ForegroundColor Yellow
        Write-Host "   HuggingFace_API_KEY=your_api_key_here`n" -ForegroundColor Yellow
        exit
    }
} else {
    Write-Host "❌ FAILED: .env file not found" -ForegroundColor Red
    exit
}

# Test 2: Run the Node test script
Write-Host "TEST 2: Running Comprehensive Integration Tests" -ForegroundColor Blue
Write-Host "━" * 60 -ForegroundColor Blue

if (Test-Path "package.json") {
    Write-Host "Running: node test-huggingface-integration.js`n" -ForegroundColor Cyan
    & node test-huggingface-integration.js
} else {
    Write-Host "❌ package.json not found. Make sure you're in the backend directory." -ForegroundColor Red
}

Write-Host "`n✅ Test completed! Check the results above.`n" -ForegroundColor Green
