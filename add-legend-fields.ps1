# Inserts legendPeak and legendOff fields into each locale's wildlifeCalendar
# block, right after "footnote:" line. Anchored specifically within
# "wildlifeCalendar: { ... }" blocks so it can't accidentally match a
# "footnote:" field belonging to some other section.
#
# Uses English placeholder text for every locale for now - swap in proper
# translations later. Safe to re-run: won't double-insert if fields already
# exist (checks first).

$path = ".\lib\i18n.ts"
$content = Get-Content $path -Raw

if ($content -match "legendPeak:") {
    Write-Host "legendPeak already exists somewhere in the file - aborting to avoid duplicate inserts. Check manually."
    exit
}

$pattern = New-Object System.Text.RegularExpressions.Regex(
    "(wildlifeCalendar: \{.*?footnote: '[^']*',\r?\n)(\s*)(\},)",
    [System.Text.RegularExpressions.RegexOptions]::Singleline
)

$replacementEval = {
    param($m)
    $indent = $m.Groups[2].Value
    return $m.Groups[1].Value + $indent + "  legendPeak: 'Peak viewing window'," + "`r`n" + $indent + "  legendOff: 'Off-peak'," + "`r`n" + $indent + $m.Groups[3].Value
}

$countMatches = $pattern.Matches($content).Count
Write-Host "Found $countMatches wildlifeCalendar block(s) to update."

$newContent = $pattern.Replace($content, $replacementEval)

if ($newContent -eq $content) {
    Write-Host "No changes made - pattern didn't match anything."
} else {
    Set-Content $path -Value $newContent -NoNewline
    Write-Host "Done."
}
