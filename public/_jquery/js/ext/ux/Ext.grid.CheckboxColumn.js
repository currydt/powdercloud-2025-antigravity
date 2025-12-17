Ext.ns('Ext.ux.grid');

Ext.ux.grid.CheckboxColumn = Ext.extend(Ext.grid.Column, {
    on: true,
    off: false,
    constructor: function (cfg) {
        Ext.ux.grid.CheckboxColumn.superclass.constructor.call(this, cfg);
        this.editor = new Ext.form.Field();
        var cellEditor = this.getCellEditor(),
            on = this.on,
            off = this.off;
        cellEditor.on('startedit', function (el, v) {
            cellEditor.setValue(String(v) == String(on) ? off : on);
            cellEditor.hide();
        });
        this.renderer = function (value, metaData, record, rowIndex, colIndex, store) {
            metaData.css += ' x-grid3-check-col-td';
            return '<div class="x-grid3-check-col' + (String(value) == String(on) ? '-on' : '') + '"></div>';
        }
    }
});
Ext.grid.Column.types['checkboxcolumn'] = Ext.ux.grid.CheckboxColumn;  