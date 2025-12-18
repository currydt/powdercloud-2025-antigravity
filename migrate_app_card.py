import os

# Configuration for this run (AppCard)
OLD_COMPONENT = "AppCard.js"
NEW_COMPONENT = "PowdercloudCard.js"
OLD_TAG = "app-card"
NEW_TAG = "powdercloud-card"

# Found via grep
FILES_TO_CHECK = [
    "public/js/lit/AnalysisAvalancheActivityPage.js",
    "public/js/lit/AnalysisCommunitySummaryPage.js",
    "public/js/lit/AnalysisConcernsPage.js",
    "public/js/lit/AnalysisDangerPage.js",
    "public/js/lit/AnalysisNewsPage.js",
    "public/js/lit/AnalysisPublicReportPage.js",
    "public/js/lit/AnalysisSightingsPage.js",
    "public/js/lit/AnalysisSnowProfilePage.js",
    "public/js/lit/AnalysisSnowpackPage.js",
    "public/js/lit/AnalysisSnowpackStructurePage.js",
    "public/js/lit/AnalysisStabilityPage.js",
    "public/js/lit/AnalysisWeatherPage.js",
    "public/js/lit/AvalancheEventStandardPage.js",
    "public/js/lit/ComponentsPage.js",
    "public/js/lit/DesignSystemArchitecturePage.js",
    "public/js/lit/DesignSystemContainersPage.js",
    "public/js/lit/DesignSystemOverviewPage.js",
    "public/js/lit/WeatherStudyPlotStandardPage.js"
]

def migrate_component():
    print(f"Migrating {OLD_COMPONENT} -> {NEW_COMPONENT}...")
    
    for filepath in FILES_TO_CHECK:
        if not os.path.exists(filepath):
            print(f"Skipping {filepath} (not found)")
            continue
            
        with open(filepath, 'r') as f:
            content = f.read()
            
        new_content = content
        
        # 1. Update Import
        new_content = new_content.replace(f"./components/{OLD_COMPONENT}", f"./components/{NEW_COMPONENT}")
        
        # 2. Update Tag
        new_content = new_content.replace(f"<{OLD_TAG}", f"<{NEW_TAG}")
        new_content = new_content.replace(f"</{OLD_TAG}>", f"</{NEW_TAG}>")
        
        if new_content != content:
            with open(filepath, 'w') as f:
                f.write(new_content)
            print(f"Updated {filepath}")

if __name__ == "__main__":
    migrate_component()
