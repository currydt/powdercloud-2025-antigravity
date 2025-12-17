var controller, grid, masterStore, mapOverlay, container,
filterCmp, chartController, powdercloudSvgHazardTreeline, powdercloudSvgHazardAlpine, powdercloudSvgHazardBelowTreeline;

var hazardSvgWidth = 300;
var hazardSvgHeight = 300;

function Controller(){
    this.store = masterStore;
    this.map = Ext.getCmp('mapViewer');
    this.filterCmp = filterCmp;
    Ext.StoreMgr.lookup('locationWithBlankRecord').load();

    this.store.on('load', function(store, records, options){
        this.map.clearOverlays();

	this.hazardRecordsArray = new Array();

        store.each(function (record){
		this.map.addMapData(record.data.terrain_map_overlay, record);

		this.hazardRecordsArray.push(record);

	    }, this);

	chartController.drawDataSvgCharts(this.hazardRecordsArray);

    }, this);
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
            entity: 'Concerns',
	    type__ObservationType__lookup: 'concernsevent',
	    sort: 'date_time_start',
	    dir: 'DESC',
            'date_time_start__range': filterCmp.start_date.format('Y-m-d 00:00')+'/'+filterCmp.end_date.format('Y-m-d 23:59')
        },
        autoLoad: false,
        reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, ConcernsVO)
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
		name: 'comments_internal',
		fieldLabel: 'Comment'
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
                dateFormat: 'Y-m-d',
                timeFormat: 'H:i',
                dataIndex: 'date_time_start',
		renderer: formatDate
            },
	    {
                id       :'operation',
                header   : 'Operation',
                width    : 120,
                sortable : false,
                dataIndex: 'operation_desc'
            },
	    {
                id       :'terrain',
                header   : 'Location',
                width    : 120,
                sortable : false,
                dataIndex: 'terrain_desc'
            },
	    {
                id       :'expected_avalanche_character',
                header   : 'Avalanche Character',
                width    : 120,
                sortable : false,
                dataIndex: 'expected_avalanche_character_desc'
           },



	    // Alpine
//	    {
//                id       :'expected_size_in_alpine_min',
//                header   : 'Alpine min size',
//                width    : 150,
//                sortable : true,
//                dataIndex: 'expected_size_in_alpine_min_desc'
//            },
	    {
                id       :'expected_size_in_alpine',
                header   : 'Alpine size',
                width    : 150,
                sortable : true,
                dataIndex: 'expected_size_in_alpine_desc'
            },
//	    {
//                id       :'expected_size_in_alpine_max',
//                header   : 'Alpine max size',
//                width    : 150,
//                sortable : true,
//                dataIndex: 'expected_size_in_alpine_max_desc'
//            },
//	    {
//                id       :'likelihood_in_alpine_min',
//                header   : 'Alpine min likelihood',
//                width    : 150,
//                sortable : true,
//                dataIndex: 'likelihood_in_alpine_min_desc'
//            },
	    {
                id       :'likelihood_in_alpine',
                header   : 'Alpine min likelihood',
                width    : 150,
                sortable : true,
                dataIndex: 'likelihood_in_alpine_desc'
            },
//	    {
//                id       :'likelihood_in_alpine_max',
//                header   : 'Alpine max likelihood',
//                width    : 150,
//                sortable : true,
//                dataIndex: 'likelihood_in_alpine_max_desc'
//            },


	    // Treeline
//	    {
//                id       :'expected_size_in_treeline_min',
//                header   : 'Treeline min size',
//                width    : 150,
//                sortable : true,
//                dataIndex: 'expected_size_in_treeline_min_desc'
//            },
	    {
                id       :'expected_size_in_treeline',
                header   : 'Treeline size',
                width    : 150,
                sortable : true,
                dataIndex: 'expected_size_in_treeline_desc'
            },
//	    {
//                id       :'expected_size_in_treeline_max',
//                header   : 'Treeline max size',
//                width    : 150,
//                sortable : true,
//                dataIndex: 'expected_size_in_treeline_max_desc'
//            },
//	    {
//                id       :'likelihood_in_treeline_min',
//                header   : 'Treeline min likelihood',
//                width    : 150,
//                sortable : true,
//                dataIndex: 'likelihood_in_treeline_min_desc'
//            },
	    {
                id       :'likelihood_in_treeline',
                header   : 'Treeline likelihood',
                width    : 150,
                sortable : true,
                dataIndex: 'likelihood_in_treeline_desc'
            },
//	    {
//                id       :'likelihood_below_treeline_max',
//                header   : 'Alpine max likelihood',
//                width    : 150,
//                sortable : true,
//                dataIndex: 'likelihood_below_treeline_max'
//            },


	    // Below Treeline
//	    {
//                id       :'expected_size_below_treeline_min',
//                header   : 'Below treeline min size',
//                width    : 150,
//                sortable : true,
//                dataIndex: 'expected_size_below_treeline_min_desc'
//            },
	    {
                id       :'expected_size_below_treeline',
                header   : 'Below treeline size',
                width    : 150,
                sortable : true,
                dataIndex: 'expected_size_below_treeline_desc'
            },
//	    {
//                id       :'expected_size_below_treeline_max',
//                header   : 'Treeline max size',
//                width    : 150,
//                sortable : true,
//                dataIndex: 'expected_size_below_treeline_max_desc'
//            },
//	    {
//                id       :'likelihood_below_treeline_min',
//                header   : 'Below treeline min likelihood',
//                width    : 150,
//                sortable : true,
//                dataIndex: 'likelihood_below_treeline_min_desc'
//            },
	    {
                id       :'likelihood_below_treeline',
                header   : 'Below treeline likelihood',
                width    : 150,
                sortable : true,
                dataIndex: 'likelihood_below_treeline_desc'
            },
//	    {
//                id       :'likelihood_below_treeline_max',
//                header   : 'Below treeline max likelihood',
//                width    : 150,
//                sortable : true,
//                dataIndex: 'likelihood_below_treeline_max'
//            },

	    {
                id       :'subject',
                header   : 'Subject',
                width    : 600,
                dataIndex: 'subject',
		sortable : false
            }],
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
		       {
			    xtype:'container',
			    html:'<p>The following table displays the concerns fields in textual format. You can select an individual column to resize it; change its position,  or to hide and show the column. You can sort by date and time in ascending or descending order.</p>'
			},
			grid
		]
	    }),

            new Ext.form.FieldSet({
		title: 'Charts',
		width: '100%',
		collapsible: true,
		collapsed: false,
		border: true,
		items:[
		    {
			xtype:'container',
			html:'<p>The following charts display the concerns (Alpine, Treeline, Below Treeline) as summarized charts.</p>'
		    },
		    {
			xtype: 'container',
			layout: 'column',
			items: [
			    {
				id: 'svg_div_hazard_alpine',
				columnWidth: 0.33
			    },
			    {
				id: 'svg_div_hazard_treeline',
				columnWidth: 0.33
			    },
			    {
				id: 'svg_div_hazard_below_treeline',
				columnWidth: 0.33
			    }
                    ]
                }
		]
	    }),

	    new Ext.form.FieldSet({
		title: 'Map Overlay',
		width: '100%',
		collapsible: false,
		border: true,
		items:[
			{
			    xtype:'container',
			    html:'<p>The following map displays the location of the various observations. You can mange the view by using the toolbar (for example, Map or Earth). You can alter the scale using the vertical scale, and while in Earth mode you can alter the prespecitve with the upper left control.</p>'
			},

			mapOverlay
			//
			//{
			//    xtype:'container',
			//    html:'<p> </p>'
			//},
			//{
			//    xtype:'container',
			//    html:'<p>Persons accessing Powdercloud.com information have agreed to a Release of Liability, Waiver of Claims and Assumption of Risk Agreement and assume all risk of injury resulting from using this information. They further agree to release the contributors from liability and waive all claims against the contributors for any personal injury, death, property damage, loss or expense that may be sustained as a result of using the information provided herein by the contributors, due to any cause whatsoever, including negligence, breach of contract or breach of any statutory or other duty of care on the part of the contributors.</p>'
			//}

		],
		listeners:{
		    scope: this,
		    expand: function(cmp){
			var temp = Ext.getCmp('mapViewer');
			temp.getMap().checkResize();
		    }
		}
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

    chartController = new ChartController();
    chartController.initialRenderSvgCharts();
});

function ChartController(){

    var svgDivHazardAlpine = $('#svg_div_hazard_alpine');
    svgDivHazardAlpine.width(hazardSvgWidth);
    svgDivHazardAlpine.height(hazardSvgHeight);

    var svgDivHazardTreeline = $('#svg_div_hazard_treeline');
    svgDivHazardTreeline.width(hazardSvgWidth);
    svgDivHazardTreeline.height(hazardSvgHeight);

    var svgDivHazardBelowTreeline = $('#svg_div_hazard_below_treeline');
    svgDivHazardBelowTreeline.width(hazardSvgWidth);
    svgDivHazardBelowTreeline.height(hazardSvgHeight);

    $('#svg_div_hazard_alpine').svg(); // Create svg
    $('#svg_div_hazard_treeline').svg(); // Create svg
    $('#svg_div_hazard_below_treeline').svg(); // Create svg

    powdercloudSvgHazardAlpine = new PowdercloudSvgHazard(hazardSvgWidth, hazardSvgHeight);
    $('#svg_div_hazard_alpine').svg({onLoad: powdercloudSvgHazardAlpine.drawChart});

    powdercloudSvgHazardTreeline = new PowdercloudSvgHazard(hazardSvgWidth, hazardSvgHeight);
    $('#svg_div_hazard_treeline').svg({onLoad: powdercloudSvgHazardTreeline.drawChart});

    powdercloudSvgHazardBelowTreeline = new PowdercloudSvgHazard(hazardSvgWidth, hazardSvgHeight);
    $('#svg_div_hazard_below_treeline').svg({onLoad: powdercloudSvgHazardBelowTreeline.drawChart});
}

ChartController.prototype.initialRenderSvgCharts = function() {

    var svgHazardAlpine = $('#svg_div_hazard_alpine').svg('get');
    powdercloudSvgHazardAlpine.drawChart(svgHazardAlpine);

    var svgHazardTreeline = $('#svg_div_hazard_treeline').svg('get');
    powdercloudSvgHazardTreeline.drawChart(svgHazardTreeline);

    var svgHazardBelowTreeline = $('#svg_div_hazard_below_treeline').svg('get');
    powdercloudSvgHazardBelowTreeline.drawChart(svgHazardBelowTreeline);
}

ChartController.prototype.drawDataSvgCharts = function(recordsArray){

    var hazardAlpineData = new Array();
    var hazardTreelineData = new Array();
    var hazardBelowTreelineData = new Array();

    if (recordsArray) {
	for (var r = 0; r <= recordsArray.length; r++) {
	    var record = recordsArray[r];
	    if (record) {


		// 0. Alpine
		var hazardAlpine = new Object();
		// TODO: get color
		hazardAlpine.colour = "#999999"; // type:String
		hazardAlpine.triggerMin = this.translateLikelihood(record.data.likelihood_in_alpine_min_code); // type:Numeric
		hazardAlpine.triggerExpected = this.translateLikelihood(record.data.likelihood_in_alpine_code); // type:Numeric
		hazardAlpine.triggerMax = this.translateLikelihood(record.data.likelihood_in_alpine_max_code); // type:Numeric
		hazardAlpine.sizeMin = this.translateSizeDestructive(record.data.expected_size_in_alpine_min_code); // type:Numeric
		hazardAlpine.sizeExpected = this.translateSizeDestructive(record.data.expected_size_in_alpine_code); // type:Numeric
		hazardAlpine.sizeMax = this.translateSizeDestructive(record.data.expected_size_in_alpine_max_code); // type:Numeric
		hazardAlpineData.push(hazardAlpine);

		// 1. Treeline
		var hazardTreeline = new Object();
		// TODO: get color
		hazardTreeline.colour = "#999999"; // type:String
		hazardTreeline.triggerMin = this.translateLikelihood(record.data.likelihood_in_treeline_min_code); // type:Numeric
		hazardTreeline.triggerExpected = this.translateLikelihood(record.data.likelihood_in_treeline_code); // type:Numeric
		hazardTreeline.triggerMax = this.translateLikelihood(record.data.likelihood_in_treeline_max_code); // type:Numeric
		hazardTreeline.sizeMin = this.translateSizeDestructive(record.data.expected_size_in_treeline_min_code); // type:Numeric
		hazardTreeline.sizeExpected = this.translateSizeDestructive(record.data.expected_size_in_treeline_code); // type:Numeric
		hazardTreeline.sizeMax = this.translateSizeDestructive(record.data.expected_size_in_treeline_max_code); // type:Numeric
		hazardTreelineData.push(hazardTreeline);

		// 2. Below Treeline
		var hazardBelowTreeline = new Object();
		// TODO: get color
		hazardBelowTreeline.colour = "#999999"; // type:String
		hazardBelowTreeline.triggerMin = this.translateLikelihood(record.data.likelihood_in_below_treeline_min_code); // type:Numeric
		hazardBelowTreeline.triggerExpected = this.translateLikelihood(record.data.likelihood_in_below_treeline_code); // type:Numeric
		hazardBelowTreeline.triggerMax = this.translateLikelihood(record.data.likelihood_in_below_treeline_max_code); // type:Numeric
		hazardBelowTreeline.sizeMin = this.translateSizeDestructive(record.data.expected_size_in_below_treeline_min_code); // type:Numeric
		hazardBelowTreeline.sizeExpected = this.translateSizeDestructive(record.data.expected_size_in_below_treeline_code); // type:Numeric
		hazardBelowTreeline.sizeMax = this.translateSizeDestructive(record.data.expected_size_in_below_treeline_max_code); // type:Numeric
		hazardBelowTreelineData.push(hazardBelowTreeline);

	    }
	}
    }

    var svgHazardAlpine = $('#svg_div_hazard_alpine').svg('get');
    powdercloudSvgHazardAlpine.drawChart(svgHazardAlpine);
    powdercloudSvgHazardAlpine.drawData(svgHazardAlpine, hazardAlpineData, false);

    var svgHazardTreeline = $('#svg_div_hazard_treeline').svg('get');
    powdercloudSvgHazardTreeline.drawChart(svgHazardTreeline);
    powdercloudSvgHazardTreeline.drawData(svgHazardTreeline, hazardTreelineData, false);

    var svgHazardBelowTreeline = $('#svg_div_hazard_below_treeline').svg('get');
    powdercloudSvgHazardBelowTreeline.drawChart(svgHazardBelowTreeline);
    powdercloudSvgHazardBelowTreeline.drawData(svgHazardBelowTreeline, hazardBelowTreelineData, false);
}

ChartController.prototype.translateLikelihood = function(likelihoodCode){
    var likelihoodNum = null;
    if (likelihoodCode) {
        switch( likelihoodCode ) {

            case "VU" :
                    likelihoodNum = 1;
                    break;
            case "VU+" :
                    likelihoodNum = 2;
                    break;
            case "U" :
                    likelihoodNum = 3;
                    break;
            case "U+" :
                    likelihoodNum = 4;
                    break;
            case "P" :
                    likelihoodNum = 5;
                    break;
            case "P+" :
                    likelihoodNum = 6;
                    break;
            case "L" :
                    likelihoodNum = 7;
                    break;
            case "L+" :
                    likelihoodNum = 8;
                    break;
            case "AC" :
                    likelihoodNum = 9;
                    break;
        }
    }

    return likelihoodNum;
}

ChartController.prototype.translateSizeDestructive = function(sizeDestructiveCode){
    var sizeDestructiveNum = null;
    if (sizeDestructiveCode) {
        switch( sizeDestructiveCode ) {

            case "1" :
                    sizeDestructiveNum = 1;
                    break;
            case "1.5" :
                    sizeDestructiveNum = 1.5;
                    break;
            case "2" :
                    sizeDestructiveNum = 2;
                    break;
            case "2.5" :
                    sizeDestructiveNum = 2.5;
                    break;
            case "3" :
                    sizeDestructiveNum = 3;
                    break;
            case "3.5" :
                    sizeDestructiveNum = 3.5;
                    break;
            case "4" :
                    sizeDestructiveNum = 4
                    break;
            case "4.5" :
                    sizeDestructiveNum = 4.5;
                    break;
            case "5" :
                    sizeDestructiveNum = 5;
                    break;
        }
    }

    return sizeDestructiveNum;
}
