# Generates JPEG thumbnails for carousel (no npm required).
# Run: powershell -ExecutionPolicy Bypass -File scripts/optimize-images.ps1
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$imagesDir = Join-Path $root 'images'
$carouselDir = Join-Path $imagesDir 'carousel'
$heroDir = Join-Path $imagesDir 'hero'
New-Item -ItemType Directory -Force -Path $carouselDir | Out-Null
New-Item -ItemType Directory -Force -Path $heroDir | Out-Null

function Save-ResizedJpeg {
  param([string]$InputPath, [string]$OutputPath, [int]$Width)
  if (-not (Test-Path $InputPath)) {
    Write-Warning "skip (missing): $InputPath"
    return
  }
  $src = [System.Drawing.Image]::FromFile($InputPath)
  try {
    if ($src.Width -lt 1 -or $src.Height -lt 1) { return }
    $scale = [Math]::Min(1.0, $Width / [double]$src.Width)
    $w = [Math]::Max(1, [int][Math]::Round($src.Width * $scale))
    $h = [Math]::Max(1, [int][Math]::Round($src.Height * $scale))
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($src, 0, 0, $w, $h)
    $g.Dispose()
    $bmp.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $kb = [Math]::Round((Get-Item $OutputPath).Length / 1KB, 1)
    Write-Host "wrote $(Split-Path $OutputPath -Leaf) ${kb} KB"
    $bmp.Dispose()
  } finally {
    $src.Dispose()
  }
}

$names = @(
  'winery','biomanufacturing','agriculture','chemicals','oilandgas','research',
  'defense','municipal','education','universityeducation','beverages','cpg',
  'supplementsnutrition','beautyfragrances','home'
)

foreach ($name in $names) {
  $src = Join-Path $imagesDir "$name.jpg"
  Save-ResizedJpeg -InputPath $src -OutputPath (Join-Path $carouselDir "$name.jpg") -Width 420
}

# GIF poster: first frame only (static placeholder until animated GIF loads)
$gif = Join-Path $imagesDir 'tinylab-device.gif'
if (Test-Path $gif) {
  try {
    $gi = New-Object System.Drawing.Bitmap($gif)
    $dimension = [System.Drawing.Imaging.FrameDimension]::Time
    if ($gi.FrameDimensionsList -contains 'time') {
      $gi.SelectActiveFrame($dimension, 0) | Out-Null
    }
    $tmp = Join-Path $env:TEMP 'anaco-gif-frame.png'
    $gi.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png)
    $gi.Dispose()
    Save-ResizedJpeg -InputPath $tmp -OutputPath (Join-Path $heroDir 'tinylab-device-poster.jpg') -Width 912
    Remove-Item $tmp -ErrorAction SilentlyContinue
  } catch {
    Write-Warning "Could not build hero poster from GIF: $_"
  }
}

Write-Host 'Done.'
