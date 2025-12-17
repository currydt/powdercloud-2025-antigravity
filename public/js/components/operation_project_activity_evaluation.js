Ext.namespace("pc.custom");
pc.custom.ActivityEvaluationForm = Ext.extend(Ext.Panel, {
    border: false,
    defaults: {
        anchor: '0',
        border: false
    },
    autoHeight: true,
    storesToLoad: [ 'observerActive',
                    'location',
                    'locationRegionEvaluation',
                    'spatialScale',
                    'temporalScale',
                    'aspect',
                    'sizedestructive',
                    'sizerelative',
                    'trigger',
                    'bedsurface',
                    'failuretype',
                    'snowonground',
                    'liquidwatercontentstartzone',
                    'liquidwatercontentstartzone',
                    'startlocation',
                    'terminus',
                    'avalanchedistribution',
                    'skyconditons',
                    'precipitationtyperate',
                    'windspeedestimation',
                    'blowingsnow',
                    'dangerscale',
                    'stabilityratingscale',
                    'stabilitytrending'],
    initComponent: function() {
        this.projectCombo = new Ext.form.ComboBox({
            fieldLabel: 'Project',
            hiddenName: 'project',
            store: 'projects',
            valueField: 'key',
            displayField: 'name',
            hidden: true,
            editable: false,
            triggerAction: 'all',
            mode: 'local',
            selectOnFocus: false,
            forceSelection: false,
            width: 200
        });
        /*
            AVALANCHE
        */
        /*
            AVALANCHE FORM
        */
        this.avalancheNarrativeForm = new Ext.FormPanel({
            form_url: "/json/entity_save/",
            form_params:{
                entity: 'Avalanche',
                form: 'pc.forms.observation.ObservationForm',
                type: 'avalanchenarrative__ObservationType__lookup'
            },
            waitMsgTarget: true,
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, AvalancheVO),
            errorReader: new Ext.form.JSONErrorReader(),
            defaults: {
                width: 160
            },
            items:[{
                xtype:'hidden',
                name:'key'
            },{
                xtype:'hidden',
                name:'operation'
            },{
                xtype:'hidden',
                name:'subject'
            },{
                xtype:'hidden',
                name:'terrain'
            },{
                xtype:'hidden',
                name:'date_time_start'
            },{
                xtype:'hidden',
                name:'observer'
            },{
                xtype:'hidden',
                name:'created_by'
            },{
                fieldLabel: 'Avalanche Narrative',
                name: 'comments_internal',
                xtype: 'textarea',
                width: 500
            }]
        });


        /*
            AVALANCHE FORMS
        */
        this.avalancheFormStandard = new Ext.FormPanel({
            hidden: true,
            form_url: "/json/entity_save/",
            defaults: {
                anchor: '0'
            },
            waitMsgTarget: true,
            errorReader: new Ext.form.JSONErrorReader(),
            defaults: {
                width: 160
            },
            items: [
            // default header info
            {
                xtype: 'hidden',
                name: 'created_by'
            }, {
                xtype: 'hidden',
                name: 'created_date'
            }, {
                xtype: 'hidden',
                name: 'map_overlay'
            }, {
                xtype: 'hidden',
                name: 'key'
            }, {
                xtype: 'hidden',
                name: 'photo_overlay'
            }, {
                xtype: 'hidden',
                name: 'operation'
            }, {
                xtype: 'fieldset',
                collapsible: true,
                collapsed: false,
                width: '100%',
                title: 'Single Avalanche Event',
                items: [{
                    xtype: 'displayfield',
                    fieldLabel: 'Operation',
                    name: 'operation_desc',
                    width: 307
                },
                //{
                //	xtype:'quickaddlocation'
                //},
                {
                    xtype: 'displayfield',
                    fieldLabel: 'Data Recorder',
                    name: 'created_by_desc',
                    width: 368
                }, {
                    xtype: 'combo',
                    fieldLabel: 'Observer',
                    hiddenName: 'observer',
                    width: 368,
                    store: 'observerActive',
                    lastQuery: '',
                    valueField: 'key',
                    displayField: 'full_name',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus: true
                }, {
                    fieldLabel: 'Date and time',
                    name: 'date_time_start',
                    xtype: 'datetimefield',
                    dateFormat: 'Y-m-d',
                    timeFormat: 'H:i',
                    width: 150
                }, {
                    xtype: 'combo',
                    fieldLabel: 'Location',
                    hiddenName: 'terrain',
                    width: 368,
                    store: 'location',
                    valueField: 'key',
                    displayField: 'name_nick',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus: true
                },
                //{
                //    fieldLabel: 'Notable',
                //    name: 'notable',
                //    xtype: 'checkbox',
                //    width: 40
                //},
                {
                    fieldLabel: 'Subject',
                    name: 'subject',
                    xtype: 'textfield',
                    width: 736
                }]
            },

            // maid detail collapsible fieldset
            {
                xtype: 'fieldset',
                collapsible: true,
                collapsed: false,
                width: '100%',
                title: 'Details',
                items: [{
                    xtype: 'compositefield',
                    msgTarget: 'side',
                    height: 40,
                    fieldLabel: 'Occurrence',
                    cls: 'composite-field',
                    items: [{
                        xtype: 'compositefield',
                        width: 368,
                        items: [{
                            name: 'date_time_occurrence',
                            xtype: 'datetimefield',
                            dateFormat: 'Y-m-d',
                            timeFormat: 'H:i',
                            width: 150
                        }, {
                            xtype: 'displayfield',
                            hideParent: true,
                            value: 'Date/Time',
                            ctCls: 'pcComboOutter',
                            cls: 'pcComboInner'
                        }]
                    }, {
                        xtype: 'compositefield',
                        width: 368,
                        items: [{
                            name: 'time_range',
                            xtype: 'textfield',
                            width: 150
                        }, {
                            xtype: 'displayfield',
                            hideParent: true,
                            value: 'Range',
                            ctCls: 'pcComboOutter',
                            cls: 'pcComboInner'
                        }, ]
                    }]
                },

                // Path Characteristics
                {
                    xtype: 'fieldset',
                    collapsible: false,
                    collapsed: false,
                    title: 'Path Characteristics',
                    items: [{
                        xtype: 'compositefield',
                        msgTarget: 'side',
                        height: 40,
                        fieldLabel: 'Aspect',
                        cls: 'composite-field',
                        items: [{
                            xtype: 'compositefield',
                            width: 368,
                            items: [{
                                xtype: 'combo',
                                hiddenName: 'aspect_start',
                                width: 348,
                                store: 'aspect',
                                valueField: 'key',
                                displayField: 'value',
                                editable: false,
                                triggerAction: 'all',
                                mode: 'local',
                                selectOnFocus: true
                            }, {
                                xtype: 'displayfield',
                                hideParent: true,
                                value: 'Categorical',
                                ctCls: 'pcComboOutter',
                                cls: 'pcComboInner'
                            }]
                        },
                        // Numeric field is smaller, as it has checkbox after it
                        {
                            xtype: 'compositefield',
                            width: 293,
                            // 368 - 55px
                            items: [{
                                name: 'aspect_start_numeric',
                                xtype: 'numberfield',
                                width: 273 // 20px less than comp field width
                            }, {
                                xtype: 'displayfield',
                                hideParent: true,
                                value: 'Numeric',
                                ctCls: 'pcComboOutter',
                                cls: 'pcComboInner'
                            }]
                        }, {
                            xtype: 'compositefield',
                            width: 40,
                            items: [{
                                name: 'aspect_measured',
                                xtype: 'checkbox',
                                width: 20
                            }, {
                                xtype: 'displayfield',
                                hideParent: true,
                                value: 'Measured',
                                ctCls: 'pcComboOutter',
                                cls: 'pcComboInner'
                            }]
                        }]
                    }, {
                        xtype: 'compositefield',
                        msgTarget: 'side',
                        height: 40,
                        fieldLabel: 'Incline',
                        cls: 'composite-field',
                        items: [{
                            xtype: 'compositefield',
                            width: 75,
                            items: [{
                                name: 'incline_range_start',
                                xtype: 'numberfield',
                                width: 75
                            }, {
                                xtype: 'displayfield',
                                hideParent: true,
                                value: '',
                                ctCls: 'pcComboOutter',
                                cls: 'pcComboInner'
                            }]
                        }, {
                            xtype: 'compositefield',
                            width: 293,
                            // 368 - 75 (as field is small)
                            items: [{
                                name: 'incline_measured',
                                xtype: 'checkbox',
                                width: 20 // stays at 20, always
                            }, {
                                xtype: 'displayfield',
                                hideParent: true,
                                value: 'Measured?',
                                ctCls: 'pcComboOutter',
                                cls: 'pcComboInner'
                            }]
                        }]
                    }, {
                        xtype: 'compositefield',
                        msgTarget: 'side',
                        height: 40,
                        fieldLabel: 'Elevation m (feet)',
                        cls: 'composite-field',
                        width: '100%',
                        items: [{
                            xtype: 'compositefield',
                            width: 75,
                            items: [{
                                name: 'elevation_min',
                                width: 75,
                                xtype: 'numberfield'
                            }, {
                                xtype: 'displayfield',
                                hideParent: true,
                                value: 'Min',
                                ctCls: 'pcComboOutter',
                                cls: 'pcComboInner'
                            }]
                        }, {
                            xtype: 'compositefield',
                            width: 293,
                            items: [{
                                name: 'elevation_measured',
                                xtype: 'checkbox',
                                width: 20
                            }, {
                                xtype: 'displayfield',
                                hideParent: true,
                                value: 'Measured?',
                                ctCls: 'pcComboOutter',
                                cls: 'pcComboInner'
                            }]
                        }]
                    }]
                },

                // Trigger and Event Characteristics
                {
                    xtype: 'fieldset',
                    collapsible: false,
                    collapsed: false,
                    title: 'Trigger and Event Characteristics',
                    items: [{
                        xtype: 'compositefield',
                        msgTarget: 'side',
                        height: 40,
                        fieldLabel: 'Destructive size',
                        cls: 'composite-field',
                        items: [{
                            xtype: 'compositefield',
                            width: 368,
                            items: [{
                                xtype: 'combo',
                                hiddenName: 'destructive_size_max',
                                width: 348,
                                store: 'sizedestructive',
                                valueField: 'key',
                                displayField: 'code_value',
                                editable: false,
                                triggerAction: 'all',
                                mode: 'local',
                                selectOnFocus: true
                            }, {
                                xtype: 'displayfield',
                                hideParent: true,
                                value: 'Max',
                                ctCls: 'pcComboOutter',
                                cls: 'pcComboInner'
                            }]
                        }]
                    }, {
                        xtype: 'compositefield',
                        msgTarget: 'side',
                        height: 40,
                        fieldLabel: 'Relative size',
                        cls: 'composite-field',
                        items: [{
                            xtype: 'compositefield',
                            width: 368,
                            items: [{
                                xtype: 'combo',
                                hiddenName: 'relative_size_max',
                                width: 348,
                                store: 'sizerelative',
                                valueField: 'key',
                                displayField: 'code_value',
                                editable: false,
                                triggerAction: 'all',
                                mode: 'local',
                                selectOnFocus: true
                            }, {
                                xtype: 'displayfield',
                                hideParent: true,
                                value: 'Max',
                                ctCls: 'pcComboOutter',
                                cls: 'pcComboInner'
                            }]
                        }]
                    }, {
                        xtype: 'compositefield',
                        fieldLabel: 'Trigger & remote distance',
                        msgTarget: 'side',
                        height: 40,
                        width: 980,
                        cls: 'composite-field',
                        items: [{
                            xtype: 'compositefield',
                            width: 368,
                            items: [{
                                xtype: 'combo',
                                hiddenName: 'trigger',
                                store: 'trigger',
                                valueField: 'key',
                                displayField: 'code_value',
                                editable: false,
                                triggerAction: 'all',
                                mode: 'local',
                                selectOnFocus: true,
                                cascadeComboId: 'avalanche_single_trigger_composite',
                                width: 348
                            }]
                        }, {
                            xtype: 'compositefield',
                            width: 368,
                            items: [{
                                xtype: 'combo',
                                hiddenName: 'trigger_minor',
                                id: 'avalanche_single_trigger_composite',
                                width: 348,
                                store: new Ext.data.Store({
                                    reader: new Ext.data.JsonReader({}, LookupVO)
                                }),
                                valueField: 'key',
                                displayField: 'code_value',
                                editable: false,
                                triggerAction: 'all',
                                mode: 'local',
                                selectOnFocus: true
                            }]
                        }, {
                            xtype: 'compositefield',
                            width: 100,
                            items: [{
                                name: 'trigger_remote_distance',
                                width: 100,
                                xtype: 'numberfield'
                            }, {
                                xtype: 'displayfield',
                                hideParent: true,
                                value: 'Distance',
                                ctCls: 'pcComboOutter',
                                cls: 'pcComboInner'
                            }]
                        }]
                    }, { // no need for composite field, as it has just the 1 field on the row (and no sub labels)
                        xtype: 'combo',
                        fieldLabel: 'Bed surface',
                        hiddenName: 'bed_surface',
                        store: new Ext.data.JsonStore({
                            storeId: 'bedsurface',
                            fields: [{
                                name: 'key'
                            }, {
                                name: 'code_value'
                            }, ],
                            root: 'rows',
                            baseParams: {
                                lookup_code: 'bedsurface',
                                allowBlankRecord: true
                            },
                            proxy: new Ext.data.HttpProxy({
                                url: '/json/lookup_query_all/',
                                disableCaching: false,
                                method: 'GET'
                            })
                        }),
                        valueField: 'key',
                        displayField: 'code_value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus: true,
                        width: 348
                    }, {
                        xtype: 'combo',
                        fieldLabel: 'Failure type',
                        hiddenName: 'failure_type',
                        store: new Ext.data.JsonStore({
                            storeId: 'failuretype',
                            fields: [{
                                name: 'key'
                            }, {
                                name: 'code_value'
                            }, ],
                            root: 'rows',
                            baseParams: {
                                lookup_code: 'failuretype',
                                allowBlankRecord: true
                            },
                            proxy: new Ext.data.HttpProxy({
                                url: '/json/lookup_query_all/',
                                disableCaching: false,
                                method: 'GET'
                            })
                        }),
                        valueField: 'key',
                        displayField: 'code_value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus: true,
                        width: 348
                    }, {
                        fieldLabel: 'Failure plane age',
                        name: 'failure_plane_age',
                        xtype: 'datetimefield',
                        dateFormat: 'Y-m-d',
                        timeFormat: 'H:i',
                        width: 150
                    }, {
                        xtype: 'compositefield',
                        fieldLabel: 'Failure plane snow form',
                        msgTarget: 'side',
                        height: 40,
                        width: 980,
                        cls: 'composite-field',
                        items: [{
                            xtype: 'compositefield',
                            width: 368,
                            items: [{
                                xtype: 'combo',
                                hiddenName: 'surface_snow_form',
                                width: 368,
                                store: 'snowonground',
                                valueField: 'key',
                                displayField: 'code_value',
                                editable: false,
                                triggerAction: 'all',
                                mode: 'local',
                                width: 348,
                                selectOnFocus: true,
                                cascadeComboId: 'avalanche_single_surface_snow_form_minor'
                            }]
                        }, {
                            xtype: 'compositefield',
                            width: 368,
                            items: [{
                                xtype: 'combo',
                                id: 'avalanche_single_surface_snow_form_minor',
                                hiddenName: 'surface_snow_form_minor',
                                store: new Ext.data.Store({
                                    reader: new Ext.data.JsonReader({}, LookupVO)
                                }),
                                valueField: 'key',
                                displayField: 'code_value',
                                editable: false,
                                triggerAction: 'all',
                                mode: 'local',
                                selectOnFocus: true,
                                width: 348
                            }]
                        }, {
                            xtype: 'compositefield',
                            width: 184,
                            items: [{
                                xtype: 'compositefield',
                                width: 75,
                                items: [{
                                    name: 'surface_snow_size',
                                    width: 75,
                                    xtype: 'numberfield'
                                }, {
                                    xtype: 'displayfield',
                                    hideParent: true,
                                    value: 'Size',
                                    ctCls: 'pcComboOutter',
                                    cls: 'pcComboInner'
                                }]
                            }, {
                                xtype: 'compositefield',
                                width: 293,
                                items: [{
                                    name: 'surface_snow_form_rimed',
                                    xtype: 'checkbox',
                                    width: 20
                                }, {
                                    xtype: 'displayfield',
                                    hideParent: true,
                                    value: 'Rimed?',
                                    ctCls: 'pcComboOutter',
                                    cls: 'pcComboInner'
                                }]
                            }]
                        }]
                    }, {
                        xtype: 'compositefield',
                        fieldLabel: 'Failure plane snow form',
                        msgTarget: 'side',
                        height: 40,
                        width: 980,
                        cls: 'composite-field',
                        items: [{
                            xtype: 'compositefield',
                            width: 368,
                            items: [{
                                xtype: 'combo',
                                hiddenName: 'surface_snow_form_2',
                                width: 368,
                                store: 'snowonground',
                                valueField: 'key',
                                displayField: 'code_value',
                                editable: false,
                                triggerAction: 'all',
                                mode: 'local',
                                width: 348,
                                selectOnFocus: true,
                                cascadeComboId: 'avalanche_single_surface_snow_form_2_minor'
                            }]
                        }, {
                            xtype: 'compositefield',
                            width: 368,
                            items: [{
                                xtype: 'combo',
                                id: 'avalanche_single_surface_snow_form_2_minor',
                                hiddenName: 'surface_snow_form_2_minor',
                                store: new Ext.data.Store({
                                    reader: new Ext.data.JsonReader({}, LookupVO)
                                }),
                                valueField: 'key',
                                displayField: 'code_value',
                                editable: false,
                                triggerAction: 'all',
                                mode: 'local',
                                selectOnFocus: true,
                                width: 348
                            }]
                        }, {
                            xtype: 'compositefield',
                            width: 184,
                            items: [{
                                xtype: 'compositefield',
                                width: 75,
                                items: [{
                                    name: 'surface_snow_size_2',
                                    width: 75,
                                    xtype: 'numberfield'
                                }, {
                                    xtype: 'displayfield',
                                    hideParent: true,
                                    value: 'Size',
                                    ctCls: 'pcComboOutter',
                                    cls: 'pcComboInner'
                                }]
                            }, {
                                xtype: 'compositefield',
                                width: 293,
                                items: [{
                                    name: 'surface_snow_form_rimed_2',
                                    xtype: 'checkbox',
                                    width: 20
                                }, {
                                    xtype: 'displayfield',
                                    hideParent: true,
                                    value: 'Rimed?',
                                    ctCls: 'pcComboOutter',
                                    cls: 'pcComboInner'
                                }]
                            }]
                        }]
                    }, {
                        xtype: 'combo',
                        fieldLabel: 'Liquid water start',
                        hiddenName: 'liquid_water_start',
                        width: 348,
                        store: new Ext.data.JsonStore({
                            storeId: 'liquidwatercontentstartzone',
                            fields: [{
                                name: 'key'
                            }, {
                                name: 'code_value'
                            }, ],
                            root: 'rows',
                            baseParams: {
                                lookup_code: 'liquidwatercontentstartzone',
                                allowBlankRecord: true
                            },
                            proxy: new Ext.data.HttpProxy({
                                url: '/json/lookup_query_all/',
                                disableCaching: false,
                                method: 'GET'
                            })
                        }),
                        valueField: 'key',
                        displayField: 'code_value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus: true
                    }, {
                        xtype: 'combo',
                        fieldLabel: 'Liquid water deposit',
                        hiddenName: 'liquid_water_deposit',
                        width: 348,
                        store: 'liquidwatercontentstartzone',
                        valueField: 'key',
                        displayField: 'code_value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus: true
                    }]
                },

                // Dimensions
                {
                    xtype: 'fieldset',
                    collapsible: false,
                    collapsed: false,
                    width: '100%',
                    title: 'Dimensions',
                    items: [{
                        xtype: 'compositefield',
                        height: 30,
                        fieldLabel: 'Slab thickness',
                        cls: 'composite-field',
                        width: '100%',
                        items: [{
                            xtype: 'displayfield',
                            value: 'Average',
                            cls: 'alignRight',
                            width: 60
                        }, {
                            name: 'slab_thickness_avg',
                            cls: 'alignRight',
                            width: 115,
                            xtype: 'numberfield'
                        }, {
                            xtype: 'displayfield',
                            cls: 'alignRight',
                            value: 'Maximum',
                            width: 60
                        }, {
                            name: 'slab_thickness_max',
                            cls: 'alignRight',
                            width: 105,
                            xtype: 'numberfield'
                        }, {
                            xtype: 'displayfield',
                            cls: 'alignRight',
                            value: 'Measured',
                            width: 60
                        }, {
                            name: 'slab_thickness_measured',
                            xtype: 'checkbox'
                        }]
                    }, {
                        xtype: 'compositefield',
                        msgTarget: 'side',
                        height: 30,
                        fieldLabel: 'Slab width',
                        cls: 'composite-field',
                        width: '100%',
                        items: [{
                            xtype: 'displayfield',
                            cls: 'alignRight',
                            value: 'Average',
                            width: 60
                        }, {
                            name: 'slab_width_avg',
                            cls: 'alignRight',
                            width: 115,
                            xtype: 'numberfield'
                        }, {
                            xtype: 'displayfield',
                            cls: 'alignRight',
                            value: 'Maximum',
                            width: 60
                        }, {
                            name: 'slab_width_max',
                            cls: 'alignRight',
                            width: 105,
                            xtype: 'numberfield'
                        }, {
                            xtype: 'displayfield',
                            cls: 'alignRight',
                            value: 'Measured',
                            width: 60
                        }, {
                            name: 'slab_width_measured',
                            xtype: 'checkbox'
                        }]
                    }, {
                        xtype: 'compositefield',
                        msgTarget: 'side',
                        height: 30,
                        fieldLabel: 'Path Length',
                        cls: 'composite-field',
                        length: '100%',
                        items: [{
                            xtype: 'displayfield',
                            cls: 'alignRight',
                            value: 'Minimum',
                            width: 60
                        }, {
                            name: 'path_run_length_min',
                            cls: 'alignRight',
                            width: 115,
                            xtype: 'numberfield'
                        }, {
                            xtype: 'displayfield',
                            cls: 'alignRight',
                            value: 'Measured',
                            width: 60
                        }, {
                            name: 'path_run_length_min_measured',
                            xtype: 'checkbox'
                        }]
                    }, {
                        fieldLabel: 'Vertical fall',
                        name: 'vertical_fall_min',
                        xtype: 'numberfield',
                        width: 60
                    }, {
                        xtype: 'compositefield',
                        fieldLabel: 'Start location',
                        msgTarget: 'side',
                        height: 30,
                        cls: 'composite-field',
                        width: '100%',
                        items: [{
                            xtype: 'combo',
                            hiddenName: 'start_location',
                            store: 'startlocation',
                            valueField: 'key',
                            displayField: 'code_value',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true,
                            width: 265,
                            cascadeComboId: 'avalanche_single_start_location_minor'
                        }, {
                            xtype: 'combo',
                            hiddenName: 'start_location_minor',
                            id: 'avalanche_single_start_location_minor',
                            width: 265,
                            store: new Ext.data.Store({
                                reader: new Ext.data.JsonReader({}, LookupVO)
                            }),
                            valueField: 'key',
                            displayField: 'code_value',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true
                        }]
                    }, {
                        xtype: 'compositefield',
                        fieldLabel: 'Terminus',
                        msgTarget: 'side',
                        height: 30,
                        cls: 'composite-field',
                        width: '100%',
                        items: [{
                            xtype: 'combo',
                            hiddenName: 'terminus',
                            width: 265,
                            store: 'terminus',
                            valueField: 'key',
                            displayField: 'code_value',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true,
                            cascadeComboId: 'avalanche_single_terminus_minor'
                        }, {
                            xtype: 'combo',
                            hiddenName: 'terminus_minor',
                            id: 'avalanche_single_terminus_minor',
                            width: 265,
                            store: new Ext.data.Store({
                                reader: new Ext.data.JsonReader({}, LookupVO)
                            }),
                            valueField: 'key',
                            displayField: 'code_value',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true
                        }]
                    }]
                },

                // Deposit
                {
                    xtype: 'fieldset',
                    collapsible: false,
                    collapsed: false,
                    width: '100%',
                    title: 'Deposit',
                    items: [{
                        xtype: 'compositefield',
                        msgTarget: 'side',
                        height: 30,
                        fieldLabel: 'Deposit thickness',
                        cls: 'composite-field',
                        length: '100%',
                        items: [{
                            xtype: 'displayfield',
                            cls: 'alignRight',
                            value: 'Average',
                            width: 60
                        }, {
                            name: 'deposit_thickness_average',
                            fieldLabel: 'Deposit average thickness',
                            cls: 'alignRight',
                            xtype: 'numberfield',
                            width: 100
                        }, {
                            xtype: 'displayfield',
                            cls: 'alignRight',
                            value: 'Measured',
                            width: 60
                        }, {
                            name: 'deposit_thickness_measured',
                            xtype: 'checkbox'
                        }]
                    }, {
                        xtype: 'compositefield',
                        msgTarget: 'side',
                        height: 30,
                        fieldLabel: 'Deposit width',
                        cls: 'composite-field',
                        length: '100%',
                        items: [{
                            xtype: 'displayfield',
                            cls: 'alignRight',
                            value: 'Average',
                            width: 60
                        }, {
                            name: 'deposit_width_average',
                            cls: 'alignRight',
                            xtype: 'numberfield',
                            width: 100
                        }, {
                            xtype: 'displayfield',
                            cls: 'alignRight',
                            value: 'Measured',
                            width: 60
                        }, {
                            name: 'deposit_width_measured',
                            xtype: 'checkbox'
                        }]
                    }, {
                        xtype: 'compositefield',
                        msgTarget: 'side',
                        height: 30,
                        fieldLabel: 'Deposit length',
                        cls: 'composite-field',
                        length: '100%',
                        items: [{
                            xtype: 'displayfield',
                            cls: 'alignRight',
                            value: 'Average',
                            width: 60
                        }, {
                            name: 'deposit_length_average',
                            cls: 'alignRight',
                            xtype: 'numberfield',
                            width: 100
                        }, {
                            xtype: 'displayfield',
                            cls: 'alignRight',
                            value: 'Measured',
                            width: 60
                        }, {
                            name: 'deposit_length_measured',
                            xtype: 'checkbox'
                        }]
                    }]
                },
                // Notes
                {
                    fieldLabel: 'Notes',
                    name: 'comments_internal',
                    xtype: 'textarea',
                    width: 500
                }]
            }],
            buttons: [{
                text: 'Save',
                id: 'saveSingleAvalancheButton',
                scope: this,
                handler: function(button) {
                    button.disable();
                    this.saveAvalanche('single');
                }
            }, {
                text: 'Cancel',
                scope: this,
                handler: function() {
                    this.cancelAvalanche();
                }
            }]
        });
        this.avalancheFormMultiple = new Ext.FormPanel({
            hidden: true,
            form_url: "/json/entity_save/",
            defaults: {
                anchor: '0'
            },
            waitMsgTarget: true,
            errorReader: new Ext.form.JSONErrorReader(),
            defaults: {
                width: 160
            },
            items:[
                {
                    xtype:'hidden',
                    name:'key'
                },{
                    xtype:'hidden',
                    name:'created_date'
                },{
                    xtype:'hidden',
                    name:'map_overlay'
                },{
                    xtype:'hidden',
                    name:'photo_overlay'
                },{
                    xtype:'hidden',
                    name:'operation'
                },{
                    xtype:'hidden',
                    name:'created_by'
                },{
                    xtype:'fieldset',
                    collapsible: true,
                    collapsed: false,
                    width: '100%',
                    title:'Multiple Avalanche Event',
                    items: [{
                        xtype: 'displayfield',
                        fieldLabel: 'Operation',
                        name:'operation_desc',
                        width: 200
                    },{
                        xtype: 'displayfield',
                        fieldLabel: 'Data Recorder',
                        name:'created_by_desc',
                        width: 200
                    },{
                        xtype:'combo',
                        fieldLabel: 'Observer',
                        hiddenName:'observer',
                        width: 200,
                        store: 'observerActive',
                        lastQuery: '',
                        valueField:'key',
                        displayField:'full_name',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true
                    },{
                        fieldLabel: 'Date and time',
                        name: 'date_time_start',
                        xtype: 'datetimefield',
                        dateFormat: 'Y-m-d',
                        timeFormat: 'H:i',
                        width: 200
                    },
                    {
                        xtype:'combo',
                        fieldLabel: 'Location',
                        hiddenName:'terrain',
                        width: 200,
                        store: 'location',
                        valueField:'key',
                        displayField:'name_nick',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true
                    },
                    //{
                    //    xtype:'quickaddlocation'
                    //},
                    {
                        fieldLabel: 'Notable',
                        name: 'notable',
                        xtype: 'checkbox',
                        width: 40
                    },{
                        fieldLabel: 'Subject',
                        name: 'subject',
                        xtype: 'textfield',
                        width: 530
                    } ]
                },

                // Detail Section
                {
                    xtype:'fieldset',
                    collapsible: true,
                    collapsed: false,
                    width: '100%',
                    title:'Details',
                    items: [{
                        xtype: 'compositefield',
                        msgTarget : 'side',
                        height: 30,
                        fieldLabel: 'Occurrence',
                        cls: 'composite-field',
                        width: '100%',
                        items: [{
                            xtype:'displayfield',
                            value: 'Date/Time',
                            width: 60
                        }, {
                            name: 'date_time_occurrence',
                            //emptyText: 'Date and time',
                            xtype: 'datetimefield',
                            dateFormat: 'Y-m-d',
                            timeFormat: 'H:i',
                            width: 205

                        },{
                            xtype:'displayfield',
                            value: 'Range',
                            cls: 'alignRight',
                            width: 60
                        },{
                            name: 'time_range',
                            xtype: 'textfield',
                            width: 200
                        }]
                        },


                        // Path Characteristics
                    {
                            xtype:'fieldset',
                            collapsible: false,
                            collapsed: false,
                            width: '100%',
                            title:'Path Characteristics',
                            items: [
                                {
                        xtype: 'compositefield',
                        msgTarget : 'side',
                        height: 30,
                        fieldLabel: 'Distribution',
                        cls: 'composite-field',
                        width: '100%',
                        items: [{
                            xtype:'displayfield',
                            value: 'Categorical',
                            cls: 'alignRight',
                            width: 60
                        }, {
                            xtype:'combo',

                            hiddenName:'multiple_descriptor',
                            width: 200,
                            store: 'avalanchedistribution',
                            valueField:'key',
                            displayField:'code_value',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus:true
                        },{
                            xtype:'displayfield',
                            value: 'Numeric',
                            cls: 'alignRight',
                            width: 60
                        },{
                            name:'multiple_number',
                            width: 200,
                            xtype: 'numberfield'
                        }]
                    },

                    {
                        xtype: 'compositefield',
                        msgTarget : 'side',
                        height: 30,
                        fieldLabel: 'Aspect',
                        cls: 'composite-field',
                        width: '100%',
                        items: [
                                {
                                    xtype:'displayfield',
                                    value: 'Start',
                                    cls: 'alignRight',
                                    width: 60
                                }, {
                                    xtype:'combo',

                                    hiddenName:'aspect_start',
                                    width: 200,
                                    store: 'aspect',
                                    valueField:'key',
                                    displayField:'value',
                                    editable: false,
                                    triggerAction: 'all',
                                    mode: 'local',
                                    selectOnFocus:true
                                },{
                                    xtype:'displayfield',
                                    value: 'End',
                                    cls: 'alignRight',
                                    width: 60
                                },{
                                    xtype:'combo',

                                    hiddenName:'aspect_end',
                                    width: 200,
                                    store: 'aspect',
                                    valueField:'key',
                                    displayField:'value',
                                    editable: false,
                                    triggerAction: 'all',
                                    mode: 'local',
                                    selectOnFocus:true
                                }]
                            },{
                                xtype: 'compositefield',
                                msgTarget : 'side',
                                height: 30,
                                fieldLabel: 'Incline',
                                 cls: 'composite-field',
                                width: '100%',
                                items: [{
                                    xtype:'displayfield',
                                    value: 'Start',
                                    cls: 'alignRight',
                                    width: 60
                                },{
                                    name:'incline_range_start',
                                    width: 200,
                                    xtype: 'numberfield'
                                },{
                                    xtype:'displayfield',
                                    value: 'End',
                                    cls: 'alignRight',
                                    width: 60
                                },{
                                    name:'incline_range_end',
                                    width: 200,
                                    xtype: 'numberfield'
                                }]
                            },{
                                xtype: 'compositefield',
                                msgTarget : 'side',
                                height: 30,
                                fieldLabel: 'Elevation',
                                cls: 'composite-field',
                                width: '100%',
                                items: [{
                                    xtype:'displayfield',
                                    value: 'Start',
                                    cls: 'alignRight',
                                    width: 60
                                },{
                                    name:'elevation_min',
                                    width: 200,
                                    xtype: 'numberfield'
                                }, {
                                    xtype:'displayfield',
                                    value: 'End',
                                    cls: 'alignRight',
                                    width: 60
                                },{
                                    name:'elevation_max',
                                    width: 200,
                                    xtype: 'numberfield'
                                }]
                            }
                        ]
                    },


                    // Trigger and Event Characteristics
                {
                    xtype:'fieldset',
                    collapsible: false,
                    collapsed: false,
                    width: '100%',
                    title:'Trigger and Event ',
                    items: [
                                 {
                                    xtype: 'compositefield',
                                    msgTarget : 'side',
                                    height: 30,
                                    fieldLabel: 'Destructive size',
                                    cls: 'composite-field',
                                    width: '100%',
                                    items: [{
                                        xtype:'displayfield',
                                        value: 'Min',
                                        width: 60
                                    },{
                                        xtype:'combo',
                                        hiddenName:'destructive_size_min',
                                        width: 200,
                                        store: 'sizedestructive',
                                        valueField:'key',
                                        displayField:'code_value',
                                        editable: false,
                                        triggerAction: 'all',
                                        mode: 'local',
                                        selectOnFocus:true
                                    },{
                                        xtype:'displayfield',
                                        value: 'Max',
                                        cls: 'alignRight',
                                        width: 60
                                    },{
                                        xtype:'combo',
                                        hiddenName:'destructive_size_max',
                                        width: 200,
                                        store: 'sizedestructive',
                                        valueField:'key',
                                        displayField:'code_value',
                                        editable: false,
                                        triggerAction: 'all',
                                        mode: 'local',
                                        selectOnFocus:true
                                    }]
                                },{
                                    xtype: 'compositefield',
                                    fieldLabel: 'Trigger & remove distance',
                                    msgTarget : 'side',
                                    height: 30,
                                    cls: 'composite-field',
                                    width: '100%',
                                    items: [{
                                        xtype:'combo',
                                        hiddenName:'trigger',
                                        store: 'trigger',
                                        valueField:'key',
                                        displayField:'code_value',
                                        editable: false,
                                        triggerAction: 'all',
                                        mode: 'local',
                                        selectOnFocus:true,
                                        width: 265,
                                        cascadeComboId: 'avalanche_multiple_trigger_minor'
                                    },{
                                        xtype:'combo',
                                        hiddenName:'trigger_minor',
                                        id: 'avalanche_multiple_trigger_minor',
                                        width: 265,
                                        store: new Ext.data.Store({
                                            reader: new Ext.data.JsonReader({
                                            }, LookupVO)
                                        }),
                                        valueField:'key',
                                        displayField:'code_value',
                                        editable: false,
                                        triggerAction: 'all',
                                        mode: 'local',
                                        selectOnFocus:true
                                    },{
                                        xtype:'displayfield',
                                        value: 'Distance',
                                        cls: 'alignRight',
                                        width: 60
                                    },{
                                        name:'trigger_remote_distance',
                                        width: 80,
                                        xtype: 'numberfield'
                                }]
                                },{
                                    xtype:'combo',
                                    fieldLabel: 'Bed surface',
                                    hiddenName:'bed_surface',
                                    store: 'bedsurface',
                                    valueField:'key',
                                    displayField:'code_value',
                                    editable: false,
                                    triggerAction: 'all',
                                    mode: 'local',
                                    selectOnFocus:true,
                                    width: 265
                                },{
                                    xtype:'combo',
                                    fieldLabel: 'Failure type',
                                    hiddenName:'failure_type',
                                    store: 'failuretype',
                                    valueField:'key',
                                    displayField:'code_value',
                                    editable: false,
                                    triggerAction: 'all',
                                    mode: 'local',
                                    selectOnFocus:true,
                                    width: 265
                                },{
                                    fieldLabel: 'Failure plane age',
                                    name: 'failure_plane_age',
                                    xtype: 'datetimefield',
                                    dateFormat: 'Y-m-d',
                                    timeFormat: 'H:i',
                                    width: 265
                                },{
                                    xtype: 'compositefield',
                                    fieldLabel: 'Failure plane snow form',
                                    msgTarget : 'side',
                                    height: 30,
                                    cls: 'composite-field',
                                    width: '100%',
                                    items: [{
                                        xtype:'combo',
                                        hiddenName:'surface_snow_form',
                                        width: 265,
                                        store: 'snowonground',
                                        valueField:'key',
                                        displayField:'code_value',
                                        editable: false,
                                        triggerAction: 'all',
                                        mode: 'local',
                                        selectOnFocus:true,
                                        cascadeComboId: 'avalanche_multiple_surface_snow_form_minor'
                                    },{
                                        xtype:'combo',
                                        id: 'avalanche_multiple_surface_snow_form_minor',
                                        hiddenName:'surface_snow_form_minor',
                                        store: new Ext.data.Store({
                                            reader: new Ext.data.JsonReader({
                                            }, LookupVO)
                                        }),
                                        valueField:'key',
                                        displayField:'code_value',
                                        editable: false,
                                        triggerAction: 'all',
                                        mode: 'local',
                                        selectOnFocus:true,
                                        width: 265
                                    },{
                                        xtype:'displayfield',
                                        value: 'Size',
                                        cls: 'alignRight',
                                        width: 60
                                    },{
                                        fieldLabel: 'Size',
                                        name: 'surface_snow_size',
                                        xtype: 'numberfield',
                                        width: 80
                                    },{
                                        xtype:'displayfield',
                                        value: 'Rimed',
                                        cls: 'alignRight',
                                        width: 60
                                    },{
                                        name: 'surface_snow_form_rimed',
                                        xtype: 'checkbox'
                                    }]
                                },{
                                    xtype:'combo',
                                    fieldLabel: 'Liquid water deposit',
                                    hiddenName:'liquid_water_deposit',
                                    width: 265,
                                    store: 'liquidwatercontentstartzone',
                                    valueField:'key',
                                    displayField:'code_value',
                                    editable: false,
                                    triggerAction: 'all',
                                    mode: 'local',
                                    selectOnFocus:true
                                },


                // Dimensions
                {
                    xtype:'fieldset',
                    collapsible: false,
                    collapsed: false,
                    width: '100%',
                    title:'Dimensions',
                    items: [
                        {
                        xtype: 'compositefield',
                        height: 30,
                        fieldLabel: 'Slab thickness',
                        cls: 'composite-field',
                        width: '100%',
                        items: [{
                            xtype:'displayfield',
                            value: 'Minimum',
                            cls: 'alignRight',
                            width: 60
                        },{
                            name:'slab_thickness_min',
                            width: 105,
                            xtype: 'numberfield'
                        },{
                            xtype:'displayfield',
                            value: 'Maximum',
                            cls: 'alignRight',
                            width: 60
                        },{
                            name:'slab_thickness_max',
                            width: 105,
                            xtype: 'numberfield'
                        }]
                    },{
                        xtype: 'compositefield',
                        msgTarget : 'side',
                        height: 30,
                        fieldLabel: 'Slab width',
                         cls: 'composite-field',
                        width: '100%',
                        items: [{
                            xtype:'displayfield',
                            value: 'Minumim',
                            cls: 'alignRight',
                            width: 60
                        },{
                            name:'slab_width_min',
                            width: 105,
                            xtype: 'numberfield'
                        },{
                            xtype:'displayfield',
                            value: 'Maximum',
                            cls: 'alignRight',
                            width: 60
                        },{
                            name:'slab_width_max',
                            width: 105,
                            xtype: 'numberfield'
                        }]
                    },{
                        xtype: 'compositefield',
                        msgTarget : 'side',
                        height: 30,
                        fieldLabel: 'Run Length',
                         cls: 'composite-field',
                        width: '100%',
                        items: [{
                            xtype:'displayfield',
                            value: 'Minimum',
                            cls: 'alignRight',
                            width: 60
                        },{
                            name:'path_run_length_min',
                            width: 105,
                            xtype: 'numberfield'
                        },{
                            xtype:'displayfield',
                            value: 'Maximum',
                            cls: 'alignRight',
                            width: 60
                        },{
                            name:'path_run_length_max',
                            width: 105,
                            xtype: 'numberfield'
                        }]
                    },{
                        xtype: 'compositefield',
                        msgTarget : 'side',
                        height: 30,
                        fieldLabel: 'Vertical fall',
                         cls: 'composite-field',
                        width: '100%',
                        items: [{
                            xtype:'displayfield',
                            value: 'Minimum',
                            cls: 'alignRight',
                            width: 60
                        },{
                            name:'vertical_fall_min',
                            width: 105,
                            xtype: 'numberfield'
                        },{
                            xtype:'displayfield',
                            value: 'Maximum',
                            cls: 'alignRight',
                            width: 60
                        },{
                            name:'vertical_fall_max',
                            width: 105,
                            xtype: 'numberfield'
                        }]
                    }]
                }]
                },

                // Notes
                {
                        fieldLabel: 'Notes',
                        name: 'comments_internal',
                        xtype: 'textarea',
                        width:500
                    }]
                }],
            buttons: [{
                text: 'Save',
                id: 'saveMultipleAvalancheButton',
                scope: this,
                handler: function(button) {
                    button.disable();
                    this.saveAvalanche('multiple');
                }
            }, {
                text: 'Cancel',
                scope: this,
                handler: function() {
                    this.cancelAvalanche();
                }
            }]
        });
        /*
            AVALANCHE GRID
        */
        this.avalancheGridExpander = new Ext.ux.grid.RowExpander({
            tpl: new Ext.Template('<p><b>Comment:</b> {comments_internal}</p>')
        });
        this.avalancheGridAction = new Ext.ux.grid.RowActions({
            header: '',
            width: 80,
            keepSelection: true,
            actions: [{
                iconCls: 'ui-icon ui-icon-wrench',
                tooltip: 'Edit',
                scope: this,
                callback: function(grid, records, action) {
                    grid.ownerCt.ownerCt.ownerCt.editAvalanche(records);
                }
            }, {
                iconCls: 'ui-icon ui-icon-trash',
                tooltip: 'Delete',
                scope: this,
                callback: function(grid, records, action) {
                    Ext.MessageBox.confirm('Confirm', 'Are you sure you want delete the record?', function(btn) {
                        if (btn == "yes") {
                            Ext.Ajax.request({
                                method: 'GET',
                                url: '/json/entity_delete/',
                                params: {
                                    key: records.data.key,
                                    entity: 'Avalanche'
                                },
                                success: function(action, options) {
                                    this.avalancheGrid.getStore().reload();
                                    deleteFunciton(action, options);
                                }
                            });
                        }
                    }, this);
                }
            }]
        });
        this.avalancheGridStore = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
            }, AvalancheVO),
            remoteSort: true,
            baseParams:{
                entity: 'Avalanche',
                type__ObservationType__lookup: 'avalancheeventmultiple,avalancheeventstandard',
                operation: operation.key,
                start:0,
                limit:PAGING_LIMIT
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/entity_query_all_paging/'
            })
        });
        this.avalancheGrid = new Ext.grid.GridPanel({
            store: this.avalancheGridStore,
            autoHeight: true,
            loadMask: true,
            plugins: [this.avalancheGridAction, this.avalancheGridExpander],
            columns: [
                this.avalancheGridExpander,
                this.avalancheGridAction,
            {
                header: 'Type',
                width: 120,
                dataIndex: 'type_desc',
                renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                    if(value == 'avalancheeventstandard'){
                        return 'Single';
                    }   else {
                        return 'Multiple';
                    }
                }
            }, {
                header: 'Date and Time',
                renderer: formatDate,
                width: 120,
                sortable: true,
                dataIndex: 'date_time_start'
            }, {
                header: 'Observer',
                width: 140,
                sortable: false,
                dataIndex: 'observer_desc'
            }, {
                header: 'Location',
                width: 150,
                sortable: false,
                dataIndex: 'terrain_desc'
            }, {
                header: 'Occurrence Date and Time',
                width: 160,
                sortable: false,
                dataIndex: 'date_time_occurrence',
                renderer: formatDate
            }, {
                header: 'Notable',
                width: 68,
                sortable: false,
                dataIndex: 'notable'
            }],
            stripeRows: true
        });
        /*
            AVALANCHE SECTION
        */
        this.avalancheSection = new Ext.form.FieldSet({
            title: 'Avalanche Observations',
            hidden: true,
            collapsible: true,
            collapsed: true,
            width: 1000,
            border: true,
            defaults:{
                border:false
            },
            items:[
                {
                    xtype:'container',
                    html:'<p>This section provides a standard avalanche narrative that is set the location, date, and analyst completing this evaluation. </p>'
                },
                 {
                    xtype:'container',
                    html:'<p> In addition, it provides a table of avalanche events. To add, edit, or delete avalanche events, just select  select the appropriate button at the top of the form.</p>'
                },
                this.avalancheNarrativeForm,
                {
                    xtype:'label',
                    fieldLabel: 'Avalanche Events'
                },
                {
                    xtype: 'panel',
                    id: 'avalancheGridContainer',
                    border: true,
                    plain : true,
                    unstyled: true,
                    width: 960,
                    autoScroll: true,
                    tbar: new Ext.Toolbar({
                        items: ['->',
                        {
                            text: 'Add',
                            iconCls: 'add-icon',
                            scope: this,
                            menu: [
                                {
                                    text: 'Multiple Avalanche',
                                    scope: this,
                                    handler: function() {
                                        this.addAvalanche('multiple');
                                    }
                                }, {
                                    text: 'Single Avalanche',
                                    scope: this,
                                    handler: function() {
                                        this.addAvalanche('single');
                                    }
                                }
                            ]
                        }]
                    }),
                    items:[
                        this.avalancheGrid
                    ]
                },
                this.avalancheFormStandard,
                this.avalancheFormMultiple
            ]
        });




        /*
        FIELD WEATHER
        */

        /*
            FIELD WEATHER FORM
        */
        this.weatherNarrativeForm = new Ext.FormPanel({
            form_url: "/json/entity_save/",
            form_params:{
                entity: 'Weather',
                form: 'pc.forms.observation.ObservationForm',
                type: 'weathernarrative__ObservationType__lookup'
            },
            waitMsgTarget: true,
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, WeatherVO),
            errorReader: new Ext.form.JSONErrorReader(),
            defaults: {
                width: 160
            },
            items:[{
                xtype:'hidden',
                name:'key'
            },{
                xtype:'hidden',
                name:'subject'
            },{
                xtype:'hidden',
                name:'operation'
            },{
                xtype:'hidden',
                name:'terrain'
            },{
                xtype:'hidden',
                name:'date_time_start'
            },{
                xtype:'hidden',
                name:'observer'
            },{
                xtype:'hidden',
                name:'created_by',
                value: party.key
            },{
                fieldLabel: 'Weather Narrative',
                name: 'comments_internal',
                xtype: 'textarea',
                width: 500
            }]
        });

        /*
            FIELD WEATHER SUMMARY FORM
        */
        this.fieldWeatherSummaryForm = new Ext.FormPanel({
            form_url: "/json/entity_save/",
            form_params:{
                entity: 'Weather',
                form: 'pc.forms.observation.ObservationForm',
                type: 'weatherfieldsummary__ObservationType__lookup'
            },
            waitMsgTarget: true,
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, WeatherVO),
            errorReader: new Ext.form.JSONErrorReader(),
            defaults: {
                width: 160
            },
            items:[{
                    xtype:'hidden',
                    name:'key'
                },{
                    xtype:'hidden',
                    name:'map_overlay'
                },{
                    xtype:'hidden',
                    name:'photo_overlay'
                },{
                    xtype:'hidden',
                    name:'operation'
                },{
                    xtype:'hidden',
                    name:'created_date'
                },{
                    xtype:'hidden',
                    name:'created_by'
                },{
                    xtype:'hidden',
                    name:'observer'
                },{
                    xtype:'hidden',
                    name:'terrain'
                },{
                    xtype:'hidden',
                    name:'subject'
                },
                {
                    xtype:'fieldset',
                    collapsible: true,
                    collapsed: false,
                    width: '100%',
                    title:'Field Weather Summary',
                    items: [{
                        xtype: 'compositefield',
                        msgTarget : 'side',
                        height: 30,
                        fieldLabel: 'Date Range',
                        cls: 'composite-field',
                        width: '100%',
                        items: [{
                            name: 'date_time_start',
                            xtype: 'datetimefield',
                            dateFormat: 'Y-m-d',
                            timeFormat: 'H:i',
                            renderer: formatDate,
                            width: 200
                        },{
                                xtype:'displayfield',
                                cls: 'alignRight',
                                value: 'End',
                                width: 60
                        },{
                            name: 'date_time_end',
                            xtype: 'datetimefield',
                            dateFormat: 'Y-m-d',
                            timeFormat: 'H:i',
                            renderer: formatDate,
                            width: 200
                        }]
                    },{
                        fieldLabel: 'Notable',
                        name: 'notable',
                        xtype: 'checkbox',
                        width: 40
                    },
                    {
                        fieldLabel: 'Percent Observed',
                        name: 'tenure_observed_percent',
                        xtype: 'numberfield',
                        width: 60
                    }
                    ,{
                        xtype: 'compositefield',
                        msgTarget : 'side',
                        height: 30,
                        fieldLabel: 'Aspect',
                        cls: 'composite-field',
                        width: '100%',
                        items: [{
                            xtype:'displayfield',
                            cls: 'alignRight',
                            value: 'Start',
                            width: 60
                    }
                    ,{
                            xtype:'combo',

                            hiddenName:'aspect_start',
                            width: 200,
                            store: 'aspect',
                            valueField:'key',
                            displayField:'code_value',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus:true
                    }
                    ,{
                            xtype:'displayfield',
                            cls: 'alignRight',
                            value: 'End',
                            width: 60
                    }
                    ,{
                            xtype:'combo',

                            hiddenName:'aspect_end',
                            width: 200,
                            store: 'aspect',
                            valueField:'key',
                            displayField:'code_value',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus:true
                        },]
                    }
                    ,{
                        xtype: 'compositefield',
                        msgTarget : 'side',
                        height: 30,
                        fieldLabel: 'Incline',
                         cls: 'composite-field',
                        width: '100%',
                        items: [
                        {
                            xtype:'displayfield',
                            cls: 'alignRight',
                            value: 'Start',
                            width: 60
                        }
                        ,{
                            name:'incline_range_start',
                            width: 200,
                            xtype: 'numberfield'
                        }
                        ,{
                            xtype:'displayfield',
                            cls: 'alignRight',
                            value: 'End',
                            width: 60
                        }
                        ,{
                            name:'incline_range_end',
                            width: 200,
                            xtype: 'numberfield'
                        }]
                    }
                    ,{
                        xtype: 'compositefield',
                        msgTarget : 'side',
                        height: 30,
                        fieldLabel: 'Elevation',
                        cls: 'composite-field',
                        width: '100%',
                        items: [
                        {
                            xtype:'displayfield',
                            cls: 'alignRight',
                            value: 'Start',
                            width: 60
                        }
                        ,{
                            name:'elevation_min',
                            width: 200,
                            xtype: 'numberfield'
                        }
                        ,{
                            xtype:'displayfield',
                            cls: 'alignRight',
                            value: 'End',
                            width: 60
                        }
                        ,{
                            name:'elevation_max',
                            width: 200,
                            xtype: 'numberfield'
                        }]
                    }
                    ,{
                        xtype:'combo',
                        fieldLabel: 'Sky conditions',
                        hiddenName:'sky_condition',
                        store: new Ext.data.JsonStore({
                            storeId: 'skyconditons',
                            fields: [
                                {name: 'key'},
                                {name: 'code_value'}
                            ],
                            root: 'rows',
                            baseParams : {
                                lookup_code: 'skyconditons',
                                allowBlankRecord: true
                            },
                            proxy: new Ext.data.ScriptTagProxy({
                                url: '/json/lookup_query_all/'
                            })
                        }),
                        valueField:'key',
                        displayField:'code_value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        width: 265,
                        selectOnFocus:true
                    },{
                        xtype: 'compositefield',
                        fieldLabel: 'Precipitation Type & Rate',
                        msgTarget : 'side',
                        height: 30,
                        cls: 'composite-field',
                        width: '100%',
                        items: [{
                            xtype:'combo',
                            hiddenName:'precipitation_type_rate',
                            width: 265,
                            store: 'precipitationtyperate',
                            valueField:'key',
                            displayField:'code_value',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus:true,
                            cascadeComboId: 'weatherfieldsummary_precipitation_type_rate_minor'
                        },{
                            xtype:'combo',
                            hiddenName:'precipitation_type_rate_minor',
                            id: 'weatherfieldsummary_precipitation_type_rate_minor',
                            width: 265,
                            store: new Ext.data.Store({
                                reader: new Ext.data.JsonReader({
                                }, LookupVO)
                            }),
                            valueField:'key',
                            displayField:'code_value',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus:true
                        }]
                    }
                    ,{
                        xtype: 'compositefield',
                        msgTarget : 'side',
                        height: 30,
                        fieldLabel: 'Air temperature',
                         cls: 'composite-field',
                        width: '100%',
                        items: [
                        {
                            xtype:'displayfield',
                            cls: 'alignRight',
                            value: 'Minimum',
                            width: 60
                        }
                        ,{
                            name:'air_temperature_min',
                            width: 105,
                            xtype: 'numberfield'
                        }
                        ,{
                            xtype:'displayfield',
                            cls: 'alignRight',
                            value: 'Maximum',
                            width: 60
                        }
                        ,{
                            name:'air_temperature_max',
                            width: 105,
                            xtype: 'numberfield'
                        }]
                    }
                    ,{
                        xtype: 'compositefield',
                        msgTarget : 'side',
                        height: 30,
                        fieldLabel: 'Field snow height',
                        cls: 'composite-field',
                        width: '100%',
                        items: [
                        {
                            xtype:'displayfield',
                            cls: 'alignRight',
                            value: 'HN24',
                            width: 60
                        }
                        ,{
                            name:'hn24_accumulated',
                            xtype: 'numberfield',
                            width: 200
                        }
                        ,{
                            xtype:'displayfield',
                            cls: 'alignRight',
                            value: 'HST',
                            width: 60
                        }
                        ,{
                            name:'hst_accumulated',
                            xtype: 'numberfield',
                            width: 200
                        }
                        ,{
                            xtype:'displayfield',
                            cls: 'alignRight',
                            value: 'HS',
                            width: 60
                        }
                        ,{
                            name:'hs_accumulated',
                            xtype: 'numberfield',
                            width: 200
                        },]
                    }
                    ,{
                        xtype: 'compositefield',
                        fieldLabel: 'Surface form',
                        msgTarget : 'side',
                        height: 30,
                        cls: 'composite-field',
                        width: '100%',
                        items: [{
                            xtype:'combo',
                            hiddenName:'surface_snow_form',
                            width: 265,
                            store: 'snowonground',
                            valueField:'key',
                            displayField:'code_value',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus:true,
                            cascadeComboId: 'weatherfieldsummary_surface_snow_form_minor'
                        },{
                            xtype:'combo',
                            hiddenName:'surface_snow_form_minor',
                            id: 'weatherfieldsummary_surface_snow_form_minor',
                            store: new Ext.data.Store({
                                reader: new Ext.data.JsonReader({
                                }, LookupVO)
                            }),
                            valueField:'key',
                            displayField:'code_value',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus:true,
                            width: 265
                        },{
                            xtype:'displayfield',
                            cls: 'alignRight',
                            value: 'Size',
                            width: 60
                        },{
                            fieldLabel: 'Size',
                            name: 'surface_snow_size',
                            xtype: 'numberfield',
                            width: 80
                        },{
                            xtype:'displayfield',
                            cls: 'alignRight',
                            value: 'Rimed',
                            width: 60
                        },{
                            name: 'surface_snow_form_rimed',
                            xtype: 'checkbox'
                        }]
                    },

                    {
                        xtype: 'compositefield',
                        msgTarget : 'side',
                        height: 30,
                        fieldLabel: 'Wind',
                        cls: 'composite-field',
                        width: '100%',
                        items: [
                        {
                            xtype:'displayfield',
                            cls: 'alignRight',
                            value: 'Direction',
                            width: 60
                        }
                        ,{
                            xtype:'combo',

                            hiddenName:'wind_direction_cat',
                            width: 200,
                            store: 'aspect',
                            valueField:'key',
                            displayField:'code_value',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus:true
                        }
                        ,{
                            xtype:'displayfield',
                            cls: 'alignRight',
                            value: 'Speed',
                            width: 60
                        }
                        ,{
                            xtype:'combo',

                            hiddenName:'wind_speed_cat',
                            width: 200,
                            store: 'windspeedestimation',
                            valueField:'key',
                            displayField:'code_value',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus:true
                        }]
                    },{
                        xtype: 'compositefield',
                        msgTarget : 'side',
                        height: 30,
                        fieldLabel: 'Ridge blowing snow',
                        cls: 'composite-field',
                        width: '100%',
                        items: [
                        {
                            xtype:'displayfield',
                            cls: 'alignRight',
                            value: 'Transport',
                            width: 60
                        }
                        ,{
                            xtype:'combo',

                            hiddenName:'ridge_blowing_snow_transport',
                            width: 200,
                            store: new Ext.data.JsonStore({
                                storeId: 'blowingsnow',
                                fields: [
                                    {name: 'key'},
                                    {name: 'code_value'},
                                ],
                                root: 'rows',
                                baseParams : {
                                    lookup_code: 'blowingsnow',
                                    allowBlankRecord: true
                                },
                                proxy: new Ext.data.ScriptTagProxy({
                                    url: '/json/lookup_query_all/'
                                })
                            }),
                            valueField:'key',
                            displayField:'code_value',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus:true
                        }
                        ,{
                            xtype:'displayfield',
                            cls: 'alignRight',
                            value: 'Direction',
                            width: 60
                        }
                        ,{
                            xtype:'combo',
                            hiddenName:'ridge_blowing_snow_direction',
                            width: 200,
                            store: 'aspect',
                            valueField:'key',
                            displayField:'code_value',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus:true
                        }]
                    },{
                        fieldLabel: 'Notes',
                        name: 'comments_internal',
                        xtype: 'textarea',
                        width:500
                    }

                    ]
                }
            ]
        });

        /*
            FIELD WEATHER SECTION
        */
        this.weatherSection = new Ext.form.FieldSet({
            title: 'Field Weather Summary',
            hidden: true,
            collapsible: true,
            collapsed: true,
            border: true,
            defaults:{
                border:false
            },
            items:[
                {
                    xtype:'container',
                    html:'<p>This section provides a standard weather narrative and field weather summary that is set the location, date, and analyst completing this evaluation.</p>'
                },
                this.weatherNarrativeForm,
                this.fieldWeatherSummaryForm
            ]
        });
        /*
            Snowpack Structure
        */
        this.snowpackStructureTestsForm = new Ext.FormPanel({
            form_url: "/json/entity_save/",
            form_params:{
                entity: 'SnowpackStructure',
                form: 'pc.forms.observation.ObservationForm',
		type: 'snowpackstructure__ObservationType__lookup'
            },
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, SnowpackStructureVO),
            defaults: {
                anchor: '0'
            },
            waitMsgTarget: true,
            errorReader: new Ext.form.JSONErrorReader(),
            defaults: {
                width: 160
            },
            items:[{
                    xtype:'hidden',
                    name:'key'
                },{
                    xtype:'hidden',
                    name:'subject'
                },{
                    xtype:'hidden',
                    name:'observer'
                },{
                    xtype:'hidden',
                    name:'date_time_start'
                },{
                    xtype:'hidden',
                    name:'terrain'
                },
                {
                    xtype:'hidden',
                    name:'operation'
                },
                {
                    xtype:'hidden',
                    name:'created_date'
                },
                {
                    xtype:'hidden',
                    name:'created_by'
                },
                {
                    fieldLabel: 'Snowpack Structure',
                    name: 'comments_internal',
                    xtype: 'textarea',
                    width: 500
                }]

        });
        /*
            Tests table
        */
        // Create RowActions Plugin
        var actionSnowpackStructureTestsTable = new Ext.ux.grid.RowActions({
            header:'',
            width: 80,
            keepSelection:true,
            actions:[     {
                   iconCls:'ui-icon ui-icon-trash',
                   tooltip:'Delete',
                   scope: this,
                   callback:function(grid, records, action) {
                        if(Ext.isEmpty(records.data.profile)){
                            Ext.MessageBox.confirm('Confirm', 'Are you sure you want delete the record?', function(btn){
                                if(btn == "yes"){
                                    if(!Ext.isEmpty(records.data.key) ){
                                        
                                        Ext.Ajax.request(
                                            {
                                            method: 'GET',
                                            url: '/json/entity_delete/',
                                            params:{
                                                key: records.data.key,
                                                entity: 'SnowpackTest'
                                            },
                                            scope: this,
                                            success: function(action, options) {
                                                grid.store.reload()
                                                deleteFunciton(action, options);
    
                                            }
                                        });
                                    }   else {
                                        grid.store.remove(records);
                                    }
    
                                }
                            }, this);
                        }   else {
                            Ext.MessageBox.alert('Cannot Delete Record', 'This record is assocaited with a Snow Profile.');
                        }
                   }
           }
           ]
        });
        this.snowpackStructureTestsTable = new Ext.grid.EditorGridPanel({
            form_url: "/json/entity_save/",
            loadMask: true,
            form_params :{
                entity: 'SnowpackTest',
                type: 'snowpacktest__ObservationType__lookup',
                form: 'pc.forms.general.SnowpackTestsForm'
            },
            autoWidth: true,
            autoHeight: true,
            clicksToEdit : 'auto',
            plugins:[actionSnowpackStructureTestsTable],
            store: new Ext.data.Store({
                reader: new Ext.data.JsonReader({
                    root: 'rows'
                }, SnowpackTestVO),
                remoteSort: true,
                baseParams:{
                    entity: 'SnowpackTest',
                    type__ObservationType__lookup: 'snowpacktest'
                },
                proxy: new Ext.data.ScriptTagProxy({
                    url: '/json/entity_query_all/'
                })
            }),
            cm: new Ext.grid.ColumnModel([
                actionSnowpackStructureTestsTable,
                {
                    sortable: false ,
                    header: 'Time',
                    dataIndex: 'date_time_start',
                    renderer: formatDate,
                    editor: new Ext.ux.form.DateTimeField({
                        id: 'date_time_start',
                        dateFormat: 'Y-m-d',
                        allowBlank: false,
                        timeFormat: 'H:i'
                    })
                },
                {
                    sortable: false ,
                    header: 'Location',
                    dataIndex: 'terrain',
                    width:160,
                    renderer: function(value, cmp, record){
                        return record.data.terrain_desc;
                    },
                    editor: new Ext.form.ComboBox({
                        id: 'terrain',
                        store: 'locationRegionEvaluation',
                        valueField:'key',
                        displayField:'name_nick',
                        editable: false,
                        listWidth: 250,
                        triggerAction: 'all',
                        mode: 'local',
                        allowBlank: false,
                        selectOnFocus:true
                    })
                },{
                    sortable: false ,
                    header: 'Aspect',
                    dataIndex: 'aspect_start',
                    renderer: function(value, cmp, record){
                        return record.data.aspect_start_code;
                    },
                    width: 45,
                    editor: new Ext.form.ComboBox({
                        id: 'tests_aspect_start',
                        store: new Ext.data.Store({
                            reader: new Ext.data.JsonReader({
                                root: 'rows'
                            }, LookupVO),
                            autoLoad: true,
                            baseParams : {
                                lookup_code: 'aspect',
                                allowBlankRecord: true
                            },
                            proxy: new Ext.data.ScriptTagProxy({
                                url: '/json/lookup_query_all/'
                            })
                        }),
                        valueField:'key',
                        displayField:'code',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        listWidth: 80,
                        selectOnFocus:true
                    })
                },
                {
                    header: 'Incline',
                    sortable: false ,
                    dataIndex: 'elevation_min',
                    width: 70,
                    align: 'right',
                    editor: new Ext.form.NumberField({
                        allowBlank: false
                    })
                },{
                    header: 'Elevation',
                    sortable: false ,
                    dataIndex: 'incline_range_start',
                    width: 70,
                    align: 'right',
                    editor: new Ext.form.NumberField({
                        allowBlank: false
                    })
                },{
                    sortable: false ,
                    header: 'Test',
                    dataIndex: 'snowpacktest_type',
                    renderer: function(value, cmp, record){
                        return record.data.snowpacktest_type_code;
                    },
                    width: 45,
                    editor: new Ext.form.ComboBox({
                        id: 'tests_type',
                        store: new Ext.data.Store({
                            reader: new Ext.data.JsonReader({
                                root: 'rows'
                            }, LookupVO),
                            autoLoad: true,
                            baseParams : {
                                lookup_code: 'snowpacktesttype',
                                allowBlankRecord: true
                            },
                            proxy: new Ext.data.ScriptTagProxy({
                                url: '/json/lookup_query_all/'
                            })
                        }),
                        cascadeComboId: 'tests_type_minor',
                        valueField:'key',
                        displayField:'code',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        listWidth: 80,
                        selectOnFocus:true
                    })
                },{
                    sortable: false ,
                    header: 'Value',
                    dataIndex: 'snowpacktest_type_minor',
                    width:45,
                    renderer: function(value, cmp, record){
                        return record.data.snowpacktest_type_minor_code;
                    },
                    editor: new Ext.form.ComboBox({
                        id: 'tests_type_minor',
                        store: new Ext.data.Store({
                            storeId: "tests_type_minor_store",
                            reader: new Ext.data.JsonReader({
                            }, LookupVO)
                        }),
                        valueField:'key',
                        displayField:'code',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true
                    })
                }, {
                    header: 'Hits',
                    sortable: false ,
                    dataIndex: 'hits_num',
                    width: 45,
                    align: 'right',
                    editor: new Ext.form.NumberField({
                        allowBlank: false
                    })
                }, {
                    sortable: false ,
                    header: 'FC ',
                    dataIndex: 'fracture_character',
                    width: 45,
                    renderer: function(value, cmp, record){
                        return record.data.fracture_character_code;
                    },
                    editor: new Ext.form.ComboBox({
                        id: 'tests_fracture_character',
                        store: new Ext.data.Store({
                            reader: new Ext.data.JsonReader({
                                root: 'rows'
                            }, LookupVO),
                            autoLoad: true,
                            baseParams : {
                                lookup_code: 'snowpacktestfracturecharacter',
                                allowBlankRecord: true
                            },
                            proxy: new Ext.data.ScriptTagProxy({
                                url: '/json/lookup_query_all/'
                            })
                        }),
                        cascadeComboId: 'tests_fracture_character_minor',
                        valueField:'key',
                        displayField:'code',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true
                    })
                },{
                    sortable: false ,
                    header: 'FC Minor',
                    dataIndex: 'fracture_character_minor',
                    width: 65,
                    renderer: function(value, cmp, record){
                        return record.data.fracture_character_minor_code;
                    },
                    editor: new Ext.form.ComboBox({
                        id: 'tests_fracture_character_minor',
                        store: new Ext.data.Store({
                            storeId: "tests_fracture_character_minor_store",
                            reader: new Ext.data.JsonReader({
                            }, LookupVO)
                        }),
                        valueField:'key',
                        displayField:'code',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true
                    })
                }, {
                    sortable: false,
                    header: 'SQ',
                    dataIndex: 'shear_quality',
                    width: 45,
                    renderer: function(value, cmp, record){
                        return record.data.shear_quality_code;
                    },
                    editor: new Ext.form.ComboBox({
                        id: 'tests_shear_quality',
                        store: new Ext.data.JsonStore({
                            fields: [
                                {name: 'key'},
                                {name: 'value'}
                            ],
                            autoLoad: true,
                            root: 'rows',
                            baseParams : {
                                lookup_code: 'snowpacktestshearquality',
                                allowBlankRecord: true
                            },
                            proxy: new Ext.data.ScriptTagProxy({
                                url: '/json/lookup_query_all/'
                            })
                        }),
                        valueField:'key',
                        displayField:'value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        listWidth: 100,
                        selectOnFocus:true,
                        lazyRender: true
                    })
                },{
                    header: 'Height',
                    sortable: false ,
                    dataIndex: 'height',
                    width: 65,
                    align: 'right',
                    editor: new Ext.form.NumberField({
                        allowDecimals : false,
                        allowBlank: false
                    })
                },{
                    header: 'Comments',
                    sortable: false ,
                    dataIndex: 'remark',
                    width: 130,
                    editor: new Ext.form.TextField({
                    })
                }]
            ),
            autoHeight: true,
            border: true,
            unstyled: true,
            frame: true,
            listeners:{
                scope:this,
                validateedit: function (e){
                    if(e.field == 'aspect_start'){
                        e.record.data['aspect_start_code'] = Ext.getCmp('tests_aspect_start').getRawValue();
                    } else if(e.field == 'snowpacktest_type'){
                        e.record.data['snowpacktest_type_code'] = Ext.getCmp('tests_type').getRawValue();
                    } else if(e.field == 'snowpacktest_type_minor'){
                        e.record.data['snowpacktest_type_minor_code'] = Ext.getCmp('tests_type_minor').getRawValue();
                    } else if(e.field == 'fracture_character'){
                        e.record.data['fracture_character_code'] = Ext.getCmp('tests_fracture_character').getRawValue();
                    } else if(e.field == 'fracture_character_minor'){
                        e.record.data['fracture_character_minor_code'] = Ext.getCmp('tests_fracture_character_minor').getRawValue();
                    } else if(e.field == 'shear_quality'){
                        e.record.data['shear_quality_code'] = Ext.getCmp('tests_shear_quality').getRawValue();
                    } else if(e.field == 'terrain'){
                        e.record.data['terrain_desc'] = Ext.getCmp('terrain').getRawValue();
                    }
                }
            }
        });
        /*
            Snowpack Structure and Tests SECTION
        */
        this.snowpackStructureTestsSection = new Ext.form.FieldSet({
            title: 'Snowpack Structure and Tests',
            hidden: true,
            collapsible: true,
            collapsed: true,
            border: true,
            defaults:{
                border:false
            },
            items:[
                {
                    xtype:'container',
                    html:'<p>This section allows you to record the snowpack structure and individual snowpack tests. The snowpack structure observation is set the location, date, and analyst completing this evaluation.</p>'
                },
                this.snowpackStructureTestsForm,
                {
                    xtype: 'panel',
                    border: true,
                    plain : true,
                    unstyled: true,
                    width: 960,
                    autoScroll: true,
                    tbar: ['->',{
                        text: 'Add',
                        scope: this,
                        handler : function(){
                            var RecordVO = this.snowpackStructureTestsTable.getStore().recordType;
                            var record = new RecordVO({ created_by: party.key,
                                                        observer: party.key,
                                                        created_date: new Date(),
                                                        terrain: this.mainForm.getForm().getValues().terrain,
                                                        terrain_desc:     Ext.StoreMgr.lookup('locationRegionEvaluation').getAt(Ext.StoreMgr.lookup('locationRegionEvaluation').findExact('key',this.mainForm.getForm().getValues().terrain)).data.name_nick,
                                                        date_time_start:new Date()
                                                    });
                            this.snowpackStructureTestsTable.stopEditing();
                            this.snowpackStructureTestsTable.store.insert(this.snowpackStructureTestsTable.store.getCount(), record);
                            this.snowpackStructureTestsTable.startEditing(this.snowpackStructureTestsTable.store.getCount() - 1, 0);
                        }
                    },{
                        text: 'Save',
                        scope: this,
                        handler : function(){
                            this.saveTests();
                        }
                    }],
                    items:[
                        this.snowpackStructureTestsTable
                    ]
                }

            ]
        });
        /*
            DANGER RATING
        */
        /*
            DANGER RATING FORM
        */
        this.dangerRatingForm = new Ext.FormPanel({
            form_url: "/json/entity_save/",
            form_params:{
                entity: 'Rating',
                form: 'pc.forms.observation.ObservationForm',
                type: 'ratingdanger__ObservationType__lookup'
            },
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, RatingVO),
            defaults: {
                anchor: '0'
            },
            waitMsgTarget: true,
            errorReader: new Ext.form.JSONErrorReader(),
            defaults: {
                width: 160
            },
            items:[{
                    xtype:'hidden',
                    name:'key'
                },
                {
                    xtype:'hidden',
                    name:'operation'
                },
                {
                    xtype:'hidden',
                    name:'created_date'
                },{
                    xtype:'hidden',
                    name:'subject'
                },
                {
                    xtype:'hidden',
                    name:'created_by'
                },
                {
                    xtype:'hidden',
                    name:'terrain'
                },
                {
                    xtype:'hidden',
                    name:'observer'
                },
                {
                    xtype:'hidden',
                    name:'date_time_start'
                },
                {
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Alpine',
                    cls: 'composite-field',
                    width: '100%',
                    items: [

                        {
                        xtype:'combo',
                        hiddenName:'danger_scale_alpine',
                        width: 200,
                        store: 'dangerscale',
                        valueField:'key',
                        displayField:'code_value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true
                    },
                    {
                        xtype:'displayfield',
                        value: 'Remark',
                        width: 60
                    },
                    {
                        name: 'remark_alpine',
                        xtype: 'textfield'
                    }
                    ]
                },

                {
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Treeline',
                    cls: 'composite-field',
                    width: '100%',
                    items: [{
                        xtype:'combo',
                        hiddenName:'danger_scale_treeline',
                        width: 200,
                        store: 'dangerscale',
                        valueField:'key',
                        displayField:'code_value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true
                    },
                    {
                        xtype:'displayfield',
                        value: 'Remark',
                        width: 60
                    },
                    {
                        name: 'remark_treeline',
                        xtype: 'textfield'
                    }
                    ]
                },
                {
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Below treeline',
                    cls: 'composite-field',
                    width: '100%',
                    items: [
                    {
                        xtype:'combo',
                        hiddenName:'danger_scale_below_treeline',
                        width: 200,
                        store: 'dangerscale',
                        valueField:'key',
                        displayField:'code_value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true
                    },
                    {
                        xtype:'displayfield',
                        value: 'Remark',
                        width: 60
                    },
                    {
                        name: 'remark_below_treellne',
                        xtype: 'textfield'
                    }
                    ]
                },
                {
                    xtype:'combo',
                    fieldLabel: 'Danger Trending',
                    hiddenName:'stability_trending',
                    store: 'stabilitytrending',
                    valueField:'key',
                    displayField:'code_value',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus:true,
                    width: 265
                },
                {
                    fieldLabel: 'Notes',
                    name: 'comments_internal',
                    xtype: 'textarea',
                    width: 500
                }
            ]
        });
        /*
            DANGER RATING SECTION
        */
        this.dangerRatingSection = new Ext.form.FieldSet({
            title: 'Avalanche Danger',
            collapsible: true,
            collapsed: true,
            border: true,
            defaults:{
                border:false
            },
            items:[
                {
                    xtype:'container',
                    html:'<p>This section provides a standard danger rating that is set the location, date, and analyst completing this evaluation.</p>'
                },
                this.dangerRatingForm
            ]
        });
        /*
            STABILITY RATING
        */

        /*
            STABILITY RATING FORM
        */
        this.stabilityRatingForm = new Ext.FormPanel({
            form_url: "/json/entity_save/",
            form_params:{
                entity: 'Rating',
                form: 'pc.forms.observation.ObservationForm',
                type: 'ratingstability__ObservationType__lookup'
            },
            defaults: {
                anchor: '0'
            },
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, RatingVO),
            waitMsgTarget: true,
            errorReader: new Ext.form.JSONErrorReader(),
            defaults: {
                width: 160
            },
            items:[{
                    xtype:'hidden',
                    name:'key'
                },
                {
                    xtype:'hidden',
                    name:'operation'
                },
                {
                    xtype:'hidden',
                    name:'created_date'
                },{
                    xtype:'hidden',
                    name:'subject'
                },
                {
                    xtype:'hidden',
                    name:'created_by'
                },
                {
                    xtype:'hidden',
                    name:'terrain'
                },
                {
                    xtype:'hidden',
                    name:'observer'
                },
                {
                    xtype:'hidden',
                    name:'date_time_start'
                },
                {
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'High alpine',
                    cls: 'composite-field',
                    width: '100%',
                    items: [

                        {
                        xtype:'combo',
                        hiddenName:'stability_scale_alpine',
                        width: 200,
                        store: 'stabilityratingscale',
                        valueField:'key',
                        displayField:'code_value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true
                    },
                    {
                        xtype:'displayfield',
                        value: 'Remark',
                        width: 60
                    },
                    {
                        name: 'remark_alpine',
                        xtype: 'textfield'
                    }]
                },

                {
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Treeline',
                    cls: 'composite-field',
                    width: '100%',
                    items: [{
                        xtype:'combo',
                        hiddenName:'stability_scale_treeline',
                        width: 200,
                        store: 'stabilityratingscale',
                        valueField:'key',
                        displayField:'code_value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true
                    },
                    {
                        xtype:'displayfield',
                        value: 'Remark',
                        width: 60
                    },
                    {
                        name: 'remark_treeline',
                        xtype: 'textfield'
                    }]
                },
                {
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Below treeline',
                    cls: 'composite-field',
                    width: '100%',
                    items: [{
                        xtype:'combo',
                        hiddenName:'stability_scale_below_treeline',
                        width: 200,
                        store: 'stabilityratingscale',
                        valueField:'key',
                        displayField:'code_value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true
                    },
                    {
                        xtype:'displayfield',
                        value: 'Remark',
                        width: 60
                    },
                    {
                        name: 'remark_below_treeline',
                        xtype: 'textfield'
                    }]
                },{
                    xtype:'combo',
                    fieldLabel: 'Stability Trending',
                    hiddenName:'stability_trending',
                    store: 'stabilitytrending',
                    valueField:'key',
                    displayField:'code_value',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus:true,
                    width: 265
                },
                {
                    fieldLabel: 'Notes',
                    name: 'comments_internal',
                    xtype: 'textarea',
                    width: 500
                }]
        });
        /*
            STABILITY RATING SECTION
        */
        this.stabilityRatingSection = new Ext.form.FieldSet({
            title: 'Stability Rating',
            collapsible: true,
            collapsed: true,
            border: true,
            defaults:{
                border:false
            },
            items:[
                {
                    xtype:'container',
                    html:'<p>This section provides a standard stability rating that is set the location, date, and analyst completing this evaluation.</p>'
                },
                this.stabilityRatingForm
            ]
        });
        /*
            PROGRAM
        */
        this.programForm = new Ext.FormPanel({
            form_url: "/json/entity_save/",
            form_params:{
                entity: 'Program',
                form: 'pc.forms.activities.ProgramForm',
                type: 'programforecast__ObservationType__lookup'
            },
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, ProgramVO),
            defaults: {
                anchor: '0'
            },
            waitMsgTarget: true,
            errorReader: new Ext.form.JSONErrorReader(),
            defaults: {
                width: 160
            },
            items:[{
                    xtype:'hidden',
                    name:'key'
                },{
                    xtype:'hidden',
                    name:'subject'
                },{
                    xtype:'hidden',
                    name:'observer'
                },{
                    xtype:'hidden',
                    name:'date_time_start'
                },{
                    xtype:'hidden',
                    name:'terrain'
                },
                {
                    xtype:'hidden',
                    name:'operation'
                },
                {
                    xtype:'hidden',
                    name:'created_date'
                },
                {
                    xtype:'hidden',
                    name:'created_by'
                },
                {
                    fieldLabel: 'Operation logistics',
                    name: 'operational_logistics',
                    xtype: 'textarea',
                    width: 500
                },
                {
                    fieldLabel: 'Risk Management',
                    name: 'snow_safety_objectives',
                    xtype: 'textarea',
                    width: 500
                },
                {
                    fieldLabel: 'Skiing quality',
                    name: 'skiing_quality',
                    xtype: 'textarea',
                    width: 500
                }]

        });
        /*
            PROGRAM SECTION
        */
        this.programSection = new Ext.form.FieldSet({
            title: 'Program',
            hidden: true,
            collapsible: true,
            collapsed: true,
            border: true,
            defaults:{
                border:false
            },
            items:[
                {
                    xtype:'container',
                    html:'<p>This section provides a program observation that is set to the location, date, and analyst completing the evaluation.</p>'
                },
                this.programForm
            ]
        });

        /*
            TERRAIN USAGE FORM
        */
        this.terrainUsageForm = new Ext.FormPanel({
            form_url: "/json/entity_save/",
            form_params:{
                entity: 'TerrainUsage',
                form: 'pc.forms.observation.ObservationForm',
                type: 'terrainusage__ObservationType__lookup'
            },
            waitMsgTarget: true,
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, WeatherVO),
            errorReader: new Ext.form.JSONErrorReader(),
            defaults: {
                width: 160
            },
            items:[{
                xtype:'hidden',
                name:'key'
            },{
                xtype:'hidden',
                name:'subject'
            },{
                xtype:'hidden',
                name:'operation'
            },{
                xtype:'hidden',
                name:'terrain'
            },{
                xtype:'hidden',
                name:'date_time_start'
            },{
                xtype:'hidden',
                name:'observer'
            },{
                xtype:'hidden',
                name:'created_by',
                value: party.key
            },{
                fieldLabel: 'Terrain Usage',
                name: 'comments_internal',
                xtype: 'textarea',
                width: 500
            }]
        });
        /*
            TERRAIN USAGE SECTION
        */
        this.terrainUsageSection = new Ext.form.FieldSet({
            title: 'Terrain Usage',
            hidden: true,
            collapsible: true,
            collapsed: true,
            border: true,
            defaults:{
                border:false
            },
            items:[
                {
                    xtype:'container',
                    html:'<p>This section provides a terrain usage observation that is set to the location, date, and analyst completing the evaluation.</p>'
                },
                this.terrainUsageForm
            ]
        });
        this.mainForm = new Ext.FormPanel({
            form_url: "/json/entity_save/",
            params: {
                entity: 'Activity',
                form: 'pc.forms.activities.ActivityForm',
                type: 'hazeval__ActivityType__lookup'
            },
            waitMsgTarget: true,
            errorReader: new Ext.form.JSONErrorReader(),
            defaults: {
                width: 160
            },
            items: [
            {
                xtype: 'hidden',
                itemId: 'key',
                name: 'key'
            },
            {
                xtype: 'hidden',
                name: 'operation'
            },
            {
                xtype:'hidden',
                itemId: 'avalanche_narrative',
                name:'avalanche_narrative'
            },
            {
                xtype:'hidden',
                itemId: 'snowpack_narrative',
                name:'snowpack_narrative'
            },
            {
                xtype:'hidden',
                itemId: 'weather_narrative',
                name:'weather_narrative'
            },
            {
                xtype:'hidden',
                itemId: 'field_weather_summary',
                name:'field_weather_summary'
            },
            {
                xtype:'hidden',
                itemId: 'snowpack_narrative',
                name:'snowpack_narrative'
            },
            {
                xtype:'hidden',
                itemId: 'rating_danger',
                name:'rating_danger'
            },
            {
                xtype:'hidden',
                itemId: 'rating_stability',
                name:'rating_stability'
            },
            {
                xtype: 'hidden',
                itemId: 'terrain_usage',
                name: 'terrain_usage'
            },
            {
                xtype: 'hidden',
                itemId: 'program',
                name: 'program'
            },
            {
                xtype: 'hidden',
                name: 'created_date'
            },
            {
                xtype: 'hidden',
                name: 'created_by'
            },

            // Operational Header
            {
                xtype: 'fieldset',
                collapsible: true,
                collapsed: false,
                width: '100%',
                title: 'Operational Header',
                items: [
                {
                        xtype:'container',
                        html:'<p> This section allows you to record details related to your operation. The notable and description fields are provided to assist in identifying specific obserations. </p>'
                },
                {
                    xtype: 'displayfield',
                    fieldLabel: 'Operation',
                    name: 'operation_desc',
                    width: 200
                },
                    this.projectCombo,
                {
                    xtype: 'displayfield',
                    fieldLabel: 'Data Recorder',
                    width: 200,
                    name: 'created_by_desc'
                },
                {
                    xtype: 'combo',
                    fieldLabel: 'Forecaster',  //'Observer',
                    hiddenName: 'observer',
                    itemId: 'observer',
                    store: 'observerActive',
                    lastQuery: '',
                    valueField: 'key',
                    displayField: 'full_name',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus: false,
                    forceSelection: false,
                    allowBlank: false,
                    width: 200
                },
                //{
                //    xtype: 'combo',
                //    fieldLabel: 'Forecaster',
                //    hiddenName: 'analyst',
                //    store: 'observerActive',
                //    valueField: 'key',
                //    displayField: 'full_name',
                //    editable: false,
                //    triggerAction: 'all',
                //    mode: 'local',
                //    selectOnFocus: false,
                //    forceSelection: false,
                //    allowBlank: false,
                //    width: 200
                //},
                {
                    fieldLabel: 'Notable',
                    name: 'notable',
                    xtype: 'checkbox',
                    width: 100
                },
                {
                    fieldLabel: 'Verified ?',
                    name: 'verified',
                    xtype: 'checkbox',
                    width: 40
                },
                {
                    fieldLabel: 'Name',
                    name: 'name',
                    xtype: 'textfield',
                    allowBlank: false,
                    width: 600
                }
            ]
            },

            // Scope Header
            {
                xtype: 'fieldset',
                collapsible: true,
                collapsed: false,
                width: '100%',
                title: 'Scope',
                items: [
                {
                        xtype:'container',
                        html:'<p> This section allows you to specify the observation date and time, and its key location. Locations are limited to type Region, Operating Zone, and Forecast Zone.</p>'
                },
                {
                    fieldLabel: 'Date and time',
                    itemId: 'date_time_start',
                    name: 'date_time_start',
                    xtype: 'datetimefield',
                    dateFormat: 'Y-m-d',
                    timeFormat: 'H:i',
                    allowBlank: false,
                    width: 200
                },
                {
                    xtype: 'combo',
                    hiddenName: 'hazard_temporal_scale',
                    fieldLabel: 'Temporal Scale',
                    store: 'temporalScale',
                    width: 200,
                    valueField: 'key',
                    displayField: 'value',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus: true
                },
                {
                    xtype: 'combo',
                    fieldLabel: 'Location',
                    itemId: 'location',
                    hiddenName: 'terrain',
                    width: 200,
                    store: 'locationRegionEvaluation',
                    valueField: 'key',
                    displayField: 'name_nick',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    allowBlank: false,
                    selectOnFocus: true

                },
                {
                    xtype: 'combo',
                    hiddenName: 'hazard_spatial_scale',
                    fieldLabel: 'Spatial Scale',
                    width: 200,
                    store: 'spatialScale',
                    valueField: 'key',
                    displayField: 'value',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus: true
                }
            ]
            },
            // Details
            {
                xtype: 'fieldset',
                collapsible: true,
                collapsed: false,
                width: '100%',
                title: 'Details',
                items: [{
                    fieldLabel: 'Notes',
                    name: 'comments_internal',
                    xtype: 'textarea',
                    width: 600
                }]
            }]
        })

        Ext.applyIf(this, {
            items: [
                this.mainForm,
                this.avalancheSection,
                this.weatherSection,
                this.snowpackStructureTestsSection,
                this.dangerRatingSection,
                this.stabilityRatingSection,
                this.programSection,
                this.terrainUsageSection
            ]
        });
        this.saveButton = new Ext.Button({
            text: 'Save',
            scope: this,
            handler: function(button) {
                this.fireEvent('save');
            }
        });
        this.continueButton = new Ext.Button({
            text: 'Continue',
            scope: this,
            handler: function(button) {
                this.fireEvent('continue');
            }
        });
        this.buttons = [
        this.saveButton, this.continueButton,
        {
            text: 'Cancel',
            scope: this,
            handler: function(button) {
                this.fireEvent('cancel');
            }
        }];
        pc.custom.ActivityEvaluationForm.superclass.initComponent.call(this);
    },
    formState: function(stateName) {
        if (stateName == 'create') {
            this.continueButton.show();
            this.saveButton.hide();
            this.avalancheSection.hide();
            this.weatherSection.hide();
            this.dangerRatingSection.hide();
            this.snowpackStructureTestsSection.hide();
            this.stabilityRatingSection.hide();
            this.programSection.hide();
            this.terrainUsageSection.hide();
        } else {
            this.continueButton.hide();
            this.saveButton.show();
            this.avalancheSection.show();
            this.weatherSection.show();
            this.dangerRatingSection.show();
            this.snowpackStructureTestsSection.show();
            this.stabilityRatingSection.show();
            this.programSection.show();
            this.terrainUsageSection.show();
        }

    },
    resetForms: function() {
        this.avalancheNarrativeForm.getForm().setValues( newRecordForForm(new AvalancheVO({})));
        this.weatherNarrativeForm.getForm().setValues( newRecordForForm(new WeatherVO({})));
        this.fieldWeatherSummaryForm.getForm().setValues( newRecordForForm(new WeatherVO({})));
        this.stabilityRatingForm.getForm().setValues( newRecordForForm(new RatingVO({})));
        this.dangerRatingForm.getForm().setValues( newRecordForForm(new RatingVO({})));
        this.snowpackStructureTestsForm.getForm().setValues( newRecordForForm(new SnowpackStructureVO({})));
        this.programForm.getForm().setValues( newRecordForForm(new ProgramVO({})));
        this.terrainUsageForm.getForm().setValues( newRecordForForm(new TerrainUsageVO({})));
        this.cancelAvalanche();
        this.loadAvalanches();
        this.loadTests();
    },
    saveData: function() {
        this.cancelAvalanche();
        this.saveButton.disable();
        this.saveCounter = 0;
        this.saveCounter++;//avalancheNarrativeForm
        this.saveCounter++;//weatherNarrativeForm
        this.saveCounter++;//fieldWeatherSummaryForm
        this.saveCounter++;// stabilityRatingForm
        this.saveCounter++;// dangerRatingForm
        this.saveCounter++;// snowpackStructureTestsForm
        this.saveCounter++;// programForm
        this.saveCounter++;// terrainUsageForm
        this.saveTests();
        var parentValues = {
            terrain: this.mainForm.getForm().getValues().terrain,
            observer:this.mainForm.getForm().getValues().observer,
            subject: 'AHE: '+ this.mainForm.getForm().getValues().date_time_start+' '+this.mainForm.getForm().getValues().name,
            date_time_start:this.mainForm.getForm().getValues().date_time_start
        };

        this.avalancheNarrativeForm.getForm().setValues(parentValues);
        this.avalancheNarrativeForm.getForm().submit({
            url: this.avalancheNarrativeForm.form_url,
            waitMsg: 'Saving Data...',
            scope: this,
            params: this.avalancheNarrativeForm.form_params,
            submitEmptyText: false,
            success: function(form, action) {
                var key = Ext.decode(action.response.responseText).key;
                var recordServerJSON = Ext.decode(action.response.responseText).record;
                var record = this.avalancheNarrativeForm.reader.extractData([recordServerJSON], true)[0];
                this.avalancheNarrativeForm.getForm().setValues(newRecordForForm(record));
                this.mainForm.getForm().setValues({
                    avalanche_narrative: key
                });
                this.saveCounter--;
                this.saveDataComplete();
            },
            failure: function(form, action) {
                this.saveButton.enable();
                formFailureFunction();
            }
        });

        this.weatherNarrativeForm.getForm().setValues(parentValues);
        this.weatherNarrativeForm.getForm().submit({
            url: this.weatherNarrativeForm.form_url,
            waitMsg: 'Saving Data...',
            scope: this,
            params: this.weatherNarrativeForm.form_params,
            submitEmptyText: false,
            success: function(form, action) {
                var key = Ext.decode(action.response.responseText).key;
                var recordServerJSON = Ext.decode(action.response.responseText).record;
                var record = this.weatherNarrativeForm.reader.extractData([recordServerJSON], true)[0];
                this.weatherNarrativeForm.getForm().setValues(newRecordForForm(record));
                this.mainForm.getForm().setValues({
                    weather_narrative: key
                });
                this.saveCounter--;
                this.saveDataComplete();
            },
            failure: function(form, action) {
                this.saveButton.enable();
                formFailureFunction();
            }
        });

        this.fieldWeatherSummaryForm.getForm().setValues(parentValues);
        this.fieldWeatherSummaryForm.getForm().submit({
            url: this.fieldWeatherSummaryForm.form_url,
            waitMsg: 'Saving Data...',
            scope: this,
            params: this.fieldWeatherSummaryForm.form_params,
            submitEmptyText: false,
            success: function(form, action) {
                var key = Ext.decode(action.response.responseText).key;
                var recordServerJSON = Ext.decode(action.response.responseText).record;
                var record = this.fieldWeatherSummaryForm.reader.extractData([recordServerJSON], true)[0];
                this.fieldWeatherSummaryForm.getForm().setValues(newRecordForForm(record));
                this.mainForm.getForm().setValues({
                    field_weather_summary: key
                });
                this.saveCounter--;
                this.saveDataComplete();
            },
            failure: function(form, action) {
                this.saveButton.enable();
                formFailureFunction();
            }
        });

        this.stabilityRatingForm.getForm().setValues(parentValues);
        this.stabilityRatingForm.getForm().submit({
            url: this.stabilityRatingForm.form_url,
            waitMsg: 'Saving Data...',
            scope: this,
            params: this.stabilityRatingForm.form_params,
            submitEmptyText: false,
            success: function(form, action) {
                var key = Ext.decode(action.response.responseText).key;
                var recordServerJSON = Ext.decode(action.response.responseText).record;
                var record = this.stabilityRatingForm.reader.extractData([recordServerJSON], true)[0];
                this.stabilityRatingForm.getForm().setValues(newRecordForForm(record));
                this.mainForm.getForm().setValues({
                    rating_stability: key
                });
                this.saveCounter--;
                this.saveDataComplete();
            },
            failure: function(form, action) {
                this.saveButton.enable();
                formFailureFunction();
            }
        });

        this.dangerRatingForm.getForm().setValues(parentValues);
        this.dangerRatingForm.getForm().submit({
            url: this.dangerRatingForm.form_url,
            waitMsg: 'Saving Data...',
            scope: this,
            params: this.dangerRatingForm.form_params,
            submitEmptyText: false,
            success: function(form, action) {
                var key = Ext.decode(action.response.responseText).key;
                var recordServerJSON = Ext.decode(action.response.responseText).record;
                var record = this.dangerRatingForm.reader.extractData([recordServerJSON], true)[0];
                this.dangerRatingForm.getForm().setValues(newRecordForForm(record));
                this.mainForm.getForm().setValues({
                    rating_danger: key
                });
                this.saveCounter--;
                this.saveDataComplete();
            },
            failure: function(form, action) {
                this.saveButton.enable();
                formFailureFunction();
            }
        });

        this.snowpackStructureTestsForm.getForm().setValues(parentValues);
        this.snowpackStructureTestsForm.getForm().submit({
            url: this.snowpackStructureTestsForm.form_url,
            waitMsg: 'Saving Data...',
            scope: this,
            params: this.snowpackStructureTestsForm.form_params,
            submitEmptyText: false,
            success: function(form, action) {
                var key = Ext.decode(action.response.responseText).key;
                var recordServerJSON = Ext.decode(action.response.responseText).record;
                var record = this.snowpackStructureTestsForm.reader.extractData([recordServerJSON], true)[0];
                this.snowpackStructureTestsForm.getForm().setValues(newRecordForForm(record));
                this.mainForm.getForm().setValues({
                    snowpack_narrative: key
                });
                this.saveCounter--;
                this.saveDataComplete();
            },
            failure: function(form, action) {
                this.saveButton.enable();
                formFailureFunction();
            }
        });

        this.programForm.getForm().setValues(parentValues);
        this.programForm.getForm().submit({
            url: this.programForm.form_url,
            waitMsg: 'Saving Data...',
            scope: this,
            params: this.programForm.form_params,
            submitEmptyText: false,
            success: function(form, action) {
                var key = Ext.decode(action.response.responseText).key;
                var recordServerJSON = Ext.decode(action.response.responseText).record;
                var record = this.programForm.reader.extractData([recordServerJSON], true)[0];
                this.programForm.getForm().setValues(newRecordForForm(record));
                this.mainForm.getForm().setValues({
                    program: key
                });
                this.saveCounter--;
                this.saveDataComplete();
            },
            failure: function(form, action) {
                this.saveButton.enable();
                formFailureFunction();
            }
        });

        this.terrainUsageForm.getForm().setValues(parentValues);
        this.terrainUsageForm.getForm().submit({
            url: this.terrainUsageForm.form_url,
            waitMsg: 'Saving Data...',
            scope: this,
            params: this.terrainUsageForm.form_params,
            submitEmptyText: false,
            success: function(form, action) {
                var key = Ext.decode(action.response.responseText).key;
                var recordServerJSON = Ext.decode(action.response.responseText).record;
                var record = this.terrainUsageForm.reader.extractData([recordServerJSON], true)[0];
                this.terrainUsageForm.getForm().setValues(newRecordForForm(record));
                this.mainForm.getForm().setValues({
                    terrain_usage: key
                });
                this.saveCounter--;
                this.saveDataComplete();
            },
            failure: function(form, action) {
                this.saveButton.enable();
                formFailureFunction();
            }
        });
    },
    saveDataComplete: function(){
        if(this.saveCounter == 0){
            this.fireEvent('dataSaved');
        }
    },
    loadData: function(){
        var key = this.mainForm.get('key');
        key = key.getValue();
        if(key){
            if(this.mainForm.get('avalanche_narrative').getValue()){
                this.avalancheNarrativeForm.getForm().load({
                    url:'/json/entity_query_single/',
                    params:{
                        entity: 'Avalanche',
                        key: this.mainForm.get('avalanche_narrative').getValue()
                    },
                    waitMsg:'Loading'
                });
            }
            if(this.mainForm.get('weather_narrative').getValue()){
                this.weatherNarrativeForm.getForm().load({
                    url:'/json/entity_query_single/',
                    params:{
                        entity: 'Weather',
                        key: this.mainForm.get('weather_narrative').getValue()
                    },
                    waitMsg:'Loading'
                });
            }
            if(this.mainForm.get('field_weather_summary').getValue()){
                this.fieldWeatherSummaryForm.getForm().load({
                    url:'/json/entity_query_single/',
                    params:{
                        entity: 'Weather',
                        key: this.mainForm.get('field_weather_summary').getValue()
                    },
                    waitMsg:'Loading'
                });
            }
            if(this.mainForm.get('rating_stability').getValue()){
                this.stabilityRatingForm.getForm().load({
                    url:'/json/entity_query_single/',
                    params:{
                        entity: 'Rating',
                        key: this.mainForm.get('rating_stability').getValue()
                    },
                    waitMsg:'Loading'
                });
            }
            if(this.mainForm.get('rating_danger').getValue()){
                this.dangerRatingForm.getForm().load({
                    url:'/json/entity_query_single/',
                    params:{
                        entity: 'Rating',
                        key: this.mainForm.get('rating_danger').getValue()
                    },
                    waitMsg:'Loading'
                });
            }
            if(this.mainForm.get('snowpack_narrative').getValue()){
                this.snowpackStructureTestsForm.getForm().load({
                    url:'/json/entity_query_single/',
                    params:{
                        entity: 'SnowpackStructure',
                        key: this.mainForm.get('snowpack_narrative').getValue()
                    },
                    waitMsg:'Loading'
                });
            }

            if(this.mainForm.get('program').getValue()){
                this.programForm.getForm().load({
                    url:'/json/entity_query_single/',
                    params:{
                        entity: 'Program',
                        key: this.mainForm.get('program').getValue()
                    },
                    waitMsg:'Loading'
                });
            }

            if(this.mainForm.get('terrain_usage').getValue()){
                this.terrainUsageForm.getForm().load({
                    url:'/json/entity_query_single/',
                    params:{
                        entity: 'TerrainUsage',
                        key: this.mainForm.get('terrain_usage').getValue()
                    },
                    waitMsg:'Loading'
                });
            }
            this.loadAvalanches();
            this.loadTests();
        }
    },
    loadAvalanches: function(){
        var date = this.mainForm.getForm().getFieldValues().date_time_start;
        if(date){
            if( typeof( date ) === "String" || typeof( date ) === "number" ) date = new Date(date);
            var start_date = date.format('Y-m-d') + " 00:00";
            var end_date = date.format('Y-m-d') + " 23:59";
            this.avalancheGrid.getStore().setBaseParam('date_time_start__range', start_date+'/'+end_date);
            this.avalancheGrid.getStore().load();
        }
    },
    loadTests: function(){
        var date = this.mainForm.getForm().getFieldValues().date_time_start;
        if(date){
            if( typeof( date ) === "String" || typeof( date ) === "number" ) date = new Date(date);
            var start_date = date.format('Y-m-d') + " 00:00";
            var end_date = date.format('Y-m-d') + " 23:59";
            this.snowpackStructureTestsTable.getStore().setBaseParam('date_time_start__range', start_date+'/'+end_date);
            this.snowpackStructureTestsTable.getStore().load();
        }
    },
    saveAvalanche: function(type){
        if(type == 'single'){
            this.avalancheFormStandard.getForm().submit({
                url: this.avalancheFormStandard.form_url,
                waitMsg: 'Saving Data...',
                params: {
                    entity: 'Avalanche',
                    form: 'pc.forms.observation.ObservationForm',
                    type: 'avalancheeventstandard__ObservationType__lookup'
                },
                submitEmptyText: false,
                scope: this,
                success: function(form, action) {
                    var key = Ext.decode(action.response.responseText).key;
                    Ext.getCmp('saveSingleAvalancheButton').enable();
                    this.cancelAvalanche();
                    this.avalancheGrid.getStore().reload();
                },
                failure: function(form, action) {
                    Ext.getCmp('saveSingleAvalancheButton').enable();
                    formFailureFunction();
                }
            });
        }   else {
            this.avalancheFormMultiple.getForm().submit({
                url: this.avalancheFormMultiple.form_url,
                waitMsg: 'Saving Data...',
                params: {
                    entity: 'Avalanche',
                    form: 'pc.forms.observation.ObservationForm',
                    type: 'avalancheeventmultiple__ObservationType__lookup'
                },
                submitEmptyText: false,
                scope: this,
                success: function(form, action) {
                    var key = Ext.decode(action.response.responseText).key;
                    Ext.getCmp('saveMultipleAvalancheButton').enable();
                    this.cancelAvalanche();
                    this.avalancheGrid.getStore().reload();
                },
                failure: function(form, action) {
                    Ext.getCmp('saveMultipleAvalancheButton').enable();
                    formFailureFunction();
                }
            });
        }
    },
    saveTests: function(){
        this.snowpackStructureTestsTable.saveCounter = this.snowpackStructureTestsTable.getStore().getCount();
        if(this.snowpackStructureTestsTable.saveCounter > 0){
            this.snowpackStructureTestsTable.loadMask = new Ext.LoadMask(this.snowpackStructureTestsTable.body, {
                msg:'Saving...'
            });
            this.snowpackStructureTestsTable.loadMask.show();
        }
        this.snowpackStructureTestsTable.getStore().each( function (record){
            if(record.dirty){
                //set values
                this.snowpackStructureTestsTable.form_params.operation = operation.key;
                this.snowpackStructureTestsTable.form_params.observer = this.mainForm.getForm().getValues().observer;
                this.snowpackStructureTestsTable.form_params.subject = 'AHE: '+ this.mainForm.getForm().getValues().date_time_start+' '+this.mainForm.getForm().getValues().name;
                this.snowpackStructureTestsTable.form_params.date_time_start = this.mainForm.getForm().getValues().date_time_start;
                this.snowpackStructureTestsTable.form_params.terrain = this.mainForm.getForm().getValues().terrain;
                Ext.Ajax.request({
                    url: this.snowpackStructureTestsTable.form_url,
                    extraParams: this.snowpackStructureTestsTable.form_params,
                    params: Ext.apply(ServerUtils.prepareFieldsForService(record), this.snowpackStructureTestsTable.form_params),
                    scope: this,
                    success: function(response, opts){
                        var key = Ext.decode(response.responseText).key;
                        this.snowpackStructureTestsTable.saveCounter = this.snowpackStructureTestsTable.saveCounter - 1;
                        this.saveTestsContinue();
                    }
                });
            }   else{
                this.snowpackStructureTestsTable.saveCounter =  this.snowpackStructureTestsTable.saveCounter - 1;
                this.saveTestsContinue();
            }
        }, this);
    },
    saveTestsContinue: function(){
        if(this.snowpackStructureTestsTable.saveCounter == 0){
            this.snowpackStructureTestsTable.loadMask.hide();
            this.snowpackStructureTestsTable.store.reload();
        }
    },
    cancelAvalanche: function(){
        this.avalancheFormStandard.hide();
        this.avalancheFormMultiple.hide();
        Ext.getCmp('avalancheGridContainer').show();
    },
    editAvalanche: function(record){
        Ext.getCmp('avalancheGridContainer').hide();
        if(record.data.type_desc == 'avalancheeventstandard'){
            this.avalancheFormStandard.show();
            this.avalancheFormStandard.getForm().loadRecord(record);
        }   else {
            this.avalancheFormMultiple.getForm().loadRecord(record);
            this.avalancheFormMultiple.show();
        }
    },
    addAvalanche: function(type){
        var date = this.mainForm.getForm().getFieldValues().date_time_start;
        if( typeof( date ) === "String" || typeof( date ) === "number" ) date = new Date(date);
        var record = new AvalancheVO({
            date_time_start: date
        });
        Ext.getCmp('avalancheGridContainer').hide();
        if(type == 'single'){
            this.avalancheFormStandard.show();
            this.avalancheFormStandard.getForm().setValues(newRecordForForm(record));
        }   else {
            this.avalancheFormMultiple.getForm().setValues(newRecordForForm(record));
            this.avalancheFormMultiple.show();
        }
    }
});
Ext.reg('activityevaluationform', pc.custom.ActivityEvaluationForm);
