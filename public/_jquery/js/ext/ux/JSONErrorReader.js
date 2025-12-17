// A reusable error reader class for XML forms
 var ErrorVO = Ext.data.Record.create([
    { name : 'id'}, { name : 'msg'}
 ]);

Ext.form.JSONErrorReader = function(){
   

    Ext.form.JSONErrorReader.superclass.constructor.call(this, {
            success: 'success',    
            root: 'errors'
        }, ErrorVO
    );
};
Ext.extend(Ext.form.JSONErrorReader, Ext.data.JsonReader);