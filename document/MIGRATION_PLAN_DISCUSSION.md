# Migration Plan & Discussion

## 1. Vision
**Goal:** Legacy Workflow + Modern Tech (Lit + Firestore).
**Namespace:** `powdercloud-*` (Prefix for all components).

## 2. Directory Structure Strategy (Updated)
We will organize `public/js/lit/` to perfectly mirror the **PowderCrowd Design System** structure, but use our `powdercloud-` naming convention.

### Generic Categories (mapped from Design System)
| Category | Includes | Our Path | Tag Name |
| :--- | :--- | :--- | :--- |
| **actions** | Button, Chip, Fab | `lit/actions/` | `<powdercloud-button>` |
| **communication** | Alert, Banner, Toast, Tooltip | `lit/communication/` | `<powdercloud-alert>` |
| **containment** | Card, Dialog, Divider, PageHeader | `lit/containment/` | `<powdercloud-card>` |
| **inputs** | Checkbox, DateRange, TextField, Select | `lit/inputs/` | `<powdercloud-text-field>` |
| **layout** | Container, Grid, Stack, Spacer | `lit/layout/` | `<powdercloud-container>` |
| **navigation** | Tabs, Menu, Breadcrumb | `lit/navigation/` | `<powdercloud-tabs>` |
| **data-display** | DataTable, GoogleMap | `lit/data-display/` | `<powdercloud-data-table>` |

### Business Categories (Our Specific Logic)
| Category | Purpose | Our Path | Tag Name |
| :--- | :--- | :--- | :--- |
| **forms** | Application Forms | `lit/forms/` | `<powdercloud-avalanche-form>` |
| **grids** | Application Grids | `lit/grids/` | `<powdercloud-observation-grid>` |
| **pages** | Route Containers | `lit/pages/` | `<powdercloud-observation-page>` |
| **domain** | *Shared Domain Logic?* | `lit/domain/` | *(TBD if we mirror DS domain or keep separate)* |

## 3. Migration Roadmap

### Phase 1: Foundation Refactor ("The Clean Up")
*Goal: Align current flat files with the Categorized Structure.*
1.  **Rename:** `AppButton.js` -> `PowdercloudButton.js` (and class `PowdercloudButton`, tag `powdercloud-button`).
2.  **Move:** Identify category for each file (using DS tree as guide) and move to `lit/[category]/`.
3.  **Update Imports:** Fix all paths.
4.  **Verify:** Test site.

### Phase 2: Feature Build
*Standard Process.*
1.  Read Legacy Reference.
2.  Build `pages/` and `forms/` utilizing `actions/`, `inputs/`, etc.

## 4. Discussion
- **Domain Components:** The Design System has a `domain/` folder (`AppNews`, `AppUser`). Should we copy these to `lit/domain/` and rename to `PowdercloudNews`? Or are these specialized enough specifically for this app?
    - *Assumption:* Yes, mirror them if we use them.

## 5. Next Step
**Execute Phase 1.**
