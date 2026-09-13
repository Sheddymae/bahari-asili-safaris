# Inserts a bookingOverlay section (English placeholder content) into each
# locale block in lib/i18n.ts, right after the locale's opening brace.
# Safe to re-run: it skips any locale block that already has bookingOverlay.

$path = ".\lib\i18n.ts"
$content = Get-Content $path -Raw

$block = @'
  bookingOverlay: {
    title: 'Book Your Safari',
    subtitle: "Fill in the details below and we'll get back to you with a tailored quote.",
    whereStep: 'Where',
    whereDesc: 'Choose your destination',
    selectDest: 'Select a destination',
    peopleStep: "Who's Going",
    peopleDesc: 'Tell us about your group',
    adultsLabel: 'Adults',
    childrenLabel: 'Children',
    kidsStep: "Kids' Ages",
    kidsDesc: 'Let us know the ages of any children in your group',
    childIndexLabel: 'Child',
    years: 'year',
    whenStep: 'When',
    whenDesc: 'Choose your travel dates',
    departureStep: 'Departure Date',
    departureDesc: 'When would you like to start your safari?',
    cancel: 'Cancel',
    submitting: 'Submitting...',
    inquireNow: 'Inquire Now',
  },
'@

$locales = @('en', 'it', 'fr', 'es', 'de', 'ar', 'zh', 'sw')
$inserted = 0
$skipped = @()

foreach ($loc in $locales) {
    $openPattern = "(?m)^  $loc`: \{\r?\n"
    if ($content -notmatch $openPattern) {
        $skipped += "$loc (locale block not found)"
        continue
    }

    # Check if this specific locale block already has bookingOverlay
    # by looking between this locale's opening and the next top-level locale (or end of file)
    $matchInfo = [regex]::Match($content, $openPattern)
    $startIdx = $matchInfo.Index + $matchInfo.Length

    # crude "already has it" check within next 200 lines worth of chars
    $window = $content.Substring($startIdx, [Math]::Min(15000, $content.Length - $startIdx))
    if ($window -match "bookingOverlay:") {
        $skipped += "$loc (already has bookingOverlay)"
        continue
    }

    $content = $content -replace $openPattern, ("`$0" + $block)
    $inserted++
}

Set-Content $path -Value $content -NoNewline

Write-Host "Inserted bookingOverlay into $inserted locale block(s)."
if ($skipped.Count -gt 0) {
    Write-Host "Skipped:"
    $skipped | ForEach-Object { Write-Host "  - $_" }
}