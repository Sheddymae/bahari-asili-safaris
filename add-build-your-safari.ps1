# Inserts a buildYourSafari field into each locale's footer block, right after
# the footer's opening brace. Safe to re-run: skips locales that already have it.
#
# Adjust the per-locale text below if you want proper translations instead of
# English everywhere — this gets the build passing first.

$path = ".\lib\i18n.ts"
$content = Get-Content $path -Raw

# label text per locale (fill in real translations later if desired)
$labels = @{
    en = 'Build Your Safari'
    it = 'Crea il Tuo Safari'
    fr = 'Créez Votre Safari'
    es = 'Crea Tu Safari'
    de = 'Gestalte Deine Safari'
    ar = 'صمم رحلتك السفارية'
    zh = '定制您的野生动物园'
    sw = 'Unda Safari Yako'
}

$inserted = 0
$skipped = @()

foreach ($loc in $labels.Keys) {
    # Find this locale's footer: block specifically (footer appears once per locale)
    # We anchor on "  footer: {" within this locale's section by first finding
    # the locale's own opening brace, then the next "footer: {" after it.
    $localePattern = "(?m)^  $loc`: \{\r?\n"
    $localeMatch = [regex]::Match($content, $localePattern)
    if (-not $localeMatch.Success) {
        $skipped += "$loc (locale block not found)"
        continue
    }

    $searchStart = $localeMatch.Index + $localeMatch.Length
    $footerRelative = $content.IndexOf("footer: {", $searchStart)
    if ($footerRelative -eq -1) {
        $skipped += "$loc (footer block not found)"
        continue
    }

    # Check next ~2000 chars for existing buildYourSafari to avoid double-insert
    $window = $content.Substring($footerRelative, [Math]::Min(2000, $content.Length - $footerRelative))
    if ($window -match "buildYourSafari:") {
        $skipped += "$loc (already has buildYourSafari)"
        continue
    }

    $insertAt = $footerRelative + "footer: {".Length
    $label = $labels[$loc] -replace "'", "\'"
    $fieldText = "`n    buildYourSafari: '$label',"

    $content = $content.Insert($insertAt, $fieldText)
    $inserted++
}

Set-Content $path -Value $content -NoNewline

Write-Host "Inserted buildYourSafari into $inserted footer block(s)."
if ($skipped.Count -gt 0) {
    Write-Host "Skipped:"
    $skipped | ForEach-Object { Write-Host "  - $_" }
}
