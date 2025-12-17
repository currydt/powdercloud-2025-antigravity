# GitHub Issue #4 Update - Component Migration Strategy

## Executive Summary
After extensive discussion and analysis, we have established a clear migration path from ExtJS to Lit with Direct Firestore SDK access. All architectural decisions are documented and the site structure is fully validated.

---

## Key Architectural Decisions

### 1. Technology Stack ✅
- **Frontend:** Lit Web Components (lightweight, Shadow DOM)
- **Backend:** Direct Firestore SDK (no intermediate API)
- **Namespace:** `powdercloud-*` prefix for all components
- **Hosting:** Firebase Hosting + Functions

**Rationale for Direct Firestore SDK:**
- **Speed:** Direct mapping from Django models to Firestore documents
- **Real-time:** Native `onSnapshot()` support for live updates
- **Simplicity:** Firestore SDK's JSON handling matches ExtJS form/grid patterns perfectly

### 2. Component Naming & Organization ✅

**Namespace Strategy:**
- All components use `powdercloud-*` prefix to avoid collision with external libraries
- Mirrors the Design System structure but with our application namespace

**Directory Structure (from Design System):**
```
public/js/lit/
├── actions/          # Button, Chip, Fab
├── communication/    # Alert, Banner, Toast, Tooltip
├── containment/      # Card, Dialog, Modal, PageHeader
├── inputs/           # TextField, Checkbox, Select, DateRange
├── layout/           # Container, Grid, Stack, Header
├── navigation/       # Tabs, Menu, Breadcrumb
├── data-display/     # DataTable, GoogleMap
├── forms/            # Business forms (AvalancheForm, WeatherForm)
├── grids/            # Business grids (ObservationGrid)
├── pages/            # Route containers (60+ pages)
└── domain/           # Shared business logic
```

### 3. Reference Materials ✅

**Four Reference Sources:**
1. **`reference/powdercloud-2011-v1-master`** - Legacy Django/ExtJS
   - **Use for:** Routes, UI layouts, field definitions, workflows
   - **Source:** `appengine/app/pc/models.py` for data models

2. **`reference/powdercrowd-api`** - Zod Schemas
   - **Use for:** Validation rules, data types
   - **Source:** `src/schemas/*.ts`

3. **`reference/powdercrowd-design-system`** - Component Library
   - **Use for:** Component categories, naming conventions
   - **Source:** `public/js/components/` structure

4. **`reference/powdercloud-manager`** - Secondary Logic
   - **Use for:** Complex business logic reference (UI patterns ignored)

---

## Current Site Status ✅

### Site Validation Complete
- **URL:** http://127.0.0.1:3003
- **Total Menu Items:** 60+
- **HTML Landing Pages:** 74 files in `public/admin/`
- **Lit Page Components:** 60 components in `public/js/lit/pages/`
- **Coverage:** ✅ 100% - Every menu item has a corresponding HTML page and Lit component

### Menu Structure (5 Main Sections)
1. **Home** - Dashboard
2. **Observations** (18 pages) - Avalanche, Weather, Snowpack, Ratings, Sighting
3. **Analysis** (11 pages) - Community, Weather, Avalanche, Snowpack, etc.
4. **Projects** (16 pages) - Projects, Activities, Reports
5. **Profile** (18 pages) - Administration, Site Admin, Design System

**Key Finding:** The navigation skeleton is complete. All routes work. The work ahead is building out the forms/grids with real Firestore data.

---

## Documentation Created ✅

1. **`document/REFERENCE_USAGE.md`**
   - How to use each reference source
   - Mapping strategy from legacy to Lit

2. **`document/MIGRATION_PLAN_DISCUSSION.md`**
   - Architecture decisions
   - Directory structure
   - Migration roadmap

3. **`document/MEGAMENU_STRUCTURE.md`**
   - Complete menu tree visualization
   - Table mapping menu links → HTML files → Lit components

4. **`document/SITE_INVENTORY.md`**
   - Detailed inventory of all pages and components

---

## Migration Roadmap

### Phase 1: Foundation Refactor ("The Clean Up")
**Goal:** Align current flat Lit files with the categorized structure.

**Steps:**
1. **Rename Components**
   - `AppButton.js` → `PowdercloudButton.js`
   - Class: `AppButton` → `PowdercloudButton`
   - Tag: `<app-button>` → `<powdercloud-button>`

2. **Organize Files**
   - Move to categorized folders (actions, inputs, etc.)
   - Example: `AppButton.js` → `actions/PowdercloudButton.js`

3. **Update Imports**
   - Fix all relative paths
   - Update HTML tag usage throughout

4. **Verify**
   - Test site at http://127.0.0.1:3003
   - Ensure all pages load correctly

### Phase 2: Feature Migration ("The Build")
**Goal:** Systematically rebuild features with real data.

**Process (per feature):**
1. **Analyze Legacy**
   - Read Django model from `-v1`
   - Read Zod schema from `-api`
   - Read ExtJS form layout

2. **Build Lit Component**
   - Create `powdercloud-[feature]-form`
   - Use categorized components (inputs, actions, etc.)

3. **Connect Firestore**
   - Direct SDK calls (no API middleware)
   - Implement save/load/update

4. **Verify**
   - Test against legacy workflow
   - Ensure field-for-field match

---

## ExtJS Cleanup Strategy

### Current State
- ExtJS files are mixed in `public/js/ext`, `public/js/pages`, `public/js/custom`
- Needed during development as reference
- Not needed at runtime (Lit is independent)

### Proposed Action
**Move to Reference (Now):**
```bash
mkdir reference/extjs-legacy
mv public/js/ext reference/extjs-legacy/
mv public/js/pages reference/extjs-legacy/
mv public/js/custom reference/extjs-legacy/
```

**Benefits:**
- ✅ Clean active codebase (only Lit)
- ✅ Preserve ExtJS for reference during development
- ✅ Easy to delete later with zero risk

**Delete Later (After Migration):**
- Once Lit site is complete and verified
- Simple `rm -rf reference/extjs-legacy`
- No code changes needed (Lit is independent)

---

## Next Steps - Decision Point

**Option A: Clean Up First**
- Move ExtJS to `reference/`
- Execute Phase 1 (Rename/Organize)
- Verify site still works

**Option B: Proof of Concept First**
- Pick one feature (e.g., "Avalanche Narrative")
- Build end-to-end with Firestore
- Prove the pattern works
- Then do Phase 1

**Option C: Hybrid**
- Move ExtJS to `reference/` (quick cleanup)
- Build one proof of concept
- Then execute Phase 1 on remaining components

---

## Current Git State
- **Commit:** `61ba958` (Clean working state)
- **Status:** All files reverted to working baseline
- **Ready:** To execute chosen next step

---

## Questions for Approval

1. **Approve Phase 1 execution?** (Rename/Organize to `powdercloud-*`)
2. **Move ExtJS to reference now?** (Clean up active codebase)
3. **Which feature for proof of concept?** (If choosing Option B/C)

---

**Status:** ✅ Planning Complete - Awaiting Go/No-Go Decision
