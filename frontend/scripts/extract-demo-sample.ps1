# Extracts a product sample from the EasiShop API for UI demo use.
# Usage:  .\scripts\extract-demo-sample.ps1
# Reads credentials from .env (username / password).

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

function Get-EnvValue([string]$key) {
  $line = Get-Content ".env" | Where-Object { $_ -match "^\s*$key\s*=" } | Select-Object -First 1
  if (-not $line) { throw "Missing '$key' in .env" }
  return ($line -split "=", 2)[1].Trim()
}

$user = Get-EnvValue "username"
$pass = Get-EnvValue "password"
$pair = "${user}:${pass}"

$categoryQueries = @{
  "Milk & Dairy" = @("milk", "yoghurt", "cheese", "eggs")
  "Bakery" = @("bread", "rolls")
  "Pantry" = @("rice", "oil", "sugar", "pasta")
  "Beverages & Juices" = @("coffee", "juice", "tea")
  "Toiletries" = @("toothpaste", "deodorant")
  "Haircare" = @("shampoo")
  "Cleaning" = @("detergent", "cleaner")
  "Meat, Poultry & Fish" = @("chicken", "mince")
  "Fruits & Vegetables" = @("banana", "tomato", "apple")
  "Skincare" = @("cream", "serum")
  "Bath and Body" = @("soap", "body wash")
  "Frozen" = @("frozen")
  "Kids & Baby" = @("nappies", "wipes")
  "Wine & Bubbles" = @("wine")
}

$retailerMap = @(
  @{ code = "chk"; name = "Checkers" },
  @{ code = "dsc"; name = "Dischem" },
  @{ code = "pnp"; name = "Pick n Pay" },
  @{ code = "srt"; name = "Shoprite" },
  @{ code = "woo"; name = "Woolworths" }
)

function Get-Slug([string]$name) {
  ($name.ToLower() -replace "&", "and" -replace "[^a-z0-9]+", "-" -replace "(^-|-`$)", "")
}

$all = New-Object System.Collections.Generic.List[object]

foreach ($category in $categoryQueries.Keys) {
  foreach ($q in $categoryQueries[$category]) {
    $bodyPath = Join-Path $env:TEMP "easishop_search_$q.json"
    Set-Content -Path $bodyPath -Value "{`"query`":`"$q`"}" -NoNewline -Encoding ascii
    Write-Host "Searching [$category]: $q"
    $raw = & curl.exe -s -X POST "https://www.easishop.co.za/api/v1/search" `
      -u $pair -H "Content-Type: application/json" --data-binary "@$bodyPath" --max-time 90
    Remove-Item $bodyPath -ErrorAction SilentlyContinue
    if (-not $raw) { continue }
    try {
      $parsed = $raw | ConvertFrom-Json
      foreach ($p in @($parsed.products)) {
        $p | Add-Member -NotePropertyName "_category" -NotePropertyValue $category -Force
        $p | Add-Member -NotePropertyName "_query" -NotePropertyValue $q -Force
        $all.Add($p)
      }
    } catch {
      Write-Host "  parse failed"
    }
  }
}

$unique = $all | Group-Object -Property name | ForEach-Object { $_.Group[0] }
$usable = New-Object System.Collections.Generic.List[object]
$idx = 0

foreach ($p in $unique) {
  $prices = New-Object System.Collections.Generic.List[object]
  $image = $null
  foreach ($r in $retailerMap) {
    $code = $r.code
    $priceVal = $p."$code"
    $imgVal = $p."${code}_image"
    $urlVal = $p."${code}_url"
    $prevVal = $p."${code}_prev"
    if ($null -eq $priceVal -or $priceVal -eq "N/A" -or $priceVal -eq "") { continue }
    $num = 0.0
    if (-not [double]::TryParse([string]$priceVal, [ref]$num)) { continue }
    $prev = $null
    if ($null -ne $prevVal -and $prevVal -ne "N/A") {
      $prevNum = 0.0
      if ([double]::TryParse([string]$prevVal, [ref]$prevNum)) { $prev = $prevNum }
    }
    if (-not $image -and $imgVal -and $imgVal -ne "N/A") { $image = [string]$imgVal }
    $prices.Add([ordered]@{
      retailer = $r.name
      price = $num
      previousPrice = $prev
      url = if ($urlVal -and $urlVal -ne "N/A") { [string]$urlVal } else { $null }
      image = if ($imgVal -and $imgVal -ne "N/A") { [string]$imgVal } else { $null }
      unitPrice = $null
      unitLabel = $null
    })
  }
  if ($prices.Count -eq 0 -or -not $image) { continue }
  $idx++
  $usable.Add([ordered]@{
    id = ("prod-{0:D3}" -f $idx)
    name = [string]$p.name
    category = [string]$p._category
    categorySlug = Get-Slug $p._category
    image = $image
    barcode = $null
    prices = @($prices)
  })
}

$sampleSize = [Math]::Min(100, $usable.Count)
$sample = @($usable | Get-Random -Count $sampleSize | Sort-Object name)
# renumber
for ($i = 0; $i -lt $sample.Count; $i++) {
  $sample[$i].id = ("prod-{0:D3}" -f ($i + 1))
}

$out = [ordered]@{
  generatedAt = (Get-Date).ToUniversalTime().ToString("o")
  source = "https://www.easishop.co.za/api/v1"
  note = "Static sample extracted for UI demo. Not live data."
  sampleSize = $sample.Count
  products = @($sample)
}

$dataDir = Join-Path $root "data"
if (-not (Test-Path $dataDir)) { New-Item -ItemType Directory -Path $dataDir | Out-Null }
$path = Join-Path $dataDir "demo-products.json"
$out | ConvertTo-Json -Depth 8 | Set-Content -Path $path -Encoding utf8
Write-Host "Wrote $path ($($sample.Count) products)"
