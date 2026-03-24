# Matthias' file upload

This works by deploying to Vercel: matthias-host.vercel.app

## Create random string for filename
```bash
python -c "import random, string; print(''.join(random.choices(string.ascii_letters + string.digits, k=6)))"
```