var controller, grid, masterStore, mapOverlay, container,
filterCmp, powdercloudSvgRose;


function Controller(){
    this.store = masterStore;
    this.map = Ext.getCmp('mapViewer');
    this.filterCmp = filterCmp;
    Ext.StoreMgr.lookup('locationWithBlankRecord').load();

    this.store.on('load', function(store, records, options){
        this.map.clearOverlays();
        this.rose_data = [];
        store.each(function (record){
            this.map.addMapData(record.data.profile_map_overlay, record);

            // TODO: map correct elevation and aspectCode params
            // ROSE Data - Start
            var roseDateItem = {
                "type": TYPE_SNOWPACK_TEST,
                "elevation" : record.data.elevation_min,
		"aspectCode" : record.data.aspect_start_code,
		"description" : record.data.comments_internal
            };
            this.rose_data.push(roseDateItem);
            // ROSE Data - End

        }, this);

        if (powdercloudSvgRose) {
            var svg = $('#svg_div').svg('get');
            powdercloudSvgRose.drawData(svg, this.rose_data);
        }

    }, this);
}
Controller.prototype.drawRose = function(){
    /*
        ROSE
    */
    var svgWidth = 750;
    var svgHeight = 600;
    document.getElementById('svg_div').style.width = svgWidth + "px";
    document.getElementById('svg_div').style.height = svgHeight + "px";
    document.getElementById('svg_div').style.border = '1px solid #000000';
    powdercloudSvgRose = new PowdercloudSvgRose(svgWidth, svgHeight, false, true, 150);
    $('#svg_div').svg({onLoad: powdercloudSvgRose.drawChart});
}
Ext.onReady(function(){
    Ext.QuickTips.init();
    /*
        FILTER
    */
    filterCmp = new ModeDaterangeFilter();

    /*
        STORE
    */
    masterStore = new ModeDaterangeFilterStore({
        baseParams:{
			entity: 'SnowpackTest',
			type__ObservationType__lookup: 'snowpacktest',
      			sort: 'date_time_start',
			dir: 'DESC'
	  },
	dateRange : 'created_date',
	reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, SnowpackTestVO)
    });
    filterCmp.regStore(masterStore);
    /*
        MAP
    */
    mapOverlay = new Ext.Panel({
        defaults: {
            anchor: '0'
        },
        items:[{
            xtype: 'gmappanel',
            itemId: 'mapViewer',
            id: 'mapViewer',
            //width: 966,
            width: '100%',
            height: 600,
            gmapType: 'map',
	    overlayDetailFields:[{
		name: 'created_date',
		fieldLabel: 'Date and time',
		renderer: 'date',
		format: getDateFormat()
	    }]
        }]
    });

    /*
        TABLE
    */
    var expander = new Ext.ux.grid.RowExpander({
        tpl : new Ext.Template(
            '<p><b>Comment:</b> {comments_internal}</p>'
        )
    });
    // create the Grid
    grid = new Ext.grid.GridPanel({
        store: masterStore,
	plugins:[expander],
        loadMask: true,
	tbar: new Ext.Toolbar({
            items: [
		'Search by Location: ',
                {
                    xtype: 'combo',
		    store: 'locationWithBlankRecord',
                    searchBy: 'terrain',
		    searchStore:masterStore,
		    width: 150,
		    valueField: 'key',
		    displayField: 'name_nick',
		    editable: false,
		    triggerAction: 'all',
		    mode: 'local',
		    selectOnFocus: true,
		    forceSelection: true,
		    listeners: {
			scope: this,
			select:  function(cmp, record){
			    if(cmp.lastSearchValue === undefined || cmp.lastSearchValue != cmp.getValue()){
				if(Ext.isEmpty(cmp.getValue())){
				    delete cmp.searchStore.baseParams[cmp.searchBy];
				}	else {
				    cmp.searchStore.setBaseParam(cmp.searchBy,cmp.getValue());
				}
				cmp.lastSearchValue = cmp.getValue();
				cmp.searchStore.reload();				
			    }
			}
		    }
                }
            ]
        }),
        columns: [
	    expander,
            {
                id       :'type',
                header   : 'Type',
                width    : 100,
                sortable : false,
                dataIndex: 'type_desc'
            },{
                id       :'operation',
                header   : 'Operation',
                width    : 100,
                sortable : false,
                dataIndex: 'operation_desc'
            },{
                id       :'snowpack_test_shear_quality',
                header   : 'Quality',
                width    : 100,
                sortable : false,
                dataIndex: 'snowpack_test_shear_quality_code'
            },{
                header   : 'Date and Time',
                width    : 200,
                sortable : true,
                dataIndex: 'created_date'
            },{
                id       :'location',
                header   : 'Location',
                width    : 100,
                sortable : false,
                dataIndex: 'terrain_desc'
            },{
                id       :'subject',
                header   : 'Subject',
                width    : 100,
                sortable : false,
                dataIndex: 'subject'
            },{
                id       :'elevation_min',
                header   : 'Elevation Min',
                width    : 100,
                sortable : false,
                dataIndex: 'elevation_min'
            },{
                id       :'elevation_max',
                header   : 'Elevation Max',
                width    : 100,
                sortable : false,
                dataIndex: 'elevation_max'
            },{
                id       :'aspect_start',
                header   : 'Aspect Start',
                width    : 100,
                sortable : false,
                dataIndex: 'aspect_start_code'
            },{
                id       :'aspect_end',
                header   : 'Aspect End',
                width    : 100,
                sortable : false,
                dataIndex: 'aspect_end_code'
            },{
                id       :'incline_range_start',
                header   : 'Incline Start',
                width    : 100,
                sortable : false,
                dataIndex: 'incline_range_start'
            },{
                id       :'incline_range_end',
                header   : 'Incline End',
                width    : 100,
                sortable : false,
                dataIndex: 'incline_range_end'
            },{
                id       :'snowpack_test_type_minor',
                header   : 'Type',
                width    : 75,
                sortable : false,
                dataIndex: 'snowpack_test_type_minor_code'
            },{
                id       :'snowpack_test_fracture_character_minor',
                header   : 'Fracture Character',
                width    : 100,
                sortable : false,
                dataIndex: 'snowpack_test_fracture_character_minor_code'
            },{
                id       :'snowpack_test_height',
                header   : 'Height',
                width    : 100,
                sortable : false,
                dataIndex: 'snowpack_test_height'
            }
        ],
        stripeRows: true,
        height: 400,
        width: '100%'
    });
    /*
        Controller
    */
    controller = new Controller();
    /*
	CONTAINER
    */
    container = new Ext.FormPanel({
	renderTo:'table-loc',
        plain: true,
	border: false,
        autoWidth: true,
	items:[
	    new Ext.form.FieldSet({
		title: 'Table',
		width: '100%',
		collapsible: true,
		collapsed: false,
		border: true,
		items:[
		    grid
		]
	    }),
	    new Ext.form.FieldSet({
		title: 'Map Overlay',
		width: '100%',
		collapsible: false,
		border: true,
		items:[
		    mapOverlay
		],
		listeners:{
		    scope: this,
		    expand: function(cmp){
			var temp = Ext.getCmp('mapViewer');
			temp.getMap().checkResize();
		    }
		}
	    }),
	    new Ext.form.FieldSet({
		title: 'Rose Overlay',
		width: '100%',
		collapsible: true,
		collapsed: true,
		border: true,
		items:[
		    new Ext.Container({
			html:'<div id="svg_div"></div>',
			listeners:{
			    afterrender:{
				scope: this,
				fn: controller.drawRose
			    }
			}
		    })
		]
	    })
	],
	listeners:{
	    afterrender:{
		scope: this,
		fn: function(){
		    masterStore.load();
		}
	    }
	}
    });
});
