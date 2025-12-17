# Reference Usage Strategy

## Overview
This document outlines the strict usage of reference materials to ensure the new Lit Application matches the legacy functionality while using modern architecture.

## 1. Legacy Application (`-v1`)
**Source:** `reference/powdercloud-2011-v1-master`
**Purpose:** The Master Specification for Workflow, Data Structure, and Routes.

| Feature Scope | Source File(s) | Usage Action |
|Data Models|`appengine/app/pc/models.py`|Map Python Django models to Firestore Collections. Use exact field names.|
|Routes|`urls.py` / `navigation.js`|Map ExtJS routes to Browser History/Lit Router paths.|
|UI Layouts|`client/` (ExtJS Scripts)|Replicate field layout and grid columns exactly.|

**Workflow:**
- Before migrating a page (e.g., "Add Observation"), read the `-v1` file.
- List all inputs and validation rules.
- Build the Lit Form (`powdercloud-avalanche-form`) to match.

## 2. PowderCrowd Design System (`-design`)
**Source:** `reference/powdercrowd-design-system`
**Purpose:** Component Library & Visual Language.

**Usage:**
- **Categories:** Organize our generic components using the same logical groups found here (e.g., `navigation`, `inputs`, `feedback`).
- **Implementation:** Our `powdercloud-*` business components will wrap these generic design system components.
- **Naming:** We will maintain the naming conventions but prefix with `powdercloud-` for our specific business implementations to avoid collision.

## 3. PowderCrowd API (`-api`)
**Source:** `reference/powdercrowd-api`
**Purpose:** Data Validation & Direct Firestore Access Patterns.

**Usage:**
- **Zod Schemas:** Read `src/schemas/*.ts` (e.g., `party.ts`).
- **Validation:** Translate Zod logic into Lit `Validator` classes (or import Zod directly if bundle size permits).
- **Direct Access:** Use the schema knowledge to write direct Firestore `set()` and `get()` calls using the Firebase SDK (No intermediate API).

## 4. PowderCloud Manager (`-manager`)
**Source:** `reference/powdercloud-manager`
**Purpose:** Logic Reference (Secondary).

**Usage:**
- Consult for complex business logic if the `-v1` code is unclear.
- **Ignore UI:** Do not copy UI patterns from this repo (User instruction: "Argued on UI").

## Technical Stack Confirmation
- **Frontend:** Lit Web Components.
- **Backend:** Firebase Hosting + Direct Firestore SDK.
- **Namespace:** `powdercloud-*` for all Application Components.
