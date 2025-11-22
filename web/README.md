Sudoku Web
=============

This is a lightweight Node.js + Express web version of the Sudoku solver.

Quick start (requires Node.js):

1. cd into the `web/` folder
2. Install dependencies: `npm install`
3. Start: `npm start`
4. Open http://localhost:7000 in your browser

Docker:
  Build: `docker build -t sudoku-web ./web`
  Run: `docker run -p 7000:7000 sudoku-web`

The UI uses a dark background `#0f1113` as requested.
