# Phase 1: Component Rename & Reorganization - Execution Plan

## Overview
**Goal:** Rename all Lit components to `powdercloud-*` prefix and organize into categorized directory structure based on the Design System.

**Estimated Time:** 120 minutes  
**Actual Time:** _[To be filled upon completion]_

---

## Pre-Execution Checklist

### Current State Verification
- [x] Git status clean at commit `61ba958`
- [x] Site running at http://127.0.0.1:3003
- [x] All documentation created:
  - `REFERENCE_USAGE.md`
  - `MIGRATION_PLAN_DISCUSSION.md`
  - `MEGAMENU_STRUCTURE.md`
  - `SITE_INVENTORY.md`

### Structure Decision ✅
**Based on `-design-system` categories:**
```
public/js/lit/
├── actions/          # Button, Chip, Fab
├── communication/    # Alert, Banner, Toast, Tooltip
├── containment/      # Card, Dialog, Modal, PageHeader
├── inputs/           # TextField, Checkbox, Select, DateRange
├── layout/           # Container, Grid, Stack, Header
├── navigation/       # Tabs, Menu, Breadcrumb
├── data-display/     # DataTable, GoogleMap
├── charts/           # (Already exists)
├── forms/            # (Already exists)
├── grids/            # (Already exists)
├── pages/            # (Already exists)
└── domain/           # Shared business logic
```

---

## Step 1: Create Component Mapping Table

**Action:** Generate CSV mapping of all components.

**Output File:** `document/COMPONENT_MAPPING.csv`

**Format:**
```csv
OldFileName,OldClassName,OldTagName,NewFileName,NewClassName,NewTagName,TargetCategory
AppButton.js,AppButton,app-button,PowdercloudButton.js,PowdercloudButton,powdercloud-button,actions
AppAlert.js,AppAlert,app-alert,PowdercloudAlert.js,PowdercloudAlert,powdercloud-alert,communication
...
```

**Checklist:**
- [ ] Generate mapping table
- [ ] Review for accuracy
- [ ] Commit mapping table to git

---

## Step 2: Implement Component Rename (In-Place)

**Action:** Rename components without moving files.

**Changes Per File:**
1. Update `customElements.define('app-button', ...)` → `customElements.define('powdercloud-button', ...)`
2. Update class name: `class AppButton` → `class PowdercloudButton`
3. Update export: `export class AppButton` → `export class PowdercloudButton`

**Script Approach:**
```bash
# For each component in mapping table:
# 1. Update customElements.define()
# 2. Update class declaration
# 3. Update export statement
```

**Checklist:**
- [ ] Execute rename script on all components
- [ ] Verify no syntax errors
- [ ] **Git Commit:** `git commit -m "Renamed components to powdercloud-* prefix"`

---

## Step 3: Verify Rename Works

**Action:** Test that site still functions with new names.

**Tests:**
1. **Curl Test:**
   ```bash
   curl -I http://127.0.0.1:3003
   curl -I http://127.0.0.1:3003/admin/obs_avalanche_narrative.html
   ```

2. **Browser Console:**
   - Open http://127.0.0.1:3003
   - Check for JavaScript errors
   - Verify components render

3. **Visual Check:**
   - Navigate through menu
   - Spot-check 5-10 pages

**Checklist:**
- [ ] Curl tests pass (200 OK)
- [ ] No console errors
- [ ] Visual verification complete
- [ ] Document results in `document/PHASE1_VERIFICATION_1.md`

---

## Step 4: Implement Directory Structure

**Action:** Create category folders and move files.

**Process:**
1. Create all category folders:
   ```bash
   mkdir -p public/js/lit/{actions,communication,containment,inputs,layout,navigation,data-display,domain}
   ```

2. Move files according to mapping table:
   ```bash
   # Example:
   mv public/js/lit/AppButton.js public/js/lit/actions/PowdercloudButton.js
   mv public/js/lit/AppAlert.js public/js/lit/communication/PowdercloudAlert.js
   ```

3. Generate ASCII tree of new structure

**Checklist:**
- [ ] Create category folders
- [ ] Move all files to correct categories
- [ ] Generate new directory tree
- [ ] Verify no files left in root (except subdirs)
- [ ] **Git Commit:** `git commit -m "Organized components into categories"`

**Output:** Post new ASCII tree in issue comment.

---

## Step 5: Update All Import Paths

**Action:** Fix all broken imports caused by file moves.

**Categories of Changes:**

1. **Imports within moved files:**
   ```javascript
   // Old (when both in root):
   import './AppButton.js'
   
   // New (different categories):
   import '../actions/PowdercloudButton.js'
   ```

2. **Imports in pages that reference moved files:**
   ```javascript
   // Old:
   import '../AppButton.js'
   
   // New:
   import '../actions/PowdercloudButton.js'
   ```

3. **HTML tag usage in render() methods:**
   ```javascript
   // Old:
   html`<app-button>Click</app-button>`
   
   // New:
   html`<powdercloud-button>Click</powdercloud-button>`
   ```

**Checklist:**
- [ ] Update imports in all moved files
- [ ] Update imports in all page files
- [ ] Update HTML tag usage throughout
- [ ] Search for any remaining `<app-` tags
- [ ] **Git Commit:** `git commit -m "Fixed all import paths and tag usage"`

---

## Step 6: Final Verification

**Action:** Comprehensive testing of migrated codebase.

**Tests:**

1. **Curl Test (Sample URLs):**
   ```bash
   curl -I http://127.0.0.1:3003
   curl -I http://127.0.0.1:3003/admin/obs_avalanche_narrative.html
   curl -I http://127.0.0.1:3003/admin/analysis_weather.html
   curl -I http://127.0.0.1:3003/admin/project_list.html
   curl -I http://127.0.0.1:3003/admin/admin_settings.html
   ```

2. **Browser Console Check:**
   - Open DevTools
   - Navigate to each major section
   - Verify no 404s for component files
   - Verify no JavaScript errors

3. **Visual Verification with Dan:**
   - Walk through all menu sections
   - Verify components render correctly
   - Check for any visual regressions

**Checklist:**
- [ ] All curl tests return 200 OK
- [ ] No 404 errors in browser console
- [ ] No JavaScript errors
- [ ] Visual verification complete
- [ ] Create `document/PHASE1_COMPLETION.md` with results

---

## Step 7: Documentation & Completion

**Action:** Update all documentation and close out Phase 1.

**Tasks:**
1. Update `document/PHASE1_COMPLETION.md`:
   - Total time taken
   - Issues encountered
   - Final verification results
   - Next steps

2. Update GitHub Issue:
   - Change title to include actual time
   - Check off completed items
   - Add final comment with results

3. Assign to Dan:
   - Tag @Dan
   - Request review
   - Note: "Phase 1 complete, pushed to GitHub, ready for review"

**Checklist:**
- [ ] `PHASE1_COMPLETION.md` created
- [ ] Issue title updated with actual time
- [ ] All checklist items marked complete
- [ ] Assigned to Dan for review
- [ ] Pushed to GitHub
- [ ] Notified Dan

---

## Rollback Plan (If Needed)

**If something breaks:**
1. Check last git commit
2. Revert to previous commit:
   ```bash
   git reset --hard [commit-hash]
   ```
3. Document what broke
4. Adjust plan and retry

**Git Commit Points:**
- After rename (Step 2)
- After move (Step 4)
- After path updates (Step 5)

---

## Success Criteria

✅ **Phase 1 is complete when:**
1. All components renamed to `powdercloud-*`
2. All files organized into categories
3. All imports updated and working
4. Site loads without errors
5. Dan approves the changes

---

## Notes & Issues

_[To be filled during execution]_

- Issue 1: ...
- Issue 2: ...
- Resolution: ...

---

**Status:** Ready to Execute  
**Next Action:** Begin Step 1 (Create Component Mapping Table)
