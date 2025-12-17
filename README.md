# PowderCloud 2011 Antigravity Shim

This project is a Node.js "Shim" designed to serve the legacy PowderCloud 2011 application, which consists of two distinct parts:
1. **Corporate Site** - Static marketing pages (index, features, pricing, mobile, support)
2. **Management App** - ExtJS-based data management interface

## Purpose
- **Reference Implementation:** Allows viewing the legacy UI to understand data models and workflows.
- **API Bridge:** Intercepts legacy ExtJS calls (e.g., `/json/lookup_query_all/`) and proxies them to the new Firestore database or returns mock data.
- **Data Verification:** Verified that `Lookup` data structure in Firestore matches what the legacy frontend expects.
- **Site Separation:** Corporate and Management sites are now properly separated into distinct directories.

## Architecture

### Directory Structure
```
powdercloud-2011-antigravity/
├── public/
│   ├── admin/                  # New HTML shells for admin pages (e.g., operation_list.html)
│   ├── css/                    # Global styles (main.css, mainNew.css)
│   ├── js/
│   │   ├── lit/                # New Lit Component Architecture
│   │   │   ├── charts/         # Chart components (Highcharts wrappers)
│   │   │   ├── forms/          # Form components (e.g., OperationForm.js)
│   │   │   ├── grids/          # Grid components (e.g., OperationListGrid.js)
│   │   │   ├── pages/          # Page components (e.g., OperationListPage.js)
│   │   │   ├── AppHeader.js    # Main Header with MegaMenu
│   │   │   ├── AppLayout.js    # Main Layout Shell (Shadow DOM)
│   │   │   ├── AppTabs.js      # Tab container component
│   │   │   ├── AppLookup.js    # Lookup dropdown component
│   │   │   └── DashboardGrid.js # Base Grid Component
│   │   └── ...                 # Legacy JS files
│   ├── dashboard_lit.html      # Main Dashboard (Lit)
│   └── ...
└── ...
```

### Lit Component Architecture (New)

The application is being refactored to use a modular Lit component architecture.

**Master Page Structure:**
Every page in the new architecture follows a consistent 4-layer pattern:
1.  **HTML Shell** (`public/admin/[page].html`): The entry point. It loads global CSS, imports the `AppLayout` and the specific Page Component, and sets up breadcrumbs.
2.  **Page Component** (`public/js/lit/pages/[PageName].js`): A Lit component that defines the page's specific layout, title, and imports the necessary content components (like grids or forms).
3.  **Content Component** (`public/js/lit/grids/[GridName].js`): Reusable components that handle specific data fetching and display logic (e.g., fetching the list of operations).
4.  **Base Components** (`public/js/lit/DashboardGrid.js`): Low-level UI primitives used by content components to ensure consistent styling and behavior (e.g., sorting, paging).

**Key Components:**
*   **`AppLayout`** (`public/js/lit/AppLayout.js`): The main application shell. It uses Shadow DOM to encapsulate the layout structure (Header, Footer, Breadcrumbs) while injecting global legacy styles (`main.css`, `ext-all.css`). It provides a `<slot>` for page-specific content.
*   **Page Components** (`public/js/lit/pages/`): Each page (e.g., `DashboardPage.js`) is a Lit component that renders the specific content for that view. It is designed to be slotted into `AppLayout`.
*   **Charts** (`public/js/lit/charts/`): Individual chart components wrapping Highcharts logic.
*   **Grids** (`public/js/lit/grids/`): Individual grid components for tabular data.
*   **Forms** (`public/js/lit/forms/`): Form components for creating and editing entities.

**Usage Pattern:**
HTML pages (e.g., `dashboard_lit.html`) should follow this structure:
```html
<body>
    <app-layout id="layout">
        <dashboard-page></dashboard-page>
    </app-layout>
    <script>
        // Set breadcrumbs on the layout element
        document.getElementById('layout').breadcrumbs = [...];
    </script>
</body>
```

### Documentation & Design System

The component documentation (`/admin/development_components.html`) has been reorganized to follow a strict **"Macro-to-Micro"** teaching philosophy. This ensures developers understand the high-level structure before diving into low-level details.

**Hierarchy:**

1.  **Overview**: The big picture and purpose of the design system.
2.  **Framework Architecture**: How the app is built (Lit, Shadow DOM, Event Bus).
3.  **Page Architecture**: The rules for building a page (Shell, Layout, Slots).
4.  **Core Components**: The application shell (`<app-layout>`, `<app-header>`, `<app-footer>`).
5.  **Layout Elements**: The invisible skeleton (`<dashboard-grid>`, Stacks).
6.  **Containers**: The boxes that hold content (`<app-card>`, `<app-fieldset>`, `<collapsible-panel>`, `<app-tabs>`).
7.  **Data Patterns**: Complex, composed patterns for displaying data (e.g., `<dashboard-grid>` with filters).
8.  **Form Patterns**: "Kitchen Sink" examples showing how to build complex forms.
9.  **Atomic Elements**: The smallest building blocks (Inputs, Buttons, Switches, Chips, Dividers).

**Key Changes:**
*   **Tabs are Containers**: `<app-tabs>` was moved from "UI Components" to "Containers" as it is a structural element for holding content.
*   **Atoms are Last**: All atomic elements (Buttons, Inputs, Chips) were merged into a single "Atomic Elements" section at the bottom to serve as a reference library, rather than the starting point.

### Validation Strategy

We need to port a significant amount of custom business logic validation from the legacy jQuery/ExtJS code (`powdercloud.js`) to our new Lit components.

**1. Standard Validators**
These should be built into `<app-input>` or available as standard utility functions.
*   **Required**: Field must have a value.
*   **Email**: Valid email format.
*   **Phone**: Valid phone number format.
*   **Date**: Valid date format.
*   **Password Match**: Confirmation field matches password.
*   **Min/Max Length**: String length constraints.
*   **Min/Max Value**: Numeric value constraints.

**2. Custom Business Validators (Legacy Port)**
These are domain-specific rules extracted from `powdercloud.js` that must be implemented to ensure data integrity.

*   **Air Temp**: `valAirTemp` - Number, must end in `.0` or `.5`.
*   **Aspect**: `valAspectNum` - Integer, 0-360.
*   **Avalanche Depth**: `valAvalDepth` - Positive Integer, multiple of 25 (Metric).
*   **Avalanche Path Run**: `valAvalPathRun` - Positive Integer, multiples of 100/300/25 depending on scale.
*   **Avalanche Surface**: `valAvalSurface` - Positive Integer, multiple of 10 (Metric).
*   **Barometric Pressure**: `valBarometric` - Positive number, max 2 decimal places.
*   **Density**: `valDensity` - Integer >= 0.
*   **Elevation**: `valElevation` - Integer, 0-30000ft / 0-9000m.
*   **Valley Fog Elevation**: `valElevationValleyFog` - Integer, multiple of 100ft / 50m.
*   **Grain Size**: `valGrainSize` - Specific rounding rules (0.1, 0.3, 0.5, or .0/.5).
*   **Hits**: `valHits` - Integer 0-30.
*   **Incline**: `valIncline` - Integer 0-90.
*   **Layer**: `valLayer` - Integer >= 0.
*   **Penetration (Foot/Ram)**: `valPenFoot` - Integer >= 0, multiple of 2 or 5.
*   **Percent / Humidity**: `valPercent` - Integer 0-100.
*   **Precipitation Intensity**: `valPrecipIntensity` - Positive number, max 1 or 2 decimals.
*   **Snow Fall Depth**: `valSnowFallDepth` - Specific values (0, 0.1, 0.5) or integer.
*   **Snow Profile Thickness**: `valSnowProThickness` - Integer 0-6000.
*   **Snow Temp**: `valSnowTemp` - Max 1 decimal, specific rounding.
*   **Stability Ratio**: `valStabilityRatio` - 0-1000, max 3 decimals.
*   **Wind Direction**: `valWindDirNum` - 0-360, multiple of 10.
*   **Wind Speed**: `valWindSpeed` - 0-1000, max 1 decimal.

**Implementation Plan:**
We will create a `Validators.js` utility library that exports these functions. `<app-input>` will be updated to accept a `validators` array property, allowing us to chain these rules easily.

Example:
```javascript
<app-input 
    label="Air Temp" 
    .validators="${[Validators.required, Validators.airTemp]}">
</app-input>
```

### Development Notes & Gotchas

*   **Imports:** Do **NOT** import Lit decorators or other libraries from CDN URLs (e.g., `https://cdn.jsdelivr.net...`) inside local modules unless you are certain of the compatibility. Mixing CDN imports with local module resolution can cause silent failures where the module refuses to load, resulting in blank components. Always verify imports are necessary and correct.
*   **Shadow DOM vs. Global Styles:** `AppLayout` uses Shadow DOM but explicitly injects the global CSS files via `<link>` tags in its template. This allows the layout to be styled correctly while isolating it. Page components (like `DashboardPage`) typically use Light DOM (`createRenderRoot() { return this; }`) to inherit global styles easily, or they must also inject the CSS links if using Shadow DOM.

### Routes
- **Corporate Site:** `/corporate/` - Static HTML pages
- **Management App:** `/management/` - ExtJS application (currently at root for compatibility)
- **API Endpoints:** `/json/*` - Data API for ExtJS
- **Admin Pages:** `/admin/*` - New Lit-based admin pages

## Setup
1. Navigate to this directory:
   ```bash
   cd powdercloud-2011-antigravity
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
   (Requires `express`, `firebase`, `cors`)

## Running the Shim
1. Start the server:
   ```bash
   node server.js
   ```
2. Open your browser to:
   - Corporate Site: http://localhost:3000/corporate/
   - Management App: http://localhost:3000/management/

## PowderCloud 2011 Corporate Site

The corporate marketing site has been moved to a separate project: `powdercloud-2011-corporate`.

This `antigravity` project now focuses exclusively on the **Management App** and the API shim.

### Corporate Site Location
The static corporate site can be found in the sibling directory: `../powdercloud-2011-corporate/`.

It runs independently on port 3002.

## Firestore Schema

The application uses a Cloud Firestore database with the following core collections. This structure is designed to map the legacy relational/BigQuery data into a document-oriented format.

### Core Collections

*   **`Activities`**: Stores user activity logs and timeline events.
*   **`Lookups`**: System-wide configuration data (e.g., dropdown options).
    *   *Structure*: `{ type: string, code: string, name: string, sort_order: number, ... }`
*   **`Observations`**: The central collection for all field observations.
    *   *Discriminator*: `type` field (e.g., 'weather', 'avalanche', 'snowpack').
    *   *Key Fields*: `date_time_start`, `operation` (map), `observer` (map), `location` (map).
*   **`Operations`**: Organizations or entities managing the data (e.g., Ski Resorts, Heliski Ops).
*   **`Parties`**: Users and personnel.
*   **`Roles`**: User roles and permissions.
*   **`Terrain`**: Geographic features and locations.
    *   *Fields*: `name`, `abbreviation`, `feature_type`, `elevation_min`, `elevation_max`, `aspect_start`, `lat`, `lng`.

### Data Modeling Notes
*   **Denormalization**: To support efficient reads, related entities (like Operation or Observer) are often stored as summary maps (ID + Name) within the main document, rather than just foreign keys.
*   **Timestamps**: Legacy dates are converted to Firestore `Timestamp` objects.
*   **Legacy IDs**: The original BigQuery/Datastore IDs are preserved in the `__key__` or `id` field where possible to maintain referential integrity during migration.

---

## Migration Tooling

We have developed a dedicated set of scripts to handle the complex migration of data from the legacy BigQuery export to Cloud Firestore.

### Directory Structure (`powdercrowd-migrate/`)

```
powdercrowd-migrate/
├── src/
│   ├── migrate.ts              # Main entry point / Orchestrator
│   ├── migrate-lookups.ts      # Migrates Lookup codes
│   ├── migrate-party.ts        # Migrates User accounts (Parties)
│   ├── migrate-terrain.ts      # Migrates Terrain/Location data
│   ├── migrate-observation.ts  # Migrates Observations (Weather, Avalanche, etc.)
│   ├── migrate-associations.ts # Handles relationships (e.g., User <-> Operation)
│   ├── verify.ts               # Verification script to check counts and data integrity
│   ├── list-datasets.ts        # Utility to explore BigQuery datasets
│   └── cleanup-ids.ts          # Utility to fix ID formatting issues
├── package.json                # Dependencies (BigQuery, Firestore SDKs)
└── tsconfig.json               # TypeScript configuration
```

### Migration Workflow

1.  **Source**: Data is read from the `powdercloud-2011` BigQuery dataset.
2.  **Transformation**:
    *   Fields are mapped from snake_case (Legacy) to camelCase or kept as snake_case depending on the target schema.
    *   Types are converted (e.g., String 'true' -> Boolean true, Integer strings -> Numbers).
    *   Timestamps are parsed and converted to Firestore Timestamps.
    *   Reserved fields (like `__key__`) are handled or stripped.
3.  **Destination**: Data is written to the `powdercrowd-project` Firestore database.

### Key Scripts

*   **`migrate-terrain.ts`**:
    *   Reads from `powdercloud_2011.Terrain`.
    *   Maps fields: `feature_type`, `elevation_min`, `elevation_max`, `aspect_start`, `lat`, `lng`.
    *   Successfully migrated **1,945** records.
*   **`migrate-lookups.ts`**:
    *   Reads from `powdercloud_2011.Lookup`.
    *   Ensures all dropdown values are populated.
*   **`verify.ts`**:
    *   Runs count queries against both BigQuery and Firestore to ensure no data loss.

### Running a Migration

To run a specific migration (e.g., Terrain), navigate to the `powdercrowd-migrate` directory and run:

```bash
# Run in dry-run mode first (optional flags depend on script implementation)
npx ts-node src/migrate-terrain.ts --dry-run

# Execute migration
npx ts-node src/migrate-terrain.ts
```

## Firebase Architecture & Deployment

This project is part of the **`powdercrowd-project`** Firebase ecosystem. It utilizes a **Multi-site Hosting** architecture to coexist with other applications while sharing the same backend resources.

### Architecture Overview

*   **Project ID:** `powdercrowd-project` (Shared Container)
*   **Database:** Cloud Firestore (Shared Data)
*   **Authentication:** Firebase Auth (Shared Users)
*   **Hosting Site:** `powdercrowd-antigravity` (Dedicated URL)
*   **Backend Logic:** Cloud Functions (Node.js 22)

The "Antigravity Shim" is deployed as a dedicated **Firebase Hosting Site** (`powdercrowd-antigravity`) backed by a **Cloud Function** (`antigravity`). This allows it to serve dynamic content (via `server.js`) and static assets independently of the main corporate site, while still reading and writing to the production Firestore database.

### Deployment

To deploy updates to the Antigravity Shim:

1.  **Ensure you are in the project root:**
    ```bash
    cd /path/to/powdercrowd-project
    ```

2.  **Run the deploy command:**
    ```bash
    firebase deploy --only functions:antigravity,hosting:antigravity
    ```

    *   `functions:antigravity`: Deploys the backend logic (Express app in `server.js`).
    *   `hosting:antigravity`: Deploys the static assets from `public/`.

### Live URL
**[https://powdercrowd-antigravity.web.app](https://powdercrowd-antigravity.web.app)**

## API Documentation

The project includes a dedicated API documentation site that provides detailed information about the available endpoints, data structures, and usage examples.

### Accessing the Docs
*   **Local URL**: `http://localhost:5013/api/` (via Firebase Hosting Emulator)
*   **Structure**: The documentation is built as a Single Page Application (SPA) using Lit components.
    *   **Sidebar**: Provides navigation to all entity endpoints (User, Activity, Role, etc.).
    *   **Tabbed Interface**: Complex entities like **RoleType** feature a tabbed layout with:
        *   **Summary**: Overview of the entity.
        *   **Data Dictionary**: Detailed field definitions and types.
        *   **API Commands**: Copy-pasteable `curl` commands for testing.
*   **Independent Pages**: Some entities also have standalone HTML documentation pages (e.g., `http://localhost:5013/api/user`) which can be accessed directly.

### Key Components
*   **`AppSidebar`**: Manages the navigation menu.
*   **`AppRole`**: Demonstrates the full tabbed documentation pattern.
*   **`AppUser`**: Shows a simplified list of endpoints.

## Developer Setup

This section outlines the project structure, shared resources, and standard ports used for local development.

### Project Ecosystem Diagram

```text
powdercrowd-project (Monorepo Root)
│
├── powdercloud-2011-antigravity (Shim Application)
│   ├── server.js (Node.js Proxy/Server)
│   └── public/ (Legacy ExtJS & New Lit Admin)
│
├── powdercloud-2011-corporate (Static Marketing Site)
│   └── public/ (HTML/CSS)
│
├── powdercrowd-admin (New Admin Dashboard)
│   └── src/ (Vue/Vite App)
│
├── powdercrowd-api (Backend Services)
│   ├── src/ (Cloud Functions)
│   └── public/ (API Documentation SPA)
│
├── powdercrowd-management (Main Application)
│   └── public/ (App Shell)
│
└── powdercrowd-migrate (Migration Tools)
    └── src/ (TypeScript Migration Scripts)

Shared Resources:
├── functions/ (Firebase Cloud Functions)
├── firestore/ (NoSQL Database)
├── storage/ (Cloud Storage Buckets)
└── auth/ (Firebase Authentication)
```

### Applications & Resources

The project is composed of several distinct applications that share the same backend resources (Firestore, Auth, Storage).

*   **Antigravity Shim**: Serves the legacy ExtJS application and new Lit-based admin tools.
*   **Corporate Site**: The static marketing website.
*   **API**: The backend logic and RESTful endpoints.
*   **Admin**: The modern administrative dashboard (Vue.js).
*   **Management**: The core application shell.

### Service Ports Table

When running the local development environment (`firebase emulators:start`), the following services are available on these standard ports:

| Service | Port | Description |
| :--- | :--- | :--- |
| **Antigravity (Node)** | `3002` | Legacy Shim Server & Proxy |
| **Corporate (Static)** | `3000` | Marketing Site (Served via local server) |
| **API (Functions)** | `5001` | Cloud Functions / API Endpoints |
| **Hosting (Firebase)** | `5013` | Firebase Hosting Emulator (Serves all sites) |
| **Firestore** | `8080` | Local Database Emulator |
| **Auth** | `9099` | Authentication Emulator |
| **PubSub** | `8085` | Event Bus Emulator |
| **Database (RTDB)** | `9000` | Realtime Database Emulator |

### Run Commands

Use the following commands to start the environment or individual components:

**1. Run Entire Ecosystem (Emulators)**
Starts Firestore, Functions, Hosting, Auth, and PubSub emulators.
```bash
firebase emulators:start
```

**2. Run Antigravity Shim (Standalone)**
Starts the Node.js server for the legacy shim application.
```bash
cd powdercloud-2011-antigravity
node server.js
```

**3. Build API**
Compiles the TypeScript backend code.
```bash
cd powdercrowd-api
npm run build
```

**4. Run Migration Scripts**
Executes data migration from BigQuery to Firestore.
```bash
cd powdercrowd-migrate
npx ts-node src/migrate-terrain.ts
```

## Current Status

### ✅ Working
- **Server**: Running on `http://localhost:3002`
- **Firestore**: Connected and querying data
- **Corporate Site**: All pages loading (index, features, pricing, mobile, support)
  - Static HTML with vanilla JavaScript
  - Proper navigation between pages
  - Original styling preserved
- **Lookups API**: `/json/lookup_query_all/` - Serving lookup data from Firestore
- **Activities API**: `/json/entity_query_all_paging/?entity=Activity` - Serving mock activity data
- **Observations API**: `/json/entity_query_all_paging/?entity=Observation` - Serving real data from Firestore `Observations` collection
- **JSONP Support**: All endpoints support JSONP callbacks for ExtJS ScriptTagProxy
- **Admin Pages (Lit Components)**:
  - **Operation List** - Displays all operations from Firestore
  - **Terrain Atlas** - Displays 1,945 terrain records from Firestore with full pagination
  - **Role Editor** - Mock data (migration pending)
  - **Observation Type Editor** - Mock data (migration pending)
- **DashboardGrid Component**:
  - Sortable columns (click header to sort)
  - Pagination controls (10, 25, 50, 100, 500 rows per page)
  - Page navigation with Previous/Next and page number buttons
  - Fixed height scrolling (600px) with sticky header
  - "Showing X-Y of Z" record count display
  - Mock data indicator when using fallback data
  - **Filtering**: Text input filter in toolbar
  - **Row Click**: Emits events for master-detail navigation

### 🔧 In Progress
- **Management App Migration**: Moving ExtJS app to `/management/` directory
- **ExtJS Timeline**: Template fixed with `div.thumb-wrap` wrapper, should now render Activity items
- **Observation Grid**: Page structure ready with `table-loc` and `form-loc` divs for ExtJS components
- **Admin Page Stubs**: 50+ stub pages created for all menu links
- **Data Migration**: Terrain data migrated (1,945 records), other entities pending

### ⚠️ Known Issues
- **Chart Styling**: Axis lines and labels are too dark/heavy compared to original muted theme.
- **Mega Menu Styling**: Minor tweaks needed for perfect alignment.
- **Data Transformation**: Firestore Timestamps need conversion to ISO strings
- **Description Fields**: Legacy GAE reference objects (observer_desc, terrain_desc) need proper extraction
- **Paging**: Basic limit implemented, but full cursor-based paging not yet implemented

## Recent Updates

### Terrain Atlas (Completed)
- ✅ Created `TerrainAtlasGrid.js` component
- ✅ Created `migrate-terrain.ts` migration script
- ✅ Successfully migrated 1,945 terrain records from BigQuery to Firestore
- ✅ Updated grid to show real schema fields (name, abbreviation, feature_type, elevation_min/max, aspect_start)
- ✅ Filtered out reserved Firestore fields (`__key__`, `__error__`, etc.)

### Grid Enhancements (Completed)
- ✅ Added pagination controls (rows per page selector, page navigation)
- ✅ Added fixed height scrolling with sticky header
- ✅ Sticky header and breadcrumbs for better navigation
- ✅ Mock data warning indicator
- ✅ Added text filtering and row click events

## Next Steps
1. Migrate remaining entities (RoleType, ObservationType, etc.)
2. Implement Lookup Editor (complex hierarchical data)
3. Create detail/edit pages for entities
4. Build observation forms
5. Complete migration of management app to `/management/` directory

## Notes
*   The `reference` folder (original source) is **not** included in this shim's git history to keep the repo clean.
*   Corporate site uses vanilla JavaScript (no jQuery dependencies) for image rotation.
*   To fix the Timeline rendering, one would need to strictly match the `ActivityVO` fields in `home.js` with the mock data in `server.js`.

### FAQ

**Why does this project use jQuery if it's a modern Lit application?**
We are strictly **NOT** using jQuery for any of our new Lit components or application logic. However, the legacy version of Highcharts (v2.x/v3.x) used in this project—to maintain 1:1 visual fidelity with the 2011 original—**strictly requires jQuery** to function.
*   **Current State:** jQuery is loaded solely as a dependency for Highcharts.
*   **Future Path:** When modernizing, we can upgrade to Highcharts v12+ (which is standalone and dependency-free) or switch to another library, at which point jQuery can be removed entirely.

### Dashboard Component Hierarchy
This diagram illustrates how the `dashboard_lit.html` page is composed of our new Lit components.

```text
dashboard_lit.html (Page Container)
│
├── <app-header>
│   └── <mega-menu> (Repeated for each nav item)
│
├── <app-breadcrumbs>
│
├── #dvBody (Main Content Wrapper - 1000px centered)
│   │
│   ├── H1 Title ("OPERATION DASHBOARD")
│   │
│   ├── <date-selector>
│   │
│   ├── <collapsible-panel> (Title: "CHARTS")
│   │   │
│   │   ├── Row 1
│   │   │   └── <seasonal-chart>
│   │   │
│   │   ├── Row 2 (Flex Container)
│   │   │   ├── <avalanche-rose>
│   │   │   ├── <failure-types-chart>
│   │   │   └── <trigger-types-chart>
│   │   │
│   │   └── Row 3 (Flex Container)
│   │       ├── <snowpack-height-chart>
│   │       ├── <temperature-range-chart>
│   │       └── <wind-speed-chart>
│   │
│   ├── <collapsible-panel> (Title: "WEATHER OBSERVATIONS")
│   │   └── <weather-grid>
│   │
│   ├── <collapsible-panel> (Title: "AVALANCHE ACTIVITY")
│   │   └── <avalanche-grid>
│   │
│   ├── <collapsible-panel> (Title: "SNOWPACK STRUCTURE")
│   │   └── <snowpack-grid>
│   │
│   ├── <collapsible-panel> (Title: "STABILITY RATINGS")
│   │   └── <stability-grid>
│   │
│   ├── <collapsible-panel> (Title: "NEWS & UPDATES")
│   │   └── <news-grid>
│   │
│   └── <app-disclaimer>
│
└── <app-footer>
```

**Key Architectural Points:**

*   **Container Design:** The `#dvBody` div acts as the main layout container, enforcing the 1000px width and centering, consistent with the legacy CSS.
*   **Composition:** We use composition (nesting components inside `<collapsible-panel>`) rather than inheritance for the layout. This makes it very flexible—we can put anything inside a panel.
*   **Atomic Design:** We have "atoms" (like charts and grids) composed into "molecules" (panels) which form the "organism" (the dashboard page).

### Future Architecture Refactoring
To further modularize the application and support multiple pages efficiently, the following architecture is proposed:

1.  **`AppLayout` Component**:
    *   Acts as the master container for the application shell.
    *   Encapsulates `<app-header>`, `<app-breadcrumbs>`, the main content wrapper (`#dvBody`), and `<app-footer>`.
    *   Uses a `slot` to inject specific page content.

2.  **Page Components** (e.g., `<dashboard-page>`, `<observations-page>`):
    *   Top-level components for each major view.
    *   Contain page-specific logic and sub-components (e.g., `<date-selector>` for Dashboard, `<filter-panel>` for Observations).
    *   Allows for easy switching of content regions while maintaining a consistent shell.

**Target Structure in HTML:**
```html
<body>
  <app-layout>
    <dashboard-page></dashboard-page>
  </app-layout>
</body>
```


The server has been restarted (via firebase emulators and node server.js which are running in the background).

I have updated the pages for Organizations (Operations), Roles, and Users (Parties) to use a new "full page" style with tabs and fields, mimicking the richness of ExtJS forms but using modern Lit components.

Key Updates:

New Components:
AppTabs.js
: A reusable tab container component to organize form content into sections (e.g., General, Settings, Contact).
AppLookup.js
: A smart dropdown component that fetches lookup options from the API (/json/lookup_query_all/), enabling dynamic field population.
DashboardGrid.js
: Updated to include a Filter Text Input in the toolbar for quick searching/filtering of rows. It also now properly emits row-click events for better navigation.
Updated Grids & Forms:
Operations (
OperationListGrid
 & 
OperationForm
):
Grid: Now supports Create, Edit, and Delete actions (mocked for safety).
Form: Features tabs for General, Settings, and Contact. Includes fields for Name, Type (Lookup), Status, Description, Publish settings, and Contact info.
Roles (
RoleListGrid
 & 
RoleForm
):
Grid: Full CRUD support.
Form: Features tabs for Role Details and Permissions (displaying JSON).
Parties/Users (
PartyListGrid
 & 
PartyForm
):
Grid: Full CRUD support.
Form: Features tabs for Profile, Contact Info, and Preferences. Includes fields for Name, Type (Lookup), Status, Email, Phone, and Notes.
Functionality:
Filtering: You can now type in the "Filter..." box on any of these grids to instantly filter the displayed rows.
Master-Detail: Clicking a row opens the detailed form in a modal.
Tabs: Forms are organized into logical tabs to handle many fields without clutter.
Lookups: Fields like "Type" now use the 
AppLookup
 component to fetch valid options from the backend.
You can now navigate to the Operations, Roles, or Parties pages to see these enhanced interfaces in action.

Good
Bad
Review Changes



Add context
Images
Mentions
Workflows

Conversation mode
Planning
Agent can plan before executing tasks. Use for deep research, complex tasks, or collaborative work
Fast
Agent will execute tasks directly. Use for simple tasks that can be completed faster

Gemini 3 Pro (High)

Model






