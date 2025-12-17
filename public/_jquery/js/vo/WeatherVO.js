// WeatherVO - Value Object for Weather observations
// Simplified version for UI shell - data loading commented out

Ext.namespace('PC');

PC.WeatherVO = Ext.data.Record.create([
    { name: 'key', type: 'string' },
    { name: 'date_time_start', type: 'date', dateFormat: 'Y-m-d H:i:s' },
    { name: 'operation_desc', type: 'string' },
    { name: 'terrain_desc', type: 'string' },
    { name: 'type_desc', type: 'string' },
    { name: 'elevation_min', type: 'int' },
    { name: 'elevation_max', type: 'int' },
    { name: 'aspect_start_code', type: 'string' },
    { name: 'aspect_end_code', type: 'string' },
    { name: 'sky_condition_code', type: 'string' },
    { name: 'precipitation_type_code', type: 'string' },
    { name: 'precipitation_rate_code', type: 'string' },
    { name: 'air_temperature_max', type: 'float' },
    { name: 'air_temperature_min', type: 'float' },
    { name: 'hn24_accumulated', type: 'float' },
    { name: 'hn24_water_equivalent', type: 'float' },
    { name: 'hs_accumulated', type: 'float' },
    { name: 'ridge_blowing_snow_direction_code', type: 'string' },
    { name: 'ridge_blowing_snow_transport_code', type: 'string' },
    { name: 'wind_speed_cat_code', type: 'string' },
    { name: 'wind_direction_cat_code', type: 'string' },
    { name: 'subject', type: 'string' },
    { name: 'comments_internal', type: 'string' }
]);

// Alias for compatibility
var WeatherVO = PC.WeatherVO;
