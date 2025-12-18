# PowderCloud Antigravity: Architecture & Migration Status
**Date:** 2025-12-18
**Status:** Green / Stable

## 1. Directory Structure (Refactored)
The codebase now follows a flat structure for Lit components and pages to simplify imports.

```
public/js/lit/
├── components/          # ALL Components (Core UI, Charts, Forms, Grids)
│   ├── PowdercloudAlert.js
│   ├── PowdercloudButton.js
│   ├── PowdercloudSeasonalChart.js
│   └── ... (100+ components)
│
├── OperationListPage.js # Pages live directly in 'lit/'
├── DashboardPage.js
└── ... (72 Page files)
```

## 2. Component Naming Convention
All components have been migrated to the `Powdercloud*` namespace.

- **File Name:** `Powdercloud[Name].js` (e.g., `PowdercloudButton.js`)
- **Class Name:** `Powdercloud[Name]` (e.g., `PowdercloudButton`)
- **HTML Tag:** `<powdercloud-[name]>` (e.g., `<powdercloud-button>`)

Legacy `App*` files still exist in `components/` for reference but are **unused** in the Page files.

## 3. Data Flow (The "Dummies View")
The application uses an RPC-style shim to support ExtJS legacy patterns.

1.  **Page Load:** Browser loads `OperationListPage.js` -> renders `<powdercloud-operation-list-grid>`.
2.  **Fetch:** Component calls `fetch('/json/entity_query_all/?entity=Operation')`.
3.  **Routing:** `firebase.json` redirects `/json/*` to the Cloud Function `antigravity`.
4.  **Backend:** `server.js` receives the request.
    *   Maps `entity=Operation` to Firestore Collection `Operations`.
5.  **Database:** Firestore returns documents.
6.  **Response:** `server.js` formats as JSON `{ rows: [...] }`.
7.  **Update:** Component receives JSON -> specific properties (e.g., `_data`) update -> Lit re-renders the DOM.

## 4. Migration Summary (Dec 17-18, 2025)
- **Phase 1:** Core UI components duplicated (`App*` -> `Powdercloud*`).
- **Phase 2:** Domain components (Charts, Forms, Grids) duplicated.
- **Phase 3:** Directory structure flattened.
- **Phase 4:** **ALL** usage in `public/js/lit/*.js` updated to use `powdercloud-*` tags and `./components/` imports.

## 5. Next Steps
- Restart `powdercrowd-api` to resolve 404 errors on the Dashboard.
- Delete legacy `App*.js` files when confident (optional cleanup).
