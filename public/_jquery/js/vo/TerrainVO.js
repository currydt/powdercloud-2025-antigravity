// TerrainVO - Value Object for Terrain/Location data
// Simplified version for UI shell

Ext.namespace('PC');

PC.TerrainVO = Ext.data.Record.create([
    { name: 'key', type: 'string' },
    { name: 'name_nick', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'elevation', type: 'int' },
    { name: 'aspect', type: 'string' }
]);

// Alias for compatibility
var TerrainVO = PC.TerrainVO;
