import re
import os

# Wechsle zum Projektverzeichnis
os.chdir(r"c:\Users\kk\Documents\GitHub\unknown-test")

# Lese die Datei
with open('system/hardware/quins-pro.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern: Alles zwischen <body> und <header class="uui-section_heroheader05">
# und ersetze es mit dem neuen Include + Header-Tag
pattern = r'(<body>)\s*<div data-w-id="421732b6-d4ea-4a13-dc0b-53c1d8083fcf"[\s\S]*?</div>\s+(<header class="uui-section_heroheader05">)'

replacement = r'\1\n  <div data-include="../../components/header.html"></div>\n  \2'

# Führe Replacement durch
new_content = re.sub(pattern, replacement, content)

# Wenn ersetzt, schreibe zurück
if new_content != content:
    with open('system/hardware/quins-pro.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('✓ Header erfolgreich ersetzt!')
    print(f'Neue Dateigröße: {len(new_content)} bytes')
else:
    print('✗ Kein Match gefunden')
    print(f'Erstes Zeichen nach <body>: {repr(content[content.find("<body>"):content.find("<body>")+100])}')
