<# =====================================================================
 verify-score-screen-fast.ps1
 Uni App – 2 | ScoreScreen drift detector (fast, read-only)
 Skips node_modules/, android/, ios/, .git/, backups, etc.
===================================================================== #>

function Section([string]$title) { Write-Host "`n=== $title ===" -ForegroundColor Cyan }
function Pass([string]$msg)     { Write-Host "PASS: $msg" -ForegroundColor Green }
function Warn([string]$msg)     { Write-Host "WARN: $msg" -ForegroundColor Yellow }
function Fail([string]$msg)     { Write-Host "FAIL: $msg" -ForegroundColor Red }

$root = (Get-Location).Path
$hasFailures = $false
$hasWarnings = $false
$scorePath = $null

# Directories to ignore (case-insensitive)
$ignoreDirs = @(
  'node_modules', '.git', '.expo', '.gradle', '.idea',
  'android', 'ios', 'web-build', 'dist', 'build',
  'backups', '_backup', '_app', 'old', 'archive'
)

# Build a regex like \\(dir1|dir2|dir3)\\ to match any ignored folder in FullName
$ignorePattern = '\\(' + ($ignoreDirs -join '|') + ')\\'

function Get-CodeFiles {
  param(
    [string[]]$Extensions = @('*.js','*.jsx')
  )
  # Get all matching files under root, then filter out paths containing ignored dirs
  $files = @()
  foreach ($ext in $Extensions) {
    $files += Get-ChildItem -Path $root -Recurse -File -Include $ext -ErrorAction SilentlyContinue
  }
  $files | Where-Object { $_.FullName -notmatch $ignorePattern }
}

# Convenience: read one file quickly
function Read-FileRaw([string]$p) {
  if (Test-Path $p) { Get-Content -Raw -Path $p } else { $null }
}

# --- 1) Confirm which ScoreScreen file is actually wired ---
Section "1) ScoreScreen export location"
$exportHits = Get-CodeFiles | Select-String -SimpleMatch "export default function ScoreScreen" -ErrorAction SilentlyContinue |
  Select-Object Path, LineNumber | Sort-Object Path -Unique

if (-not $exportHits) {
  Fail "No 'export default function ScoreScreen' found in scanned paths."
  $fallback = Join-Path $root "src\screens\ScoreScreen.js"
  if (Test-Path $fallback) {
    Warn "Fallback path exists: $fallback"
    $hasWarnings = $true
    $scorePath = $fallback
  }
  $hasFailures = $true
} elseif ($exportHits.Count -gt 1) {
  $hasWarnings = $true
  Warn "Multiple ScoreScreen exports found (possible duplicate in tree):"
  $exportHits | ForEach-Object { Write-Host " - $($_.Path)" }
  $canonical = $exportHits | Where-Object { $_.Path -match "src\\screens\\ScoreScreen\.js$" } | Select-Object -First 1
  $scorePath = if ($canonical) { $canonical.Path } else { $exportHits[0].Path }
  Warn "Using this path for content checks: $scorePath"
} else {
  $scorePath = $exportHits[0].Path
  if ($scorePath -match "src\\screens\\ScoreScreen\.js$") {
    Pass "Single ScoreScreen export found at: $scorePath"
  } else {
    $hasWarnings = $true
    Warn "ScoreScreen export found at a non-standard path: $scorePath (expected src\\screens\\ScoreScreen.js)"
  }
}

# --- 2) Check App.js is pointing to the right screen ---
Section "2) App.js import path"
$AppPath = Join-Path $root "App.js"
if (Test-Path $AppPath) {
  $appImport = Select-String -Path $AppPath -Pattern 'import\s+ScoreScreen\s+from\s+["'']\./src/screens/ScoreScreen["'']'
  if ($appImport) {
    Pass "App.js imports ScoreScreen from ./src/screens/ScoreScreen"
  } else {
    $hasFailures = $true
    Fail "No correct import for ScoreScreen found in App.js (expected: import ScoreScreen from './src/screens/ScoreScreen')."
    $otherImports = Select-String -Path $AppPath -Pattern 'import\s+ScoreScreen\s+from\s+["''](.+?)["'']'
    if ($otherImports) {
      Warn "Found other ScoreScreen import(s):"
      $otherImports | ForEach-Object { Write-Host " - $($_.Line.Trim())" }
    }
  }
} else {
  $hasFailures = $true
  Fail "App.js not found in project root."
}

# --- 3) Look for the UC-styled elements in ScoreScreen ---
Section "3) UC-styled strings in ScoreScreen"
$required = @("Save Match","End Match","+10 Starter","+5 Bonus","UNDO","Reset","Player A","Player B","Player C","Player D")
if ($scorePath -and (Test-Path $scorePath)) {
  $content = Read-FileRaw $scorePath
  $missing = @()
  foreach ($s in $required) {
    if ($content -notlike "*$s*") { $missing += $s }
  }
  if ($missing.Count -eq 0) {
    Pass "All required UI strings present (styled/gold build)."
  } else {
    $hasWarnings = $true
    Warn ("Missing UI strings (suggests plain/older screen): " + ($missing -join ", "))
  }
} else {
  $hasFailures = $true
  Fail "ScoreScreen file not found at: $scorePath"
}

# --- 4) Quick style fingerprint ---
Section "4) Style fingerprint"
if ($scorePath -and (Test-Path $scorePath)) {
  $styleHits = Select-String -Path $scorePath -Pattern 'saveButton|endButton|grid|row|col'
  if ($styleHits) {
    $uniq = $styleHits.Matches.Value | Select-Object -Unique
    Pass ("Found style/structure cues: " + ($uniq -join ", "))
  } else {
    $hasWarnings = $true
    Warn "No 'saveButton|endButton|grid|row|col' hits — styled layout cues not detected."
  }
}

# --- 5) Safe-area + footer bar cues ---
Section "5) Safe-area/footer cues"
if ($scorePath -and (Test-Path $scorePath)) {
  $footerHits = Select-String -Path $scorePath -Pattern "SafeAreaView|edges=\[|position:\s*'?absolute'?|bottom:\s*0|zIndex|elevation"
  if ($footerHits) {
    Pass "Found safe-area/footer anchoring cues."
  } else {
    $hasWarnings = $true
    Warn "No safe-area/footer cues found (Save/End bar may not be anchored)."
  }
}

# --- 6) Tabs theme (bottom bar styling) ---
Section "6) Tabs theme in App.js"
if (Test-Path $AppPath) {
  $tabHits = Select-String -Path $AppPath -Pattern "createBottomTabNavigator|tabBarStyle|tabBarActiveTintColor|tabBarBackground|headerShown"
  if ($tabHits) {
    Pass "Tab navigator + some styling present in App.js."
  } else {
    $hasWarnings = $true
    Warn "Tab styling not detected in App.js (pale/unstyled bottom bar likely)."
  }
}

# --- 7) Duplicates & stray folders (fast) ---
Section "7) Duplicates / suspicious folders"
$dups = Get-CodeFiles | Where-Object { $_.Name -like '*ScoreScreen*.js' } | Select-Object -ExpandProperty FullName
if ($dups.Count -gt 0) {
  Write-Host "ScoreScreen-like files (filtered set):" -ForegroundColor DarkCyan
  $dups | ForEach-Object { Write-Host " - $($_.Replace($root + '\',''))" }
  $nonCanonical = $dups | Where-Object { $_ -notmatch '\\src\\screens\\ScoreScreen\.js$' }
  if ($nonCanonical.Count -gt 0) {
    $hasWarnings = $true
    Warn "Non-canonical ScoreScreen files exist (could shadow the real one)."
  } else {
    Pass "Only the canonical src\\screens\\ScoreScreen.js present."
  }
} else {
  $hasWarnings = $true
  Warn "No *ScoreScreen*.js files found in filtered set."
}

# Also list suspicious root-level dirs actually present (don’t scan into them)
$presentSuspects = Get-ChildItem . -Directory | Where-Object {
  $ignoreDirs -contains $_.Name -or $_.Name -match '^(screens|screen|old|backup|_app)'
}
if ($presentSuspects) {
  $hasWarnings = $true
  Warn "Suspicious root-level directories that can hide dupes:"
  $presentSuspects | ForEach-Object { Write-Host " - $($_.FullName)" }
} else {
  Pass "No suspicious root-level directories named screens/screen/old/backup/_app."
}

# --- Summary ---
Section "Summary"
if ($hasFailures) {
  Fail "One or more hard failures detected. Review FAIL items above."
} elseif ($hasWarnings) {
  Warn "No hard failures, but warnings found — drift is likely. See WARN items."
} else {
  Pass "All checks passed. Current tree looks aligned with the gold-master Score screen."
}
