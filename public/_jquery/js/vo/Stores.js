Ext.onReady(function() {

        new Ext.data.Store({
            storeId: 'aspect',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, LookupVO),
            baseParams: {
                lookup_code: 'aspect',
                allowBlankRecord: true
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/lookup_query_all/'
            })
        });


        new Ext.data.Store({
            storeId: 'avalanchedistribution',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, LookupVO),
            baseParams: {
                lookup_code: 'avalanchedistribution',
                allowBlankRecord: true
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/lookup_query_all/'
            })
        });


        new Ext.data.Store({
            storeId: 'confidence',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, LookupVO),
            baseParams: {
                lookup_code: 'confidence',
                allowBlankRecord: true
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/lookup_query_all/'
            })
        });


        new Ext.data.Store({
            storeId: 'dangerscale',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, LookupVO),
            baseParams: {
                lookup_code: 'dangerscale',
                allowBlankRecord: true
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/lookup_query_all/'
            })
        });


        new Ext.data.Store({
            storeId: 'layerStatusStore',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, LookupVO),
            baseParams: {
                lookup_code: 'layerstatus',
                allowBlankRecord: true
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/lookup_query_all/'
            })
        });


        this.locationStore = new Ext.data.Store({
            storeId: 'location',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, TerrainVO),
            root: 'rows',
            baseParams: {
                entity: 'Terrain',
                active: 'True',
                det: 'k',
                sort: 'name_nick',
                dir: 'ASC'
                // allowBlankRecord: true
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/entity_query_all/'
            })
        });

        new Ext.data.Store({
            storeId: 'locationWithBlankRecord',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, TerrainVO),
            root: 'rows',
            baseParams: {
                entity: 'Terrain',
                active: 'True',
                det: 'k',
                sort: 'name_nick',
                dir: 'ASC',
                allowBlankRecord: true
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/entity_query_all/'
            })
        });

      new Ext.data.Store({
            storeId: 'locationRegionEvaluation',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, TerrainVO),
            root: 'rows',
            baseParams: {
                entity: 'Terrain',
                active: 'True',
                det: 'k',
                feature_type__selfRef: 'Region,Forecast Zone,Operating Zone',
                sort: 'name_nick',
                dir: 'ASC'
                 //allowBlankRecord: true
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/entity_query_all/'
            })
        })

        new Ext.data.Store({
            storeId: 'locationRegionForecast',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, TerrainVO),
            root: 'rows',
            baseParams: {
                entity: 'Terrain',
                active: 'True',
                det: 'k',
                feature_type__selfRef: 'Region,Forecast Zone',
                sort: 'name_nick',
                dir: 'ASC'
                 //allowBlankRecord: true
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/entity_query_all/'
            })
        })

        new Ext.data.Store({
            storeId: 'locationOperatingZones',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, TerrainVO),
            root: 'rows',
            baseParams: {
                entity: 'Terrain',
                active: 'True',
                det: 'k',
                feature_type__selfRef: 'Operating Zone',
                sort: 'sort_order',
                dir: 'ASC'
                 //allowBlankRecord: true
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/entity_query_all/'
            })
        })


        new Ext.data.Store({
            storeId: 'locationRuns',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, TerrainVO),
            remoteSort: true,
            baseParams:{
                entity: 'Terrain',
                active: 'True',
                operation: operation.key,
                det: 's',
                feature_type__selfRef: 'Run',
                sort: 'sort_order',
                dir: 'ASC'
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/entity_query_all/'
            })
        })


        this.observerStore = new Ext.data.Store({
            storeId: 'observer',
            reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
            }, PartyVO),
            baseParams:{
                det: 's'
            },
            sortInfo: {
                field: 'full_name',
                direction: 'ASC'
            },
            proxy: new Ext.data.ScriptTagProxy({
                    url: '/json/operation-party-list/'+operation.key+'/'
            })
        });

        this.observerStoreFilterByActive = new Ext.data.Store({
            storeId: 'observerActive',
            reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
            }, PartyVO),
            baseParams:{
                det: 's'
            },
            sortInfo: {
                field: 'full_name',
                direction: 'ASC'
            },
            proxy: new Ext.data.ScriptTagProxy({
                    url: '/json/operation-party-list/'+operation.key+'/'
            }),
            listeners:{
                scope: this,
                load: function(store, records){
                    store.filterBy(function(record, id) {
                        return record.get('active');
                    });
                }
            }
        });


        this.observerStoreWithBlanks = new Ext.data.Store({
            storeId: 'observer',
            reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
            }, PartyVO),
            baseParams:{
                det: 's',
                allowBlankRecord: true
            },
            sortInfo: {
                field: 'full_name',
                direction: 'ASC'
            },
            proxy: new Ext.data.ScriptTagProxy({
                    url: '/json/operation-party-list/'+operation.key+'/'
            })
        });


        new Ext.data.Store({
            storeId: 'precipitationtyperate',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, LookupVO),
            baseParams: {
                lookup_code: 'precipitationtyperate'
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/lookup_query_all/'
            })
        });


        new Ext.data.Store({
            storeId: 'projects',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, ProjectVO),
            remoteSort: true,
            baseParams:{
                entity: 'Project',
                allowBlankRecord: true
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/entity_query_all/'
            })
        })


        new Ext.data.Store({
            storeId: 'sizedestructive',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, LookupVO),
            baseParams: {
                lookup_code: 'sizedestructive',
                allowBlankRecord: true
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/lookup_query_all/'
            })
        });


        new Ext.data.Store({
            storeId: 'sizerelative',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, LookupVO),
            baseParams: {
                lookup_code: 'sizerelative',
                allowBlankRecord: true
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/lookup_query_all/'
            })
        });


        new Ext.data.Store({
            storeId: 'snowonground',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, LookupVO),
            baseParams : {
                lookup_code: 'snowonground',
                allowBlankRecord: true
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/lookup_query_all/'
            })
        });


        new Ext.data.Store({
            storeId: 'spatialScale',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, LookupVO),
            baseParams: {
                lookup_code: 'hazardspatialscale'
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/lookup_query_all/'
            })
        });


        new Ext.data.Store({
            storeId: 'stabilitytrending',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, LookupVO),
            baseParams: {
                lookup_code: 'stabilitytrending',
                allowBlankRecord: true
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/lookup_query_all/'
            })
        });


        new Ext.data.Store({
            storeId: 'startlocation',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, LookupVO),
            baseParams: {
                lookup_code: 'startlocation',
                allowBlankRecord: true
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/lookup_query_all/'
            })
        });


        new Ext.data.Store({
            storeId: 'stabilityratingscale',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, LookupVO),
            baseParams: {
                lookup_code: 'stabilityratingscale',
                allowBlankRecord: true
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/lookup_query_all/'
            })
        });


        new Ext.data.Store({
            storeId: 'temporalScale',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, LookupVO),
            baseParams: {
                lookup_code: 'hazardtemporalscale'
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/lookup_query_all/'
            })
        });


        new Ext.data.Store({
            storeId: 'terminus',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, LookupVO),
            baseParams: {
                lookup_code: 'terminus',
                allowBlankRecord: true
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/lookup_query_all/'
            })
        });


        new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
            }, PersistentLayerVO),
            remoteSort: true,
            storeId: 'persistantLayerStore',
            baseParams:{
                entity: 'PersistentLayer',
                operation: operation.key,
                type__ObservationType__lookup: 'persistentlayerevent'
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/entity_query_all/'
            })
        });


        new Ext.data.Store({
            storeId: 'trigger',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, LookupVO),
            baseParams: {
                lookup_code: 'trigger',
                allowBlankRecord: true
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/lookup_query_all/'
            })
        });


        new Ext.data.Store({
            storeId: 'triggersensitivity',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, LookupVO),
            baseParams: {
                lookup_code: 'triggersensitivity'
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/lookup_query_all/'
            })
        });


        new Ext.data.Store({
            storeId: 'triggerlikelihood',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, LookupVO),
            baseParams: {
                lookup_code: 'triggerlikelihood',
                allowBlankRecord: true
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/lookup_query_all/'
            })
        });


        new Ext.data.Store({
            storeId: 'windspeedestimation',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, LookupVO),
            baseParams: {
                lookup_code: 'windspeedestimation'
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/lookup_query_all/'
            })
        });

});
