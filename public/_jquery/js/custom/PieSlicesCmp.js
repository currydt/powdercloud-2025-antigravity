Ext.namespace("pc.custom");

pc.custom.PieSlicesCmp = Ext.extend(Ext.form.Field, {
    // private
    actionMode: 'wrap',
    
    afterRender: function(){
	var prevEls = $('#'+this.wrap.id).prevAll();
	var offset = 0;
	prevEls.each(function(){
	    offset += $(this).width()+5;
	});
	$('#'+this.wrap.id).css('left', offset+5);
    },
     /**
     * Set up the hidden field
     * @param {Object} ct The container to render to.
     * @param {Object} position The position in the container to render to.
     * @private
     */
    onRender : function(ct, position){
        this.autoCreate = {
            id: this.id,
            name: this.name,
            type: 'hidden',
            tag: 'input'
        };
        pc.custom.PieSlicesCmp.superclass.onRender.call(this, ct, position);
        
        this.wrap = this.el.wrap({cls: 'x-form-display-field x-box-item'});
           
	document.getElementById(this.wrap.id).style.width = this.svgWidth + "px";
	document.getElementById(this.wrap.id).style.height = this.svgHeight + "px";	

	$('#'+this.wrap.id).svg(); // Create svg
	this.svg = $('#'+this.wrap.id).svg('get');	// Get svg
	this.svgCmp.drawChart(this.svg, null);	

    },
    /**
     * Initialize the component.
     * @private
     */
    initComponent : function() {
	this.svgWidth = 75;
	this.svgHeight = 75;
	this.svgCmp = new PowdercloudSvgPieRose(this.svgWidth, this.svgHeight, 8, "#FFFFFF", "#000000");
        pc.custom.PieSlicesCmp.superclass.initComponent.call(this);
    },
    /**
     * Sets the value for this field.
     * @param {Number} v The new value.
     */
    setValue : function(v){
	this.fireEvent('change', this, v);
	this.value = v;
	this.svgCmp.drawSectors(this.svg, v);
    },
    /**
     * Gets the current value for this field.
     * @return {Number} The current value.
     */
    getValue : function(){
	//console.log(this.svgCmp.getSelectedSectors().join());
	$('#'+this.id).val(this.svgCmp.getSelectedSectors().join());
	return this.svgCmp.getSelectedSectors().join();
    },
    getRawValue: function(){
	return this.getValue();
    }
});
Ext.reg('pieslicescmp', pc.custom.PieSlicesCmp);