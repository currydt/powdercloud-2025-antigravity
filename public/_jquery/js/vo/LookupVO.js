// LookupVO - Value Object for Lookup data
// Simplified version for UI shell

Ext.namespace('PC');

PC.LookupVO = Ext.data.Record.create([
    { name: 'key', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'code', type: 'string' },
    { name: 'value', type: 'string' },
    { name: 'code_value', type: 'string' },
    { name: 'sort_order', type: 'int' }
]);

// Alias for compatibility
var LookupVO = PC.LookupVO;
