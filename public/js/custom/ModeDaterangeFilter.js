ModeDaterangeFilterStore = function(config) {
  var config = config || {};
  Ext.applyIf(config, {
        reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, AvalancheVO),
        remoteSort: true,
        autoLoad: true,
        dateRange: 'date_time_start',
        baseParams:{
                entity: 'Observation',
                sort: 'date_time_start',
                dir: 'DESC',
                type: 'weatherstudyplotstandard'                
        },
        proxy: new Ext.data.ScriptTagProxy({
                url: '/json/entity_query_all/'
        })	
  });
  // call the superclass's constructor
  ModeDaterangeFilterStore.superclass.constructor.call(this, config);
};
Ext.extend(ModeDaterangeFilterStore, Ext.data.Store);



function ModeDaterangeFilter(){
        this.mode = null;
        this.start_date = new Date();
        this.start_date.setDate(this.start_date.getDate()-1);
        this.end_date = new Date();
        this.stores = new Array();
        
        // separating the GET parameters from the current URL
        var getParams = document.URL.split("?");
        // transforming the GET parameters into a dictionnary
        var params = Ext.urlDecode(getParams[getParams.length - 1]);
        if(params){
          if(params.hasOwnProperty('dtrn')){
            if(params.dtrn == 'today'){
              var tempDate = new Date();
              this.start_date.setDate(tempDate.getDate());
            }
          }
        }
        
        $("#dvFilterOptions").buttonset();
        $('#infiltdstart').val(this.start_date.format('Y-m-d'));
        $('#infiltdend').val(this.end_date.format('Y-m-d'));
        $('#infiltdstart, #infiltdend').daterangepicker( {
                dateFormat:"yy-mm-dd",
                arrows:true,
                presets:{ dateRange:'Select date range' },
                presetRanges:[ { text:"Today", dateStart:"Today", dateEnd:"Today" }, { text:"This Week", dateStart:"-7days", dateEnd:"Today" }, { text:"Last Month", dateStart:"-1month", dateEnd:"Today" } ]
        } );
        $("#dvFilterOptions").buttonset("refresh");
        if(params){
          if(params.hasOwnProperty('flt_mode')){
            if(params.flt_mode == 'c'){
              $("[name=flt_mode]").filter("[value=c]").attr("checked","checked");
              this.mode = 'c';
              $("#dvFilterOptions").buttonset("refresh");
            } else if(params.flt_mode == 'f'){
              $("[name=flt_mode]").filter("[value=f]").attr("checked","checked");
              this.mode = 'f';
              $("#dvFilterOptions").buttonset("refresh");
            }
          }
        }
        

        
        // Filter
        $('#dvFilter').hide();
        $('#dvFilterHead').click( function() {
                if( $( "#imgFilter" ).attr( "src" ) == "/static/img/arrow-right.gif" ) {
                        $( "#imgFilter" ).fadeOut( 100 ).attr( "src", "/static/img/arrow-down.gif" ).fadeIn();
                        $('#dvFilter').fadeIn();
                        $('#dvFilterHead').removeClass().addClass( "dvFilterHeadOpen" );
                } else {
                        $( "#imgFilter" ).fadeOut(100).attr( "src", "/static/img/arrow-right.gif" ).fadeIn();
                        $('#dvFilterHead').removeClass( "dvFilterHeadOpen" );
                        $('#dvFilter').fadeOut();
                        $('#dvFilterHead').removeClass().addClass( "dvFilterHeadClosed" );
                }
        } );
        Ext.get('mode-daterange-filter-button').on('click', function() {
                this.doReload();
        }, this);

};
ModeDaterangeFilter.prototype.regStore = function(store){
        this.stores.push(store);
}
ModeDaterangeFilter.prototype.getMode = function(){
        this.mode = $('form[name=frmFilter] input[name=flt_mode]:radio[checked]').val();
        return this.mode;
}
ModeDaterangeFilter.prototype.doReload = function(){
        var start_date = $( "form[name=frmFilter] input[name=filtdstart_d]" ).val() + " 00:00";
        this.start_date = Date.parse(start_date);
        var end_date = $( "form[name=frmFilter] input[name=filtdend_d]" ).val() + " 23:59";
        this.end_date = Date.parse(end_date);
        this.mode = $('form[name=frmFilter] input[name=flt_mode]:radio[checked]').val();
        for(i=0; i<this.stores.length; i++) {
                this.stores[i].setBaseParam(this.stores[i].dateRange+'__range', start_date+'/'+end_date);
                this.stores[i].setBaseParam('__community_mode', this.mode);
                this.stores[i].load();
        }
}