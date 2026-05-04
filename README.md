# Classic Snake (Vite + React + Tailwind)

This repository is prepared for deployment to GitHub Pages.

Quick setup

1. Replace placeholders in `package.json`:

- `homepage`: set to `https://<USERNAME>.github.io/<REPO>`
- `repository.url`: set to your repo URL

2. Install deps and build:

```bash
npm install
npm run build
```

3a — Create GitHub repo and push (using `gh` CLI):

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create <USERNAME>/<REPO> --public --source=. --remote=origin --push
```

3b — Or push manually:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<USERNAME>/<REPO>.git
git push -u origin main
```

4. Deploy to GitHub Pages (one-time):

```bash
npm install
npm run deploy
```

Notes

- CI deployment is included: the workflow will build and publish on pushes to `main`.
- If you prefer manual deploys, use the `deploy` script which publishes the `dist` folder using `gh-pages`.