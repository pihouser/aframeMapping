# AGENTS.md

## Project rules
- Keep this project plain HTML, CSS, and JavaScript.
- Do not introduce TypeScript, React, Vite, Webpack, or build tooling unless explicitly asked.
- Preserve existing A-Frame scene behavior unless the task specifically changes it.
- Do not change model asset paths.
- Do not change POI coordinates unless explicitly asked.
- Prefer small, reviewable changes.

## Current architecture
- Main scene file: dnd3d.html
- A-Frame version: 1.7.1
- Semantic POI behavior: /js/semantic-trigger.js
- POI labels: /js/poi-label.js

## Coordinate convention
- X = east/west
- Y = elevation
- Z = north/south
- Use A-Frame native coordinates.
