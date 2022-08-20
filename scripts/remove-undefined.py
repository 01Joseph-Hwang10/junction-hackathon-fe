import os

SRC = os.path.join(os.path.dirname(__file__), '..', 'src')

line_to_remove = [
    'exports.__esModule = true;'
]

for filename in os.listdir(SRC):
    filepath = os.path.join(SRC, filename)
    if ".js" in filename:
        with open(filepath, 'r') as f:
            content = f.read()
        with open(filepath, 'w') as f:
            for line in line_to_remove:
                content = content.replace(line, '')
            f.write(content)
