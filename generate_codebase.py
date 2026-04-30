from pathlib import Path
root = Path(__file__).resolve().parent
output = root / 'PROJECT_CODEBASE.txt'
extensions = {'.java', '.ts', '.tsx', '.js', '.jsx', '.html', '.css', '.scss', '.sass', '.json', '.yaml', '.yml', '.xml', '.properties', '.md', '.sh', '.bat', '.cmd', '.gradle', '.kt', '.pom', '.txt'}
with output.open('w', encoding='utf-8') as out:
    for path in sorted(root.rglob('*')):
        if path.is_file() and 'node_modules' not in path.parts and path.suffix.lower() in extensions:
            rel = path.relative_to(root).as_posix()
            out.write(f'--- {rel} ---\n')
            try:
                out.write(path.read_text(encoding='utf-8'))
            except UnicodeDecodeError:
                try:
                    out.write(path.read_text(encoding='latin-1'))
                except Exception as e:
                    out.write(f'<<UNREADABLE FILE: {e}>>\n')
            out.write('\n\n')
print(f'Wrote {output}')
