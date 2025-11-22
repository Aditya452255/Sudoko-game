# Sudoko-game (Web)

This repository contains a small Node.js + Express web version of the Sudoku solver and a static frontend.

Project layout
- `web/` — the web application (server, frontend, Dockerfile)

How to push to GitHub
1. Initialize a local git repository (if you haven't):
```powershell
cd "C:\Users\hp\Desktop\class 12 material\Mental Health Web App 2\Sudoku"
git init
git add .
git commit -m "Initial web app"
```
2. Add your remote (you provided):
```powershell
git remote add origin https://github.com/Aditya452255/Sudoko-game.git
git branch -M main
git push -u origin main
```

Continuous Integration
- A GitHub Actions workflow is included in `.github/workflows/ci.yml` to build the Docker image from `web/Dockerfile` and push it to GitHub Container Registry (GHCR). The workflow runs on pushes to `main`.

Deploy to Render
- You can deploy directly from the GitHub repo on Render. I included `render.yaml` which points to the repo and the Dockerfile at `web/Dockerfile` — Render will build the container during deploy.

Manual Docker (local)
```powershell
cd web
docker build -t sudoku-web .
docker run --rm -p 7000:7000 sudoku-web
```

If you'd like I can also create a short collaborator note for a force-push (if you rewrite history), or help set up GHCR/GitHub Packages visibility settings.
