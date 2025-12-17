/**
 * Powdercloud Svg Snowprofile class
 *
 * requires jquery.svg.js, found here: http://keith-wood.name/svg.html or http://plugins.jquery.com/project/svg
 * requires jquery
 * requires powdercloud.svg.js
 */



/* Based upon JQuery SVG found here:
http://keith-wood.name/svg.html
http://keith-wood.name/svgRef.html
http://plugins.jquery.com/project/svg
*/


/**
 * Assumptions:
 * 1. This is only for a "Pro" SnowProfile
 * 2. shears and temperatures will only show if there are snowlayers
 *
 * Data Assumptions:
 * 1. SnowLayers are ordered by isLayersDescendingTopDown.
 * 2. TemperatureLayers are ordered by isLayersDescendingTopDown.
 */


var canvasWidth = 0;
var canvasHeight = 0;

// Text Styles
var FONT_FAMILY_DEFAULT = "sans-serif,Helvetica,Arial";
var FONT_SIZE_DEFAULT = 9;
var TEXT_STROKE_COLOR_DEFAULT = "#BBBBBB";
var TEXT_STROKE_WIDTH_DEFAULT = 0.1;
var TEXT_STROKE_OPACITY_DEFAULT = 1;
var FONT_SIZE_LARGE = 12;
var TEXT_STROKE_WIDTH_LARGE = 0.1;
var TEXT_ANCHOR_MIDDLE = "middle";
var TEXT_ANCHOR_START = "start";
var TEXT_ANCHOR_END = "end";
var FONT_SIZE_GLYPH_DEFAULT = 12;
var FONT_SIZE_DEFAULT_PIXEL_HEIGHT = 8;

// Flag styles
var FLAG_PATH_STROKE_DEFAULT = "black";
var FLAG_PATH_STROKE_WIDTH_DEFAULT = 0.5;
var FLAG_PATH_FILL_OPACITY_DEFAULT = 1;

// Model Constants
var TABLE_TYPE_BASIC = "basic"; // Properties Table: Basic
var TABLE_TYPE_COMMENTS = "comments"; // Properties Table: Comments
var TABLE_TYPE_FLAGS = "flags"; // Properties Table: Flags
var TABLE_TYPE_NONE = "none"; // Properties Table: None
var BLANK_LAYER_PROPERTY_RANGE_VALUE = "     "; // Used in the layer properties table where a range occurs (like grain form 1 and grain form 2).  This is the blank value.
var LAYER_PROPERTY_RANGE_SEPERATOR = " - ";
var hardness_codes_abbr = ["I", "K", "P", "1F", "4F", "F"];
var hardness_codes_full = ["I+", "I", "I-", "K+", "K", "K-", "P+", "P", "P-", "1F+", "1F", "1F-", "4F+", "4F", "4F-", "F+", "F", "F-"];
var hardness_resistance_values = [1300, 1200, 1066, 933, 800, 733, 666, 600, 533, 466, 400, 333, 266, 200, 166, 133, 100, 50];
var hardness_colors = ["black", "black", "black", "lightslategray", "lightslategray", "lightslategray", "saddlebrown", "saddlebrown", "saddlebrown", "orange", "orange", "orange", "green", "green", "green", "crimson", "crimson", "crimson"];
var GLYPH_SNOW_SYMBOLS_IACS_SVG = "SnowSymbolsIacsSvg";
var WEST_BOX_PERCENT = 0.4;
var EAST_BOX_PERCENT = 0.6;
var MAX_CHARS_COMMENTS_PARTIAL = 22; // Max number of characters for a partial comment string
var MAX_CHARS_COMMENTS_FULL = 65; // Max number of characters for a full comment string
var MAX_CHARS_SUFFIX = "...";
var MIN_LAYER_HEIGHT = 18; // Minimum layer height for properties box, this is where the "expanders" come into play

// Model Variables
var propTableType = TABLE_TYPE_BASIC; // default to Basic
var isShowTemp = true;
var isShowTempPointLabels = true;
var isShowSurfaceAndAirTemperature = true; // Flag to show surface and air temperature
var isShowLayerHeight = true; // Flag to show Layer Height on right of Hardness Chart
var isShowLayerScale = true; // Flag to show Layer Scale on left of Hardness Chart
var isShowHardnessLayerLines = true;
var isShowHardnessAxis = true;
var isHardnessDataColored = true;
var isHardnessBoxLabelShown = true;
var isPropertiesBoxLabelShown = true;
var isPropertiesAxisLabelsShown = true;
var layerScaleIncrement = 20;
var colorAirTemp = "blue";
var colorSurfaceTemp = "green";
var colorTemp = "green";
var colorLineData = "black";
var colorLineChart = "grey";
var colorTextData = "black";
var colorTextChart = "grey";
var colorHardnessDefault = "grey";
var colorSurfaceLine = "grey";
var strokeWidthChart = 1;
var strokeWidthEmpty = 0;
var strokeOpacityChart = 1;
var strokeWidthSurfaceLine = 1;
var strokeOpacitySurfaceLine = 1;
var strokeDashArraySurfaceLine = "none"; // If dashed desired, see http://www.w3.org/TR/SVG/painting.html, ex: "5,5"
var strokeDashArrayChart = "none"; // If dashed desired, see http://www.w3.org/TR/SVG/painting.html, ex: "5,5"
var hardnessAxisTitle = "Hardness Scale";
var hardnessBoxEastOffsetFactor = 0.02; // Hardness Box east offset factor (from West Box) // Tip: use in conjunction with isShowLayerHeight
var hardnessBoxWestOffsetFactor = 0.08; // Hardness Box west offset factor (from West Box) // Tip: use in conjunction with isShowLayerScale
var hardnessBoxTopOffsetFactor = 0.08; // Hardness Box top offset factor (from West Box)
var hardnessBoxBottomOffsetFactor = 0.08; // Hardness Box bottom offset factor (from West Box)
var temperatureMin = -25;
var temperatureMax = 0;
var temperatureBigTickInterval = 5;
var temperatureAxisTitle = "Temperature Scale (\u00B0 C)";
var bigTickLength = 7;
var smallTickLength = 3;
var propertiesAxisTitle = "Layer Properties";
var airTemperatureBufferFactor = 0.1;
var colorHardnessLayerLine = "grey";
var strokeWidthHardnessLayerLine = 1;
var strokeOpacityHardnessLayerLine = 1;
var strokeDashArrayHardnessLayerLine = "none"; // If dashed desired, see http://www.w3.org/TR/SVG/painting.html, ex: "5,5"
var strokeWidthHardness = 0;
var strokeOpacityHardness = 0;
var strokeDashArrayHardness = "none"; // If dashed desired, see http://www.w3.org/TR/SVG/painting.html, ex: "5,5"
var fillOpacityHardness = 0.4;
var temperaturePointRadius = 3;
var temperaturePointFillOpacity = 1;
var strokeWidthTemperatureLine = 1;
var strokeOpacityTemperatureLine = 1;
var strokeDashArrayAirTemperatureLine = "5,5"; // If dashed desired, see http://www.w3.org/TR/SVG/painting.html, ex: "5,5"
var strokeDashArrayTemperatureLine = "none"; // If dashed desired, see http://www.w3.org/TR/SVG/painting.html, ex: "5,5"
var shearCommentAndArrowBuffer = 3;
var shearArrowLength = 7;
var shearArrowColor = "black"
var shearArrowFillOpacity = 1;
var borderOffset = 10; // border offset

// prop_table_basic (TABLE_TYPE_BASIC)
// NOTE: first column is a special case for "layer expansion"
// NOTE: last column is a special case for "shears"
var prop_table_basic_columns = [null, "heightStart|heightEnd", "liquidWaterContent", "snowHardness", "snowForm01+snowFormMinor01|snowForm02+snowFormMinor02", "crystalSize01|crystalSize02", "density", "comments", null]; // These strings must match the object's properties exactly.  If a pipe "|" exists, this means there are two properties for this column.  If null occurs, there will be special logic to handle this column.
var prop_table_basic_column_headings = ["", "Height", "\u03F4", "R", "F", "E", "\u03F1", "Comments", "Shears"]; // Must be same length as prop_table_basic_columns
var prop_table_basic_column_weights = [1,2.5,1,1,3,3,1,8,8]; // Must be same length as prop_table_basic_columns
var prop_table_basic_column_glyphName = [null, null, null, GLYPH_SNOW_SYMBOLS_IACS_SVG, GLYPH_SNOW_SYMBOLS_IACS_SVG, null, null, null, null]; // If column uses glyphs, specify the name of glyph font-face. Must be same length as prop_table_basic_columns
var prop_table_basic_column_text_align = [null, TEXT_ANCHOR_MIDDLE, TEXT_ANCHOR_MIDDLE, TEXT_ANCHOR_MIDDLE, TEXT_ANCHOR_MIDDLE, TEXT_ANCHOR_MIDDLE, TEXT_ANCHOR_MIDDLE, TEXT_ANCHOR_START, null]; // These are used for text alignment.  Must be same length as prop_table_basic_columns
var prop_table_basic_column_max_chars = [null, null, null, null, null, null, null, MAX_CHARS_COMMENTS_PARTIAL, null]; // These are used for max number of characters.  Must be same length as prop_table_flags_columns

// prop_table_basic (TABLE_TYPE_COMMENTS)
// NOTE: first column is a special case for "layer expansion"
var prop_table_comments_columns = [null, "heightStart|heightEnd", "comments"]; // These strings must match the object's properties exactly.  If a pipe "|" exists, this means there are two properties for this column.  If null occurs, there will be special logic to handle this column.
var prop_table_comments_column_headings = ["", "Height", "Comments"]; // Must be same length as prop_table_comments_columns
var prop_table_comments_column_weights = [1,2.5,25]; // Must be same length as prop_table_comments_columns
var prop_table_comments_column_glyphName = [null, null, null]; // If column uses glyphs, specify the name of glyph font-face. Must be same length as prop_table_comments_columns
var prop_table_comments_column_text_align = [null, TEXT_ANCHOR_MIDDLE, TEXT_ANCHOR_START]; // These are used for text alignment.  Must be same length as prop_table_comments_columns
var prop_table_comments_column_max_chars = [null, null, MAX_CHARS_COMMENTS_FULL]; // These are used for max number of characters.  Must be same length as prop_table_comments_columns

// prop_table_basic (TABLE_TYPE_FLAGS)
// NOTE: first column is a special case for "layer expansion"
var IS_FLAG = "IS_FLAG"; // Identifier used for flags
var prop_table_flags_columns = [null, "heightStart|heightEnd", "liquidWaterContent", "snowHardness", "snowForm01+snowFormMinor01|snowForm02+snowFormMinor02", "crystalSize01|crystalSize02", "density", IS_FLAG + "AGS", IS_FLAG + "Hrd", IS_FLAG + "GT", IS_FLAG + "DGS", IS_FLAG + "DH", IS_FLAG + "DI", IS_FLAG + "Cnt"]; // These strings must match the object's properties exactly.  If a pipe "|" exists, this means there are two properties for this column.  If null occurs, there will be special logic to handle this column.
var prop_table_flags_column_headings = ["", "Height", "\u03F4", "R", "F", "E", "\u03F1", "AGS", "Hrd", "GT", "DGS", "DH", "DI", "Cnt"]; // Must be same length as prop_table_flags_columns
var prop_table_flags_column_weights = [1,2.5,1,1,3,3,1,2.25,2.25,2.25,2.25,2.25,2.25,2.5]; // Must be same length as prop_table_flags_columns
var prop_table_flags_column_glyphName = [null, null, null, GLYPH_SNOW_SYMBOLS_IACS_SVG, GLYPH_SNOW_SYMBOLS_IACS_SVG, null, null, null, null, null, null, null, null, null]; // If column uses glyphs, specify the name of glyph font-face. Must be same length as prop_table_flags_columns
var prop_table_flags_column_text_align = [null, TEXT_ANCHOR_MIDDLE, TEXT_ANCHOR_MIDDLE, TEXT_ANCHOR_MIDDLE, TEXT_ANCHOR_MIDDLE, TEXT_ANCHOR_MIDDLE, TEXT_ANCHOR_MIDDLE, null, null, null, null, null, null, null]; // These are used for text alignment.  Must be same length as prop_table_flags_columns
var prop_table_flags_column_max_chars = [null, null, null, null, null, null, null, null, null, null, null, null, null, null]; // These are used for max number of characters.  Must be same length as prop_table_flags_columns

// Boxes
var westBox; // West box (drawn)
var eastBox; // East box (drawn)
var hardnessBox; // Hardness box (drawn)
var hardnessDataBox; // Hardness Data box (not drawn, just for data, similar to Hardness box, minus the airBuffer)
var temperatureBox; // Same as hardnessDataBox (not drawn, just for data)
var propertiesBox; // Properties box (drawn)
var propertiesDataBox; // Properties Data box (not drawn, just for data, similar to Properties box, minus the airBuffer)


function PowdercloudSvgSnowprofile(width, height) {
	if (width) {
		canvasWidth = width;
	}
	if (height) {
		canvasHeight = height;
	}
}


PowdercloudSvgSnowprofile.prototype.getPropertiesTableTypes = function() {
	return [ {name:'Basic', value:TABLE_TYPE_BASIC}, {name:'Comments', value:TABLE_TYPE_COMMENTS}, {name:'Flags', value:TABLE_TYPE_FLAGS}, {name:'None', value:TABLE_TYPE_NONE} ];
}


PowdercloudSvgSnowprofile.prototype.setPropertiesTableType = function(type) {
	propTableType = type;
}


PowdercloudSvgSnowprofile.prototype.drawChart = function(svg) {

	// Add SnowSymbolsIACS Svg Font
	// Don't bother if not the correct browser/version (http://caniuse.com/svg-fonts)
	if (PowdercloudSvg.isSvgFontSupported()) {
		PowdercloudSvgSnowprofile.prototype.addSnowSymbolsIACSSvgFont(svg);
	}

	var westBoxPercent = WEST_BOX_PERCENT;
	var eastBoxPercent = EAST_BOX_PERCENT;
	if ( propTableType == TABLE_TYPE_NONE ) {
		westBoxPercent = 1;
		eastBoxPercent = 0;
	}

	// 1. West/East Boxes
	var westBoxWidth = (canvasWidth - borderOffset - borderOffset - borderOffset) * westBoxPercent;
	var eastBoxWidth = (canvasWidth - borderOffset - borderOffset - borderOffset) * eastBoxPercent;
	westBox = PowdercloudSvg.createBox(PowdercloudSvg.createPoint(borderOffset, borderOffset), PowdercloudSvg.createPoint(borderOffset + westBoxWidth, canvasHeight - borderOffset ));
	eastBox = PowdercloudSvg.createBox(PowdercloudSvg.createPoint(borderOffset + westBoxWidth + borderOffset, borderOffset), PowdercloudSvg.createPoint(borderOffset + westBoxWidth + borderOffset + eastBoxWidth, canvasHeight - borderOffset));
	PowdercloudSvg.addSvgRect(svg, westBox.point_uw.x, westBox.point_uw.y, westBox.width, westBox.height, colorLineChart, strokeWidthEmpty, strokeOpacityChart, strokeDashArrayChart, "none", 0);
	PowdercloudSvg.addSvgRect(svg, eastBox.point_uw.x, eastBox.point_uw.y, eastBox.width, eastBox.height, colorLineChart, strokeWidthEmpty, strokeOpacityChart, strokeDashArrayChart, "none", 0);


	// 2. Set airTemperatureBuffer
	var airTemperatureBuffer = 0;
	if( isShowTemp && isShowSurfaceAndAirTemperature) {
		airTemperatureBuffer = westBox.height * airTemperatureBufferFactor;
	}


	// 3. Hardness Box
	var hardnessBoxWestOffset = 0;
	var hardnessBoxEastOffset = 0;
	var hardnessBoxTopOffset = 0;
	var hardnessBoxBottomOffset = 0;
	if (isHardnessBoxLabelShown) {
		hardnessBoxWestOffset = westBox.point_le.x * hardnessBoxWestOffsetFactor;
		hardnessBoxEastOffset = westBox.point_le.x * hardnessBoxEastOffsetFactor;
		hardnessBoxTopOffset = westBox.point_le.y * hardnessBoxTopOffsetFactor;
		hardnessBoxBottomOffset = westBox.point_le.y * hardnessBoxBottomOffsetFactor;
	}
	hardnessBox = PowdercloudSvg.createBox(PowdercloudSvg.createPoint(westBox.point_uw.x + hardnessBoxWestOffset, westBox.point_uw.y + hardnessBoxTopOffset), PowdercloudSvg.createPoint(westBox.point_le.x - hardnessBoxEastOffset, westBox.point_le.y - hardnessBoxBottomOffset));
	PowdercloudSvg.addSvgRect(svg, hardnessBox.point_uw.x, hardnessBox.point_uw.y, hardnessBox.width, hardnessBox.height, colorLineChart, strokeWidthChart, strokeOpacityChart, strokeDashArrayChart, "none", 0);

	if (isHardnessBoxLabelShown) {
		PowdercloudSvg.addSvgText(svg, hardnessBox.point_uw.x + (hardnessBox.width/2), hardnessBox.point_le.y + hardnessBoxBottomOffset - 5, hardnessAxisTitle, FONT_FAMILY_DEFAULT, FONT_SIZE_LARGE, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_LARGE, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);
	}

	if( isShowHardnessAxis ) {
		for (i=0;i<hardness_codes_abbr.length;i++) {
			var hardnessXCoord = PowdercloudSvgSnowprofile.prototype.getHardnessXCoord(hardnessBox, hardness_codes_abbr[i]);
			if (hardnessXCoord != null) {
				PowdercloudSvg.addSvgLine(svg, hardnessXCoord, hardnessBox.point_le.y, hardnessXCoord, hardnessBox.point_le.y - bigTickLength, colorLineChart, strokeWidthChart, strokeOpacityChart, strokeDashArrayChart);
				PowdercloudSvg.addSvgText(svg, hardnessXCoord, hardnessBox.point_le.y + 10, hardness_codes_abbr[i], FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);
			}
		}
	}


	// 4. Hardness Data Box
	hardnessDataBox = PowdercloudSvg.createBox(PowdercloudSvg.createPoint(hardnessBox.point_uw.x, hardnessBox.point_uw.y + airTemperatureBuffer), hardnessBox.point_le);


	// 5. Temperature
	if( isShowTemp ) {
		temperatureBox = PowdercloudSvg.createBox(hardnessDataBox.point_uw, hardnessDataBox.point_le);

		var numTicks = Math.abs(temperatureMax - temperatureMin);
		var tickIntervalWidth = temperatureBox.width / numTicks;
		var tempX = temperatureBox.point_le.x;
		for (i=0;i<=numTicks;i++) {
			if (i % temperatureBigTickInterval == 0)
			{
				// Draw big tick
				PowdercloudSvg.addSvgLine(svg, tempX, hardnessBox.point_uw.y, tempX, hardnessBox.point_uw.y + bigTickLength, colorLineChart, strokeWidthChart, strokeOpacityChart, strokeDashArrayChart);

				// Draw label
				var temperatureLabel = "" + (temperatureMax - i)
				PowdercloudSvg.addSvgText(svg, tempX, hardnessBox.point_uw.y - 5, temperatureLabel, FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);

			}
			else
			{
				// Draw tick
				PowdercloudSvg.addSvgLine(svg, tempX, hardnessBox.point_uw.y, tempX, hardnessBox.point_uw.y + smallTickLength, colorLineChart, strokeWidthChart, strokeOpacityChart, strokeDashArrayChart);
			}
			tempX -= tickIntervalWidth;
		}

		PowdercloudSvg.addSvgText(svg, temperatureBox.point_uw.x + (temperatureBox.width/2), hardnessBox.point_uw.y - (hardnessBoxTopOffset/2), temperatureAxisTitle, FONT_FAMILY_DEFAULT, FONT_SIZE_LARGE, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_LARGE, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);


		// Draw surface line
		if (isShowSurfaceAndAirTemperature)
		{
			PowdercloudSvg.addSvgLine(svg, temperatureBox.point_uw.x, temperatureBox.point_uw.y, temperatureBox.point_le.x, temperatureBox.point_uw.y, colorSurfaceLine, strokeWidthSurfaceLine, strokeOpacitySurfaceLine, strokeDashArraySurfaceLine);
		}
	}


	// 5. Properties Box
	if ( propTableType != TABLE_TYPE_NONE )
	{

		// 5a. properties box (drawn)
		propertiesBox = PowdercloudSvg.createBox(PowdercloudSvg.createPoint(eastBox.point_uw.x, hardnessBox.point_uw.y), PowdercloudSvg.createPoint(eastBox.point_le.x, hardnessBox.point_le.y));
		PowdercloudSvg.addSvgRect(svg, propertiesBox.point_uw.x, propertiesBox.point_uw.y, propertiesBox.width, propertiesBox.height, colorLineChart, strokeWidthChart, strokeOpacityChart, strokeDashArrayChart, "none", 0);

		// 5b. properties data box (not drawn, just for data)
		propertiesDataBox = PowdercloudSvg.createBox(PowdercloudSvg.createPoint(eastBox.point_uw.x, hardnessDataBox.point_uw.y), PowdercloudSvg.createPoint(eastBox.point_le.x, hardnessDataBox.point_le.y));

		// 5c. title
		PowdercloudSvg.addSvgText(svg, propertiesBox.point_uw.x + (propertiesBox.width/2), propertiesBox.point_le.y + hardnessBoxBottomOffset - 5, propertiesAxisTitle, FONT_FAMILY_DEFAULT, FONT_SIZE_LARGE, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_LARGE, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);

		// 5d. properties columns (based upon propTableType)
		var tmpPropTableWeights = null;
		var tmpPropTableColumns = null;
		var tmpPropTableHeadings = null;

		if (propTableType == TABLE_TYPE_BASIC)
		{
			tmpPropTableWeights = prop_table_basic_column_weights;
			tmpPropTableColumns = prop_table_basic_columns;
			tmpPropTableHeadings = prop_table_basic_column_headings;
		}
		else if (propTableType == TABLE_TYPE_COMMENTS)
		{
			tmpPropTableWeights = prop_table_comments_column_weights;
			tmpPropTableColumns = prop_table_comments_columns;
			tmpPropTableHeadings = prop_table_comments_column_headings;
		}
		else if (propTableType == TABLE_TYPE_FLAGS)
		{
			tmpPropTableWeights = prop_table_flags_column_weights;
			tmpPropTableColumns = prop_table_flags_columns;
			tmpPropTableHeadings = prop_table_flags_column_headings;
		}


		if (tmpPropTableWeights != null && tmpPropTableColumns != null && tmpPropTableHeadings != null)
		{
			var totalColumnWeight = 0;
			for (i=0;i<tmpPropTableWeights.length;i++)
			{
				totalColumnWeight += tmpPropTableWeights[i];
			}

			var previousXCoord = propertiesBox.point_uw.x;
			for (i=0;i<tmpPropTableColumns.length;i++)
				{

					var propertiesColumnEastLineXCoord = PowdercloudSvgSnowprofile.prototype.getPropertiesColumnXCoord(propertiesBox, totalColumnWeight, tmpPropTableWeights[i], previousXCoord);
					if (propertiesColumnEastLineXCoord != null) {

						// Draw East Line
						PowdercloudSvg.addSvgLine(svg, propertiesColumnEastLineXCoord, propertiesBox.point_uw.y, propertiesColumnEastLineXCoord, propertiesBox.point_le.y, colorLineChart, strokeWidthChart, strokeOpacityChart, strokeDashArrayChart);

						// Draw column headings
						var propertiesColumnCenterX = previousXCoord + ((propertiesColumnEastLineXCoord - previousXCoord) / 2);
						PowdercloudSvg.addSvgText(svg, propertiesColumnCenterX, propertiesBox.point_uw.y - 5, tmpPropTableHeadings[i], FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);

						// Set previousXCoord
						previousXCoord = propertiesColumnEastLineXCoord;
				}
			}
		}
	}
}


/**
 * @param svg The svg object.
 * @param data The snowprofile object.
 */
PowdercloudSvgSnowprofile.prototype.drawData = function(svg, snowprofile, preferences) {

	if (svg == null)
	{
		return;
	}

	// Delete everything in the current document.
	svg.clear();

	// Re-draw chart
	PowdercloudSvgSnowprofile.prototype.drawChart(svg);

	if (snowprofile != null && snowprofile.snowLayers != null && snowprofile.snowLayers.length > 0)
	{
		// 1. Draw Layer Hardness Data
		// 1a. Min/Max snowLayer heights
		var minLayerHeight = 0;
		var maxLayerHeight = 0;
		var firstLayer = snowprofile.snowLayers[0];
		var lastLayer = snowprofile.snowLayers[snowprofile.snowLayers.length - 1];
		if (firstLayer != null && firstLayer.heightStart != null && firstLayer.heightEnd != null && lastLayer != null && lastLayer.heightStart != null && lastLayer.heightEnd != null) {
			if (snowprofile.isLayersDescendingTopDown)
			{
				minLayerHeight = lastLayer.heightEnd;
				maxLayerHeight = firstLayer.heightStart;
			}
			else
			{
				minLayerHeight = firstLayer.heightStart;
				maxLayerHeight = lastLayer.heightEnd;
			}
		}


		// 1b. Determine if "Layer Expansion" is needed
		var expansionTotalHeight = 0; // Expansion total height
		for (i=0;i<snowprofile.snowLayers.length;i++) {
			var layer = snowprofile.snowLayers[i];
			if (layer != null && layer.heightStart != null && layer.heightEnd != null && layer.snowHardness != null)
			{
				var layerHeight = Math.abs(layer.heightEnd - layer.heightStart);
				var layerScreenHeight = PowdercloudSvgSnowprofile.prototype.getLayerScreenHeight(hardnessDataBox, 0, layerHeight, minLayerHeight, maxLayerHeight);
				if (layerScreenHeight < MIN_LAYER_HEIGHT)
				{
					// This layer needs expansion
					expansionTotalHeight += (MIN_LAYER_HEIGHT - layerScreenHeight);
				}
				else
				{
					if (expansionTotalHeight > 0)
					{
						if ((layerScreenHeight - expansionTotalHeight) > MIN_LAYER_HEIGHT)
						{
							// This layer can handle all previous expansion
							expansionTotalHeight = 0;
						} else
						{
							// This layer takes what previous expansion it can, puts rest back into previousExpansion
							var contractionThisLayer = expansionTotalHeight - layerScreenHeight - MIN_LAYER_HEIGHT;
							expansionTotalHeight -= contractionThisLayer;
						}
					}
				}
			}
		}


		// 1c. Draw	layer height scale
		if (isShowLayerScale) {

			// Create layer scale heights array
			var numLayerScaleTicks = Math.floor((maxLayerHeight - minLayerHeight) / layerScaleIncrement);
			var layerScaleHeights = new Array();
			layerScaleHeights.push(minLayerHeight);
			for (i=1;i<=numLayerScaleTicks;i++)
			{
				layerScaleHeights.push(minLayerHeight + (i * layerScaleIncrement));
			}
			layerScaleHeights.push(maxLayerHeight);

			for (i=0;i<layerScaleHeights.length;i++)
			{
				var layerScaleYCoord = null;
				if (snowprofile.isLayersDescendingTopDown)
				{
					layerScaleYCoord = hardnessDataBox.point_le.y - expansionTotalHeight - ((hardnessDataBox.height - expansionTotalHeight) * (layerScaleHeights[i]) / (maxLayerHeight - minLayerHeight));
				}
				else
				{
					layerScaleYCoord = hardnessDataBox.point_uw.y + ((hardnessDataBox.height - expansionTotalHeight) * (layerScaleHeights[i]) / (maxLayerHeight - minLayerHeight));
				}
				PowdercloudSvg.addSvgLine(svg, hardnessDataBox.point_uw.x, layerScaleYCoord, hardnessDataBox.point_uw.x + 7, layerScaleYCoord, colorHardnessLayerLine, strokeWidthHardnessLayerLine, strokeOpacityHardnessLayerLine, strokeDashArrayHardnessLayerLine);

				PowdercloudSvg.addSvgText(svg, hardnessDataBox.point_uw.x - 5, layerScaleYCoord, "" + layerScaleHeights[i], FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_END);
			}
		}


		// 1d. Draw layers
		var tempY = hardnessDataBox.point_uw.y;
		for (i=0;i<snowprofile.snowLayers.length;i++)
		{
			var layer = snowprofile.snowLayers[i];
			if (layer != null && layer.heightStart != null && layer.heightEnd != null && layer.snowHardness != null)
			{

				var layerHeight = Math.abs(layer.heightEnd - layer.heightStart);
				var layerScreenHeight = PowdercloudSvgSnowprofile.prototype.getLayerScreenHeight(hardnessDataBox, expansionTotalHeight, layerHeight, minLayerHeight, maxLayerHeight);

				// Draw layer lines
				if (isShowHardnessLayerLines)
				{
					PowdercloudSvg.addSvgLine(svg, hardnessDataBox.point_uw.x, tempY, hardnessDataBox.point_le.x, tempY, colorHardnessLayerLine, strokeWidthHardnessLayerLine, strokeOpacityHardnessLayerLine, strokeDashArrayHardnessLayerLine);

					PowdercloudSvg.addSvgLine(svg, hardnessDataBox.point_uw.x, tempY + layerScreenHeight, hardnessDataBox.point_le.x, tempY + layerScreenHeight, colorHardnessLayerLine, strokeWidthHardnessLayerLine, strokeOpacityHardnessLayerLine, strokeDashArrayHardnessLayerLine);
				}

				// Draw layer height labels
				if (isShowLayerHeight)
				{
					PowdercloudSvg.addSvgText(svg, hardnessDataBox.point_le.x + 5, tempY, "" + layer.heightStart, FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_START);

					PowdercloudSvg.addSvgText(svg, hardnessDataBox.point_le.x + 5, tempY + layerScreenHeight, "" + layer.heightEnd, FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_START);
				}

				// Draw layer hardness
				var hardnessColor = colorHardnessDefault;
				if (isHardnessDataColored)
				{
					hardnessColor = PowdercloudSvgSnowprofile.prototype.getHardnessColor(layer.snowHardness);
				}
				var hardnessX = PowdercloudSvgSnowprofile.prototype.getHardnessXCoord(hardnessBox, layer.snowHardness);
				if (hardnessX != null)
				{
					PowdercloudSvg.addSvgRect(svg, hardnessX, tempY, hardnessDataBox.point_le.x - hardnessX, layerScreenHeight, hardnessColor, strokeWidthHardness, strokeOpacityHardness, strokeDashArrayHardness, hardnessColor, fillOpacityHardness);
				}

				// Increase tempY
				tempY += layerScreenHeight;
			}
		}


		// 2. Draw Temperature Data
		if (isShowTemp) {

			if (isShowSurfaceAndAirTemperature)
			{

				// Draw surface temperature point
				if (snowprofile.surfaceTemperature != null && snowprofile.surfaceTemperature != "")
				{
					var surfaceTemperatureX = PowdercloudSvgSnowprofile.prototype.getTemperatureXCoord(temperatureBox, snowprofile.surfaceTemperature);
					var surfaceTemperatureY = temperatureBox.point_uw.y;
					if (surfaceTemperatureX != null)
					{
						PowdercloudSvg.addSvgCircle(svg, surfaceTemperatureX, surfaceTemperatureY, temperaturePointRadius, colorSurfaceTemp, 0, 0, "none", colorSurfaceTemp, temperaturePointFillOpacity);
					}
				}

				// Draw air temperature point
				if (snowprofile.airTemperature != null && snowprofile.airTemperature != "")
				{
					var airTemperatureX = PowdercloudSvgSnowprofile.prototype.getTemperatureXCoord(temperatureBox, snowprofile.airTemperature);
					var airTemperatureY = temperatureBox.point_uw.y - ((temperatureBox.point_uw.y - hardnessBox.point_uw.y) / 2);
					if (airTemperatureX != null)
					{
						PowdercloudSvg.addSvgCircle(svg, airTemperatureX, airTemperatureY, temperaturePointRadius, colorAirTemp, 0, 0, "none", colorAirTemp, temperaturePointFillOpacity);
					}
				}

				// Draw surface to air line
				if (snowprofile.surfaceTemperature != null && snowprofile.surfaceTemperature != "" && snowprofile.airTemperature != null && snowprofile.airTemperature != "")
				{
					var surfaceTemperatureX = PowdercloudSvgSnowprofile.prototype.getTemperatureXCoord(temperatureBox, snowprofile.surfaceTemperature);
					var surfaceTemperatureY = temperatureBox.point_uw.y;
					var airTemperatureX = PowdercloudSvgSnowprofile.prototype.getTemperatureXCoord(temperatureBox, snowprofile.airTemperature);
					var airTemperatureY = temperatureBox.point_uw.y - ((temperatureBox.point_uw.y - hardnessBox.point_uw.y) / 2);

					PowdercloudSvg.addSvgLine(svg, surfaceTemperatureX, surfaceTemperatureY, airTemperatureX, airTemperatureY, colorAirTemp, strokeWidthTemperatureLine, strokeOpacityTemperatureLine, strokeDashArrayAirTemperatureLine);
				}
			}

			// Draw Temperature point and line
			if (snowprofile.temperatureLayers != null)
			{
				var previousX = null;
				var previousY = null;
				// First point is surfaceTemperature
				if (snowprofile.surfaceTemperature != null)
				{
					previousX = PowdercloudSvgSnowprofile.prototype.getTemperatureXCoord(temperatureBox, snowprofile.surfaceTemperature);
					previousY = temperatureBox.point_uw.y;
				}

				for (i=0;i<snowprofile.temperatureLayers.length;i++)
				{
					var temperatureLayer = snowprofile.temperatureLayers[i];
					if (temperatureLayer != null && temperatureLayer.height != null && temperatureLayer.temperature != null)
					{

						var temperaturePointX = PowdercloudSvgSnowprofile.prototype.getTemperatureXCoord(temperatureBox, temperatureLayer.temperature);
						var temperaturePointY = PowdercloudSvgSnowprofile.prototype.getTemperatureYCoord(temperatureBox, expansionTotalHeight, minLayerHeight, maxLayerHeight, temperatureLayer.height, snowprofile.isLayersDescendingTopDown);

						// Draw Temperature Point
						PowdercloudSvg.addSvgCircle(svg, temperaturePointX, temperaturePointY, temperaturePointRadius, colorTemp, 0, 0, "none", colorTemp, temperaturePointFillOpacity);

						// Draw Temperature Line
						if (previousX != null && previousY != null)
						{
							PowdercloudSvg.addSvgLine(svg, previousX, previousY, temperaturePointX, temperaturePointY, colorTemp, strokeWidthTemperatureLine, strokeOpacityTemperatureLine, strokeDashArrayTemperatureLine);
						}

						previousX = temperaturePointX;
						previousY = temperaturePointY;
					}
				}
			}
		}


		// 3. Draw Layer Properties Data
		if (propTableType != TABLE_TYPE_NONE)
		{

			var tempY = propertiesDataBox.point_uw.y;
			var previousExpansion = 0;
			var isPreviousExpansionOccured = false;
			var noExpansionContractionTempY = propertiesDataBox.point_uw.y;

			var tmpPropTableWeights = null;
			var tmpPropTableColumns = null;
			var tmpPropTableGlyphNames = null;
			var tmpPropTableTextAlign = null;
			var tmpPropTableMaxChars = null;
			var tmpSecondLastEndColumnIndex = 0;
			if (propTableType == TABLE_TYPE_BASIC)
			{
				tmpPropTableWeights = prop_table_basic_column_weights;
				tmpPropTableColumns = prop_table_basic_columns;
				tmpPropTableGlyphNames = prop_table_basic_column_glyphName;
				tmpPropTableTextAlign = prop_table_basic_column_text_align;
				tmpPropTableMaxChars = prop_table_basic_column_max_chars;
				tmpSecondLastEndColumnIndex = prop_table_basic_columns.length - 2;
			}
			else if (propTableType == TABLE_TYPE_COMMENTS)
			{
				tmpPropTableWeights = prop_table_comments_column_weights;
				tmpPropTableColumns = prop_table_comments_columns;
				tmpPropTableGlyphNames = prop_table_comments_column_glyphName;
				tmpPropTableTextAlign = prop_table_comments_column_text_align;
				tmpPropTableMaxChars = prop_table_comments_column_max_chars;
				tmpSecondLastEndColumnIndex = prop_table_comments_columns.length - 1;
			}
			else if (propTableType == TABLE_TYPE_FLAGS)
			{
				tmpPropTableWeights = prop_table_flags_column_weights;
				tmpPropTableColumns = prop_table_flags_columns;
				tmpPropTableGlyphNames = prop_table_flags_column_glyphName;
				tmpPropTableTextAlign = prop_table_flags_column_text_align;
				tmpPropTableMaxChars = prop_table_flags_column_max_chars;
				tmpSecondLastEndColumnIndex = prop_table_flags_columns.length - 2;
			}
			var expansionColumnEastXCoord = PowdercloudSvgSnowprofile.prototype.getPropertiesColumnEastXCoordByIndex(propertiesDataBox, tmpPropTableWeights, tmpPropTableColumns, 0);
			var secondLastColumnEastXCoord = PowdercloudSvgSnowprofile.prototype.getPropertiesColumnEastXCoordByIndex(propertiesDataBox, tmpPropTableWeights, tmpPropTableColumns, tmpSecondLastEndColumnIndex);

			var layerPrevious;
			var layerFlagCountPrevious = 0;

			for (i=0;i<snowprofile.snowLayers.length;i++)
			{
				var layer = snowprofile.snowLayers[i];
				if (layer != null && layer.heightStart != null && layer.heightEnd != null)
				{

					var layerFlagCount = 0;

					var layerHeight = Math.abs(layer.heightEnd - layer.heightStart);
					var layerScreenHeight = PowdercloudSvgSnowprofile.prototype.getLayerScreenHeight(propertiesDataBox, expansionTotalHeight, layerHeight, minLayerHeight, maxLayerHeight);
					var expansionThisLayer = 0;
					var contractionThisLayer = 0;
					if (layerScreenHeight < MIN_LAYER_HEIGHT) {
						// This layer needs expansion
						expansionThisLayer = (MIN_LAYER_HEIGHT - layerScreenHeight);
						previousExpansion += expansionThisLayer;
					}
					else
					{
						if (previousExpansion > 0)
						{
							if ((layerScreenHeight - previousExpansion) > MIN_LAYER_HEIGHT)
							{
								// This layer can handle all previous expansion
								contractionThisLayer = previousExpansion;
								previousExpansion -= contractionThisLayer;
							}
							else
							{
								// This layer takes what previous expansion it can, puts rest back into previousExpansion
								contractionThisLayer = previousExpansion - layerScreenHeight - MIN_LAYER_HEIGHT;
								previousExpansion -= contractionThisLayer;
							}
						}
					}

					if (tmpPropTableWeights != null && tmpPropTableColumns != null && tmpPropTableGlyphNames != null && tmpPropTableTextAlign != null && tmpPropTableMaxChars != null)
					{

						var middleY = tempY + ((layerScreenHeight + expansionThisLayer - contractionThisLayer) / 2);

						// Draw layer lines
						PowdercloudSvg.addSvgLine(svg, expansionColumnEastXCoord, tempY, secondLastColumnEastXCoord, tempY, colorHardnessLayerLine, strokeWidthHardnessLayerLine, strokeOpacityHardnessLayerLine, strokeDashArrayHardnessLayerLine);
						PowdercloudSvg.addSvgLine(svg, expansionColumnEastXCoord, tempY + layerScreenHeight + expansionThisLayer - contractionThisLayer, secondLastColumnEastXCoord, tempY + layerScreenHeight + expansionThisLayer - contractionThisLayer, colorHardnessLayerLine, strokeWidthHardnessLayerLine, strokeOpacityHardnessLayerLine, strokeDashArrayHardnessLayerLine);

						if (!isPreviousExpansionOccured)
						{
							PowdercloudSvg.addSvgLine(svg, propertiesDataBox.point_uw.x, tempY, expansionColumnEastXCoord, tempY, colorHardnessLayerLine, strokeWidthHardnessLayerLine, strokeOpacityHardnessLayerLine, strokeDashArrayHardnessLayerLine);
						}

						// Expansion Angled Line
						if (expansionThisLayer > 0)
						{
							PowdercloudSvg.addSvgLine(svg, propertiesDataBox.point_uw.x, noExpansionContractionTempY + layerScreenHeight, expansionColumnEastXCoord, tempY + layerScreenHeight + expansionThisLayer, colorHardnessLayerLine, strokeWidthHardnessLayerLine, strokeOpacityHardnessLayerLine, strokeDashArrayHardnessLayerLine);
						}
						else
						{
							PowdercloudSvg.addSvgLine(svg, propertiesDataBox.point_uw.x, tempY + layerScreenHeight + expansionThisLayer - contractionThisLayer, expansionColumnEastXCoord, tempY + layerScreenHeight + expansionThisLayer - contractionThisLayer, colorHardnessLayerLine, strokeWidthHardnessLayerLine, strokeOpacityHardnessLayerLine, strokeDashArrayHardnessLayerLine);
						}

						// set isPreviousExpansionOccured
						if (expansionThisLayer > 0)
						{
							isPreviousExpansionOccured = true;
						}
						else
						{
							isPreviousExpansionOccured = false;
						}

						// Draw values
						var totalColumnWeight = 0;
						for (k=0;k<tmpPropTableWeights.length;k++)
						{
							totalColumnWeight += tmpPropTableWeights[k];
						}

						var previousXCoord = propertiesDataBox.point_uw.x;
						for (j=0;j<tmpPropTableColumns.length;j++)
						{

							// Get column property
							var columnProperty = tmpPropTableColumns[j];
							var columnPropertyValue = null;
							var columnPropertyValue1 = null; // Used only if there is a range (like grain form 1 and grain form 2)
							var columnPropertyValue2 = null; // Used only if there is a range (like grain form 1 and grain form 2)

							var glyphName = tmpPropTableGlyphNames[j];
							var snowSymbolAttributes = null;
							var snowSymbolAttributes1 = null; // Used only if there is a range (like grain form 1 and grain form 2)
							var snowSymbolAttributes2 = null; // Used only if there is a range (like grain form 1 and grain form 2)

							var isFlag = false;
							var isRange = false;

							// For property ranges (like grain form 1 and grain form 2)
							if (columnProperty != null && columnProperty.indexOf("|") >= 0)
							{
								isRange = true;
								var pipeIndex = columnProperty.indexOf("|");
								var columnProperty1 = tmpPropTableColumns[j].substring(0,pipeIndex);

								var columnProperty2 = tmpPropTableColumns[j].substring(pipeIndex+1);
								if(columnProperty1.indexOf("+") >= 0){
									var columnPropertyValue1 = layer[columnProperty1.split('+')[0]]; // Could be undefined if not matched
									if(layer[columnProperty1.split('+')[1]] != null){
										columnPropertyValue1 += ' '+layer[columnProperty1.split('+')[1]];
									}
								}	else{
									var columnPropertyValue1 = layer[columnProperty1]; // Could be undefined if not matched
								}
								if(columnProperty2.indexOf("+") >= 0){
									var columnPropertyValue2 = layer[columnProperty2.split('+')[0]]; // Could be undefined if not matched
									if(layer[columnProperty2.split('+')[1]] != null){
										columnPropertyValue2 += ' '+layer[columnProperty2.split('+')[1]];
									}
								}	else {
									var columnPropertyValue2 = layer[columnProperty2]; // Could be undefined if not matched
								}


								if (glyphName != null)
								{
									snowSymbolAttributes1 = PowdercloudSvgSnowprofile.prototype.getSnowSymbolAttributes(columnPropertyValue1);
									snowSymbolAttributes2 = PowdercloudSvgSnowprofile.prototype.getSnowSymbolAttributes(columnPropertyValue2);
								}
							}
							else if (columnProperty != null && columnProperty.indexOf(IS_FLAG) >= 0)
							{
								isFlag = true;
							}
							else
							{
								// singular
								columnPropertyValue = layer[columnProperty]; // Could be undefined if not matched
								if (glyphName != null)
								{
									snowSymbolAttributes = PowdercloudSvgSnowprofile.prototype.getSnowSymbolAttributes(columnPropertyValue);
								}
							}

							var propertiesColumnEastLineXCoord = PowdercloudSvgSnowprofile.prototype.getPropertiesColumnXCoord(propertiesDataBox, totalColumnWeight, tmpPropTableWeights[j], previousXCoord);
							if (propertiesColumnEastLineXCoord != null)
							{

								// Draw Data

								// center X
								var propertiesColumnCenterX = previousXCoord + ((propertiesColumnEastLineXCoord - previousXCoord) / 2);

								// Range
								if (isRange)
								{

									var firstElementCenterX = previousXCoord + ((propertiesColumnCenterX - previousXCoord) / 2);
									var secondElementCenterX = propertiesColumnCenterX + ((propertiesColumnEastLineXCoord - propertiesColumnCenterX) / 2);
									// Draw First
									if (columnPropertyValue1 != undefined && columnPropertyValue1 != null)
									{
										if (glyphName != null && snowSymbolAttributes1 != null && PowdercloudSvg.isSvgFontSupported())
										{
											PowdercloudSvg.addSvgText(svg, firstElementCenterX, middleY, snowSymbolAttributes1.unicode, glyphName, FONT_SIZE_GLYPH_DEFAULT, snowSymbolAttributes1.color, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);
										}
										else
										{
											PowdercloudSvg.addSvgText(svg, firstElementCenterX, middleY, "" + columnPropertyValue1, FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);
										}
									}

									// Draw Separator
									PowdercloudSvg.addSvgText(svg, propertiesColumnCenterX, middleY, LAYER_PROPERTY_RANGE_SEPERATOR, FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);
									// Draw Second
									if (columnPropertyValue2 != undefined && columnPropertyValue2 != null)
									{
										if (glyphName != null && snowSymbolAttributes2 != null && PowdercloudSvg.isSvgFontSupported())
										{
											PowdercloudSvg.addSvgText(svg, secondElementCenterX, middleY, snowSymbolAttributes2.unicode, glyphName, FONT_SIZE_GLYPH_DEFAULT, snowSymbolAttributes2.color, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);
										}
										else {
											PowdercloudSvg.addSvgText(svg, secondElementCenterX, middleY, "" + columnPropertyValue2, FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);
										}
									}

								// Flag
								}
								else if (isFlag)
								{

									if (preferences != null)
									{

										// ASSUMPTION: all preferences values are valid
										// TODO: possibly validate preferences

										// A. AvgGrainSize
										if (columnProperty == IS_FLAG + "AGS" && (layer.crystalSize01 != null || layer.crystalSize02 != null) && preferences.averageGrainSizeFlagValue != null && preferences.flagHexColor != null)
										{
											var avgGrainSize = PowdercloudSvgSnowprofile.prototype.calculateAverageGrainSize(layer.crystalSize01, layer.crystalSize02);
											if (avgGrainSize > preferences.averageGrainSizeFlagValue)
											{
												PowdercloudSvgSnowprofile.prototype.drawFlag(svg, propertiesColumnCenterX, middleY, preferences.flagHexColor);
												layerFlagCount++;
											}
										}

										// B. Hardness
										if (columnProperty == IS_FLAG + "Hrd" && layer.snowHardness != null && preferences.snowHardnessCode != null && preferences.flagHexColor != null)
										{

											var hardnessNumber = PowdercloudSvgSnowprofile.prototype.calculateHardnessNumber( layer.snowHardness );
											var hardnessFlagValueNumber = PowdercloudSvgSnowprofile.prototype.calculateHardnessNumber( preferences.snowHardnessCode );
											if( hardnessNumber != null && hardnessFlagValueNumber != null )
											{
												if( hardnessNumber < hardnessFlagValueNumber )
												{
													PowdercloudSvgSnowprofile.prototype.drawFlag(svg, propertiesColumnCenterX, middleY, preferences.flagHexColor);
													layerFlagCount++;
												}
											}
										}

										// C. Grain Types
										if (columnProperty == IS_FLAG + "GT" && (layer.snowForm01 != null || layer.snowForm02 != null) && preferences.snowFormCodes != null && preferences.snowFormCodes.length > 0 && preferences.flagHexColor != null)
										{
											var snowFormCodeFound = false;
											for (sfc=0;sfc<preferences.snowFormCodes.length;sfc++)
											{
												if (preferences.snowFormCodes[sfc] != null)
												{
													if (layer.snowForm01 != null && layer.snowForm01.toUpperCase() == preferences.snowFormCodes[sfc].toUpperCase())
													{
														snowFormCodeFound = true;
														break;
													}
													if (layer.snowForm02 != null && layer.snowForm02.toUpperCase() == preferences.snowFormCodes[sfc].toUpperCase())
													{
														snowFormCodeFound = true;
														break;
													}
												}
											}

											if( snowFormCodeFound == true )
											{
												PowdercloudSvgSnowprofile.prototype.drawFlag(svg, propertiesColumnCenterX, middleY, preferences.flagHexColor);
												layerFlagCount++;
											}
										}

										// D. Interface between adjacent layers
										if (layerPrevious != null) {

											var interfaceFlagCount = 0;
											var flagDiffGrainSize = false;
											var flagHardness = false;
											var flagDepthInterface = false;

											// NOTE: first calculate if the interface flag exists and increase interfaceFlagCount, then use these values to determine if the interface flag is drawn.

											// D1. Difference Average Grain Size
											if ((layer.crystalSize01 != null || layer.crystalSize02 != null) && (layerPrevious.crystalSize01 != null || layerPrevious.crystalSize02 != null) && preferences.differenceAverageGrainSizeFlagValue != null)
											{

												var grainSizeLayer1 = PowdercloudSvgSnowprofile.prototype.calculateAverageGrainSize(layer.crystalSize01, layer.crystalSize02);
												var grainSizeLayer2 = PowdercloudSvgSnowprofile.prototype.calculateAverageGrainSize(layerPrevious.crystalSize01, layerPrevious.crystalSize02);
												var tmpFlagDiffGrainSize = false;
												if ( grainSizeLayer1 > grainSizeLayer2 )
												{
													var diff = grainSizeLayer1 - grainSizeLayer2;
													if( diff > preferences.differenceAverageGrainSizeFlagValue )
													{
														tmpFlagDiffGrainSize = true;
													}
												}
												else
												{
													var diff = grainSizeLayer2 - grainSizeLayer1;
													if( diff > preferences.differenceAverageGrainSizeFlagValue )
													{
														tmpFlagDiffGrainSize = true;
													}
												}

												if (tmpFlagDiffGrainSize == true)
												{
													flagDiffGrainSize = true;
													interfaceFlagCount++;
												}
											}

											// D2. Difference Hardness
											if (layer.snowHardness != null && layerPrevious.snowHardness != null && preferences.differenceHardnessFlagValue != null)
											{

												var hardnessLayer1 = PowdercloudSvgSnowprofile.prototype.calculateHardnessNumber( layer.snowHardness );
												var hardnessLayer2 = PowdercloudSvgSnowprofile.prototype.calculateHardnessNumber( layerPrevious.snowHardness );
												var tmpFlagHardness = false;
												if ( hardnessLayer1 > hardnessLayer2 )
												{
													var diff = hardnessLayer1 - hardnessLayer2;
													if( diff > preferences.differenceHardnessFlagValue )
													{
														tmpFlagHardness = true;
													}
												}
												else
												{
													var diff = hardnessLayer2 - hardnessLayer1;
													if( diff > preferences.differenceHardnessFlagValue )
													{
														tmpFlagHardness = true;
													}
												}

												if (tmpFlagHardness == true)
												{
													flagHardness = true;
													interfaceFlagCount++;
												}
											}

											// D3. Depth Interface
											if (preferences.depthOfInterfaceStart != null && preferences.depthOfInterfaceEnd != null)
											{
												var depthInterface = layer.heightStart;
												if( preferences.depthOfInterfaceStart < preferences.depthOfInterfaceEnd )
												{
													if( depthInterface > preferences.depthOfInterfaceStart && depthInterface < preferences.depthOfInterfaceEnd )
													{
														flagDepthInterface = true;
														interfaceFlagCount++;
													}
												}
											}

											// D4. Interface Flag count is (the greater layerFlagCount of the two layers) + interfaceFlagCount
											var greater = layerFlagCount;
											if( layerFlagCountPrevious > layerFlagCount )
											{
												greater = layerFlagCountPrevious;
											}
											interfaceFlagCount += greater;

											// Draw flag count
											if (columnProperty == IS_FLAG + "Cnt")
											{
												PowdercloudSvg.addSvgText(svg, propertiesColumnCenterX, tempY + 4, "" + interfaceFlagCount, FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);
											}

											if (preferences.highlightInterfaceCount != null)
											{
												// Determine flag color
												var flagFillColour = preferences.flagHexColor;
												if( interfaceFlagCount >= preferences.highlightInterfaceCount )
												{
													flagFillColour = preferences.potentialFailureHexColor;
												}

												// Draw interface flags
												if (columnProperty == IS_FLAG + "DGS" && flagDiffGrainSize)
												{
													PowdercloudSvgSnowprofile.prototype.drawFlag(svg, propertiesColumnCenterX, tempY, flagFillColour);
												}

												if (columnProperty == IS_FLAG + "DH" && flagHardness)
												{
													PowdercloudSvgSnowprofile.prototype.drawFlag(svg, propertiesColumnCenterX, tempY, flagFillColour);
												}

												if (columnProperty == IS_FLAG + "DI" && flagDepthInterface)
												{
													PowdercloudSvgSnowprofile.prototype.drawFlag(svg, propertiesColumnCenterX, tempY, flagFillColour);
												}

											}
										}
									}

								// Single
								}
								else
								{
									if (columnPropertyValue != undefined && columnPropertyValue != null)
									{

										var propertiesColumnTextXCoord = propertiesColumnCenterX;

										// Text Align
										var propertiesColumnTextAlign = TEXT_ANCHOR_MIDDLE;
										var tmpPropertiesColumnTextAlign = tmpPropTableTextAlign[j];
										if (tmpPropertiesColumnTextAlign != null && tmpPropertiesColumnTextAlign != undefined)
										{
											propertiesColumnTextAlign = tmpPropertiesColumnTextAlign;
										}

										if (propertiesColumnTextAlign == TEXT_ANCHOR_START)
										{
											propertiesColumnTextXCoord = previousXCoord;
										}

										if (propertiesColumnTextAlign == TEXT_ANCHOR_END)
										{
											propertiesColumnTextXCoord = propertiesColumnEastLineXCoord;
										}

										// Max chars
										var maxChars = tmpPropTableMaxChars[j];
										if (maxChars != null)
										{
											var str = "" + columnPropertyValue;
											if (str.length > maxChars) {
												var concatStr = str.substr(0, maxChars) + MAX_CHARS_SUFFIX;
												columnPropertyValue = concatStr;
											}
										}

										if (glyphName != null && snowSymbolAttributes != null && PowdercloudSvg.isSvgFontSupported())
										{
											PowdercloudSvg.addSvgText(svg, propertiesColumnTextXCoord, middleY, snowSymbolAttributes.unicode, glyphName, FONT_SIZE_GLYPH_DEFAULT, snowSymbolAttributes.color, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, propertiesColumnTextAlign);
										}
										else
										{
											PowdercloudSvg.addSvgText(svg, propertiesColumnTextXCoord, middleY, "" + columnPropertyValue, FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, propertiesColumnTextAlign);
										}
									}
								}

								// Set previousXCoord
								previousXCoord = propertiesColumnEastLineXCoord;
							}
						}
					}

					// Increase tempY
					tempY += layerScreenHeight + expansionThisLayer - contractionThisLayer;
					noExpansionContractionTempY += layerScreenHeight;
				}

				layerPrevious = layer;
				layerFlagCountPrevious = layerFlagCount;
			}


			// 3b. Special Case 1 : Shears (Only for TABLE_TYPE_BASIC)
			if (snowprofile.shears != null && propTableType == TABLE_TYPE_BASIC)
			{

				// 4a. Calculate shearScreenX (assume that shear column is Last)
				var secondLastColumnEastXCoord = PowdercloudSvgSnowprofile.prototype.getPropertiesColumnEastXCoordByIndex(propertiesDataBox, prop_table_basic_column_weights, prop_table_basic_columns, prop_table_basic_columns.length - 2);
				var shearScreenX = secondLastColumnEastXCoord;

				// 4b. Draw shears
				for (s=0;s<snowprofile.shears.length;s++)
				{
					var shear = snowprofile.shears[s];

					if (shear != null && shear.height != null)
					{

						var shearComment = null;
						shearComment = PowdercloudSvgSnowprofile.prototype.constructShearComment(shear, snowprofile.isLayersDescendingTopDown);
						if (shearComment != null)
						{

							var shearScreenY = PowdercloudSvgSnowprofile.prototype.getShearYCoord(propertiesDataBox, expansionTotalHeight, minLayerHeight, maxLayerHeight, shear.height, snowprofile.isLayersDescendingTopDown);

							// Draw shear arrow
							PowdercloudSvg.addSvgPath3Point(svg, PowdercloudSvg.createPoint(shearScreenX + shearArrowLength, shearScreenY), PowdercloudSvg.createPoint(shearScreenX + shearArrowLength, shearScreenY - FONT_SIZE_DEFAULT_PIXEL_HEIGHT), PowdercloudSvg.createPoint(shearScreenX, shearScreenY - (FONT_SIZE_DEFAULT_PIXEL_HEIGHT/2)), shearArrowColor, 0, shearArrowColor, shearArrowFillOpacity);

							// Draw shear comment
							PowdercloudSvg.addSvgText(svg, shearScreenX + shearArrowLength + shearCommentAndArrowBuffer, shearScreenY, shearComment, FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_START);
						}
					}
				}
			}
		}
	}
}


/******* Helper Functions - Start *********/

/**
 * X Coord for Properties Column "East Line"
 */
PowdercloudSvgSnowprofile.prototype.getPropertiesColumnXCoord = function(propertiesDataBox, totalColumnWeight, columnWeight, previousColumnXCoord)
{

	if (propertiesDataBox != null && totalColumnWeight != null && columnWeight != null && previousColumnXCoord != null)
	{
		return previousColumnXCoord + ((propertiesDataBox.width) * (columnWeight) / (totalColumnWeight))
	}

	return null;
}


/**
 * Gets the property column's east X Coord.

 * @param propertiesDataBox
 * @param column_weights The column weights Array.
 * @param columns The column Array.
 * @param columnIndex The column index.
 * @return The east x coord of the column.
 */
PowdercloudSvgSnowprofile.prototype.getPropertiesColumnEastXCoordByIndex = function(propertiesDataBox, column_weights, columns, columnIndex) {
	var tempEastXCoord = 0;

	if (propertiesDataBox != null && column_weights != null && columns != null && columnIndex != null)
	{

		var totalColumnWeight = 0;
		for (i=0;i<column_weights.length;i++)
		{
			totalColumnWeight += column_weights[i];
		}
		var previousXCoord = propertiesDataBox.point_uw.x;

		for (i=0;i<columns.length;i++)
		{

			var propertiesColumnEastLineXCoord = PowdercloudSvgSnowprofile.prototype.getPropertiesColumnXCoord(propertiesDataBox, totalColumnWeight, column_weights[i], previousXCoord);
			// Get 'East X Coord' of second-to-last column
			if (propertiesColumnEastLineXCoord != null)
			{

				if (i == columnIndex)
				{
					tempEastXCoord = propertiesColumnEastLineXCoord;
					break;
				}

				// Set previousXCoord
				previousXCoord = propertiesColumnEastLineXCoord;
			}
		}
	}

	return tempEastXCoord;
}


PowdercloudSvgSnowprofile.prototype.getHardnessXCoord = function(hardnessBox, hardnessCode)
{
	var maxHardnessResistance = hardness_resistance_values[0];

	for (h=0;h<hardness_codes_full.length;h++)
	{
		if (hardnessCode == hardness_codes_full[h])
		{
			return hardnessBox.point_uw.x + ((maxHardnessResistance - hardness_resistance_values[h]) * (hardnessBox.width / maxHardnessResistance));
		}
	}

	return null;
}


PowdercloudSvgSnowprofile.prototype.getHardnessColor = function(hardnessCode)
{

	for (h=0;h<hardness_codes_full.length;h++)
	{
		if (hardnessCode == hardness_codes_full[h])
		{
			return hardness_colors[h];
		}
	}

	return colorHardnessDefault;
}


PowdercloudSvgSnowprofile.prototype.getTemperatureXCoord = function(temperatureBox, temperature)
{
	if (temperatureBox != null && temperature != null)
	{
		var screenTemperatureXValue = (temperatureBox.width) * (Math.abs(temperature)) / (Math.abs(temperatureMax - temperatureMin));
		return temperatureBox.point_le.x - screenTemperatureXValue;
	}

	return null;
}


PowdercloudSvgSnowprofile.prototype.getTemperatureYCoord = function(temperatureBox, expansionTotalHeight, minLayerHeight, maxLayerHeight, temperatureLayerHeight, isLayersDescendingTopDown)
{
	if (temperatureBox != null && expansionTotalHeight != null && minLayerHeight != null && maxLayerHeight != null && temperatureLayerHeight != null && isLayersDescendingTopDown != null)
	{
		if (isLayersDescendingTopDown)
		{
			return temperatureBox.point_le.y - expansionTotalHeight - ((temperatureBox.height - expansionTotalHeight) * temperatureLayerHeight /  Math.abs(maxLayerHeight - minLayerHeight));
		}
		else
		{
			return temperatureBox.point_uw.y + ((temperatureBox.height - expansionTotalHeight) * temperatureLayerHeight /  Math.abs(maxLayerHeight - minLayerHeight));
		}

	}

	return null;
}


PowdercloudSvgSnowprofile.prototype.getShearYCoord = function(propertiesDataBox, expansionTotalHeight, minLayerHeight, maxLayerHeight, shearHeight, isLayersDescendingTopDown)
{
	if (propertiesDataBox != null && expansionTotalHeight != null && minLayerHeight != null && maxLayerHeight != null && shearHeight != null && isLayersDescendingTopDown != null)
	{
		if (isLayersDescendingTopDown)
		{
			return propertiesDataBox.point_le.y - expansionTotalHeight - PowdercloudSvgSnowprofile.prototype.getLayerScreenHeight(propertiesDataBox, expansionTotalHeight, shearHeight, minLayerHeight, maxLayerHeight);
		}
		else
		{
			return propertiesDataBox.point_uw.y + PowdercloudSvgSnowprofile.prototype.getLayerScreenHeight(propertiesDataBox, expansionTotalHeight, shearHeight, minLayerHeight, maxLayerHeight);
		}
	}
}


PowdercloudSvgSnowprofile.prototype.getLayerScreenHeight = function(box, expansionTotalHeight, layerHeight, minLayerHeight, maxLayerHeight)
{
	if (box != null && expansionTotalHeight != null && layerHeight != null && minLayerHeight != null && maxLayerHeight != null)
	{
		return (box.height - expansionTotalHeight) * (layerHeight) / (maxLayerHeight - minLayerHeight);
	}
	else
	{
		return 0;
	}
}


/**
 * Returns the shear comment. May return null.
 */
PowdercloudSvgSnowprofile.prototype.constructShearComment = function(shear, isLayersDescendingTopDown)
{
	var shearComment = null;
	if (shear != null)
	{
		shearComment = "";

		if(shear.snowpacktest_type_code){
			shearComment += shear.snowpacktest_type_code;
		}

		if(shear.snowpacktest_type_minor_code){
			shearComment += '('+shear.snowpacktest_type_minor_code+')';
		}

		if (shear.hits != null)
		{
			shearComment += "@" + shear.hits;
		}

		if (shear.fracture_character_code)
		{
			shearComment += "(" + shear.fracture_character_code + ")";
		}

		if (shear.fracture_character_minor_code)
		{
			shearComment += "(" + shear.fracture_character_minor_code + ")";
		}


		if (shear.height)
		{

			if (isLayersDescendingTopDown)
			{
				shearComment += " up";
			}
			else
			{
				shearComment += " down";
			}

			shearComment += " " + shear.height;
		}

	}

	return shearComment;
}


/**
 * Draws a flag.
 */
PowdercloudSvgSnowprofile.prototype.drawFlag = function(svg, centerX, middleY, flagHexColor)
{

	if( centerX != null && middleY != null )
	{

		// Create polygon points for the flag
		var x = centerX - 7.5;
		var y = middleY;
		var point1 = PowdercloudSvg.createPoint(x, y);
		x = x + 15;
		y = y + 5;
		var point2 = PowdercloudSvg.createPoint(x, y);
		y = y - 10;
		var point3 = PowdercloudSvg.createPoint(x, y);

		// Draw Flag
		PowdercloudSvg.addSvgPath3Point(svg, point1, point2, point3, FLAG_PATH_STROKE_DEFAULT, FLAG_PATH_STROKE_WIDTH_DEFAULT, flagHexColor, FLAG_PATH_FILL_OPACITY_DEFAULT);
	}
}


/**
 * Calculate the hardness number from a snowHardness code.
 */
PowdercloudSvgSnowprofile.prototype.calculateHardnessNumber = function(snowHardnessCode)
{

	if (snowHardnessCode != null)
	{

		var hcfIndex = -1;
		for (hcf=0;hcf<hardness_codes_full.length;hcf++)
		{
			if (snowHardnessCode.toUpperCase() == hardness_codes_full[hcf].toUpperCase())
			{
				hcfIndex = hcf;
				break;
			}
		}

		if (hcfIndex >= 0)
		{
			return hardness_resistance_values[hcfIndex];
		}
	}

	return null;
}


/**
 * Calculate the average grain size.
 */
PowdercloudSvgSnowprofile.prototype.calculateAverageGrainSize = function(grainSize1, grainSize2) {

	var avgGrainSize = 0;

	if (grainSize1 != null && grainSize2 != null)
	{
		avgGrainSize = (grainSize1 + grainSize2) / 2;
	}
	else if (grainSize1 != null && grainSize2 == null)
	{
		avgGrainSize = grainSize1;
	}
	else if (grainSize1 == null && grainSize2 != null)
	{
		avgGrainSize = grainSize2;
	}

	return avgGrainSize;
}


/**
 * Returns an object with two properties: color and unicode
 * Returns null if code is not found.
 */
PowdercloudSvgSnowprofile.prototype.getSnowSymbolAttributes = function(code)
{
	//console.info(code);
	if (code == null )
	{
		return null;
	}

	var attributes = new Object();

	attributes.color = "#000000"; // Black
	
	var codes = code.split(' '); //codes[0] is major and codes[1] may be minor if available
	// match against major first
	//console.info(codes);
	switch(codes[0]){
		case 'PP':
			attributes.unicode = "a";
			attributes.color = "#00FF00";    // Lime
			break;
		case 'MM':
			switch(codes[1]){
				case 'ci':
					attributes.unicode = "t";
					attributes.color = "#112233";    // Lime
					break;
			}
			break;
		case 'DF':
			attributes.unicode = "c";
			attributes.color = "#228B22";    // Forest Green	
			break;
		case 'RG':
			attributes.unicode = "d";
			attributes.color = "#FFB6C1";    // Light Pink
			break;
		case 'FC':
			attributes.unicode = "e";
			attributes.color = "#ADD8E6";    // Light Blue	
			break;
		case 'DH':
			attributes.unicode = "f";
			attributes.color = "#0000FF";    // Blue
			break;
		case 'WG':
			attributes.unicode = "h";
			// TODO: not sure what color "WG" should be
			break;
		case 'SH':
			attributes.unicode = "g";
			attributes.color = "#FF00FF";    // Fuchsia
			break;
		case 'IM':
			attributes.unicode = "i";
			// TODO: not sure what color "IM" should be, use "IF" color instead
			attributes.color = "#00FFFF";    // Cyan/Aqua
			break;
		case 'CR':
			// TODO: cannot find matching font, used "J" for now (which is 'SHcv')
			attributes.unicode = "J";
			// TODO: not sure what color "CR" should be
			break;
		case 'GR':
			attributes.unicode = "o";
			// TODO: not sure what color "GR" should be
			break;
		case 'MF':
			attributes.unicode = "O";
			attributes.color = "#FF0000";
			break;
		case 'F-':
		case 'F':
		case 'F+':
			attributes.unicode = ""; // Special case, "nothing" should be shown.
			break;
		case '4F-':
		case '4F':
		case '4F+':
			attributes.unicode = "2";
			break;
		case '1F-':
		case '1F':
		case '1F+':
			attributes.unicode = "3";
			break;
		case '1F-':
		case '1F':
		case '1F+':
			attributes.unicode = "3";
			break;
		case 'P-':
		case 'P':
		case 'P+':
			attributes.unicode = "4";
			break;
		case 'K-':
		case 'K':
		case 'K+':
			attributes.unicode = "5";
			break;
		case 'I-':
		case 'I':
		case 'I+':
			attributes.unicode = "i";
			break;
	};
	

	return attributes;
}

/**
 * Adds SnowSymbolsIACSSvg Font
 */
PowdercloudSvgSnowprofile.prototype.addSnowSymbolsIACSSvgFont = function(svg) {

	var defs = svg.defs('defs');
	var font = svg.other(defs, "font", {'id': GLYPH_SNOW_SYMBOLS_IACS_SVG, 'horiz-adv-x': "936"});
	var fontFace = svg.other(font, "font-face", {'font-family': GLYPH_SNOW_SYMBOLS_IACS_SVG, 'units-per-em': "1000", 'panose-1': "5 5 6 0 2 2 2 2 2 4", 'ascent': "770", 'descent': "-252", 'alphabetic': "0"});

	// PP
	svg.other(font, "glyph", {'unicode': "a", 'glyph-name': "a", 'horiz-adv-x': "1021", 'd': "M547 519V295H770V223H547V0H475V223H251V295H475V519H547Z"});
	// PPco
	svg.other(font, "glyph", {'unicode': "j", 'glyph-name': "j", 'horiz-adv-x': "1021", 'd': "M698 163V355H324V163H698ZM251 91V427H770V91H251Z"});
	//PPnd
	svg.other(font, "glyph", {'unicode': "k", 'glyph-name': "k", 'horiz-adv-x': "1021", 'd': "M709 468L899 279L709 89L659 140L762 243H259L362 140L312 89L122 279L312 468L362 416L261 315H760L659 416L709 468Z"});
	//PPpl
	svg.other(font, "glyph", {'unicode': "l", 'glyph-name': "l", 'horiz-adv-x': "1021", 'd': "M580 259Q580 230 560 211T510 191Q481 191 461 210T441 259Q441 288 461 309T510 330Q539 330 559 309T580 259ZM620 72Q648 121 672 164T727 259Q698 308 674 352T620 447H401Q387 422 374 399T348 354T322 308T294 259Q322 209 346 166T401 72H620ZM360 0L211 259L360 519H661L810 259L661 0H360Z"});
	//PPsd
	svg.other(font, "glyph", {'unicode': "m", 'glyph-name': "m", 'horiz-adv-x': "1021", 'd': "M753 357L583 259L753 161L717 98L547 196V0H475V196L304 98L268 161L438 259L268 357L304 420L475 321V519H547V322L717 420L753 357Z"});
	//PPir
	svg.other(font, "glyph", {'unicode': "n", 'glyph-name': "n", 'horiz-adv-x': "1021", 'd': "M162 14Q198 97 237 175Q253 208 271 243T309 313T347 379T386 436Q428 491 483 519T598 547Q656 547 710 519T804 434L860 350L799 311Q790 326 780 340Q772 352 762 366T744 393Q717 435 679 455T598 475Q556 475 515 454T443 393Q416 356 387 305H591V233H348Q323 187 302 143T264 64Q245 23 228 -14L162 14Z"});
	//PPgp
	svg.other(font, "glyph", {'unicode': "o", 'glyph-name': "o", 'horiz-adv-x': "1021", 'd': "M251 530H448L351 698L413 734L511 565V566L608 734L670 698L573 530H770V458H573L837 0H184L448 458H251V530ZM712 72L511 421L309 72H712Z"});
	//PPhl
	svg.other(font, "glyph", {'unicode': "p", 'glyph-name': "p", 'horiz-adv-x': "1021", 'd': "M184 0L511 566L837 0H184Z"});
	//PPip
	svg.other(font, "glyph", {'unicode': "q", 'glyph-name': "q", 'horiz-adv-x': "1021", 'd': "M184 0L511 566L837 0H184ZM712 72L511 421L309 72H712ZM581 187Q581 158 561 139T511 119Q482 119 462 138T442 187Q442 216 462 237T511 258Q540 258 560 237T581 187Z"});
	//PPrm
	svg.other(font, "glyph", {'unicode': "r", 'glyph-name': "r", 'horiz-adv-x': "1021", 'd': "M729 505L511 -48L292 505L359 532L418 383H603L662 532L729 505ZM511 149L575 311H446L511 149Z"});


	// MM
	svg.other(font, "glyph", {'unicode': "b", 'glyph-name': "b", 'horiz-adv-x': "1021", 'd': "M581 259Q581 288 561 308T511 329Q482 329 461 309T439 259Q439 230 460 209T511 188Q540 188 560 209T581 259ZM653 259Q653 229 642 203T612 158T566 127T511 116Q481 116 455 127T410 157T379 203T367 259Q367 288 378 314T409 359T455 390T511 401Q540 401 566 390T611 360T642 314T653 259ZM240 259Q240 315 261 364T319 450T405 508T511 530Q567 530 616 509T702 451T760 365T782 259Q782 203 761 154T703 68T617 10T511 -12Q455 -12 406 9T319 67T261 153T240 259ZM312 259Q312 218 327 182T370 119T433 77T511 61Q552 61 588 76T651 119T693 182T709 259Q709 300 694 336T651 400T588 442T511 458Q470 458 434 443T370 400T328 337T312 259Z"});
	//MMrp
	svg.other(font, "glyph", {'unicode': "s", 'glyph-name': "s", 'horiz-adv-x': "1021", 'd': "M581 259Q581 288 561 308T511 329Q482 329 461 309T439 259Q439 230 460 209T511 188Q540 188 560 209T581 259ZM653 259Q653 229 642 203T612 158T566 127T511 116Q481 116 455 127T410 157T379 203T367 259Q367 288 378 314T409 359T455 390T511 401Q540 401 566 390T611 360T642 314T653 259ZM240 259Q240 315 261 364T319 450T405 508T511 530Q567 530 616 509T702 451T760 365T782 259Q782 203 761 154T703 68T617 10T511 -12Q455 -12 406 9T319 67T261 153T240 259ZM312 259Q312 218 327 182T370 119T433 77T511 61Q552 61 588 76T651 119T693 182T709 259Q709 300 694 336T651 400T588 442T511 458Q470 458 434 443T370 400T328 337T312 259Z"});
	//MMci
	svg.other(font, "glyph", {'unicode': "t", 'glyph-name': "t", 'horiz-adv-x': "1021", 'd': "M191 52L731 570L781 518L706 446Q741 409 761 361T782 259Q782 203 761 154T703 68T617 10T511 -12Q454 -12 404 10T315 71L241 0L191 52ZM511 116Q480 116 454 127T408 159L368 121Q395 92 432 77T511 61Q552 61 588 76T651 119T693 182T709 259Q709 299 695 334T654 396L614 357Q632 337 642 313T653 259Q653 229 642 203T612 158T566 127T511 116ZM581 259Q581 273 576 285T561 307L460 209Q481 188 511 188Q540 188 560 209T581 259Z"});


	// DF
	svg.other(font, "glyph", {'unicode': "c", 'glyph-name': "c", 'horiz-adv-x': "1021", 'd': "M216 26L756 544L806 492L266 -26L216 26ZZ"});
	//DFdc
	svg.other(font, "glyph", {'unicode': "u", 'glyph-name': "u", 'horiz-adv-x': "1021", 'd': "M216 26L756 544L806 492L266 -26L216 26Z"});
	//DFbk
	svg.other(font, "glyph", {'unicode': "v", 'glyph-name': "v", 'horiz-adv-x': "1021", 'd': "M547 344Q576 371 609 404Q638 432 676 467T756 544L806 492Q764 451 726 416T659 352Q626 319 597 292L547 344ZM216 26Q245 53 278 86Q307 114 344 149T424 226L474 174Q432 133 395 98T328 34Q295 1 266 -26L216 26Z"});


	// RG
	svg.other(font, "glyph", {'unicode': "d", 'glyph-name': "d", 'horiz-adv-x': "1021", 'd': "M292 259Q292 304 309 344T356 414T426 461T511 478Q556 478 595 461T665 414T712 344T729 259Q729 214 712 175T665 105T596 58T511 41Q466 41 426 58T356 105T309 174T292 259Z"});
	// RGsr
	svg.other(font, "glyph", {'unicode': "w", 'glyph-name': "w", 'horiz-adv-x': "1021", 'd': "M603 259Q603 240 596 223T576 194T546 174T510 166Q491 166 474 173T445 193T425 223T417 259Q417 278 424 295T444 324T474 344T510 352Q529 352 546 345T576 325T596 295T603 259Z"});
	// RGlr
	svg.other(font, "glyph", {'unicode': "x", 'glyph-name': "x", 'horiz-adv-x': "1021", 'd': "M292 259Q292 304 309 344T356 414T426 461T511 478Q556 478 595 461T665 414T712 344T729 259Q729 214 712 175T665 105T596 58T511 41Q466 41 426 58T356 105T309 174T292 259Z"});
	// RGwp
	svg.other(font, "glyph", {'unicode': "y", 'glyph-name': "y", 'horiz-adv-x': "1021", 'd': "M292 259Q292 304 309 344T356 414T426 461T511 478Q548 478 581 467T641 434L756 544L806 492L691 382Q709 356 719 325T729 259Q729 214 712 175T665 105T596 58T511 41Q474 41 441 52T380 84L266 -26L216 26L330 136Q312 162 302 193T292 259Z"});
	// RGxf
	svg.other(font, "glyph", {'unicode': "z", 'glyph-name': "z", 'horiz-adv-x': "1021", 'd': "M292 519H729V207Q729 162 712 122T665 52T595 5T510 -12Q465 -12 426 5T356 52T309 122T292 207V519ZM510 354Q540 354 567 343T614 312T645 265T657 208V446H364V214Q365 243 377 268T408 313T454 343T510 354Z"});

	// FC
	svg.other(font, "glyph", {'unicode': "e", 'glyph-name': "e", 'horiz-adv-x': "1021", 'd': "M698 446H324V72H698V446ZM770 0H251V519H770V0Z"});
	// FCso
	svg.other(font, "glyph", {'unicode': "A", 'glyph-name': "A", 'horiz-adv-x': "1021", 'd': "M698 446H324V72H698V446ZM770 0H251V519H770V0Z"});
	//FCsf
	svg.other(font, "glyph", {'unicode': "B", 'glyph-name': "B", 'horiz-adv-x': "1021", 'd': "M770 0H251V519H770V0ZM698 396L374 72H698V396ZM324 123L647 446H324V123Z"});
	//FCxr
	svg.other(font, "glyph", {'unicode': "C", 'glyph-name': "C", 'horiz-adv-x': "1021", 'd': "M292 311Q292 356 309 396T356 466T426 513T511 530Q556 530 595 513T665 466T712 396T729 311V0H292V311ZM364 72H657V239H364V72ZM657 311Q657 341 646 368T614 415T568 446T511 458Q481 458 454 447T407 415T376 368T364 311H657Z"});


	// DH
	svg.other(font, "glyph", {'unicode': "f", 'glyph-name': "f", 'horiz-adv-x': "1021", 'd': "M195 18L511 566L826 18L764 -18L511 421L257 -18L195 18Z"});
	// DHcp
	svg.other(font, "glyph", {'unicode': "D", 'glyph-name': "D", 'horiz-adv-x': "1021", 'd': "M195 18L511 566L826 18L764 -18L511 421L257 -18L195 18Z"});
	// DHpr
	svg.other(font, "glyph", {'unicode': "E", 'glyph-name': "E", 'horiz-adv-x': "1021", 'd': "M208 61V458H813V61H741V386H280V61H208Z"});
	// DHch
	svg.other(font, "glyph", {'unicode': "F", 'glyph-name': "F", 'horiz-adv-x': "1021", 'd': "M428 18L586 291L511 421L257 -18L195 18L511 566L826 18L764 -18L627 219L490 -18L428 18Z"});
	// DHla
	svg.other(font, "glyph", {'unicode': "G", 'glyph-name': "G", 'horiz-adv-x': "1021", 'd': "M197 76L372 458H649L824 76L759 45L705 162H316Q302 133 289 104T263 45L197 76ZM349 234H672L603 386H418L349 234Z"});
	// DHxr
	svg.other(font, "glyph", {'unicode': "H", 'glyph-name': "H", 'horiz-adv-x': "1021", 'd': "M168 100L361 435Q389 483 428 506T511 530Q553 530 593 507T661 435L854 100L791 63L598 399V398Q581 428 558 443T511 458Q487 458 464 443T423 398V399L230 63L168 100Z"});


	// SH
	svg.other(font, "glyph", {'unicode': "g", 'glyph-name': "g", 'horiz-adv-x': "1021", 'd': "M826 500L511 -48L195 500L257 537L511 97L764 537L826 500Z"});
	// SHsu
	svg.other(font, "glyph", {'unicode': "I", 'glyph-name': "I", 'horiz-adv-x': "1021", 'd': "M826 500L511 -48L195 500L257 537L511 97L764 537L826 500Z"});
	// SHcv
	svg.other(font, "glyph", {'unicode': "J", 'glyph-name': "J", 'horiz-adv-x': "1021", 'd': "M511 97L656 349Q689 333 720 315L511 -48L302 315Q318 325 334 333T366 349L511 97ZM228 443Q289 485 360 507T511 530Q590 530 661 508T793 444L757 381Q704 417 642 437T511 458Q442 458 380 438T264 380L228 443Z"});
	// SHxr
	svg.other(font, "glyph", {'unicode': "K", 'glyph-name': "K", 'horiz-adv-x': "1021", 'd': "M854 419L661 83Q633 35 593 12T511 -12Q468 -12 429 11T361 83L168 419L230 455L423 120Q441 91 464 76T511 61Q534 61 557 76T598 120L791 455L854 419Z"});


	// MF
	svg.other(font, "glyph", {'unicode': "h", 'glyph-name': "h", 'horiz-adv-x': "1021", 'd': "M240 259Q240 315 261 364T319 450T405 508T511 530Q567 530 616 509T702 451T760 365T782 259Q782 203 761 154T703 68T617 10T511 -12Q455 -12 406 9T319 67T261 153T240 259ZM312 259Q312 218 327 182T370 119T433 77T511 61Q552 61 588 76T651 119T693 182T709 259Q709 300 694 336T651 400T588 442T511 458Q470 458 434 443T370 400T328 337T312 259Z"});
	// MFcl
	svg.other(font, "glyph", {'unicode': "L", 'glyph-name': "L", 'horiz-adv-x': "1021", 'd': "M673 150Q673 117 660 88T625 36T574 1T510 -12Q477 -12 448 1T396 36T362 87T349 150Q349 183 359 209Q330 213 305 227T262 263T234 311T223 369Q223 402 235 431T270 483T321 517T385 530Q423 530 455 514T510 470Q533 498 566 514T637 530Q671 530 700 518T752 483T786 432T799 369Q799 338 789 311T760 263T716 228T662 209Q673 181 673 150ZM546 365Q548 329 574 304T637 279Q675 279 701 305T727 369Q727 406 701 432T637 458Q600 458 574 433T546 372V369V365ZM601 150Q601 188 575 214T510 240Q473 240 447 214T421 150Q421 113 447 87T510 61Q548 61 574 87T601 150ZM474 369Q474 406 449 432T385 458Q366 458 350 451T321 432T302 404T295 369Q295 350 302 334T321 305T349 286T385 279Q423 279 448 305T474 369Z"});
	// MFpc
	svg.other(font, "glyph", {'unicode': "M", 'glyph-name': "M", 'horiz-adv-x': "1021", 'd': "M385 530Q423 530 455 514T511 470Q534 498 566 514T637 530Q671 530 700 518T752 483T786 432T799 369Q799 339 789 312T760 263T717 228T663 208Q673 182 673 150Q673 117 660 88T625 36T574 1T511 -12Q477 -12 448 1T396 36T362 87T349 150Q349 165 351 179T359 208Q330 213 306 227T263 263T234 311T223 369Q223 402 236 431T271 483T322 517T385 530ZM475 369Q475 406 449 432T385 458Q347 458 321 432T295 369Q295 331 321 305T385 279Q407 279 427 290L463 228Q443 214 432 194T421 150Q421 113 447 87T511 61Q549 61 575 87T601 150Q601 173 590 193T559 228L593 290Q617 279 637 279Q675 279 701 305T727 369Q727 406 701 432T637 458Q599 458 573 432T547 369H475Z"});
	// MFsl
	svg.other(font, "glyph", {'unicode': "N", 'glyph-name': "N", 'horiz-adv-x': "1021", 'd': "M364 479Q364 510 343 531T290 553Q259 553 237 532T215 479Q215 447 237 426T290 404Q322 404 343 425T364 479ZM437 479Q437 448 426 422T394 375T348 344T290 332Q260 332 233 343T186 375T155 421T143 479Q143 509 154 536T186 582T233 613T290 625Q321 625 347 614T394 583T425 536T437 479ZM806 479Q806 510 784 531T731 553Q699 553 678 532T657 479Q657 447 678 426T731 404Q762 404 784 425T806 479ZM878 479Q878 448 867 422T835 375T788 344T731 332Q700 332 674 343T627 375T596 421T584 479Q584 509 595 536T627 582T673 613T731 625Q761 625 788 614T835 583T866 536T878 479ZM584 96Q584 127 563 148T510 170Q479 170 457 149T435 96Q435 64 457 43T510 21Q541 21 562 42T584 96ZM657 96Q657 65 646 39T614 -8T567 -39T510 -51Q480 -51 453 -40T406 -8T374 38T362 96Q362 126 373 153T405 200T453 231T510 243Q540 243 566 232T613 200T645 153T657 96Z"});
	//MFcr
	svg.other(font, "glyph", {'unicode': "O", 'glyph-name': "O", 'horiz-adv-x': "789", 'd': "M1299 770Q1405 770 1498 730T1660 621T1770 458T1810 259Q1810 153 1770 60T1661 -102T1498 -212T1299 -252Q1240 -252 1185 -239T1079 -201T984 -142T905 -65Q870 -107 826 -141T732 -200T625 -238T511 -252Q405 -252 312 -212T150 -103T40 60T0 259Q0 365 40 458T149 620T312 730T511 770Q569 770 625 757T731 718T826 659T905 583Q940 625 984 659T1078 718T1184 756T1299 770ZM1299 697Q1242 697 1187 680T1081 632T986 557T905 458Q869 512 824 556T729 632T623 680T511 697Q420 697 340 663T201 569T107 430T72 259Q72 168 106 88T200 -51T340 -145T511 -180Q568 -180 623 -163T728 -115T824 -39T905 60Q941 6 985 -38T1081 -114T1187 -163T1299 -180Q1390 -180 1469 -146T1608 -52T1702 88T1737 259Q1737 350 1703 429T1609 568T1470 662T1299 697ZM240 259Q240 315 261 364T319 450T405 508T511 530Q567 530 616 509T702 451T760 365T782 259Q782 203 761 154T703 68T617 10T511 -12Q455 -12 406 9T319 67T261 153T240 259ZM312 259Q312 218 327 182T370 119T433 77T511 61Q552 61 588 76T651 119T693 182T709 259Q709 300 694 336T651 400T588 442T511 458Q470 458 434 443T370 400T328 337T312 259Z"});


	// IF
	svg.other(font, "glyph", {'unicode': "i", 'glyph-name': "i", 'horiz-adv-x': "1021", 'd': "M251 91V427H770V91H251Z"});
	// IFil
	svg.other(font, "glyph", {'unicode': "P", 'glyph-name': "P", 'horiz-adv-x': "1021", 'd': "M251 91V427H770V91H251Z"});
	// IFic
	svg.other(font, "glyph", {'unicode': "Q", 'glyph-name': "Q", 'horiz-adv-x': "1021", 'd': "M342 519H679V0H342V519Z"});
	// IFbi
	svg.other(font, "glyph", {'unicode': "R", 'glyph-name': "R", 'horiz-adv-x': "1021", 'd': "M251 91V427H770V91H251ZM324 241H698V355H324V241Z"});
	// IFrc
	svg.other(font, "glyph", {'unicode': "S", 'glyph-name': "S", 'horiz-adv-x': "1021", 'd': "M713 335H308V408H713V335ZM713 140H308V212H713V140Z"});
	// Ifsc
	svg.other(font, "glyph", {'unicode': "T", 'glyph-name': "T", 'horiz-adv-x': "1021", 'd': "M713 238H308V310H713V238Z"});

	// SFrsm
	svg.other(font, "glyph", {'unicode': "U", 'glyph-name': "U", 'horiz-adv-x': "1021", 'd': "M3953 238H0V310H3953V238Z"});
	//SFrwa
	svg.other(font, "glyph", {'unicode': "V", 'glyph-name': "V", 'horiz-adv-x': "3953", 'd': "M36 271Q36 227 52 189T97 123T164 78T247 61Q290 61 328 77T396 122T441 189T458 271Q458 330 480 381T541 471T631 532T742 555Q800 555 851 533T941 472T1002 382T1024 271Q1024 227 1040 189T1086 123T1153 78T1235 61Q1279 61 1317 77T1384 122T1429 189T1446 271Q1446 330 1468 381T1529 471T1619 532T1730 555Q1788 555 1840 533T1930 472T1990 382T2013 271Q2013 227 2029 189T2074 123T2141 78T2223 61Q2267 61 2305 77T2373 122T2418 189T2435 271Q2435 330 2457 381T2518 471T2607 532T2718 555Q2777 555 2828 533T2918 472T2979 382T3001 271Q3001 227 3017 189T3062 123T3129 78T3211 61Q3255 61 3293 77T3361 122T3406 189T3423 271Q3423 330 3445 381T3506 471T3596 532T3707 555Q3765 555 3816 533T3906 472T3967 382T3989 271H3917Q3917 315 3901 353T3856 420T3789 465T3707 482Q3663 482 3625 466T3557 421T3512 354T3495 271Q3495 212 3473 161T3412 71T3322 11T3211 -12Q3152 -12 3101 10T3012 71T2951 160T2929 271Q2929 315 2913 353T2867 420T2800 465T2718 482Q2674 482 2636 466T2569 421T2524 354T2507 271Q2507 212 2485 161T2424 71T2334 11T2223 -12Q2164 -12 2113 10T2023 71T1963 160T1940 271Q1940 315 1924 353T1879 420T1812 465T1730 482Q1686 482 1648 466T1581 421T1536 354T1519 271Q1519 212 1497 161T1436 71T1346 11T1235 -12Q1176 -12 1125 10T1035 71T975 160T952 271Q952 315 936 353T891 420T824 465T742 482Q698 482 660 466T592 421T547 354T530 271Q530 212 508 161T447 71T357 11T247 -12Q188 -12 137 10T47 71T-14 160T-36 271H36Z"});
	// SFrcv
	svg.other(font, "glyph", {'unicode': "W", 'glyph-name': "W", 'horiz-adv-x': "3953", 'd': "M3953 -12Q3869 -12 3792 13T3651 83T3537 190T3459 326Q3430 252 3381 190T3268 83T3126 13T2965 -12Q2881 -12 2804 13T2663 83T2549 190T2471 326Q2442 252 2393 190T2279 83T2137 13T1976 -12Q1892 -12 1816 13T1675 82T1561 189T1482 325Q1453 251 1404 189T1291 83T1149 13T988 -12Q904 -12 827 13T686 83T572 190T494 326Q465 252 416 190T303 83T161 13T0 -12V61Q94 61 177 97T323 195T422 340T458 519H530Q530 424 566 341T664 195T809 97T988 61Q1083 61 1166 97T1312 195T1410 340T1446 519H1519Q1519 424 1555 341T1653 195T1798 97T1976 61Q2071 61 2154 97T2300 195T2399 340T2435 519H2507Q2507 424 2543 341T2641 195T2786 97T2965 61Q3059 61 3142 97T3288 195T3387 340T3423 519H3495Q3495 424 3531 341T3629 195T3775 97T3953 61V-12Z"});
	// SFrcx
	svg.other(font, "glyph", {'unicode': "X", 'glyph-name': "X", 'horiz-adv-x': "3953", 'd': "M0 530Q84 530 161 505T302 435T416 328T494 192Q523 266 572 328T685 435T827 505T988 530Q1072 530 1149 505T1290 436T1404 329T1482 193Q1511 267 1560 329T1674 435T1816 505T1977 530Q2061 530 2138 505T2279 435T2393 328T2471 192Q2500 266 2549 328T2662 435T2804 505T2965 530Q3049 530 3126 505T3267 436T3381 329T3459 193Q3488 267 3537 329T3651 435T3792 505T3953 530V458Q3858 458 3775 422T3630 324T3532 179T3496 0H3423Q3423 95 3387 178T3289 324T3144 422T2965 458Q2870 458 2787 422T2641 324T2543 179T2507 0H2435Q2435 95 2399 178T2301 324T2155 422T1977 458Q1882 458 1799 422T1653 324T1555 179T1519 0H1446Q1446 95 1410 178T1312 324T1167 422T988 458Q893 458 810 422T665 324T566 179T530 0H458Q458 95 422 178T324 324T178 422T0 458V530Z"});
	// SFrrd
	svg.other(font, "glyph", {'unicode': "Y", 'glyph-name': "Y", 'horiz-adv-x': "3953", 'd': "M3978 234L3706 -37L3212 457L2718 -37L2224 457L1730 -37L1236 457L740 -39L247 456L25 234L-25 284L249 558L742 63L1236 557L1730 63L2224 557L2718 63L3212 557L3706 63L3928 284L3978 234Z"});

	// |||| S
	svg.other(font, "glyph", {'unicode': "0", 'glyph-name': "zero", 'horiz-adv-x': "1644", 'd': "M638 716V-199H566V716H638ZM1078 716V-199H1006V716H1078ZM1517 716V-199H1445V716H1517ZM199 716V-199H127V716H199Z"});
	// 4F
	svg.other(font, "glyph", {'unicode': "2", 'glyph-name': "two", 'horiz-adv-x': "1021", 'd': "M894 691L178 -25L127 25L843 742L894 691Z"});
	// 1F
	svg.other(font, "glyph", {'unicode': "3", 'glyph-name': "three", 'horiz-adv-x': "1021", 'd': "M894 691L561 358L894 25L843 -25L510 307L178 -25L127 25L460 358L127 691L178 742L510 408L843 742L894 691Z"});
	// P
	svg.other(font, "glyph", {'unicode': "4", 'glyph-name': "four", 'horiz-adv-x': "1021", 'd': "M792 691L178 77L127 128L741 742L792 691ZM229 25L843 639L894 588L280 -25L229 25Z"});
	// K
	svg.other(font, "glyph", {'unicode': "5", 'glyph-name': "five", 'horiz-adv-x': "1021", 'd': "M843 77L613 307L561 255L792 25L741 -25L510 204L281 -25L230 25L460 255L408 307L178 77L127 128L357 358L127 588L178 639L408 409L459 460L229 691L280 742L510 511L741 742L792 691L561 460L613 408L844 639L895 588L664 358L894 128L843 77ZM459 358L511 306L562 357L510 409L459 358Z"});
	// M
	svg.other(font, "glyph", {'unicode': "7", 'glyph-name': "seven", 'horiz-adv-x': "326", 'd': "M199 716V-199H127V716H199Z"});
	// W
	svg.other(font, "glyph", {'unicode': "8", 'glyph-name': "eight", 'horiz-adv-x': "765", 'd': "M199 716V-199H127V716H199ZM638 716V-199H566V716H638Z"});
	// V
	svg.other(font, "glyph", {'unicode': "9", 'glyph-name': "nine", 'horiz-adv-x': "1205", 'd': "M199 716V-199H127V716H199ZM638 716V-199H566V716H638ZM1078 716V-199H1006V716H1078Z"});
}
/******* Helper Functions - End *********/
