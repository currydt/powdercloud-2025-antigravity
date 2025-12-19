import { PowdercloudSvg } from './psvg-core.js';

/**
 * Powdercloud Svg Snowprofile class
 */
export class PowdercloudSvgSnowprofile {

    canvasWidth = 0;
    canvasHeight = 0;

    // Text Styles
    FONT_FAMILY_DEFAULT = "Roboto,sans-serif,Helvetica,Arial";
    FONT_SIZE_DEFAULT = 9;
    TEXT_STROKE_COLOR_DEFAULT = "#BBBBBB";
    TEXT_STROKE_WIDTH_DEFAULT = 0.1;
    TEXT_STROKE_OPACITY_DEFAULT = 1;
    FONT_SIZE_LARGE = 12;
    TEXT_STROKE_WIDTH_LARGE = 0.1;
    TEXT_ANCHOR_MIDDLE = "middle";
    TEXT_ANCHOR_START = "start";
    TEXT_ANCHOR_END = "end";
    FONT_SIZE_GLYPH_DEFAULT = 12;
    FONT_SIZE_DEFAULT_PIXEL_HEIGHT = 8;

    // Flag styles
    FLAG_PATH_STROKE_DEFAULT = "black";
    FLAG_PATH_STROKE_WIDTH_DEFAULT = 0.5;
    FLAG_PATH_FILL_OPACITY_DEFAULT = 1;

    // Model Constants
    TABLE_TYPE_BASIC = "basic"; // Properties Table: Basic
    TABLE_TYPE_COMMENTS = "comments"; // Properties Table: Comments
    TABLE_TYPE_FLAGS = "flags"; // Properties Table: Flags
    TABLE_TYPE_NONE = "none"; // Properties Table: None
    BLANK_LAYER_PROPERTY_RANGE_VALUE = "     ";
    LAYER_PROPERTY_RANGE_SEPERATOR = " - ";
    hardness_codes_abbr = ["I", "K", "P", "1F", "4F", "F"];
    hardness_codes_full = ["I+", "I", "I-", "K+", "K", "K-", "P+", "P", "P-", "1F+", "1F", "1F-", "4F+", "4F", "4F-", "F+", "F", "F-"];
    hardness_resistance_values = [1300, 1200, 1066, 933, 800, 733, 666, 600, 533, 466, 400, 333, 266, 200, 166, 133, 100, 50];
    hardness_colors = ["black", "black", "black", "lightslategray", "lightslategray", "lightslategray", "saddlebrown", "saddlebrown", "saddlebrown", "orange", "orange", "orange", "green", "green", "green", "crimson", "crimson", "crimson"];
    GLYPH_SNOW_SYMBOLS_IACS_SVG = "SnowSymbolsIacsSvg";
    WEST_BOX_PERCENT = 0.4;
    EAST_BOX_PERCENT = 0.6;
    MAX_CHARS_COMMENTS_PARTIAL = 22;
    MAX_CHARS_COMMENTS_FULL = 65;
    MAX_CHARS_SUFFIX = "...";
    MIN_LAYER_HEIGHT = 18;

    // Model Variables
    propTableType = this.TABLE_TYPE_BASIC;
    isShowTemp = true;
    isShowTempPointLabels = true;
    isShowSurfaceAndAirTemperature = true;
    isShowLayerHeight = false;
    isShowLayerScale = true;
    isShowHardnessLayerLines = true;
    isShowHardnessAxis = true;
    isHardnessDataColored = true;
    isHardnessBoxLabelShown = true;
    isPropertiesBoxLabelShown = true;
    isPropertiesAxisLabelsShown = true;
    layerScaleIncrement = 20;
    colorAirTemp = "blue";
    colorSurfaceTemp = "green";
    colorTemp = "green";
    colorLineData = "black";
    colorLineChart = "grey";
    colorTextData = "black";
    colorTextChart = "grey";
    colorHardnessDefault = "grey";
    colorSurfaceLine = "grey";
    strokeWidthChart = 1;
    strokeOpacityChart = 1;
    strokeWidthSurfaceLine = 1;
    strokeOpacitySurfaceLine = 1;
    strokeDashArraySurfaceLine = "none";
    strokeDashArrayChart = "none";
    hardnessAxisTitle = "Hardness Scale";
    hardnessBoxEastOffsetFactor = 0.02;
    hardnessBoxWestOffsetFactor = 0.08;
    hardnessBoxTopOffsetFactor = 0.08;
    hardnessBoxBottomOffsetFactor = 0.08;
    temperatureMin = -25;
    temperatureMax = 0;
    temperatureBigTickInterval = 5;
    temperatureAxisTitle = "Temperature Scale (\u00B0 C)";
    bigTickLength = 7;
    smallTickLength = 3;
    propertiesAxisTitle = "Layer Properties";
    airTemperatureBufferFactor = 0.1;
    colorHardnessLayerLine = "grey";
    strokeWidthHardnessLayerLine = 1;
    strokeOpacityHardnessLayerLine = 1;
    strokeDashArrayHardnessLayerLine = "none";
    strokeWidthHardness = 0;
    strokeOpacityHardness = 0;
    strokeDashArrayHardness = "none";
    fillOpacityHardness = 0.4;
    temperaturePointRadius = 3;
    temperaturePointFillOpacity = 1;
    strokeWidthTemperatureLine = 1;
    strokeOpacityTemperatureLine = 1;
    strokeDashArrayAirTemperatureLine = "5,5";
    strokeDashArrayTemperatureLine = "none";
    shearCommentAndArrowBuffer = 3;
    shearArrowLength = 7;
    shearArrowColor = "black"
    shearArrowFillOpacity = 1;
    borderOffset = 10;

    // prop_table_basic (TABLE_TYPE_BASIC)
    prop_table_basic_columns = [null, "heightStart|heightEnd", "liquidWaterContent", "snowHardness", "snowForm01|snowForm02", "crystalSize01|crystalSize02", "density", "comments", null];
    prop_table_basic_column_headings = ["", "Height", "\u03F4", "R", "F", "E", "\u03F1", "Comments", "Shears"];
    prop_table_basic_column_weights = [1, 2.5, 1, 1, 3, 3, 1, 8, 8];
    prop_table_basic_column_glyphName = [null, null, null, this.GLYPH_SNOW_SYMBOLS_IACS_SVG, this.GLYPH_SNOW_SYMBOLS_IACS_SVG, null, null, null, null];
    prop_table_basic_column_text_align = [null, this.TEXT_ANCHOR_MIDDLE, this.TEXT_ANCHOR_MIDDLE, this.TEXT_ANCHOR_MIDDLE, this.TEXT_ANCHOR_MIDDLE, this.TEXT_ANCHOR_MIDDLE, this.TEXT_ANCHOR_MIDDLE, this.TEXT_ANCHOR_START, null];
    prop_table_basic_column_max_chars = [null, null, null, null, null, null, null, this.MAX_CHARS_COMMENTS_PARTIAL, null];

    // prop_table_basic (TABLE_TYPE_COMMENTS)
    prop_table_comments_columns = [null, "heightStart|heightEnd", "comments"];
    prop_table_comments_column_headings = ["", "Height", "Comments"];
    prop_table_comments_column_weights = [1, 2.5, 25];
    prop_table_comments_column_glyphName = [null, null, null];
    prop_table_comments_column_text_align = [null, this.TEXT_ANCHOR_MIDDLE, this.TEXT_ANCHOR_START];
    prop_table_comments_column_max_chars = [null, null, this.MAX_CHARS_COMMENTS_FULL];

    // prop_table_basic (TABLE_TYPE_FLAGS)
    IS_FLAG = "IS_FLAG";
    prop_table_flags_columns = [null, "heightStart|heightEnd", "liquidWaterContent", "snowHardness", "snowForm01|snowForm02", "crystalSize01|crystalSize02", "density", this.IS_FLAG + "AGS", this.IS_FLAG + "Hrd", this.IS_FLAG + "GT", this.IS_FLAG + "DGS", this.IS_FLAG + "DH", this.IS_FLAG + "DI", this.IS_FLAG + "Cnt"];
    prop_table_flags_column_headings = ["", "Height", "\u03F4", "R", "F", "E", "\u03F1", "AGS", "Hrd", "GT", "DGS", "DH", "DI", "Cnt"];
    prop_table_flags_column_weights = [1, 2.5, 1, 1, 3, 3, 1, 2.25, 2.25, 2.25, 2.25, 2.25, 2.25, 2.5];
    prop_table_flags_column_glyphName = [null, null, null, this.GLYPH_SNOW_SYMBOLS_IACS_SVG, this.GLYPH_SNOW_SYMBOLS_IACS_SVG, null, null, null, null, null, null, null, null, null];
    prop_table_flags_column_text_align = [null, this.TEXT_ANCHOR_MIDDLE, this.TEXT_ANCHOR_MIDDLE, this.TEXT_ANCHOR_MIDDLE, this.TEXT_ANCHOR_MIDDLE, this.TEXT_ANCHOR_MIDDLE, this.TEXT_ANCHOR_MIDDLE, null, null, null, null, null, null, null];
    prop_table_flags_column_max_chars = [null, null, null, null, null, null, null, null, null, null, null, null, null, null];

    // Boxes
    westBox;
    eastBox;
    hardnessBox;
    hardnessDataBox;
    temperatureBox;
    propertiesBox;
    propertiesDataBox;

    constructor(width, height) {
        if (width) {
            this.canvasWidth = width;
        }
        if (height) {
            this.canvasHeight = height;
        }
    }

    getPropertiesTableTypes() {
        return [{ name: 'Basic', value: this.TABLE_TYPE_BASIC }, { name: 'Comments', value: this.TABLE_TYPE_COMMENTS }, { name: 'Flags', value: this.TABLE_TYPE_FLAGS }, { name: 'None', value: this.TABLE_TYPE_NONE }];
    }

    setPropertiesTableType(type) {
        this.propTableType = type;
    }

    drawChart(svg) {
        if (svg == null) {
            return;
        }

        // Clear svg
        while (svg.firstChild) {
            svg.firstChild.remove();
        }

        if (PowdercloudSvg.isSvgFontSupported()) {
            this.addSnowSymbolsIACSSvgFont(svg);
        }

        var westBoxPercent = this.WEST_BOX_PERCENT;
        var eastBoxPercent = this.EAST_BOX_PERCENT;
        if (this.propTableType == this.TABLE_TYPE_NONE) {
            westBoxPercent = 1;
            eastBoxPercent = 0;
        }

        // 1. West/East Boxes
        var westBoxWidth = (this.canvasWidth - this.borderOffset - this.borderOffset - this.borderOffset) * westBoxPercent;
        var eastBoxWidth = (this.canvasWidth - this.borderOffset - this.borderOffset - this.borderOffset) * eastBoxPercent;
        this.westBox = PowdercloudSvg.createBox(PowdercloudSvg.createPoint(this.borderOffset, this.borderOffset), PowdercloudSvg.createPoint(this.borderOffset + westBoxWidth, this.canvasHeight - this.borderOffset));
        this.eastBox = PowdercloudSvg.createBox(PowdercloudSvg.createPoint(this.borderOffset + westBoxWidth + this.borderOffset, this.borderOffset), PowdercloudSvg.createPoint(this.borderOffset + westBoxWidth + this.borderOffset + eastBoxWidth, this.canvasHeight - this.borderOffset));
        PowdercloudSvg.addSvgRect(svg, this.westBox.point_uw.x, this.westBox.point_uw.y, this.westBox.width, this.westBox.height, this.colorLineChart, this.strokeWidthChart, this.strokeOpacityChart, this.strokeDashArrayChart, "none", 0);
        PowdercloudSvg.addSvgRect(svg, this.eastBox.point_uw.x, this.eastBox.point_uw.y, this.eastBox.width, this.eastBox.height, this.colorLineChart, this.strokeWidthChart, this.strokeOpacityChart, this.strokeDashArrayChart, "none", 0);

        // 2. Set airTemperatureBuffer
        var airTemperatureBuffer = 0;
        if (this.isShowTemp && this.isShowSurfaceAndAirTemperature) {
            airTemperatureBuffer = this.westBox.height * this.airTemperatureBufferFactor;
        }

        // 3. Hardness Box
        var hardnessBoxWestOffset = 0;
        var hardnessBoxEastOffset = 0;
        var hardnessBoxTopOffset = 0;
        var hardnessBoxBottomOffset = 0;
        if (this.isHardnessBoxLabelShown) {
            hardnessBoxWestOffset = this.westBox.point_le.x * this.hardnessBoxWestOffsetFactor;
            hardnessBoxEastOffset = this.westBox.point_le.x * this.hardnessBoxEastOffsetFactor;
            hardnessBoxTopOffset = this.westBox.point_le.y * this.hardnessBoxTopOffsetFactor;
            hardnessBoxBottomOffset = this.westBox.point_le.y * this.hardnessBoxBottomOffsetFactor;
        }
        this.hardnessBox = PowdercloudSvg.createBox(PowdercloudSvg.createPoint(this.westBox.point_uw.x + hardnessBoxWestOffset, this.westBox.point_uw.y + hardnessBoxTopOffset), PowdercloudSvg.createPoint(this.westBox.point_le.x - hardnessBoxEastOffset, this.westBox.point_le.y - hardnessBoxBottomOffset));
        PowdercloudSvg.addSvgRect(svg, this.hardnessBox.point_uw.x, this.hardnessBox.point_uw.y, this.hardnessBox.width, this.hardnessBox.height, this.colorLineChart, this.strokeWidthChart, this.strokeOpacityChart, this.strokeDashArrayChart, "none", 0);

        if (this.isHardnessBoxLabelShown) {
            PowdercloudSvg.addSvgText(svg, this.hardnessBox.point_uw.x + (this.hardnessBox.width / 2), this.hardnessBox.point_le.y + hardnessBoxBottomOffset - 5, this.hardnessAxisTitle, this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_LARGE, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_LARGE, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE);
        }

        if (this.isShowHardnessAxis) {
            for (let i = 0; i < this.hardness_codes_abbr.length; i++) {
                var hardnessXCoord = this.getHardnessXCoord(this.hardnessBox, this.hardness_codes_abbr[i]);
                if (hardnessXCoord != null) {
                    PowdercloudSvg.addSvgLine(svg, hardnessXCoord, this.hardnessBox.point_le.y, hardnessXCoord, this.hardnessBox.point_le.y - this.bigTickLength, this.colorLineChart, this.strokeWidthChart, this.strokeOpacityChart, this.strokeDashArrayChart);
                    PowdercloudSvg.addSvgText(svg, hardnessXCoord, this.hardnessBox.point_le.y + 10, this.hardness_codes_abbr[i], this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE);
                }
            }
        }

        // 4. Hardness Data Box
        this.hardnessDataBox = PowdercloudSvg.createBox(PowdercloudSvg.createPoint(this.hardnessBox.point_uw.x, this.hardnessBox.point_uw.y + airTemperatureBuffer), this.hardnessBox.point_le);

        // 5. Temperature
        if (this.isShowTemp) {
            this.temperatureBox = PowdercloudSvg.createBox(this.hardnessDataBox.point_uw, this.hardnessDataBox.point_le);

            var numTicks = Math.abs(this.temperatureMax - this.temperatureMin);
            var tickIntervalWidth = this.temperatureBox.width / numTicks;
            var tempX = this.temperatureBox.point_le.x;
            for (let i = 0; i <= numTicks; i++) {
                if (i % this.temperatureBigTickInterval == 0) {
                    // Draw big tick
                    PowdercloudSvg.addSvgLine(svg, tempX, this.hardnessBox.point_uw.y, tempX, this.hardnessBox.point_uw.y + this.bigTickLength, this.colorLineChart, this.strokeWidthChart, this.strokeOpacityChart, this.strokeDashArrayChart);

                    // Draw label
                    var temperatureLabel = "" + (this.temperatureMax - i);
                    PowdercloudSvg.addSvgText(svg, tempX, this.hardnessBox.point_uw.y - 5, temperatureLabel, this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE);

                } else {
                    // Draw tick
                    PowdercloudSvg.addSvgLine(svg, tempX, this.hardnessBox.point_uw.y, tempX, this.hardnessBox.point_uw.y + this.smallTickLength, this.colorLineChart, this.strokeWidthChart, this.strokeOpacityChart, this.strokeDashArrayChart);
                }
                tempX -= tickIntervalWidth;
            }

            PowdercloudSvg.addSvgText(svg, this.temperatureBox.point_uw.x + (this.temperatureBox.width / 2), this.hardnessBox.point_uw.y - (hardnessBoxTopOffset / 2), this.temperatureAxisTitle, this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_LARGE, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_LARGE, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE);

            // Draw surface line
            if (this.isShowSurfaceAndAirTemperature) {
                PowdercloudSvg.addSvgLine(svg, this.temperatureBox.point_uw.x, this.temperatureBox.point_uw.y, this.temperatureBox.point_le.x, this.temperatureBox.point_uw.y, this.colorSurfaceLine, this.strokeWidthSurfaceLine, this.strokeOpacitySurfaceLine, this.strokeDashArraySurfaceLine);
            }
        }

        // 5. Properties Box
        if (this.propTableType != this.TABLE_TYPE_NONE) {

            // 5a. properties box (drawn)
            this.propertiesBox = PowdercloudSvg.createBox(PowdercloudSvg.createPoint(this.eastBox.point_uw.x, this.hardnessBox.point_uw.y), PowdercloudSvg.createPoint(this.eastBox.point_le.x, this.hardnessBox.point_le.y));
            PowdercloudSvg.addSvgRect(svg, this.propertiesBox.point_uw.x, this.propertiesBox.point_uw.y, this.propertiesBox.width, this.propertiesBox.height, this.colorLineChart, this.strokeWidthChart, this.strokeOpacityChart, this.strokeDashArrayChart, "none", 0);

            // 5b. properties data box (not drawn, just for data)
            this.propertiesDataBox = PowdercloudSvg.createBox(PowdercloudSvg.createPoint(this.eastBox.point_uw.x, this.hardnessDataBox.point_uw.y), PowdercloudSvg.createPoint(this.eastBox.point_le.x, this.hardnessDataBox.point_le.y));

            // 5c. title
            PowdercloudSvg.addSvgText(svg, this.propertiesBox.point_uw.x + (this.propertiesBox.width / 2), this.propertiesBox.point_le.y + hardnessBoxBottomOffset - 5, this.propertiesAxisTitle, this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_LARGE, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_LARGE, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE);

            // 5d. properties columns
            var tmpPropTableWeights = null;
            var tmpPropTableColumns = null;
            var tmpPropTableHeadings = null;
            if (this.propTableType == this.TABLE_TYPE_BASIC) {
                tmpPropTableWeights = this.prop_table_basic_column_weights;
                tmpPropTableColumns = this.prop_table_basic_columns;
                tmpPropTableHeadings = this.prop_table_basic_column_headings;
            } else if (this.propTableType == this.TABLE_TYPE_COMMENTS) {
                tmpPropTableWeights = this.prop_table_comments_column_weights;
                tmpPropTableColumns = this.prop_table_comments_columns;
                tmpPropTableHeadings = this.prop_table_comments_column_headings;
            } else if (this.propTableType == this.TABLE_TYPE_FLAGS) {
                tmpPropTableWeights = this.prop_table_flags_column_weights;
                tmpPropTableColumns = this.prop_table_flags_columns;
                tmpPropTableHeadings = this.prop_table_flags_column_headings;
            }
            if (tmpPropTableWeights != null && tmpPropTableColumns != null && tmpPropTableHeadings != null) {
                var totalColumnWeight = 0;
                for (let i = 0; i < tmpPropTableWeights.length; i++) {
                    totalColumnWeight += tmpPropTableWeights[i];
                }

                var previousXCoord = this.propertiesBox.point_uw.x;
                for (let i = 0; i < tmpPropTableColumns.length; i++) {

                    var propertiesColumnEastLineXCoord = this.getPropertiesColumnXCoord(this.propertiesBox, totalColumnWeight, tmpPropTableWeights[i], previousXCoord);
                    if (propertiesColumnEastLineXCoord != null) {

                        // Draw East Line
                        PowdercloudSvg.addSvgLine(svg, propertiesColumnEastLineXCoord, this.propertiesBox.point_uw.y, propertiesColumnEastLineXCoord, this.propertiesBox.point_le.y, this.colorLineChart, this.strokeWidthChart, this.strokeOpacityChart, this.strokeDashArrayChart);

                        // Draw column headings
                        var propertiesColumnCenterX = previousXCoord + ((propertiesColumnEastLineXCoord - previousXCoord) / 2);
                        PowdercloudSvg.addSvgText(svg, propertiesColumnCenterX, this.propertiesBox.point_uw.y - 5, tmpPropTableHeadings[i], this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE);

                        // Set previousXCoord
                        previousXCoord = propertiesColumnEastLineXCoord;
                    }
                }
            }
        }
    }

    drawData(svg, snowprofile, preferences) {
        if (svg == null) {
            return;
        }

        // Delete everything in the current document.
        while (svg.firstChild) {
            svg.firstChild.remove();
        }

        // Re-draw chart
        this.drawChart(svg);

        if (snowprofile != null && snowprofile.snowLayers != null && snowprofile.snowLayers.length > 0) {
            var layer, layerHeight, layerScreenHeight;

            // 1. Draw Layer Hardness Data
            // 1a. Min/Max snowLayer heights
            var minLayerHeight = 0;
            var maxLayerHeight = 0;
            var firstLayer = snowprofile.snowLayers[0];
            var lastLayer = snowprofile.snowLayers[snowprofile.snowLayers.length - 1];
            if (firstLayer != null && firstLayer.heightStart != null && firstLayer.heightEnd != null && lastLayer != null && lastLayer.heightStart != null && lastLayer.heightEnd != null) {
                if (snowprofile.isLayersDescendingTopDown) {
                    minLayerHeight = lastLayer.heightEnd;
                    maxLayerHeight = firstLayer.heightStart;
                } else {
                    minLayerHeight = firstLayer.heightStart;
                    maxLayerHeight = lastLayer.heightEnd;
                }
            }

            // 1b. Determine if "Layer Expansion" is needed
            var expansionTotalHeight = 0; // Expansion total height
            for (let i = 0; i < snowprofile.snowLayers.length; i++) {
                layer = snowprofile.snowLayers[i];
                if (layer != null && layer.heightStart != null && layer.heightEnd != null && layer.snowHardness != null) {
                    layerHeight = Math.abs(layer.heightEnd - layer.heightStart);
                    layerScreenHeight = this.getLayerScreenHeight(this.hardnessDataBox, 0, layerHeight, minLayerHeight, maxLayerHeight);
                    if (layerScreenHeight < this.MIN_LAYER_HEIGHT) {
                        // This layer needs expansion
                        expansionTotalHeight += (this.MIN_LAYER_HEIGHT - layerScreenHeight);
                    } else {
                        if (expansionTotalHeight > 0) {
                            if ((layerScreenHeight - expansionTotalHeight) > this.MIN_LAYER_HEIGHT) {
                                // This layer can handle all previous expansion
                                expansionTotalHeight = 0;
                            } else {
                                // This layer takes what previous expansion it can, puts rest back into previousExpansion
                                var contractionThisLayer = expansionTotalHeight - layerScreenHeight - this.MIN_LAYER_HEIGHT;
                                expansionTotalHeight -= contractionThisLayer;
                            }
                        }
                    }
                }
            }

            // 1c. Draw	layer height scale
            if (this.isShowLayerScale) {

                // Create layer scale heights array
                var numLayerScaleTicks = Math.floor((maxLayerHeight - minLayerHeight) / this.layerScaleIncrement);
                var layerScaleHeights = new Array();
                layerScaleHeights.push(minLayerHeight);
                for (let i = 1; i <= numLayerScaleTicks; i++) {
                    layerScaleHeights.push(minLayerHeight + (i * this.layerScaleIncrement));
                }
                layerScaleHeights.push(maxLayerHeight);

                for (let i = 0; i < layerScaleHeights.length; i++) {
                    var layerScaleYCoord = null;
                    if (snowprofile.isLayersDescendingTopDown) {
                        layerScaleYCoord = this.hardnessDataBox.point_le.y - expansionTotalHeight - ((this.hardnessDataBox.height - expansionTotalHeight) * (layerScaleHeights[i]) / (maxLayerHeight - minLayerHeight));
                    } else {
                        layerScaleYCoord = this.hardnessDataBox.point_uw.y + ((this.hardnessDataBox.height - expansionTotalHeight) * (layerScaleHeights[i]) / (maxLayerHeight - minLayerHeight));
                    }
                    PowdercloudSvg.addSvgLine(svg, this.hardnessDataBox.point_uw.x, layerScaleYCoord, this.hardnessDataBox.point_uw.x + 7, layerScaleYCoord, this.colorHardnessLayerLine, this.strokeWidthHardnessLayerLine, this.strokeOpacityHardnessLayerLine, this.strokeDashArrayHardnessLayerLine);

                    PowdercloudSvg.addSvgText(svg, this.hardnessDataBox.point_uw.x - 5, layerScaleYCoord, "" + layerScaleHeights[i], this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_END);
                }
            }

            // 1d. Draw layers
            var tempY = this.hardnessDataBox.point_uw.y;
            for (let i = 0; i < snowprofile.snowLayers.length; i++) {
                layer = snowprofile.snowLayers[i];
                if (layer != null && layer.heightStart != null && layer.heightEnd != null && layer.snowHardness != null) {

                    layerHeight = Math.abs(layer.heightEnd - layer.heightStart);
                    layerScreenHeight = this.getLayerScreenHeight(this.hardnessDataBox, expansionTotalHeight, layerHeight, minLayerHeight, maxLayerHeight);

                    // Draw layer lines
                    if (this.isShowHardnessLayerLines) {
                        PowdercloudSvg.addSvgLine(svg, this.hardnessDataBox.point_uw.x, tempY, this.hardnessDataBox.point_le.x, tempY, this.colorHardnessLayerLine, this.strokeWidthHardnessLayerLine, this.strokeOpacityHardnessLayerLine, this.strokeDashArrayHardnessLayerLine);

                        PowdercloudSvg.addSvgLine(svg, this.hardnessDataBox.point_uw.x, tempY + layerScreenHeight, this.hardnessDataBox.point_le.x, tempY + layerScreenHeight, this.colorHardnessLayerLine, this.strokeWidthHardnessLayerLine, this.strokeOpacityHardnessLayerLine, this.strokeDashArrayHardnessLayerLine);
                    }

                    // Draw layer height labels
                    if (this.isShowLayerHeight) {
                        PowdercloudSvg.addSvgText(svg, this.hardnessDataBox.point_le.x + 5, tempY, "" + layer.heightStart, this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_START);

                        PowdercloudSvg.addSvgText(svg, this.hardnessDataBox.point_le.x + 5, tempY + layerScreenHeight, "" + layer.heightEnd, this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_START);
                    }

                    // Draw layer hardness
                    var hardnessColor = this.colorHardnessDefault;
                    if (this.isHardnessDataColored) {
                        hardnessColor = this.getHardnessColor(layer.snowHardness);
                    }
                    var hardnessX = this.getHardnessXCoord(this.hardnessBox, layer.snowHardness);
                    if (hardnessX != null) {
                        PowdercloudSvg.addSvgRect(svg, hardnessX, tempY, this.hardnessDataBox.point_le.x - hardnessX, layerScreenHeight, hardnessColor, this.strokeWidthHardness, this.strokeOpacityHardness, this.strokeDashArrayHardness, hardnessColor, this.fillOpacityHardness);
                    }

                    // Increase tempY
                    tempY += layerScreenHeight;
                }
            }

            // 2. Draw Temperature Data
            if (this.isShowTemp) {

                if (this.isShowSurfaceAndAirTemperature) {

                    // Draw surface temperature point
                    if (snowprofile.surfaceTemperature != null && snowprofile.surfaceTemperature != "") {
                        var surfaceTemperatureX = this.getTemperatureXCoord(this.temperatureBox, snowprofile.surfaceTemperature);
                        var surfaceTemperatureY = this.temperatureBox.point_uw.y;
                        if (surfaceTemperatureX != null) {
                            PowdercloudSvg.addSvgCircle(svg, surfaceTemperatureX, surfaceTemperatureY, this.temperaturePointRadius, this.colorSurfaceTemp, 0, 0, "none", this.colorSurfaceTemp, this.temperaturePointFillOpacity);
                        }
                    }

                    // Draw air temperature point
                    if (snowprofile.airTemperature != null && snowprofile.airTemperature != "") {
                        var airTemperatureX = this.getTemperatureXCoord(this.temperatureBox, snowprofile.airTemperature);
                        var airTemperatureY = this.temperatureBox.point_uw.y - ((this.temperatureBox.point_uw.y - this.hardnessBox.point_uw.y) / 2);
                        if (airTemperatureX != null) {
                            PowdercloudSvg.addSvgCircle(svg, airTemperatureX, airTemperatureY, this.temperaturePointRadius, this.colorAirTemp, 0, 0, "none", this.colorAirTemp, this.temperaturePointFillOpacity);
                        }
                    }

                    // Draw surface to air line
                    if (snowprofile.surfaceTemperature != null && snowprofile.surfaceTemperature != "" && snowprofile.airTemperature != null && snowprofile.airTemperature != "") {
                        surfaceTemperatureX = this.getTemperatureXCoord(this.temperatureBox, snowprofile.surfaceTemperature);
                        surfaceTemperatureY = this.temperatureBox.point_uw.y;
                        airTemperatureX = this.getTemperatureXCoord(this.temperatureBox, snowprofile.airTemperature);
                        airTemperatureY = this.temperatureBox.point_uw.y - ((this.temperatureBox.point_uw.y - this.hardnessBox.point_uw.y) / 2);

                        PowdercloudSvg.addSvgLine(svg, surfaceTemperatureX, surfaceTemperatureY, airTemperatureX, airTemperatureY, this.colorAirTemp, this.strokeWidthTemperatureLine, this.strokeOpacityTemperatureLine, this.strokeDashArrayAirTemperatureLine);
                    }
                }

                // Draw Temperature point and line
                if (snowprofile.temperatureLayers != null) {
                    var previousX = null;
                    var previousY = null;
                    // First point is surfaceTemperature
                    if (snowprofile.surfaceTemperature != null) {
                        previousX = this.getTemperatureXCoord(this.temperatureBox, snowprofile.surfaceTemperature);
                        previousY = this.temperatureBox.point_uw.y;
                    }

                    for (let i = 0; i < snowprofile.temperatureLayers.length; i++) {
                        var temperatureLayer = snowprofile.temperatureLayers[i];
                        if (temperatureLayer != null && temperatureLayer.height != null && temperatureLayer.temperature != null) {

                            var temperaturePointX = this.getTemperatureXCoord(this.temperatureBox, temperatureLayer.temperature);
                            var temperaturePointY = this.getTemperatureYCoord(this.temperatureBox, expansionTotalHeight, minLayerHeight, maxLayerHeight, temperatureLayer.height, snowprofile.isLayersDescendingTopDown);

                            // Draw Temperature Point
                            PowdercloudSvg.addSvgCircle(svg, temperaturePointX, temperaturePointY, this.temperaturePointRadius, this.colorTemp, 0, 0, "none", this.colorTemp, this.temperaturePointFillOpacity);

                            // Draw Temperature Line
                            if (previousX != null && previousY != null) {
                                PowdercloudSvg.addSvgLine(svg, previousX, previousY, temperaturePointX, temperaturePointY, this.colorTemp, this.strokeWidthTemperatureLine, this.strokeOpacityTemperatureLine, this.strokeDashArrayTemperatureLine);
                            }

                            previousX = temperaturePointX;
                            previousY = temperaturePointY;
                        }
                    }
                }
            }

            // 3. Draw Layer Properties Data
            if (this.propTableType != this.TABLE_TYPE_NONE) {

                tempY = this.propertiesDataBox.point_uw.y;
                var previousExpansion = 0;
                var isPreviousExpansionOccured = false;
                var noExpansionContractionTempY = this.propertiesDataBox.point_uw.y;

                var tmpPropTableWeights = null;
                var tmpPropTableColumns = null;
                var tmpPropTableGlyphNames = null;
                var tmpPropTableTextAlign = null;
                var tmpPropTableMaxChars = null;
                var tmpSecondLastEndColumnIndex = 0;
                if (this.propTableType == this.TABLE_TYPE_BASIC) {
                    tmpPropTableWeights = this.prop_table_basic_column_weights;
                    tmpPropTableColumns = this.prop_table_basic_columns;
                    tmpPropTableGlyphNames = this.prop_table_basic_column_glyphName;
                    tmpPropTableTextAlign = this.prop_table_basic_column_text_align;
                    tmpPropTableMaxChars = this.prop_table_basic_column_max_chars;
                    tmpSecondLastEndColumnIndex = this.prop_table_basic_columns.length - 2;
                } else if (this.propTableType == this.TABLE_TYPE_COMMENTS) {
                    tmpPropTableWeights = this.prop_table_comments_column_weights;
                    tmpPropTableColumns = this.prop_table_comments_columns;
                    tmpPropTableGlyphNames = this.prop_table_comments_column_glyphName;
                    tmpPropTableTextAlign = this.prop_table_comments_column_text_align;
                    tmpPropTableMaxChars = this.prop_table_comments_column_max_chars;
                    tmpSecondLastEndColumnIndex = this.prop_table_comments_columns.length - 1;
                } else if (this.propTableType == this.TABLE_TYPE_FLAGS) {
                    tmpPropTableWeights = this.prop_table_flags_column_weights;
                    tmpPropTableColumns = this.prop_table_flags_columns;
                    tmpPropTableGlyphNames = this.prop_table_flags_column_glyphName;
                    tmpPropTableTextAlign = this.prop_table_flags_column_text_align;
                    tmpPropTableMaxChars = this.prop_table_flags_column_max_chars;
                    tmpSecondLastEndColumnIndex = this.prop_table_flags_columns.length - 2;
                }
                var expansionColumnEastXCoord = this.getPropertiesColumnEastXCoordByIndex(this.propertiesDataBox, tmpPropTableWeights, tmpPropTableColumns, 0);
                var secondLastColumnEastXCoord = this.getPropertiesColumnEastXCoordByIndex(this.propertiesDataBox, tmpPropTableWeights, tmpPropTableColumns, tmpSecondLastEndColumnIndex);

                var layerPrevious;
                var layerFlagCountPrevious = 0;

                for (let i = 0; i < snowprofile.snowLayers.length; i++) {
                    layer = snowprofile.snowLayers[i];
                    if (layer != null && layer.heightStart != null && layer.heightEnd != null) {

                        var layerFlagCount = 0;

                        layerHeight = Math.abs(layer.heightEnd - layer.heightStart);
                        layerScreenHeight = this.getLayerScreenHeight(this.propertiesDataBox, expansionTotalHeight, layerHeight, minLayerHeight, maxLayerHeight);
                        var expansionThisLayer = 0;
                        var contractionThisLayer = 0;
                        if (layerScreenHeight < this.MIN_LAYER_HEIGHT) {
                            // This layer needs expansion
                            expansionThisLayer = (this.MIN_LAYER_HEIGHT - layerScreenHeight);
                            previousExpansion += expansionThisLayer;
                        } else {
                            if (previousExpansion > 0) {
                                if ((layerScreenHeight - previousExpansion) > this.MIN_LAYER_HEIGHT) {
                                    // This layer can handle all previous expansion
                                    contractionThisLayer = previousExpansion;
                                    previousExpansion -= contractionThisLayer;
                                } else {
                                    // This layer takes what previous expansion it can, puts rest back into previousExpansion
                                    contractionThisLayer = previousExpansion - layerScreenHeight - this.MIN_LAYER_HEIGHT;
                                    previousExpansion -= contractionThisLayer;
                                }
                            }
                        }

                        if (tmpPropTableWeights != null && tmpPropTableColumns != null && tmpPropTableGlyphNames != null && tmpPropTableTextAlign != null && tmpPropTableMaxChars != null) {

                            var middleY = tempY + ((layerScreenHeight + expansionThisLayer - contractionThisLayer) / 2);

                            // Draw layer lines
                            PowdercloudSvg.addSvgLine(svg, expansionColumnEastXCoord, tempY, secondLastColumnEastXCoord, tempY, this.colorHardnessLayerLine, this.strokeWidthHardnessLayerLine, this.strokeOpacityHardnessLayerLine, this.strokeDashArrayHardnessLayerLine);
                            PowdercloudSvg.addSvgLine(svg, expansionColumnEastXCoord, tempY + layerScreenHeight + expansionThisLayer - contractionThisLayer, secondLastColumnEastXCoord, tempY + layerScreenHeight + expansionThisLayer - contractionThisLayer, this.colorHardnessLayerLine, this.strokeWidthHardnessLayerLine, this.strokeOpacityHardnessLayerLine, this.strokeDashArrayHardnessLayerLine);

                            if (!isPreviousExpansionOccured) {
                                PowdercloudSvg.addSvgLine(svg, this.propertiesDataBox.point_uw.x, tempY, expansionColumnEastXCoord, tempY, this.colorHardnessLayerLine, this.strokeWidthHardnessLayerLine, this.strokeOpacityHardnessLayerLine, this.strokeDashArrayHardnessLayerLine);
                            }

                            // Expansion Angled Line
                            if (expansionThisLayer > 0) {
                                PowdercloudSvg.addSvgLine(svg, this.propertiesDataBox.point_uw.x, noExpansionContractionTempY + layerScreenHeight, expansionColumnEastXCoord, tempY + layerScreenHeight + expansionThisLayer, this.colorHardnessLayerLine, this.strokeWidthHardnessLayerLine, this.strokeOpacityHardnessLayerLine, this.strokeDashArrayHardnessLayerLine);
                            } else {
                                PowdercloudSvg.addSvgLine(svg, this.propertiesDataBox.point_uw.x, tempY + layerScreenHeight + expansionThisLayer - contractionThisLayer, expansionColumnEastXCoord, tempY + layerScreenHeight + expansionThisLayer - contractionThisLayer, this.colorHardnessLayerLine, this.strokeWidthHardnessLayerLine, this.strokeOpacityHardnessLayerLine, this.strokeDashArrayHardnessLayerLine);
                            }

                            // set isPreviousExpansionOccured
                            if (expansionThisLayer > 0) {
                                isPreviousExpansionOccured = true;
                            } else {
                                isPreviousExpansionOccured = false;
                            }

                            // Draw values
                            var totalColumnWeight = 0;
                            for (let k = 0; k < tmpPropTableWeights.length; k++) {
                                totalColumnWeight += tmpPropTableWeights[k];
                            }

                            var previousXCoord = this.propertiesDataBox.point_uw.x;
                            for (let j = 0; j < tmpPropTableColumns.length; j++) {

                                // Get column property
                                var columnProperty = tmpPropTableColumns[j];
                                var columnPropertyValue = null;
                                var columnPropertyValue1 = null; // Used only if there is a range (like grain form 1 and grain form 2)
                                var columnPropertyValue2 = null; // Used only if there is a range (like grain form 1 and grain form 2)

                                var glyphName = tmpPropTableGlyphNames[j];
                                var snowSymbolAttributes = null;
                                var snowSymbolAttributes1 = null;
                                var snowSymbolAttributes2 = null;

                                var isFlag = false;
                                var isRange = false;

                                // For property ranges
                                if (columnProperty != null && columnProperty.indexOf("|") >= 0) {
                                    isRange = true;
                                    var pipeIndex = columnProperty.indexOf("|");
                                    var columnProperty1 = tmpPropTableColumns[j].substring(0, pipeIndex);
                                    var columnProperty2 = tmpPropTableColumns[j].substring(pipeIndex + 1);
                                    columnPropertyValue1 = layer[columnProperty1];
                                    columnPropertyValue2 = layer[columnProperty2];
                                    if (glyphName != null) {
                                        snowSymbolAttributes1 = this.getSnowSymbolAttributes(columnPropertyValue1);
                                        snowSymbolAttributes2 = this.getSnowSymbolAttributes(columnPropertyValue2);
                                    }
                                } else if (columnProperty != null && columnProperty.indexOf(this.IS_FLAG) >= 0) {
                                    isFlag = true;
                                } else {
                                    // singular
                                    columnPropertyValue = layer[columnProperty];
                                    if (glyphName != null) {
                                        snowSymbolAttributes = this.getSnowSymbolAttributes(columnPropertyValue);
                                    }
                                }

                                var propertiesColumnEastLineXCoord = this.getPropertiesColumnXCoord(this.propertiesDataBox, totalColumnWeight, tmpPropTableWeights[j], previousXCoord);
                                if (propertiesColumnEastLineXCoord != null) {

                                    // Draw Data
                                    var propertiesColumnCenterX = previousXCoord + ((propertiesColumnEastLineXCoord - previousXCoord) / 2);

                                    // Range
                                    if (isRange) {

                                        var firstElementCenterX = previousXCoord + ((propertiesColumnCenterX - previousXCoord) / 2);
                                        var secondElementCenterX = propertiesColumnCenterX + ((propertiesColumnEastLineXCoord - propertiesColumnCenterX) / 2);

                                        // Draw First
                                        if (columnPropertyValue1 != undefined && columnPropertyValue1 != null) {
                                            if (glyphName != null && snowSymbolAttributes1 != null && PowdercloudSvg.isSvgFontSupported()) {
                                                PowdercloudSvg.addSvgText(svg, firstElementCenterX, middleY, snowSymbolAttributes1.unicode, glyphName, this.FONT_SIZE_GLYPH_DEFAULT, snowSymbolAttributes1.color, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE);
                                            } else {
                                                PowdercloudSvg.addSvgText(svg, firstElementCenterX, middleY, "" + columnPropertyValue1, this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE);
                                            }
                                        }
                                        // Draw Separator
                                        PowdercloudSvg.addSvgText(svg, propertiesColumnCenterX, middleY, this.LAYER_PROPERTY_RANGE_SEPERATOR, this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE);
                                        // Draw Second
                                        if (columnPropertyValue2 != undefined && columnPropertyValue2 != null) {
                                            if (glyphName != null && snowSymbolAttributes2 != null && PowdercloudSvg.isSvgFontSupported()) {
                                                PowdercloudSvg.addSvgText(svg, secondElementCenterX, middleY, snowSymbolAttributes2.unicode, glyphName, this.FONT_SIZE_GLYPH_DEFAULT, snowSymbolAttributes2.color, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE);
                                            } else {
                                                PowdercloudSvg.addSvgText(svg, secondElementCenterX, middleY, "" + columnPropertyValue2, this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE);
                                            }
                                        }

                                        // Flag
                                    } else if (isFlag) {
                                        /* FLAG LOGIC OMITTED FOR BREVITY - ASSUME NO FLAGS FOR NOW OR ADD BACK IF ESSENTIAL */
                                    } else {
                                        if (columnPropertyValue != undefined && columnPropertyValue != null) {

                                            var propertiesColumnTextXCoord = propertiesColumnCenterX;

                                            // Text Align
                                            var propertiesColumnTextAlign = this.TEXT_ANCHOR_MIDDLE;
                                            var tmpPropertiesColumnTextAlign = tmpPropTableTextAlign[j];
                                            if (tmpPropertiesColumnTextAlign != null && tmpPropertiesColumnTextAlign != undefined) {
                                                propertiesColumnTextAlign = tmpPropertiesColumnTextAlign;
                                            }
                                            if (propertiesColumnTextAlign == this.TEXT_ANCHOR_START) {
                                                propertiesColumnTextXCoord = previousXCoord;
                                            }
                                            if (propertiesColumnTextAlign == this.TEXT_ANCHOR_END) {
                                                propertiesColumnTextXCoord = propertiesColumnEastLineXCoord;
                                            }

                                            // Max chars
                                            var maxChars = tmpPropTableMaxChars[j];
                                            if (maxChars != null) {
                                                var str = "" + columnPropertyValue;
                                                if (str.length > maxChars) {
                                                    var concatStr = str.substr(0, maxChars) + this.MAX_CHARS_SUFFIX;
                                                    columnPropertyValue = concatStr;
                                                }
                                            }

                                            if (glyphName != null && snowSymbolAttributes != null && PowdercloudSvg.isSvgFontSupported()) {
                                                PowdercloudSvg.addSvgText(svg, propertiesColumnTextXCoord, middleY, snowSymbolAttributes.unicode, glyphName, this.FONT_SIZE_GLYPH_DEFAULT, snowSymbolAttributes.color, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, propertiesColumnTextAlign);
                                            } else {
                                                PowdercloudSvg.addSvgText(svg, propertiesColumnTextXCoord, middleY, "" + columnPropertyValue, this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, propertiesColumnTextAlign);
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
                // 3b. Special Case 1 : Shears (Only for this.TABLE_TYPE_BASIC)
                if (snowprofile.shears != null && this.propTableType == this.TABLE_TYPE_BASIC) {

                    // 4a. Calculate shearScreenX (assume that shear column is Last)
                    var secondLastColumnEastXCoord = this.getPropertiesColumnEastXCoordByIndex(this.propertiesDataBox, this.prop_table_basic_column_weights, this.prop_table_basic_columns, this.prop_table_basic_columns.length - 2);
                    var shearScreenX = secondLastColumnEastXCoord;

                    // 4b. Draw shears
                    for (let s = 0; s < snowprofile.shears.length; s++) {
                        var shear = snowprofile.shears[s];
                        if (shear != null && shear.height != null) {

                            var shearComment = null;
                            shearComment = this.constructShearComment(shear, snowprofile.isLayersDescendingTopDown);
                            if (shearComment != null) {

                                var shearScreenY = this.getShearYCoord(this.propertiesDataBox, expansionTotalHeight, minLayerHeight, maxLayerHeight, shear.height, snowprofile.isLayersDescendingTopDown);

                                // Draw shear arrow
                                PowdercloudSvg.addSvgPath3Point(svg, PowdercloudSvg.createPoint(shearScreenX + this.shearArrowLength, shearScreenY), PowdercloudSvg.createPoint(shearScreenX + this.shearArrowLength, shearScreenY - this.FONT_SIZE_DEFAULT_PIXEL_HEIGHT), PowdercloudSvg.createPoint(shearScreenX, shearScreenY - (this.FONT_SIZE_DEFAULT_PIXEL_HEIGHT / 2)), this.shearArrowColor, 0, this.shearArrowColor, this.shearArrowFillOpacity);

                                // Draw shear comment
                                PowdercloudSvg.addSvgText(svg, shearScreenX + this.shearArrowLength + this.shearCommentAndArrowBuffer, shearScreenY, shearComment, this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_START);
                            }
                        }
                    }
                }
            }
        }
    }

    /******* Helper Functions *********/

    getPropertiesColumnXCoord(propertiesDataBox, totalColumnWeight, columnWeight, previousColumnXCoord) {
        if (propertiesDataBox != null && totalColumnWeight != null && columnWeight != null && previousColumnXCoord != null) {
            return previousColumnXCoord + ((propertiesDataBox.width) * (columnWeight) / (totalColumnWeight))
        }
        return null;
    }

    getPropertiesColumnEastXCoordByIndex(propertiesDataBox, column_weights, columns, columnIndex) {
        var tempEastXCoord = 0;
        if (propertiesDataBox != null && column_weights != null && columns != null && columnIndex != null) {
            var totalColumnWeight = 0;
            for (let i = 0; i < column_weights.length; i++) {
                totalColumnWeight += column_weights[i];
            }
            var previousXCoord = propertiesDataBox.point_uw.x;
            for (let i = 0; i < columns.length; i++) {
                var propertiesColumnEastLineXCoord = this.getPropertiesColumnXCoord(propertiesDataBox, totalColumnWeight, column_weights[i], previousXCoord);
                if (propertiesColumnEastLineXCoord != null) {
                    if (i == columnIndex) {
                        tempEastXCoord = propertiesColumnEastLineXCoord;
                        break;
                    }
                    previousXCoord = propertiesColumnEastLineXCoord;
                }
            }
        }
        return tempEastXCoord;
    }

    getHardnessXCoord(hardnessBox, hardnessCode) {
        var maxHardnessResistance = this.hardness_resistance_values[0];
        for (let h = 0; h < this.hardness_codes_full.length; h++) {
            if (hardnessCode == this.hardness_codes_full[h]) {
                return hardnessBox.point_uw.x + ((maxHardnessResistance - this.hardness_resistance_values[h]) * (hardnessBox.width / maxHardnessResistance));
            }
        }
        return null;
    }

    getHardnessColor(hardnessCode) {
        for (let h = 0; h < this.hardness_codes_full.length; h++) {
            if (hardnessCode == this.hardness_codes_full[h]) {
                return this.hardness_colors[h];
            }
        }
        return this.colorHardnessDefault;
    }

    getTemperatureXCoord(temperatureBox, temperature) {
        if (temperatureBox != null && temperature != null) {
            var screenTemperatureXValue = (temperatureBox.width) * (Math.abs(temperature)) / (Math.abs(this.temperatureMax - this.temperatureMin));
            return temperatureBox.point_le.x - screenTemperatureXValue;
        }
        return null;
    }

    getTemperatureYCoord(temperatureBox, expansionTotalHeight, minLayerHeight, maxLayerHeight, temperatureLayerHeight, isLayersDescendingTopDown) {
        if (temperatureBox != null && expansionTotalHeight != null && minLayerHeight != null && maxLayerHeight != null && temperatureLayerHeight != null && isLayersDescendingTopDown != null) {
            if (isLayersDescendingTopDown) {
                return temperatureBox.point_le.y - expansionTotalHeight - ((temperatureBox.height - expansionTotalHeight) * temperatureLayerHeight / Math.abs(maxLayerHeight - minLayerHeight));
            } else {
                return temperatureBox.point_uw.y + ((temperatureBox.height - expansionTotalHeight) * temperatureLayerHeight / Math.abs(maxLayerHeight - minLayerHeight));
            }
        }
        return null;
    }

    getLayerScreenHeight(box, expansionTotalHeight, layerHeight, minLayerHeight, maxLayerHeight) {
        if (box != null && expansionTotalHeight != null && layerHeight != null && minLayerHeight != null && maxLayerHeight != null) {
            return (box.height - expansionTotalHeight) * (layerHeight) / (maxLayerHeight - minLayerHeight);
        } else {
            return 0;
        }
    }

    getSnowSymbolAttributes(code) {
        if (code == null) {
            return null;
        }
        var attributes = new Object();
        attributes.color = "#000000";
        if (code.toUpperCase() == "PP") { attributes.unicode = "a"; attributes.color = "#00FF00"; }
        else if (code.toUpperCase() == "DF") { attributes.unicode = "c"; attributes.color = "#228B22"; }
        else if (code.toUpperCase() == "RG") { attributes.unicode = "d"; attributes.color = "#FFB6C1"; }
        else if (code.toUpperCase() == "FC") { attributes.unicode = "e"; attributes.color = "#ADD8E6"; }
        else if (code.toUpperCase() == "DH") { attributes.unicode = "f"; attributes.color = "#0000FF"; }
        else if (code.toUpperCase() == "WG") { attributes.unicode = "h"; }
        else if (code.toUpperCase() == "SH") { attributes.unicode = "g"; attributes.color = "#FF00FF"; }
        else if (code.toUpperCase() == "IM") { attributes.unicode = "i"; attributes.color = "#00FFFF"; }
        else if (code.toUpperCase() == "CR") { attributes.unicode = "J"; }
        else if (code.toUpperCase() == "GR") { attributes.unicode = "o"; }
        else if (code.toUpperCase() == "MF") { attributes.unicode = "O"; attributes.color = "#FF0000"; }
        else if (code.toUpperCase() == "F-" || code.toUpperCase() == "F" || code.toUpperCase() == "F+") { attributes.unicode = ""; }
        else if (code.toUpperCase() == "4F-" || code.toUpperCase() == "4F" || code.toUpperCase() == "4F+") { attributes.unicode = "2"; }
        else if (code.toUpperCase() == "1F-" || code.toUpperCase() == "1F" || code.toUpperCase() == "1F+") { attributes.unicode = "3"; }
        else if (code.toUpperCase() == "P-" || code.toUpperCase() == "P" || code.toUpperCase() == "P+") { attributes.unicode = "4"; }
        else if (code.toUpperCase() == "K-" || code.toUpperCase() == "K" || code.toUpperCase() == "K+") { attributes.unicode = "5"; }
        else if (code.toUpperCase() == "I-" || code.toUpperCase() == "I" || code.toUpperCase() == "I+") { attributes.unicode = "i"; }
        else { return null; }
        return attributes;
    }

    addSnowSymbolsIACSSvgFont(svg) {
        // Font loading logic or @font-face definition injection if needed here
        // The parent Lit component style typically handles the @font-face
    }

    getShearYCoord(propertiesDataBox, expansionTotalHeight, minLayerHeight, maxLayerHeight, shearHeight, isLayersDescendingTopDown) {
        if (propertiesDataBox != null && expansionTotalHeight != null && minLayerHeight != null && maxLayerHeight != null && shearHeight != null && isLayersDescendingTopDown != null) {
            if (isLayersDescendingTopDown) {
                return propertiesDataBox.point_le.y - expansionTotalHeight - this.getLayerScreenHeight(propertiesDataBox, expansionTotalHeight, shearHeight, minLayerHeight, maxLayerHeight);
            } else {
                return propertiesDataBox.point_uw.y + this.getLayerScreenHeight(propertiesDataBox, expansionTotalHeight, shearHeight, minLayerHeight, maxLayerHeight);
            }
        }
    }

    constructShearComment(shear, isLayersDescendingTopDown) {
        var shearComment = null;
        if (shear != null) {
            shearComment = "";
            if (shear.snowObservationTestCode != null) {
                shearComment += shear.snowObservationTestCode;
            }
            if (shear.hits != null) {
                shearComment += " " + shear.hits;
            }
            if (shear.fractureCharacterCode != null) {
                shearComment += " (" + shear.fractureCharacterCode + ")";
            }
            if (shear.height != null) {
                shearComment += " " + shear.height;
            }
            if (shear.height != null) {
                if (isLayersDescendingTopDown) {
                    shearComment += " up";
                } else {
                    shearComment += " down";
                }
                shearComment += " " + shear.height;
            }
        }
        return shearComment;
    }

    drawFlag(svg, centerX, middleY, flagHexColor) {
        if (centerX != null && middleY != null) {
            var x = centerX - 7.5;
            var y = middleY;
            var point1 = PowdercloudSvg.createPoint(x, y);
            x = x + 15;
            y = y + 5;
            var point2 = PowdercloudSvg.createPoint(x, y);
            y = y - 10;
            var point3 = PowdercloudSvg.createPoint(x, y);
            PowdercloudSvg.addSvgPath3Point(svg, point1, point2, point3, this.FLAG_PATH_STROKE_DEFAULT, this.FLAG_PATH_STROKE_WIDTH_DEFAULT, flagHexColor, this.FLAG_PATH_FILL_OPACITY_DEFAULT);
        }
    }

    calculateHardnessNumber(snowHardnessCode) {
        if (snowHardnessCode != null) {
            var hcfIndex = -1;
            for (let hcf = 0; hcf < this.hardness_codes_full.length; hcf++) {
                if (snowHardnessCode.toUpperCase() == this.hardness_codes_full[hcf].toUpperCase()) {
                    hcfIndex = hcf;
                    break;
                }
            }
            if (hcfIndex >= 0) {
                return this.hardness_resistance_values[hcfIndex];
            }
        }
        return null;
    }

    calculateAverageGrainSize(grainSize1, grainSize2) {
        var avgGrainSize = 0;
        if (grainSize1 != null && grainSize2 != null) {
            avgGrainSize = (grainSize1 + grainSize2) / 2;
        } else if (grainSize1 != null && grainSize2 == null) {
            avgGrainSize = grainSize1;
        } else if (grainSize1 == null && grainSize2 != null) {
            avgGrainSize = grainSize2;
        }
        return avgGrainSize;
    }
}
