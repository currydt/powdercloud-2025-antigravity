var controller, grid, masterStore, mapOverlay, container, profileDirection,
filterCmp, powdercloudSvgRose, snowprofileSvgChartController, powdercloudSvgSnowprofile;

var snowprofileSvgWidth = 966;
var snowprofileSvgHeight = 600;

function Controller(){
    this.store = masterStore;
    this.map = Ext.getCmp('mapViewer');
    this.filterCmp = filterCmp;
    Ext.StoreMgr.lookup('locationWithBlankRecord').load();

    this.store.on('load', function(store, records, options){
        this.map.clearOverlays();
        this.rose_data = [];
        store.each(function (record){
            this.map.addMapData(record.data.terrain_map_overlay, record);

            // ROSE Data - Start
            var roseDateItem = {
                "type": TYPE_SNOWPROFILE,
                "elevation" : record.data.elevation_min,
		"aspectCode" : record.data.aspect_start_code,
		"description" : record.data.subject
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
            entity: 'Profile',
	    type__ObservationType__lookup: 'snowprofileindustrial',
	    sort: 'date_time_start',
	    dir: 'DESC',
            'date_time_start__range': filterCmp.start_date.format('Y-m-d 00:00')+'/'+filterCmp.end_date.format('Y-m-d 23:59')
        },
	reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, ProfileVO)
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
		name: 'date_time_start',
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
                id       :'date_time_start',
                header   : 'Date and Time',
                width    : 120,
                sortable : true,
                dataIndex: 'date_time_start',
                renderer: formatDate
            },
	    {
                id       :'operation',
                header   : 'Operation',
                width    : 140,
                sortable : false,
                dataIndex: 'operation_desc'
            },
	    {
                id       :'terrain',
                header   : 'Location',
                width    : 150,
                sortable : false,
                dataIndex: 'terrain_desc'
            },
	    {
                id       :'snow_profile_test_type',
                header   : 'Type',
                width    : 100,
                sortable : false,
                dataIndex: 'snow_profile_test_type_desc'
            },
	    {
                id       :'incline_range_start',
                header   : 'Incline Start',
                width    : 100,
                sortable : false,
                dataIndex: 'incline_range_start'
            },
	    {
                id       :'aspect_start',
                header   : 'Aspect Start',
                width    : 100,
                sortable : false,
                dataIndex: 'aspect_start_desc'
            },
	    {
                id       :'elevation_min',
                header   : 'Elevation Min',
                width    : 100,
                sortable : false,
                dataIndex: 'elevation_min'
            },
            {
                id       :'sky',
                header   : 'Sky',
                width    : 50,
                sortable : false,
                dataIndex: 'sky_condition_code'
            },
	    {
                id       :'precipitationRateCode',
                header   : 'Precip. Type',
                width    : 75,
                sortable : false,
                dataIndex: 'precipitation_type_rate_desc'
            },
            {
                id       :'precipitationTypeCode',
                header   : 'Precip. Rate',
                width    : 125,
                sortable : false,
                dataIndex: 'precipitation_type_rate_minor_code'
            },
            {
                id       :'windDirectionCat',
                header   : 'Wind Dir.',
                width    : 75,
                sortable : false,
                dataIndex: 'wind_direction_cat_code'
            },
            {
                id       :'windSpeedCat',
                header   : 'Wind Speed',
                width    : 75,
                sortable : false,
                dataIndex: 'wind_speed_cat_code'
            },
            {
                id       :'AirTemperaturePresent',
                header   : 'Temp. Present',
                width    : 100,
                sortable : false,
                dataIndex: 'air_temperature_present'
            },
            {
                id       :'snowTempT0',
                header   : 'Surface Temp.',
                width    : 100,
                sortable : false,
                dataIndex: 'snow_temperature_T_0'
            },
	    {
                id       :'penFoot',
                header   : 'Pen Foot',
                width    : 70,
                sortable : false,
                dataIndex: 'pen_foot'
            },
	    {
                id       :'penSki',
                header   : 'Pen Ski',
                width    : 50,
                sortable : false,
                dataIndex: 'pen_ski'
            },
            {
                id       :'HsAccumulated',
                header   : 'HS',
                width    : 50,
                sortable : false,
                dataIndex: 'hs_accumulated'
            },
            {
                id       :'notable',
                header   : 'Notable',
                width    : 68,
                sortable : false,
                dataIndex: 'notable'
            },
	    {
                id       :'subject',
                header   : 'Subject',
                width    : 600,
                dataIndex: 'subject',
		sortable : false
            }
	],
        stripeRows: true,
        height: 400,
        width: '100%',
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });

    grid.getSelectionModel().on('selectionchange', function(sm) {

        if (sm.selections.length === 1) {
            // row selected

            var selectedRecord = sm.getSelected();
            if (selectedRecord != undefined) {
                snowprofileSvgChartController.getSnowprofileData(selectedRecord);
            }
        } else if (sm.selections.length === 0) {
            // no row selected

            snowprofileSvgChartController.drawSnowProfileSvgChartData(null);
        }
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
		items:[{
		    xtype:'container',
		    html:'<p>The following table displays the snow profile fields in textual format. You can select an individual column to resize it; change its position,  or to hide and show the column. You can sort by date and time in ascending or descending order.</p>'
		},
		    grid
		]
	    }),
            new Ext.form.FieldSet({
                id: 'chartFieldSet',
		title: 'Chart',
		width: '100%',
		collapsible: true,
		collapsed: false,
		border: true,
		items:[{
		    xtype:'container',
		    html:'<p>The following chart displays the selected snow profile. You can mange the view by using the drop-down menu (for example, Basic or Flags). Flags are determined using pre-defined settings (as indicated in the documentation).</p>'
		},{
                    xtype: 'container',
                    id: 'snowprofile_svg_div_parent'
                }
		]
	    }),
	    new Ext.form.FieldSet({
		title: 'Map Overlay',
		width: '100%',
		collapsible: false,
		border: true,
		items:[{
		    xtype:'container',
		    html:'<p>The following map displays the location of the various observations. You can mange the view by using the toolbar (for example, Map or Earth). You can alter the scale using the vertical scale, and while in Earth mode you can alter the prespecitve with the upper left control.</p>'
		},
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
		items:[{
		    xtype:'container',
		    html:'<p>The following chart displays the Snow Profiles as a Rose Overlay.</p>'
		    },
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

	//    {
	//	xtype:'container',
	//	html:'<p> </p>'
	//    },
	//    {
	//	xtype:'container',
	//	html:'<p>Persons accessing Powdercloud.com information have agreed to a Release of Liability, Waiver of Claims and Assumption of Risk Agreement and assume all risk of injury resulting from using this information. They further agree to release the contributors from liability and waive all claims against the contributors for any personal injury, death, property damage, loss or expense that may be sustained as a result of using the information provided herein by the contributors, due to any cause whatsoever, including negligence, breach of contract or breach of any statutory or other duty of care on the part of the contributors.</p>'
	//    }

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

    snowprofileSvgChartController = new SnowprofileSvgChartController();
});

function SnowprofileSvgChartController(){

    // 1. StoreLoad Counter used in storeLoad()
    this.storeLoadCounter = 3;

    // 2. temporary snowprofile record used in storeLoad()
    this.tempSnowprofileRecord = null;

    // 3. stores
    this.layersStore = new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            root: 'rows'
        }, LayerVO),
        baseParams:{
            entity: 'Layer',
	    type__ObservationType__lookup: 'layerevent'
        },
        proxy: new Ext.data.ScriptTagProxy({
            url: '/json/entity_query_all/'
        })
    });
    this.snowpackTestsStore = new Ext.data.Store({
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
    });
    this.temperatureLayersStore = new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            root: 'rows'
        }, TemperatureLayerVO),
        baseParams:{
            entity: 'TemperatureLayer',
	    type__ObservationType__lookup: 'temperaturelayer'
        },
        proxy: new Ext.data.ScriptTagProxy({
            url: '/json/entity_query_all/'
        })
    });

    // 4. Add store listeners
    this.layersStore.on('load', this.storeLoad, this);
    this.snowpackTestsStore.on('load', this.storeLoad, this);
    this.temperatureLayersStore.on('load', this.storeLoad, this);

    // 5. Create powdercloudSvgSnowprofile
    powdercloudSvgSnowprofile = new PowdercloudSvgSnowprofile(snowprofileSvgWidth, snowprofileSvgHeight);

    // 6. Get parent div
    var snowprofileSvgDivParent = $('#snowprofile_svg_div_parent');

    // 7. PropertiesTable Combobox
    snowprofileSvgDivParent.append("<div id='properties_table_div'>Properties Table: <select id='properties_table_combo' onchange='onChangePropertiesTableCombo(this.value)'></select></div>");
    var types = powdercloudSvgSnowprofile.getPropertiesTableTypes();
    var propertiesTableCombo = $('#properties_table_combo');
    if (types) {
            for (i=0;i<types.length;i++) {
                    var type = types[i];
                    if (type) {
                            propertiesTableCombo.append("<option value='" + type.value + "'>" + type.name + "</option>");
                    }
            }
    }

    // 8. Add snowprofile_svg_div to snowprofile_svg_div_parent
    snowprofileSvgDivParent.append("<div id='snowprofile_svg_div'></div>");

    // 9. Set snowprofile_svg_div width/height
    var snowprofileSvgDiv = $('#snowprofile_svg_div');
    snowprofileSvgDiv.width(snowprofileSvgWidth);
    snowprofileSvgDiv.height(snowprofileSvgHeight);

    // 10. Initial drawChart
    $('#snowprofile_svg_div').svg({onLoad: powdercloudSvgSnowprofile.drawChart});
}

function onChangePropertiesTableCombo(value) {
        if (powdercloudSvgSnowprofile && value) {
                powdercloudSvgSnowprofile.setPropertiesTableType(value);
                snowprofileSvgChartController.drawSnowProfileSvgChartData(snowprofileSvgChartController.tempSnowprofileRecord);
        }
}

SnowprofileSvgChartController.prototype.storeLoad = function(){
    this.storeLoadCounter--;
    if(this.storeLoadCounter == 0){

        // 1. Hide Load Mask
        var chartFieldSet = Ext.getCmp('chartFieldSet');
        chartFieldSet.loadMask.hide();

        // 2. Reset properties_table_combo to basic
        $('#properties_table_combo').val(TABLE_TYPE_BASIC);

        // 3. Set powdercloudSvgSnowprofile propertiesTableType to basic
        powdercloudSvgSnowprofile.setPropertiesTableType(TABLE_TYPE_BASIC);

        // 4. re-draw
        this.drawSnowProfileSvgChartData(this.tempSnowprofileRecord);
    }
}

SnowprofileSvgChartController.prototype.getSnowprofileData = function(snowprofileRecord){

    if (snowprofileRecord && snowprofileRecord.data && snowprofileRecord.data.key) {
	profileDirection = "ASC";
	if(snowprofileRecord.data.snow_profile_test_type_code == 'Full'){
	    profileDirection = "DESC";
	}
        // 1. Show Load Mask
        var chartFieldSet = Ext.getCmp('chartFieldSet');
        chartFieldSet.loadMask = new Ext.LoadMask(
        chartFieldSet.body, {
            msg: 'Loading...'
        });
        chartFieldSet.loadMask.show();

        // 2. reset store counter
        this.storeLoadCounter = 3;

        // 3. temporary snowprofile record used in storeLoad()
        this.tempSnowprofileRecord = snowprofileRecord;

        // 4. Set params and load stores
        this.layersStore.setBaseParam('profile',snowprofileRecord.data.key);
	this.layersStore.setBaseParam('__community_mode', controller.filterCmp.getMode());
	this.layersStore.setBaseParam('dir',profileDirection);
	this.layersStore.setBaseParam('sort','start');
        this.layersStore.load();
        this.snowpackTestsStore.setBaseParam('profile',snowprofileRecord.data.key);
	this.snowpackTestsStore.setBaseParam('__community_mode', controller.filterCmp.getMode());
	this.snowpackTestsStore.setBaseParam('dir',profileDirection);
	this.snowpackTestsStore.setBaseParam('sort','height');
        this.snowpackTestsStore.load();
        this.temperatureLayersStore.setBaseParam('profile',snowprofileRecord.data.key);
	this.temperatureLayersStore.setBaseParam('__community_mode', controller.filterCmp.getMode());
	this.temperatureLayersStore.setBaseParam('dir',profileDirection);
	this.temperatureLayersStore.setBaseParam('sort','height');
        this.temperatureLayersStore.load();
    } else {
        this.drawSnowProfileSvgChartData(null);
    }
}

SnowprofileSvgChartController.prototype.drawSnowProfileSvgChartData = function(snowprofileRecord){
    var svg = $('#snowprofile_svg_div').svg('get');
    var snowprofile = this.generateSnowprofile(snowprofileRecord);
    var snowprofilePreferences = this.generateSnowprofilePreferences();
    powdercloudSvgSnowprofile.drawData(svg, snowprofile, snowprofilePreferences);
}

SnowprofileSvgChartController.prototype.generateSnowprofile = function (snowprofileRecord) {

    if (snowprofileRecord == null) {
        return null;
    }

    var snowprofile = new Object();

    snowprofile.surfaceTemperature = snowprofileRecord.data.snow_temperature_T_0;
    snowprofile.airTemperature = snowprofileRecord.data.air_temperature_present;

    // Layer direction
    snowprofile.isLayersDescendingTopDown = true;
    if(profileDirection == "ASC"){
	snowprofile.isLayersDescendingTopDown = false;
    }

    var snowLayers = new Array();
    if (this.layersStore != null && this.layersStore.data != null && this.layersStore.data.items != null) {
        for (i=0;i<=this.layersStore.data.items.length;i++) {
            var item = this.layersStore.data.items[i];
            if (item != null && item.data != null) {

                if (item.data.start == null || item.data.start == undefined
                    || item.data.end == null || item.data.end == undefined
                    || item.data.hardness_code == null || item.data.hardness_code == undefined || item.data.hardness_code == '') {
                    continue;
                }

                var snowLayer = new Object();
                snowLayer.density = item.data.density; // type:Numeric
                if(profileDirection == "DESC"){
		    snowLayer.heightStart = item.data.end;
		    snowLayer.heightEnd = item.data.start;
		}	else {
		    snowLayer.heightStart = item.data.start;
		    snowLayer.heightEnd = item.data.end;
		}
                snowLayer.comments = item.data.remark; // type:String

                snowLayer.crystalSize01 = item.data.surface_snow_size; // type:Numeric
                snowLayer.crystalSize02 = item.data.surface_snow_size_2; // type:Numeric

                if (item.data.liquid_water_content_code == '')
		{
                    snowLayer.liquidWaterContent = null; // type:String
                }
		else
		{
                    snowLayer.liquidWaterContent = item.data.liquid_water_content_code; // type:String
                }

                if (item.data.hardness_code == '')
		{
                    snowLayer.snowHardness = null; // type:String
                }
		else
		{
                    snowLayer.snowHardness = item.data.hardness_code; // type:String
                }

                if (item.data.surface_snow_form_code == '')
		{
                    snowLayer.snowForm01 = null; // type:String
                }
		else
		{
                    snowLayer.snowForm01 = item.data.surface_snow_form_code; // type:String
                }
		if (item.data.surface_snow_form_minor_code == '')
		{
                    snowLayer.snowFormMinor01 = null; // type:String
                }
		else
		{
                    snowLayer.snowFormMinor01 = item.data.surface_snow_form_minor_code; // type:String
                }
                if (item.data.surface_snow_form_2_code == '')
		{
                    snowLayer.snowForm02 = null; // type:String
                }
		else
		{
                    snowLayer.snowForm02 = item.data.surface_snow_form_2_code; // type:String
                }
		if (item.data.surface_snow_form_2_minor_code == '')
		{
                    snowLayer.snowFormMinor02 = null; // type:String
                }
		else
		{
                    snowLayer.snowFormMinor02 = item.data.surface_snow_form_2_minor_code; // type:String
                }

                snowLayers.push(snowLayer);
            }
        }
    }

    var temperatureLayers = new Array();
    if (this.temperatureLayersStore != null && this.temperatureLayersStore.data != null && this.temperatureLayersStore.data.items != null) {
        for (i=0;i<=this.temperatureLayersStore.data.items.length;i++) {
            var item = this.temperatureLayersStore.data.items[i];
            if (item != null && item.data != null) {

                var temperatureLayer = new Object();
                temperatureLayer.height = item.data.height;
                temperatureLayer.temperature = item.data.temperature;
                temperatureLayers.push(temperatureLayer);
            }
        }
    }

    var shears = new Array();
    if (this.snowpackTestsStore != null && this.snowpackTestsStore.data != null && this.snowpackTestsStore.data.items != null) {
        for (i=0;i<=this.snowpackTestsStore.data.items.length;i++) {
            var item = this.snowpackTestsStore.data.items[i];
            if (item != null && item.data != null) {

                var shear = new Object();
                shear.comments = item.data.remark; // type: String
                shear.height = item.data.height; // type: Numeric
                shear.hits = item.data.hits_num; // type: Numeric
                if (item.data.fracture_character_code == '') {
                    shear.fractureCharacterCode = null; // type:String
                } else {
                    shear.fractureCharacterCode = item.data.fracture_character_code; // type:String
                }
                if (item.data.shear_quality_code == '') {
                    shear.shearQualityCode = null; // type:String
                } else {
                    shear.shearQualityCode = item.data.shear_quality_code; // type:String
                }
                if (item.data.type_code == '') {
                    shear.snowObservationTestCode = null; // type:String
                } else {
                    shear.snowObservationTestCode = item.data.type_code; // type:String
                }
		shear.fracture_character_code = null;
		shear.fracture_character_minor_code = null;
		shear.shear_quality_code = null;
		shear.snowpacktest_type_code = null;
		shear.snowpacktest_type_minor_code = null;
		if(item.data.fracture_character_code != '') {
		    shear.fracture_character_code = item.data.fracture_character_code;
		}
		if(item.data.fracture_character_minor_code != '') {
		    shear.fracture_character_minor_code = item.data.fracture_character_minor_code;
		}
		if(item.data.shear_quality_code != '') {
		    shear.shear_quality_code = item.data.shear_quality_code;
		}
		if(item.data.snowpacktest_type_code != '') {
		    shear.snowpacktest_type_code = item.data.snowpacktest_type_code;
		}
		if(item.data.snowpacktest_type_minor_code != '') {
		    shear.snowpacktest_type_minor_code = item.data.snowpacktest_type_minor_code;
		}
                shears.push(shear);
            }
        }
    }

    snowprofile.snowLayers = snowLayers; // Array of snowLayer objects
    snowprofile.temperatureLayers = temperatureLayers; // Array of temperatureLayer objects
    snowprofile.shears = shears; // Array of shears objects

    return snowprofile;
}

SnowprofileSvgChartController.prototype.generateSnowprofilePreferences = function () {

    // TODO: just chose some snowprofile preferences at random.

    var prefs = new Object();

    prefs.flagHexColor = "#FFFF00";
    prefs.potentialFailureHexColor = "#66FF00";

    prefs.averageGrainSizeFlagValue = 2;
    prefs.snowHardnessCode = "P";
    prefs.snowFormCodes = ["SH", "PP"];

    prefs.differenceAverageGrainSizeFlagValue = 1;
    prefs.differenceHardnessFlagValue = 1;

    prefs.depthOfInterfaceStart = 0;
    prefs.depthOfInterfaceEnd = 200.0;

    prefs.highlightInterfaceCount = 1;

    return prefs;
}
