# TRUSTLENS

TRUSTLENS is a frontend demonstration of emergency shelter readiness, map
visualization, inspection workflow, scenario modeling, and allocation planning.
It is intended to support a future emergency-operations product; it is not an
operational dispatch or safety-certification system.

## Current capabilities

- Responsive command dashboard with shelter KPIs and readiness distribution.
- Leaflet map using the shelter, affected-zone, road, and flood-zone fixtures.
- Shelter browsing, status filtering, search, and detail panels.
- Local inspection workflow with image preview and illustrative, non-AI output.
- Shelter readiness factor breakdown.
- Local scenario and allocation demonstrations.
- Analytics charts backed by the bundled sample shelter data.
- Shared route navigation and an application error fallback.

## Technology

- React, TypeScript, and Vite
- React Router
- Zustand for shelter selection and shelter state
- React Leaflet / Leaflet for maps
- Recharts for visualizations
- Tailwind CSS v4

## Architecture

The application is a single Vite frontend in `frontend/`.

- `frontend/src/pages/` contains route-level screens.
- `frontend/src/components/layout/` contains the shared shell, navigation,
  search, headers, and error boundary.
- `frontend/src/components/map/` contains the Leaflet map, map controls, and
  shelter markers.
- `frontend/src/components/shelter/` contains shelter cards and details.
- `frontend/src/data/` contains sample shelter, hazard, road, and scenario data.
- `frontend/src/store/shelterStore.ts` contains the Zustand shelter store.

There is currently **no backend, database, authentication system, or connected
AI service** in this workspace. No environment variables are required. The
application's maps and operational figures use local sample data; weather,
notifications, history, and forecast feeds are not connected. Scenario and
allocation runs are local demonstrations. Inspection output is illustrative
and must not be used to assess or certify structural safety.

## Requirements

Install a Node.js version supported by the Vite version in
`frontend/package.json`.

## Install and run

From the repository root:

```powershell
Set-Location frontend
npm ci
npm run dev
```

Vite prints the local development URL after startup.

## Quality checks

From `frontend/`:

```powershell
npm run lint
npm run build
```

The production output is generated in `frontend/dist/`.

## Deployment

Build with `npm run build` and deploy the contents of `frontend/dist/` to a
static web host. Configure the host to serve `index.html` for client-side
application routes such as `/shelters` and `/analytics`.

The Leaflet base map loads OpenStreetMap tiles over the network and therefore
requires an internet connection. Review the tile provider's usage policy before
deploying at production scale.

## Production work still required

- Connect shelter, hazard, weather, and activity data to a secured API.
- Add a backend, database schema/migrations, validation, authorization,
  logging, and operational health monitoring.
- Connect inspection to a real service; validate uploads server-side and keep
  credentials out of the browser.
- Replace local scenario/allocation demonstrations with validated service
  results before using them for response decisions.
- Add automated component, unit, and end-to-end tests.
- Add production hosting, observability, and disaster-recovery configuration.
