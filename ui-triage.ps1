function Title($t){Write-Host "`n=== $t ===" -ForegroundColor Cyan}
function Print($p,$n=40){ if(Test-Path $p){ Write-Host "`n--- $p (first $n lines) ---" -ForegroundColor DarkCyan; Get-Content $p -TotalCount $n } else { Write-Host "Missing: $p" -ForegroundColor Yellow } }

Title "1) App.js quick scan (imports/wrappers/tab options)"
if(Test-Path .\App.js){
  Select-String -Path .\App.js -Pattern 'GradientBackground|SafeAreaProvider|NavigationContainer|createBottomTabNavigator|tabBar|headerShown|backgroundColor' | Select LineNumber,Line | Format-Table -Auto
} else { Write-Host "App.js not found" -ForegroundColor Red }

Title "2) App.js (first 80 lines)"
Print ".\App.js" 80

Title "3) ScoreScreen.js (first 80 lines)"
Print ".\src\screens\ScoreScreen.js" 80

Title "4) Look for global wrappers that can alter layout"
Get-ChildItem -Recurse -Include styles.js,style*.js -File | Select FullName
Select-String -Path .\App.js -Pattern 'styles,?\s*{\s*GradientBackground' -SimpleMatch | Select LineNumber,Line

Title "5) Any gradient or global background usage?"
Select-String -Path .\App.js,.\src\**\*.js -Pattern 'GradientBackground|expo-linear-gradient|LinearGradient' -ErrorAction SilentlyContinue | Select Path,LineNumber,Line

Title "6) Safe-area providers"
Select-String -Path .\App.js,.\src\**\*.js -Pattern 'SafeAreaProvider|SafeAreaView' -ErrorAction SilentlyContinue | Select Path,LineNumber,Line

Title "7) Package versions snapshot"
(Get-Content .\package.json -Raw | ConvertFrom-Json).dependencies.GetEnumerator() | Sort-Object Name | Format-Table Name, Value

Title "8) Metro cache reminder"
Write-Host "If UI looks stale: run 'npx expo start -c' then reload in Expo Go." -ForegroundColor Yellow
