import os

SRC = os.path.join(os.path.dirname(__file__), '..', 'res2/res')

for filename in os.listdir(SRC):
    filepath = os.path.join(SRC, filename)
    if ".js" in filename:
        with open(filepath, 'r') as f:
            content = f.read().split('\n')
        with open(filepath, 'w') as f:
            new_content = []
            for line in content:
                if 'exports' in line:
                    continue
                new_content.append(line)
            f.write('\n'.join(new_content))
