const express = require('express');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, limit } = require('firebase/firestore');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3003;

app.use(cors());

app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});

app.use(express.static('public'));

// --- FIREBASE CONFIG ---
const firebaseConfig = {
    apiKey: "AIzaSyAcdFfM5SxaTpDbgg__AnLyQaJ-BrzlBXI",
    authDomain: "powdercrowd-project.firebaseapp.com",
    projectId: "powdercrowd-project",
    storageBucket: "powdercrowd-project.firebasestorage.app",
    messagingSenderId: "702958227482",
    appId: "1:702958227482:web:fb719cc4de91bc1345c1a3",
    measurementId: "G-NKG718NZXT"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// --- HELPER: FORMAT RESPONSE FOR EXTJS ---
// ExtJS expects: { success: true, totalCount: N, rows: [...] }
// It also often uses JSONP (callback param)
function sendExtJSResponse(res, data, callback) {
    const responseData = {
        success: true,
        totalCount: data.length,
        rows: data
    };

    if (callback) {
        // JSONP response for ScriptTagProxy
        res.type('application/javascript');
        res.send(`${callback}(${JSON.stringify(responseData)})`);
    } else {
        // Regular JSON
        res.json(responseData);
    }
}

// ==========================================
// MANAGEMENT APP ROUTES (ExtJS)
// ==========================================
app.get('/', (req, res) => {
    // Redirect root to management
    res.redirect('/management/');
});

app.get('/management/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/management/observation', (req, res) => {
    res.sendFile(__dirname + '/public/observation.html');
});

app.get('/management/incidents', (req, res) => {
    res.sendFile(__dirname + '/public/incidents.html');
});

app.get('/management/reports', (req, res) => {
    res.sendFile(__dirname + '/public/reports.html');
});

app.get('/management/admin', (req, res) => {
    res.sendFile(__dirname + '/public/admin.html');
});

app.get('/reports/avalanche_event', (req, res) => {
    res.sendFile(__dirname + '/public/reports/avalanche_event.html');
});

app.get('/reports/weather_analysis', (req, res) => {
    res.sendFile(__dirname + '/public/reports/weather_analysis.html');
});

app.get('/reports/snowpack_structure_analysis', (req, res) => {
    res.sendFile(__dirname + '/public/reports/snowpack_structure_analysis.html');
});

app.get('/reports/snow_profile_analysis', (req, res) => {
    res.sendFile(__dirname + '/public/reports/snow_profile_analysis.html');
});

app.get('/reports/concerns_analysis', (req, res) => {
    res.sendFile(__dirname + '/public/reports/concerns_analysis.html');
});

app.get('/reports/sightings_analysis', (req, res) => {
    res.sendFile(__dirname + '/public/reports/sightings_analysis.html');
});

app.get('/reports/danger_analysis', (req, res) => {
    res.sendFile(__dirname + '/public/reports/danger_analysis.html');
});

app.get('/reports/stability_analysis', (req, res) => {
    res.sendFile(__dirname + '/public/reports/stability_analysis.html');
});

app.get('/reports/news_analysis', (req, res) => {
    res.sendFile(__dirname + '/public/reports/news_analysis.html');
});

app.get('/operation/activity-generic', (req, res) => {
    res.sendFile(__dirname + '/public/projects/activities_list.html');
});

// Observation Routes
app.get('/observation/weather_narrative', (req, res) => { res.sendFile(__dirname + '/public/observation/weather_narrative.html'); });
app.get('/observation/weather_study_plot_standard', (req, res) => { res.sendFile(__dirname + '/public/observation/weather_study_plot_standard.html'); });
app.get('/observation/weather_field_summary', (req, res) => { res.sendFile(__dirname + '/public/observation/weather_field_summary.html'); });
app.get('/observation/avalanche_narrative', (req, res) => { res.sendFile(__dirname + '/public/observation/avalanche_narrative.html'); });
app.get('/observation/avalanche_event_standard', (req, res) => { res.sendFile(__dirname + '/public/observation/avalanche_event_standard.html'); });
app.get('/observation/avalanche_event_multiple', (req, res) => { res.sendFile(__dirname + '/public/observation/avalanche_event_multiple.html'); });
app.get('/observation/avalanche_summary', (req, res) => { res.sendFile(__dirname + '/public/observation/avalanche_summary.html'); });
app.get('/observation/persistent_layer_narrative', (req, res) => { res.sendFile(__dirname + '/public/observation/persistent_layer_narrative.html'); });
app.get('/observation/persistent_layer', (req, res) => { res.sendFile(__dirname + '/public/observation/persistent_layer.html'); });
app.get('/observation/snowpack_structure', (req, res) => { res.sendFile(__dirname + '/public/observation/snowpack_structure.html'); });
app.get('/observation/concerns', (req, res) => { res.sendFile(__dirname + '/public/observation/concerns.html'); });
app.get('/observation/snow_profile_industrial', (req, res) => { res.sendFile(__dirname + '/public/observation/snow_profile_industrial.html'); });
app.get('/observation/rating_danger', (req, res) => { res.sendFile(__dirname + '/public/observation/rating_danger.html'); });
app.get('/observation/rating_stability', (req, res) => { res.sendFile(__dirname + '/public/observation/rating_stability.html'); });
app.get('/observation/news', (req, res) => { res.sendFile(__dirname + '/public/observation/news.html'); });
app.get('/observation/sighting_narrative', (req, res) => { res.sendFile(__dirname + '/public/observation/sighting_narrative.html'); });
app.get('/observation/sighting_event', (req, res) => { res.sendFile(__dirname + '/public/observation/sighting_event.html'); });

app.get('/admin/lookup_list', (req, res) => {
    res.sendFile(__dirname + '/public/admin/lookup_list.html');
});

// Legacy routes for backward compatibility
app.get('/observation', (req, res) => {
    res.sendFile(__dirname + '/public/observation.html');
});

// 1. LOOKUPS
// URL: /json/lookup_query_all/?lookup_code=aspect
app.get('/json/lookup_query_all/', async (req, res) => {
    const lookupCode = req.query.lookup_code;
    const callback = req.query.callback;
    console.log(`[LOOKUP] Fetching: ${lookupCode}`);

    try {
        // Strategy: Query Firestore 'Lookup' collection.
        // In the old system, we want children of the lookup with this code.
        // But for now, let's just try to find documents that MIGHT match.
        // We'll try querying for 'code' matching the request.

        // NOTE: In your migration, you might have flattened things or kept them hierarchical.
        // I'll fetch ALL lookups for now to see what we have, then filter.
        // Optimization: In production, use a specific query.

        const q = query(collection(db, 'Lookup'));
        const snapshot = await getDocs(q);

        // Simple client-side filter for the shim (inefficient but safe)
        // We are looking for items where the PARENT has the code 'lookupCode'
        // OR where the item itself has the code (depending on usage).

        // Let's assume we want children of the parent with code = lookupCode
        const allLookups = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

        // Find the parent first
        const parent = allLookups.find(l => l.code === lookupCode || l.name === lookupCode);

        let results = [];
        if (parent) {
            // Find children
            // Note: Firestore references are objects, so we compare IDs or paths
            results = allLookups.filter(l => {
                // Check if 'parent_lup' field exists and matches
                // This depends on how you migrated the ReferenceProperty
                if (l.parent_lup) {
                    // It might be a string ID or a reference object
                    return l.parent_lup === parent.id || l.parent_lup.id === parent.id;
                }
                return false;
            });
        } else {
            // Fallback: maybe they are asking for the item itself?
            results = allLookups.filter(l => l.code === lookupCode);
        }

        // If still empty, just return everything so we see SOMETHING in the UI (Debug Mode)
        if (results.length === 0) {
            console.log(`[LOOKUP] No specific matches for ${lookupCode}, returning all 20 items for debug.`);
            results = allLookups.slice(0, 20);
        }

        console.log(`[LOOKUP] Found ${results.length} items for ${lookupCode}`);
        sendExtJSResponse(res, results, callback);

    } catch (error) {
        console.error("Error fetching lookups:", error);
        res.status(500).send({ success: false, msg: error.message });
    }
});

// 2. ENTITIES (Generic)
// URL: /json/entity_query_all/?entity=Terrain
app.get('/json/entity_query_all/', async (req, res) => {
    const entityName = req.query.entity;
    const callback = req.query.callback;
    console.log(`[ENTITY] Fetching: ${entityName}`);

    // MOCK ACTIVITY DATA FOR TIMELINE
    if (entityName === 'Activity') {
        const mockActivities = [
            {
                id: 'mock_1',
                key: 'mock_1',
                name: 'Morning Meeting',
                type_desc: 'todo',
                comments_internal: 'Daily safety briefing at HQ.',
                created_date_time: new Date().toISOString(),
                date_time_start: new Date().toISOString(),
                status_desc: 'Complete',
                priority_desc: 'High',
                photos: []
            },
            {
                id: 'mock_2',
                key: 'mock_2',
                name: 'Avalanche Control Route 1',
                type_desc: 'runusage', // Triggers specific icon/logic
                comments_internal: 'Blasting performed on Ridge 1. Good results.',
                created_date_time: new Date().toISOString(),
                date_time_start: new Date().toISOString(),
                status_desc: 'In Progress',
                priority_desc: 'Critical',
                photos: []
            }
        ];
        console.log(`[ENTITY] Returning MOCK Activity data`);
        return sendExtJSResponse(res, mockActivities, callback);
    }

    try {
        // Map old entity names to new Collection names if needed
        const collectionMap = {
            'Observation': 'Observations',
            'Activity': 'Activities', // If we ever stop mocking it
            'Party': 'Parties' // Just in case
        };
        const collectionName = collectionMap[entityName] || entityName;

        const q = query(collection(db, collectionName));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            key: doc.id, // ExtJS often expects a 'key' field
            ...doc.data()
        }));

        console.log(`[ENTITY] Found ${data.length} items for ${entityName}`);
        sendExtJSResponse(res, data, callback);

    } catch (error) {
        console.error(`Error fetching entity ${entityName}:`, error);
        res.status(500).send({ success: false, msg: error.message });
    }
});

// 3. ENTITIES (Paging)
// URL: /json/entity_query_all_paging/
app.get('/json/entity_query_all_paging/', async (req, res) => {
    // For now, just alias to the non-paging one
    const entityName = req.query.entity || 'Activity'; // Default
    req.query.entity = entityName;

    const callback = req.query.callback;
    console.log(`[ENTITY PAGING] Fetching: ${entityName}`);

    // MOCK ACTIVITY DATA FOR TIMELINE (Copied from entity_query_all)
    if (entityName === 'Activity') {
        const mockActivities = [
            {
                id: 'mock_1',
                key: 'mock_1',
                name: 'Morning Meeting',
                type_desc: 'todo',
                comments_internal: 'Daily safety briefing at HQ.',
                created_date_time: new Date().toISOString(),
                date_time_start: new Date().toISOString(),
                status_desc: 'Complete',
                priority_desc: 'High',
                photos: []
            },
            {
                id: 'mock_2',
                key: 'mock_2',
                name: 'Avalanche Control Route 1',
                type_desc: 'runusage', // Triggers specific icon/logic
                comments_internal: 'Blasting performed on Ridge 1. Good results.',
                created_date_time: new Date().toISOString(),
                date_time_start: new Date().toISOString(),
                status_desc: 'In Progress',
                priority_desc: 'Critical',
                photos: []
            }
        ];
        console.log(`[ENTITY PAGING] Returning MOCK Activity data`);
        return sendExtJSResponse(res, mockActivities, callback);
    }

    try {
        const collectionMap = {
            'Observation': 'Observations',
            'Activity': 'Activities',
            'Party': 'Parties'
        };
        const collectionName = collectionMap[entityName] || entityName;

        const limitVal = parseInt(req.query.limit) || 50;
        // Note: Real paging requires startAfter, but for now let's just limit to avoid hanging
        const q = query(collection(db, collectionName), limit(limitVal));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => {
            const d = doc.data();
            // Helper to convert Firestore Timestamps to ISO strings
            const convertTimestamp = (val) => {
                if (val && typeof val === 'object' && val.toDate) {
                    return val.toDate().toISOString();
                }
                return val;
            };

            // Specific handling for Observations to ensure grid renders
            if (entityName === 'Observation') {
                const getDesc = (val) => {
                    if (!val) return '';
                    if (typeof val === 'string') return val;
                    if (typeof val === 'object') return val.name || val.id || JSON.stringify(val);
                    return String(val);
                };

                return {
                    id: doc.id,
                    key: doc.id,
                    ...d,
                    date_time_start: convertTimestamp(d.date_time_start),
                    created_date_time: convertTimestamp(d.created_date_time),
                    observer_desc: getDesc(d.observer_desc || d.observer) || 'Unknown Observer',
                    terrain_desc: getDesc(d.terrain_desc || d.terrain) || 'Unknown Location',
                    subject: d.subject || '(No Subject)'
                };
            }

            return {
                id: doc.id,
                key: doc.id,
                ...d
            };
        });
        sendExtJSResponse(res, data, callback);
    } catch (error) {
        console.error(`Error fetching paging entity ${entityName}:`, error);
        res.status(500).send({ success: false, msg: error.message });
    }
});

// 4. PARTY LIST
// URL: /json/operation-party-list/:opKey/
app.get('/json/operation-party-list/:opKey/', async (req, res) => {
    const opKey = req.params.opKey;
    const callback = req.query.callback;
    console.log(`[PARTY] Fetching parties for Op: ${opKey}`);

    try {
        // In the new system, we might query 'Party' collection.
        // We might not have the 'operation' field set on Party yet (it's usually in PartyOperationAssociation).
        // For the shim, let's just return ALL parties.

        const q = query(collection(db, 'Party'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            key: doc.id,
            full_name: `${doc.data().first_name} ${doc.data().last_name}`,
            ...doc.data()
        }));

        sendExtJSResponse(res, data, callback);

    } catch (error) {
        console.error("Error fetching parties:", error);
        res.status(500).send({ success: false, msg: error.message });
    }
});


// 5. SAVE (Mock)
app.post('/json/entity_save/', express.json(), express.urlencoded({ extended: true }), (req, res) => {
    console.log('[SAVE] Mock saving entity:', req.body);
    // Return a fake key
    res.json({ success: true, key: 'mock_saved_key_' + Date.now() });
});

// 6. DELETE (Mock)
app.get('/json/entity_delete/', (req, res) => {
    console.log('[DELETE] Mock deleting entity:', req.query);
    res.json({ success: true });
});

const { onRequest } = require('firebase-functions/v2/https');

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Antigravity app listening at http://localhost:${port}`);
    });
}

exports.antigravity = onRequest(app);
