import os
import re
from pathlib import Path
root = Path('src')
pattern = re.compile(r'StyleSheet\.create\s*\(\s*\{', re.MULTILINE)

for path in root.rglob('*.js'):
    if any(part in ('node_modules', '.git') for part in path.parts):
        continue
    text = path.read_text(encoding='utf-8')
    for m in pattern.finditer(text):
        start = m.end()
        depth = 1
        i = start
        while i < len(text):
            if text[i] == '{':
                depth += 1
            elif text[i] == '}':
                depth -= 1
                if depth == 0:
                    break
            i += 1
        block = text[start:i]
        if 'colors.' in block:
            print(path)
            for line_idx, line in enumerate(block.splitlines(), start=1):
                if 'colors.' in line:
                    print('  ', line_idx, line.strip())
            print('---')

for path in root.rglob('*.jsx'):
    if any(part in ('node_modules', '.git') for part in path.parts):
        continue
    text = path.read_text(encoding='utf-8')
    for m in pattern.finditer(text):
        start = m.end()
        depth = 1
        i = start
        while i < len(text):
            if text[i] == '{':
                depth += 1
            elif text[i] == '}':
                depth -= 1
                if depth == 0:
                    break
            i += 1
        block = text[start:i]
        if 'colors.' in block:
            print(path)
            for line_idx, line in enumerate(block.splitlines(), start=1):
                if 'colors.' in line:
                    print('  ', line_idx, line.strip())
            print('---')
