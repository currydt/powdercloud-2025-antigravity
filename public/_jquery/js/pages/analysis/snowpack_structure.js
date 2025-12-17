var controller, grid, masterStore, mapOverlay, container, filterCmp;


function Controller(){
    this.store = masterStore;
    this.map = Ext.getCmp('mapViewer');
    this.filterCmp = filterCmp;
    Ext.StoreMgr.lookup('locationWithBlankRecord').load();

    this.store.on('load', function(store, records, options){
        this.map.clearOverlays();
        store.each(function (record){
            this.map.addMapData(record.data.terrain_map_overlay, record);


        }, this);

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
			entity: 'SnowpackStructure',
			type__ObservationType__lookup: 'snowpackstructure',
			sort: 'date_time_start',
			dir: 'DESC',
			'date_time_start__range': filterCmp.start_date.format('Y-m-d 00:00')+'/'+filterCmp.end_date.format('Y-m-d 23:59')
        },
        reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, SnowpackStructureVO)
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
                dataIndex: 'date_time_start'
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
            },{
                id       :'subject',
                header   : 'Description',
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
	    new Ext.form.FieldSet(
	    {
		title: 'Table',
		width: '100%',
		collapsible: true,
		collapsed: false,
		border: true,
		items:[{
		    xtype:'container',
		    html:'<p>The following table displays the snowpack structures in textual format. You can select an individual column to resize it; change its position,  or to hide and show the column. You can sort by date and time in ascending or descending order.</p>'
		},
		    grid
		]
	    }),

	    new Ext.form.FieldSet(
		{
		    title: 'Map Overlay',
		    width: '100%',
		    collapsible: false,
		    border: true,
		    items:[{
			xtype:'container',
			html:'<p>The following map displays the location of the various observations. You can mange the view by using the toolbar (for example, Map or Earth). You can alter the scale using the vertical scale, and while in Earth mode you can alter the prespecitve with the upper left control.</p>'
		},
		    mapOverlay

		//{
		//xtype:'container',
		//html:'<p> </p>'
		//},
		//{
		//xtype:'container',
		//html:'<p>Persons accessing Powdercloud.com information have agreed to a Release of Liability, Waiver of Claims and Assumption of Risk Agreement and assume all risk of injury resulting from using this information. They further agree to release the contributors from liability and waive all claims against the contributors for any personal injury, death, property damage, loss or expense that may be sustained as a result of using the information provided herein by the contributors, due to any cause whatsoever, including negligence, breach of contract or breach of any statutory or other duty of care on the part of the contributors.</p>'
		//}

		],
		listeners:{
		    scope: this,
		    expand: function(cmp){
			var temp = Ext.getCmp('mapViewer');
			temp.getMap().checkResize();
		    }
		}
	    }),

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
