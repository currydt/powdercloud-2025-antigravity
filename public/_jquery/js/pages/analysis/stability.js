var controller, grid, masterStore, mapOverlay, container,
filterCmp, powdercloudSvgRatingStability;

function Controller(){
    this.store = masterStore;
    this.map = Ext.getCmp('mapViewer');
    this.filterCmp = filterCmp;
    this.ratingChart_data = null;
    Ext.StoreMgr.lookup('locationWithBlankRecord').load();
    this.store.on('load', function(store, records, options){
        this.map.clearOverlays();

        this.ratingChart_data = new Array();

        store.each(function (record){
            this.map.addMapData(record.data.terrain_map_overlay, record);

            // Rating Chart Data - Start
            var date  = record.data.date_time_start;
            if (date != null) {
                if (record.data.stability_scale_alpine_code) {
                    this.ratingChart_data.push({category:0, date: date, ratingCode: record.data.stability_scale_alpine_code});
                }

                if (record.data.stability_scale_treeline_code) {
                    this.ratingChart_data.push({category:1, date: date, ratingCode: record.data.stability_scale_treeline_code});
                }

                if (record.data.stability_scale_below_treeline_code) {
                    this.ratingChart_data.push({category:2, date: date, ratingCode: record.data.stability_scale_below_treeline_code});
                }
            }
            // Rating Chart Data - End
        }, this);

        if (powdercloudSvgRatingStability) {
            var svg = $('#svg_div').svg('get');	// Get svg
            powdercloudSvgRatingStability.drawChart(svg, this.ratingChart_data, this.filterCmp.start_date, this.filterCmp.end_date);
        }

    }, this);
}
Controller.prototype.drawRatingStability = function(){

    var categories = ["High Alpine", "Alpine", "Sub Alpine"];
    var days = [1, 2, 3, 4, 5, 6, 7]; // inital days (will be overwritten once we get real data)
    var title = "Stability Ratings";

    var svgWidth = 975;
    var svgHeight = 200;
    document.getElementById('svg_div').style.width = svgWidth + "px";
    document.getElementById('svg_div').style.height = svgHeight + "px";
    //document.getElementById('svg_div').style.border = '1px solid #000000';
    powdercloudSvgRatingStability = new PowdercloudSvgRating(svgWidth, svgHeight, categories, days, title, 80);

    $('#svg_div').svg(); // Create svg
    var svg = $('#svg_div').svg('get');	// Get svg
    powdercloudSvgRatingStability.drawChart(svg, null);
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
		entity: 'Rating',
		type__ObservationType__lookup: 'ratingstability',
		sort: 'date_time_start',
		dir: 'DESC',
		'date_time_start__range': filterCmp.start_date.format('Y-m-d 00:00')+'/'+filterCmp.end_date.format('Y-m-d 23:59')
        },
        autoLoad: false,
        reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, RatingVO)
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
                width    : 200,
                sortable : true,
                dateFormat: 'Y-m-d',
                timeFormat: 'H:i',
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
                id       :'notable',
                header   : 'Notable',
                width    : 80,
                dataIndex: 'notable',
		sortable : false
            },
	    {
                id       :'stability_scale_alpine',
                header   : 'Alpine',
                width    : 100,
                sortable : false,
                dataIndex: 'stability_scale_alpine_desc'
            },
	    {
                id       :'remark_alpinw',
                header   : 'Alpine Remark',
                width    : 200,
                sortable : false,
                dataIndex: 'remark_alpine'
            },
	    {
                id       :'stability_scale_treeline',
                header   : 'Treeline',
                width    : 100,
                sortable : false,
                dataIndex: 'stability_scale_treeline_desc'
            },
	    {
                id       :'remark_treeline',
                header   : 'Treeline Remark',
                width    : 200,
                sortable : false,
                dataIndex: 'remark_treeline'
            },
	    {
                id       :'stability_scale_below_treeline',
                header   : 'Below Treeline',
                width    : 100,
                sortable : false,
                dataIndex: 'stability_scale_below_treeline_desc'
            },
	    {
                id       :'remark_below_treeline',
                header   : 'Below Treeline Remark',
                width    : 200,
                sortable : false,
                dataIndex: 'remark_below_treeline'
            },
            {
                id       :'stability_trending',
                header   : 'Stability trending',
                width    : 100,
                sortable : false,
                dataIndex: 'stability_trending_desc'
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
		items:[{
		    xtype:'container',
		    html:'<p>The following table displays the stability fields in textual format. You can select an individual column to resize it; change its position,  or to hide and show the column. You can sort by date and time in ascending or descending order.</p>'
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
		items:[{
		    xtype:'container',
		    html:'<p>The following chart displays the stability ratings as a summarized chart. The latest recorded value for each day is presented.</p>'
		},
		    new Ext.Container({
			html:'<div id="svg_div"></div>',
			listeners:{
			    afterrender:{
				scope: this,
				fn: controller.drawRatingStability
			    }
			}
		    })
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
});
