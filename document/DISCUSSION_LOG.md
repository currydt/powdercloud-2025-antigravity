# Discussion & Project Trace (Dec 19, 2025)

## Overview
This document logs the critical decisions, actions, and checkpoints made during the "Great Refactor & Revert" session on Dec 19, 2025. It serves as a single source of truth for where the codebase stands and why certain decisions (like sticking with `public/`) were made.

## 1. Action Log

### Phase 1: The Categorized Refactor
**Goal:** Organize the flat `js/lit` directory into "professional" subdirectories (`forms/`, `charts/`, etc.).
**Result:** Implemented and Committed.
**Checkpoint Commit:** `8fa817d`
**Status:** **CLOSED / REVERTED** (Saved in history only).

**Work Completed:**
*   Moved all `Powdercloud*` components into categorized subdirectories.
*   Updated `server.js` with API shim logic.
*   Added documentation (`COMPONENT_STRUCTURE.md`, `ROUTE_MAPPING.md`, `MIGRATION_MAP.md`).
*   **Time Taken:** ~2 hours.

### Phase 2: The Flattening (Revert)
**Goal:** Simplify the structure back to a Flat list to reduce cognitive load and import complexity.
**Result:** Implemented and Committed.
**Checkpoint Commit:** `b8dc2ae`
**Status:** **ACTIVE / PROD**.

**Work Completed:**
*   Moved all components to `public/js/lit/components/`.
*   Kept Pages in `public/js/lit/pages/`.
*   Updated all import paths (in JS and HTML).
*   Deleted empty category folders.
*   **Time Taken:** ~30 mins.

### Phase 3: Issue Management
*   **Issue #2** ("Update the Legacy Component..."): **CLOSED**.
    *   Comment added noting the rollback and checkpoint `8fa817d`.
    *   Subsequent comment added noting the final flat state `b8dc2ae`.

## 2. Architectural Decisions

### "Public vs. Src" Debate
**Question:** Should components live in `public/js/lit` or `src/js/lit`?
**Decision:** **Stay in `public/js/lit`.**

**Reasoning:**
1.  **Current Toolchain:** We use `server.js` with `express.static('public')`. Files *must* be in `public` to be served to the browser without a build step.
2.  **Simplicity:** We are avoiding a complex Bundler (Vite/Webpack) step for now to keep development fast and simple. Browser capabilities (ES Modules) are sufficient.
3.  **Future Proofing:** If we switch to Vite later, moving `public/js/lit` to `src/` is a trivial operation. Doing it now breaks the app for no benefit.

## 3. Current State
*   **Structure:** Flat. All building blocks in `components/`, all views in `pages/`.
*   **Server:** `firebase serve` (or `node server.js`) serving from port 5003.
*   **API:** `server.js` contains a shim to serve ExtJS-style JSON from Firestore.

---
**Signed off by:** User & Antigravity
**Date:** 2025-12-19
