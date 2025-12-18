import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

/**
 * Powdercloud Svg Helper Class
 * Ported from psvg-core.ts
 */
export class PowdercloudSvg {
    static NS = "http://www.w3.org/2000/svg";

    static createPoint(x, y) {
        return { x, y };
    }

    static createBox(point_uw, point_le) {
        if (point_uw && point_le) {
            return {
                point_uw: point_uw,
                point_le: point_le,
                width: point_le.x - point_uw.x,
                height: point_le.y - point_uw.y
            };
        }
        return null;
    }

    static addSvgText(svg, x, y, text, fontFamily, fontSize, stroke, strokeWidth, fillOpacity, textAnchor) {
        if (!svg || x === undefined || y === undefined || text === undefined) return;

        const newText = document.createElementNS(this.NS, "text");
        newText.setAttribute("x", x);
        newText.setAttribute("y", y);
        newText.textContent = text;
        newText.setAttribute("style", `font: ${fontSize}px ${fontFamily}`);
        newText.setAttribute("stroke", stroke);
        newText.setAttribute("stroke-width", strokeWidth);
        newText.setAttribute("fill-opacity", fillOpacity);
        if (textAnchor) newText.setAttribute("text-anchor", textAnchor);

        svg.appendChild(newText);
    }

    static addSvgLine(svg, startX, startY, endX, endY, stroke, strokeWidth, strokeOpacity, strokeDashArray) {
        if (!svg) return;

        const newLine = document.createElementNS(this.NS, "line");
        newLine.setAttribute("x1", startX);
        newLine.setAttribute("y1", startY);
        newLine.setAttribute("x2", endX);
        newLine.setAttribute("y2", endY);
        newLine.setAttribute("stroke", stroke);
        newLine.setAttribute("stroke-width", strokeWidth);
        newLine.setAttribute("stroke-opacity", strokeOpacity);
        newLine.setAttribute("stroke-dasharray", strokeDashArray);
        svg.appendChild(newLine);
    }

    static addSvgPath3Point(svg, point1, point2, point3, stroke, strokeWidth, fill, fillOpacity) {
        if (!svg || !point1 || !point2 || !point3) return;

        const newPath = document.createElementNS(this.NS, "path");
        newPath.setAttribute("d", " M " + point1.x + ", " + point1.y +
            " L " + point2.x + ", " + point2.y +
            " L " + point3.x + ", " + point3.y +
            " Z ");
        newPath.setAttribute("stroke", stroke);
        newPath.setAttribute("stroke-width", strokeWidth);
        newPath.setAttribute("fill", fill);
        newPath.setAttribute("fill-opacity", fillOpacity);
        svg.appendChild(newPath);
    }

    static addSvgPath4Point2Arc(svg, point1, point2, point3, point4, arc1, arc2, stroke, strokeWidth, fill, fillOpacity, tooltipText) {
        if (!svg || !point1 || !point2 || !point3 || !point4 || !arc1 || !arc2) return;

        const newPath = document.createElementNS(this.NS, "path");
        newPath.setAttribute("d", " M " + point1.x + ", " + point1.y +
            " L " + point2.x + ", " + point2.y +
            " A " + arc1.xRadius + ", " + arc1.yRadius + " " + arc1.xAxisRotation + " " + (arc1.largeArcFlagBinaryValue | 0) + ", " + (arc1.sweepFlagBinaryValue | 0) + " " + point3.x + ", " + point3.y +
            " L " + point4.x + ", " + point4.y +
            " A " + arc2.xRadius + ", " + arc2.yRadius + " " + arc2.xAxisRotation + " " + (arc2.largeArcFlagBinaryValue | 0) + ", " + (arc2.sweepFlagBinaryValue | 0) + " " + point1.x + ", " + point1.y);
        newPath.setAttribute("stroke", stroke);
        newPath.setAttribute("stroke-width", strokeWidth);
        newPath.setAttribute("fill", fill);
        newPath.setAttribute("fill-opacity", fillOpacity);

        if (tooltipText) {
            const title = document.createElementNS(this.NS, "title");
            title.textContent = tooltipText;
            newPath.appendChild(title);
        }

        svg.appendChild(newPath);
    }

    static addSvgPath2Point1Arc(svg, point1, point2, arc1, stroke, strokeWidth, fill, fillOpacity, tooltipText) {
        if (!svg || !point1 || !point2 || !arc1) return;

        const newPath = document.createElementNS(this.NS, "path");
        newPath.setAttribute("d", " M " + point1.x + ", " + point1.y +
            " A " + arc1.xRadius + ", " + arc1.yRadius + " " + arc1.xAxisRotation + " " + (arc1.largeArcFlagBinaryValue | 0) + ", " + (arc1.sweepFlagBinaryValue | 0) + " " + point2.x + ", " + point2.y);
        newPath.setAttribute("stroke", stroke);
        newPath.setAttribute("stroke-width", strokeWidth);
        newPath.setAttribute("fill", fill);
        newPath.setAttribute("fill-opacity", fillOpacity);

        if (tooltipText) {
            const title = document.createElementNS(this.NS, "title");
            title.textContent = tooltipText;
            newPath.appendChild(title);
        }

        svg.appendChild(newPath);
    }

    static addSvgRect(svg, leftX, topY, width, height, stroke, strokeWidth, strokeOpacity, strokeDashArray, fill, fillOpacity) {
        if (!svg) return;

        const newRect = document.createElementNS(this.NS, "rect");
        newRect.setAttribute("x", leftX);
        newRect.setAttribute("y", topY);
        newRect.setAttribute("width", width);
        newRect.setAttribute("height", height);
        newRect.setAttribute("stroke", stroke);
        newRect.setAttribute("stroke-width", strokeWidth);
        newRect.setAttribute("stroke-opacity", strokeOpacity);
        newRect.setAttribute("stroke-dasharray", strokeDashArray);
        newRect.setAttribute("fill", fill);
        newRect.setAttribute("fill-opacity", fillOpacity);

        svg.appendChild(newRect);
    }

    static addSvgCircle(svg, x, y, radius, stroke, strokeWidth, strokeOpacity, strokeDashArray, fill, fillOpacity) {
        if (!svg) return;

        const newCircle = document.createElementNS(this.NS, "circle");
        newCircle.setAttribute("cx", x);
        newCircle.setAttribute("cy", y);
        newCircle.setAttribute("r", radius);
        newCircle.setAttribute("stroke", stroke);
        newCircle.setAttribute("stroke-width", strokeWidth);
        newCircle.setAttribute("stroke-opacity", strokeOpacity);
        newCircle.setAttribute("stroke-dasharray", strokeDashArray);
        newCircle.setAttribute("fill", fill);
        newCircle.setAttribute("fill-opacity", fillOpacity);

        svg.appendChild(newCircle);
    }

    static addSvgPath3Point(svg, point1, point2, point3, stroke, strokeWidth, fill, fillOpacity) {
        if (!svg) return;

        const newPath = document.createElementNS(this.NS, "path");
        const d = `M ${point1.x}, ${point1.y} L ${point2.x}, ${point2.y} L ${point3.x}, ${point3.y} Z`;
        newPath.setAttribute("d", d);
        newPath.setAttribute("stroke", stroke);
        newPath.setAttribute("stroke-width", strokeWidth);
        newPath.setAttribute("fill", fill);
        newPath.setAttribute("fill-opacity", fillOpacity);

        svg.appendChild(newPath);
    }

    static isSvgFontSupported() {
        return true;
    }
}

/**
 * Powdercloud Svg Snowprofile Class
 * Ported from psvg-snowprofile.ts
 */
class PowdercloudSvgSnowprofile {
    constructor(width, height) {
        this.canvasWidth = width || 800;
        this.canvasHeight = height || 600;

        // Initialize constants and defaults
        this.FONT_FAMILY_DEFAULT = "Roboto,sans-serif,Helvetica,Arial";
        this.FONT_SIZE_DEFAULT = 9;
        this.TEXT_STROKE_COLOR_DEFAULT = "#BBBBBB";
        this.TEXT_STROKE_WIDTH_DEFAULT = 0.1;
        this.TEXT_STROKE_OPACITY_DEFAULT = 1;
        this.FONT_SIZE_LARGE = 12;
        this.TEXT_STROKE_WIDTH_LARGE = 0.1;
        this.TEXT_ANCHOR_MIDDLE = "middle";
        this.TEXT_ANCHOR_START = "start";
        this.TEXT_ANCHOR_END = "end";
        this.FONT_SIZE_GLYPH_DEFAULT = 12;
        this.FONT_SIZE_DEFAULT_PIXEL_HEIGHT = 8;

        this.FLAG_PATH_STROKE_DEFAULT = "black";
        this.FLAG_PATH_STROKE_WIDTH_DEFAULT = 0.5;
        this.FLAG_PATH_FILL_OPACITY_DEFAULT = 1;

        this.TABLE_TYPE_BASIC = "basic";
        this.TABLE_TYPE_COMMENTS = "comments";
        this.TABLE_TYPE_FLAGS = "flags";
        this.TABLE_TYPE_NONE = "none";

        this.LAYER_PROPERTY_RANGE_SEPERATOR = " - ";
        this.hardness_codes_abbr = ["I", "K", "P", "1F", "4F", "F"];
        this.hardness_codes_full = ["I+", "I", "I-", "K+", "K", "K-", "P+", "P", "P-", "1F+", "1F", "1F-", "4F+", "4F", "4F-", "F+", "F", "F-"];
        this.hardness_resistance_values = [1300, 1200, 1066, 933, 800, 733, 666, 600, 533, 466, 400, 333, 266, 200, 166, 133, 100, 50];
        this.hardness_colors = ["black", "black", "black", "lightslategray", "lightslategray", "lightslategray", "saddlebrown", "saddlebrown", "saddlebrown", "orange", "orange", "orange", "green", "green", "green", "crimson", "crimson", "crimson"];
        this.GLYPH_SNOW_SYMBOLS_IACS_SVG = "SnowSymbolsIacsSvg";

        this.WEST_BOX_PERCENT = 0.4;
        this.EAST_BOX_PERCENT = 0.6;
        this.MAX_CHARS_COMMENTS_PARTIAL = 22;
        this.MAX_CHARS_COMMENTS_FULL = 65;
        this.MAX_CHARS_SUFFIX = "...";
        this.MIN_LAYER_HEIGHT = 18;

        this.propTableType = this.TABLE_TYPE_BASIC;
        this.isShowTemp = true;
        this.isShowTempPointLabels = true;
        this.isShowSurfaceAndAirTemperature = true;
        this.isShowLayerHeight = false;
        this.isShowLayerScale = true;
        this.isShowHardnessLayerLines = true;
        this.isShowHardnessAxis = true;
        this.isHardnessDataColored = true;
        this.isHardnessBoxLabelShown = true;
        this.isPropertiesBoxLabelShown = true;
        this.isPropertiesAxisLabelsShown = true;
        this.layerScaleIncrement = 20;

        this.colorAirTemp = "blue";
        this.colorSurfaceTemp = "green";
        this.colorTemp = "green";
        this.colorLineData = "black";
        this.colorLineChart = "grey";
        this.colorTextData = "black";
        this.colorTextChart = "grey";
        this.colorHardnessDefault = "grey";
        this.colorSurfaceLine = "grey";

        this.strokeWidthChart = 1;
        this.strokeOpacityChart = 1;
        this.strokeWidthSurfaceLine = 1;
        this.strokeOpacitySurfaceLine = 1;
        this.strokeDashArraySurfaceLine = "none";
        this.strokeDashArrayChart = "none";

        this.hardnessAxisTitle = "Hardness Scale";
        this.hardnessBoxEastOffsetFactor = 0.02;
        this.hardnessBoxWestOffsetFactor = 0.08;
        this.hardnessBoxTopOffsetFactor = 0.08;
        this.hardnessBoxBottomOffsetFactor = 0.08;

        this.temperatureMin = -25;
        this.temperatureMax = 0;
        this.temperatureBigTickInterval = 5;
        this.temperatureAxisTitle = "Temperature Scale (\u00B0 C)";
        this.bigTickLength = 7;
        this.smallTickLength = 3;

        this.propertiesAxisTitle = "Layer Properties";
        this.airTemperatureBufferFactor = 0.1;

        this.colorHardnessLayerLine = "grey";
        this.strokeWidthHardnessLayerLine = 1;
        this.strokeOpacityHardnessLayerLine = 1;
        this.strokeDashArrayHardnessLayerLine = "none";

        this.strokeWidthHardness = 0;
        this.strokeOpacityHardness = 0;
        this.strokeDashArrayHardness = "none";
        this.fillOpacityHardness = 0.4;

        this.temperaturePointRadius = 3;
        this.temperaturePointFillOpacity = 1;
        this.strokeWidthTemperatureLine = 1;
        this.strokeOpacityTemperatureLine = 1;
        this.strokeDashArrayAirTemperatureLine = "5,5";
        this.strokeDashArrayTemperatureLine = "none";

        this.shearCommentAndArrowBuffer = 3;
        this.shearArrowLength = 7;
        this.shearArrowColor = "black";
        this.shearArrowFillOpacity = 1;
        this.borderOffset = 10;

        this.IS_FLAG = "IS_FLAG";

        // Column Definitions
        this.prop_table_basic_columns = [null, "heightStart|heightEnd", "liquidWaterContent", "snowHardness", "snowForm01|snowForm02", "crystalSize01|crystalSize02", "density", "comments", null];
        this.prop_table_basic_column_headings = ["", "Height", "\u03F4", "R", "F", "E", "\u03F1", "Comments", "Shears"];
        this.prop_table_basic_column_weights = [1, 2.5, 1, 1, 3, 3, 1, 8, 8];
        this.prop_table_basic_column_glyphName = [null, null, null, this.GLYPH_SNOW_SYMBOLS_IACS_SVG, this.GLYPH_SNOW_SYMBOLS_IACS_SVG, null, null, null, null];
        this.prop_table_basic_column_text_align = [null, this.TEXT_ANCHOR_MIDDLE, this.TEXT_ANCHOR_MIDDLE, this.TEXT_ANCHOR_MIDDLE, this.TEXT_ANCHOR_MIDDLE, this.TEXT_ANCHOR_MIDDLE, this.TEXT_ANCHOR_MIDDLE, this.TEXT_ANCHOR_START, null];
        this.prop_table_basic_column_max_chars = [null, null, null, null, null, null, null, this.MAX_CHARS_COMMENTS_PARTIAL, null];

        this.prop_table_comments_columns = [null, "heightStart|heightEnd", "comments"];
        this.prop_table_comments_column_headings = ["", "Height", "Comments"];
        this.prop_table_comments_column_weights = [1, 2.5, 25];
        this.prop_table_comments_column_glyphName = [null, null, null];
        this.prop_table_comments_column_text_align = [null, this.TEXT_ANCHOR_MIDDLE, this.TEXT_ANCHOR_START];
        this.prop_table_comments_column_max_chars = [null, null, this.MAX_CHARS_COMMENTS_FULL];

        this.prop_table_flags_columns = [null, "heightStart|heightEnd", "liquidWaterContent", "snowHardness", "snowForm01|snowForm02", "crystalSize01|crystalSize02", "density", this.IS_FLAG + "AGS", this.IS_FLAG + "Hrd", this.IS_FLAG + "GT", this.IS_FLAG + "DGS", this.IS_FLAG + "DH", this.IS_FLAG + "DI", this.IS_FLAG + "Cnt"];
        this.prop_table_flags_column_headings = ["", "Height", "\u03F4", "R", "F", "E", "\u03F1", "AGS", "Hrd", "GT", "DGS", "DH", "DI", "Cnt"];
        this.prop_table_flags_column_weights = [1, 2.5, 1, 1, 3, 3, 1, 2.25, 2.25, 2.25, 2.25, 2.25, 2.25, 2.5];
        this.prop_table_flags_column_glyphName = [null, null, null, this.GLYPH_SNOW_SYMBOLS_IACS_SVG, this.GLYPH_SNOW_SYMBOLS_IACS_SVG, null, null, null, null, null, null, null, null, null];
        this.prop_table_flags_column_text_align = [null, this.TEXT_ANCHOR_MIDDLE, this.TEXT_ANCHOR_MIDDLE, this.TEXT_ANCHOR_MIDDLE, this.TEXT_ANCHOR_MIDDLE, this.TEXT_ANCHOR_MIDDLE, this.TEXT_ANCHOR_MIDDLE, null, null, null, null, null, null, null];
        this.prop_table_flags_column_max_chars = [null, null, null, null, null, null, null, null, null, null, null, null, null, null];
    }

    drawChart(svg) {
        if (!svg) return;

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

        var westBoxWidth = (this.canvasWidth - this.borderOffset * 3) * westBoxPercent;
        var eastBoxWidth = (this.canvasWidth - this.borderOffset * 3) * eastBoxPercent;

        this.westBox = PowdercloudSvg.createBox(PowdercloudSvg.createPoint(this.borderOffset, this.borderOffset), PowdercloudSvg.createPoint(this.borderOffset + westBoxWidth, this.canvasHeight - this.borderOffset));
        this.eastBox = PowdercloudSvg.createBox(PowdercloudSvg.createPoint(this.borderOffset + westBoxWidth + this.borderOffset, this.borderOffset), PowdercloudSvg.createPoint(this.borderOffset + westBoxWidth + this.borderOffset + eastBoxWidth, this.canvasHeight - this.borderOffset));

        PowdercloudSvg.addSvgRect(svg, this.westBox.point_uw.x, this.westBox.point_uw.y, this.westBox.width, this.westBox.height, this.colorLineChart, this.strokeWidthChart, this.strokeOpacityChart, this.strokeDashArrayChart, "none", 0);
        PowdercloudSvg.addSvgRect(svg, this.eastBox.point_uw.x, this.eastBox.point_uw.y, this.eastBox.width, this.eastBox.height, this.colorLineChart, this.strokeWidthChart, this.strokeOpacityChart, this.strokeDashArrayChart, "none", 0);

        var airTemperatureBuffer = 0;
        if (this.isShowTemp && this.isShowSurfaceAndAirTemperature) {
            airTemperatureBuffer = this.westBox.height * this.airTemperatureBufferFactor;
        }

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

        this.hardnessDataBox = PowdercloudSvg.createBox(PowdercloudSvg.createPoint(this.hardnessBox.point_uw.x, this.hardnessBox.point_uw.y + airTemperatureBuffer), this.hardnessBox.point_le);

        if (this.isShowTemp) {
            this.temperatureBox = PowdercloudSvg.createBox(this.hardnessDataBox.point_uw, this.hardnessDataBox.point_le);
            var numTicks = Math.abs(this.temperatureMax - this.temperatureMin);
            var tickIntervalWidth = this.temperatureBox.width / numTicks;
            var tempX = this.temperatureBox.point_le.x;
            for (let i = 0; i <= numTicks; i++) {
                if (i % this.temperatureBigTickInterval == 0) {
                    PowdercloudSvg.addSvgLine(svg, tempX, this.hardnessBox.point_uw.y, tempX, this.hardnessBox.point_uw.y + this.bigTickLength, this.colorLineChart, this.strokeWidthChart, this.strokeOpacityChart, this.strokeDashArrayChart);
                    var temperatureLabel = "" + (this.temperatureMax - i);
                    PowdercloudSvg.addSvgText(svg, tempX, this.hardnessBox.point_uw.y - 5, temperatureLabel, this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE);
                } else {
                    PowdercloudSvg.addSvgLine(svg, tempX, this.hardnessBox.point_uw.y, tempX, this.hardnessBox.point_uw.y + this.smallTickLength, this.colorLineChart, this.strokeWidthChart, this.strokeOpacityChart, this.strokeDashArrayChart);
                }
                tempX -= tickIntervalWidth;
            }
            PowdercloudSvg.addSvgText(svg, this.temperatureBox.point_uw.x + (this.temperatureBox.width / 2), this.hardnessBox.point_uw.y - (hardnessBoxTopOffset / 2), this.temperatureAxisTitle, this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_LARGE, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_LARGE, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE);

            if (this.isShowSurfaceAndAirTemperature) {
                PowdercloudSvg.addSvgLine(svg, this.temperatureBox.point_uw.x, this.temperatureBox.point_uw.y, this.temperatureBox.point_le.x, this.temperatureBox.point_uw.y, this.colorSurfaceLine, this.strokeWidthSurfaceLine, this.strokeOpacitySurfaceLine, this.strokeDashArraySurfaceLine);
            }
        }

        if (this.propTableType != this.TABLE_TYPE_NONE) {
            this.propertiesBox = PowdercloudSvg.createBox(PowdercloudSvg.createPoint(this.eastBox.point_uw.x, this.hardnessBox.point_uw.y), PowdercloudSvg.createPoint(this.eastBox.point_le.x, this.hardnessBox.point_le.y));
            PowdercloudSvg.addSvgRect(svg, this.propertiesBox.point_uw.x, this.propertiesBox.point_uw.y, this.propertiesBox.width, this.propertiesBox.height, this.colorLineChart, this.strokeWidthChart, this.strokeOpacityChart, this.strokeDashArrayChart, "none", 0);

            this.propertiesDataBox = PowdercloudSvg.createBox(PowdercloudSvg.createPoint(this.eastBox.point_uw.x, this.hardnessDataBox.point_uw.y), PowdercloudSvg.createPoint(this.eastBox.point_le.x, this.hardnessDataBox.point_le.y));

            PowdercloudSvg.addSvgText(svg, this.propertiesBox.point_uw.x + (this.propertiesBox.width / 2), this.propertiesBox.point_le.y + hardnessBoxBottomOffset - 5, this.propertiesAxisTitle, this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_LARGE, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_LARGE, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE);

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

            if (tmpPropTableWeights && tmpPropTableColumns && tmpPropTableHeadings) {
                var totalColumnWeight = tmpPropTableWeights.reduce((a, b) => a + b, 0);
                var previousXCoord = this.propertiesBox.point_uw.x;

                for (let i = 0; i < tmpPropTableColumns.length; i++) {
                    var propertiesColumnEastLineXCoord = this.getPropertiesColumnXCoord(this.propertiesBox, totalColumnWeight, tmpPropTableWeights[i], previousXCoord);
                    if (propertiesColumnEastLineXCoord != null) {
                        PowdercloudSvg.addSvgLine(svg, propertiesColumnEastLineXCoord, this.propertiesBox.point_uw.y, propertiesColumnEastLineXCoord, this.propertiesBox.point_le.y, this.colorLineChart, this.strokeWidthChart, this.strokeOpacityChart, this.strokeDashArrayChart);
                        var propertiesColumnCenterX = previousXCoord + ((propertiesColumnEastLineXCoord - previousXCoord) / 2);
                        PowdercloudSvg.addSvgText(svg, propertiesColumnCenterX, this.propertiesBox.point_uw.y - 5, tmpPropTableHeadings[i], this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE);
                        previousXCoord = propertiesColumnEastLineXCoord;
                    }
                }
            }
        }
    }

    drawData(svg, snowprofile, preferences) {
        if (!svg) return;

        this.drawChart(svg);

        if (snowprofile && snowprofile.snowLayers && snowprofile.snowLayers.length > 0) {
            var minLayerHeight = 0;
            var maxLayerHeight = 0;
            var firstLayer = snowprofile.snowLayers[0];
            var lastLayer = snowprofile.snowLayers[snowprofile.snowLayers.length - 1];

            if (firstLayer && firstLayer.heightStart != null && firstLayer.heightEnd != null && lastLayer && lastLayer.heightStart != null && lastLayer.heightEnd != null) {
                if (snowprofile.isLayersDescendingTopDown) {
                    minLayerHeight = lastLayer.heightEnd;
                    maxLayerHeight = firstLayer.heightStart;
                } else {
                    minLayerHeight = firstLayer.heightStart;
                    maxLayerHeight = lastLayer.heightEnd;
                }
            }

            var expansionTotalHeight = 0;
            for (let i = 0; i < snowprofile.snowLayers.length; i++) {
                var layer = snowprofile.snowLayers[i];
                if (layer && layer.heightStart != null && layer.heightEnd != null && layer.snowHardness != null) {
                    var layerHeight = Math.abs(layer.heightEnd - layer.heightStart);
                    var layerScreenHeight = this.getLayerScreenHeight(this.hardnessDataBox, 0, layerHeight, minLayerHeight, maxLayerHeight);
                    if (layerScreenHeight < this.MIN_LAYER_HEIGHT) {
                        expansionTotalHeight += (this.MIN_LAYER_HEIGHT - layerScreenHeight);
                    } else {
                        if (expansionTotalHeight > 0) {
                            if ((layerScreenHeight - expansionTotalHeight) > this.MIN_LAYER_HEIGHT) {
                                expansionTotalHeight = 0;
                            } else {
                                var contractionThisLayer = expansionTotalHeight - layerScreenHeight - this.MIN_LAYER_HEIGHT;
                                expansionTotalHeight -= contractionThisLayer;
                            }
                        }
                    }
                }
            }

            if (this.isShowLayerScale) {
                var numLayerScaleTicks = Math.floor((maxLayerHeight - minLayerHeight) / this.layerScaleIncrement);
                var layerScaleHeights = [];
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

            var tempY = this.hardnessDataBox.point_uw.y;
            for (let i = 0; i < snowprofile.snowLayers.length; i++) {
                var layer = snowprofile.snowLayers[i];
                if (layer && layer.heightStart != null && layer.heightEnd != null && layer.snowHardness != null) {
                    var layerHeight = Math.abs(layer.heightEnd - layer.heightStart);
                    var layerScreenHeight = this.getLayerScreenHeight(this.hardnessDataBox, expansionTotalHeight, layerHeight, minLayerHeight, maxLayerHeight);

                    if (this.isShowHardnessLayerLines) {
                        PowdercloudSvg.addSvgLine(svg, this.hardnessDataBox.point_uw.x, tempY, this.hardnessDataBox.point_le.x, tempY, this.colorHardnessLayerLine, this.strokeWidthHardnessLayerLine, this.strokeOpacityHardnessLayerLine, this.strokeDashArrayHardnessLayerLine);
                        PowdercloudSvg.addSvgLine(svg, this.hardnessDataBox.point_uw.x, tempY + layerScreenHeight, this.hardnessDataBox.point_le.x, tempY + layerScreenHeight, this.colorHardnessLayerLine, this.strokeWidthHardnessLayerLine, this.strokeOpacityHardnessLayerLine, this.strokeDashArrayHardnessLayerLine);
                    }

                    if (this.isShowLayerHeight) {
                        PowdercloudSvg.addSvgText(svg, this.hardnessDataBox.point_le.x + 5, tempY, "" + layer.heightStart, this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_START);
                        PowdercloudSvg.addSvgText(svg, this.hardnessDataBox.point_le.x + 5, tempY + layerScreenHeight, "" + layer.heightEnd, this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_START);
                    }

                    var hardnessColor = this.isHardnessDataColored ? this.getHardnessColor(layer.snowHardness) : this.colorHardnessDefault;
                    var hardnessX = this.getHardnessXCoord(this.hardnessBox, layer.snowHardness);
                    if (hardnessX != null) {
                        PowdercloudSvg.addSvgRect(svg, hardnessX, tempY, this.hardnessDataBox.point_le.x - hardnessX, layerScreenHeight, hardnessColor, this.strokeWidthHardness, this.strokeOpacityHardness, this.strokeDashArrayHardness, hardnessColor, this.fillOpacityHardness);
                    }
                    tempY += layerScreenHeight;
                }
            }

            if (this.isShowTemp) {
                if (this.isShowSurfaceAndAirTemperature) {
                    if (snowprofile.surfaceTemperature != null && snowprofile.surfaceTemperature !== "") {
                        var surfaceTemperatureX = this.getTemperatureXCoord(this.temperatureBox, snowprofile.surfaceTemperature);
                        var surfaceTemperatureY = this.temperatureBox.point_uw.y;
                        if (surfaceTemperatureX != null) {
                            PowdercloudSvg.addSvgCircle(svg, surfaceTemperatureX, surfaceTemperatureY, this.temperaturePointRadius, this.colorSurfaceTemp, 0, 0, "none", this.colorSurfaceTemp, this.temperaturePointFillOpacity);
                        }
                    }
                    if (snowprofile.airTemperature != null && snowprofile.airTemperature !== "") {
                        var airTemperatureX = this.getTemperatureXCoord(this.temperatureBox, snowprofile.airTemperature);
                        var airTemperatureY = this.temperatureBox.point_uw.y - ((this.temperatureBox.point_uw.y - this.hardnessBox.point_uw.y) / 2);
                        if (airTemperatureX != null) {
                            PowdercloudSvg.addSvgCircle(svg, airTemperatureX, airTemperatureY, this.temperaturePointRadius, this.colorAirTemp, 0, 0, "none", this.colorAirTemp, this.temperaturePointFillOpacity);
                        }
                    }
                    if (snowprofile.surfaceTemperature != null && snowprofile.surfaceTemperature !== "" && snowprofile.airTemperature != null && snowprofile.airTemperature !== "") {
                        var surfaceTemperatureX = this.getTemperatureXCoord(this.temperatureBox, snowprofile.surfaceTemperature);
                        var surfaceTemperatureY = this.temperatureBox.point_uw.y;
                        var airTemperatureX = this.getTemperatureXCoord(this.temperatureBox, snowprofile.airTemperature);
                        var airTemperatureY = this.temperatureBox.point_uw.y - ((this.temperatureBox.point_uw.y - this.hardnessBox.point_uw.y) / 2);
                        PowdercloudSvg.addSvgLine(svg, surfaceTemperatureX, surfaceTemperatureY, airTemperatureX, airTemperatureY, this.colorAirTemp, this.strokeWidthTemperatureLine, this.strokeOpacityTemperatureLine, this.strokeDashArrayAirTemperatureLine);
                    }
                }

                if (snowprofile.temperatureLayers != null) {
                    var previousX = null;
                    var previousY = null;
                    if (snowprofile.surfaceTemperature != null) {
                        previousX = this.getTemperatureXCoord(this.temperatureBox, snowprofile.surfaceTemperature);
                        previousY = this.temperatureBox.point_uw.y;
                    }
                    for (let i = 0; i < snowprofile.temperatureLayers.length; i++) {
                        var temperatureLayer = snowprofile.temperatureLayers[i];
                        if (temperatureLayer && temperatureLayer.height != null && temperatureLayer.temperature != null) {
                            var temperaturePointX = this.getTemperatureXCoord(this.temperatureBox, temperatureLayer.temperature);
                            var temperaturePointY = this.getTemperatureYCoord(this.temperatureBox, expansionTotalHeight, minLayerHeight, maxLayerHeight, temperatureLayer.height, snowprofile.isLayersDescendingTopDown);

                            PowdercloudSvg.addSvgCircle(svg, temperaturePointX, temperaturePointY, this.temperaturePointRadius, this.colorTemp, 0, 0, "none", this.colorTemp, this.temperaturePointFillOpacity);

                            if (previousX != null && previousY != null) {
                                PowdercloudSvg.addSvgLine(svg, previousX, previousY, temperaturePointX, temperaturePointY, this.colorTemp, this.strokeWidthTemperatureLine, this.strokeOpacityTemperatureLine, this.strokeDashArrayTemperatureLine);
                            }
                            previousX = temperaturePointX;
                            previousY = temperaturePointY;
                        }
                    }
                }
            }

            // Draw Layer Properties Data
            if (this.propTableType != this.TABLE_TYPE_NONE) {
                var tmpPropTableWeights = null;
                var tmpPropTableColumns = null;
                var tmpPropTableGlyphName = null;
                var tmpPropTableTextAlign = null;
                var tmpPropTableMaxChars = null;

                if (this.propTableType == this.TABLE_TYPE_BASIC) {
                    tmpPropTableWeights = this.prop_table_basic_column_weights;
                    tmpPropTableColumns = this.prop_table_basic_columns;
                    tmpPropTableGlyphName = this.prop_table_basic_column_glyphName;
                    tmpPropTableTextAlign = this.prop_table_basic_column_text_align;
                    tmpPropTableMaxChars = this.prop_table_basic_column_max_chars;
                }

                if (tmpPropTableColumns != null) {
                    var totalColumnWeight = tmpPropTableWeights.reduce((a, b) => a + b, 0);

                    var tempY = this.hardnessDataBox.point_uw.y;

                    for (let i = 0; i < snowprofile.snowLayers.length; i++) {
                        var layer = snowprofile.snowLayers[i];
                        if (layer && layer.heightStart != null && layer.heightEnd != null) {
                            var layerHeight = Math.abs(layer.heightEnd - layer.heightStart);
                            var layerScreenHeight = this.getLayerScreenHeight(this.hardnessDataBox, expansionTotalHeight, layerHeight, minLayerHeight, maxLayerHeight);
                            var middleY = tempY + (layerScreenHeight / 2) + (this.FONT_SIZE_DEFAULT_PIXEL_HEIGHT / 2) - 2;

                            var previousXCoord = this.propertiesBox.point_uw.x;

                            for (let j = 0; j < tmpPropTableColumns.length; j++) {
                                var columnProperty = tmpPropTableColumns[j];
                                var propertiesColumnEastLineXCoord = this.getPropertiesColumnXCoord(this.propertiesBox, totalColumnWeight, tmpPropTableWeights[j], previousXCoord);

                                if (propertiesColumnEastLineXCoord != null) {
                                    var propertiesColumnCenterX = previousXCoord + ((propertiesColumnEastLineXCoord - previousXCoord) / 2);

                                    if (columnProperty != null) {
                                        var columnPropertyValue = null;
                                        var glyphName = tmpPropTableGlyphName[j];
                                        var snowSymbolAttributes = null;

                                        // Handle combined properties (e.g. "snowForm01|snowForm02")
                                        if (columnProperty.indexOf("|") > -1) {
                                            var properties = columnProperty.split("|");
                                            var val1 = layer[properties[0]];
                                            var val2 = layer[properties[1]];

                                            if (glyphName != null) {
                                                // For glyphs, we might display two symbols side by side or just one
                                                // Simplified: just take the first one for now or handle specific logic
                                                if (val1 != null) {
                                                    snowSymbolAttributes = this.getSnowSymbolAttributes(val1);
                                                    columnPropertyValue = val1;
                                                }
                                                // TODO: Handle secondary form
                                            } else {
                                                if (val1 != null && val2 != null) {
                                                    columnPropertyValue = val1 + this.LAYER_PROPERTY_RANGE_SEPERATOR + val2;
                                                } else if (val1 != null) {
                                                    columnPropertyValue = val1;
                                                } else if (val2 != null) {
                                                    columnPropertyValue = val2;
                                                }
                                            }
                                        } else {
                                            columnPropertyValue = layer[columnProperty];
                                            if (glyphName != null) {
                                                snowSymbolAttributes = this.getSnowSymbolAttributes(columnPropertyValue);
                                            }
                                        }

                                        if (columnPropertyValue != null) {
                                            var propertiesColumnTextXCoord = propertiesColumnCenterX;
                                            var textAlign = tmpPropTableTextAlign[j] || this.TEXT_ANCHOR_MIDDLE;

                                            if (textAlign == this.TEXT_ANCHOR_START) {
                                                propertiesColumnTextXCoord = previousXCoord + 2;
                                            } else if (textAlign == this.TEXT_ANCHOR_END) {
                                                propertiesColumnTextXCoord = propertiesColumnEastLineXCoord - 2;
                                            }

                                            if (glyphName != null && snowSymbolAttributes != null) {
                                                PowdercloudSvg.addSvgText(svg, propertiesColumnTextXCoord, middleY, snowSymbolAttributes.unicode, glyphName, this.FONT_SIZE_GLYPH_DEFAULT, snowSymbolAttributes.color, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, textAlign);
                                            } else {
                                                // Truncate if needed
                                                if (tmpPropTableMaxChars[j] != null && ("" + columnPropertyValue).length > tmpPropTableMaxChars[j]) {
                                                    columnPropertyValue = ("" + columnPropertyValue).substring(0, tmpPropTableMaxChars[j]) + this.MAX_CHARS_SUFFIX;
                                                }
                                                PowdercloudSvg.addSvgText(svg, propertiesColumnTextXCoord, middleY, "" + columnPropertyValue, this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, textAlign);
                                            }
                                        }
                                    }
                                    previousXCoord = propertiesColumnEastLineXCoord;
                                }
                            }
                            tempY += layerScreenHeight;
                        }
                    }
                }
            }
        }
    }

    getSnowSymbolAttributes(code) {
        if (code == null) return null;

        var attributes = { color: "#000000", unicode: "" };

        // SnowForm codes
        if (code.toUpperCase() == "PP") {
            attributes.unicode = "a";
            attributes.color = "#00FF00";    // Lime
        }
        else if (code.toUpperCase() == "DF") {
            attributes.unicode = "c";
            attributes.color = "#228B22";    // Forest Green
        }
        else if (code.toUpperCase() == "RG") {
            attributes.unicode = "d";
            attributes.color = "#FFB6C1";    // Light Pink
        }
        else if (code.toUpperCase() == "FC") {
            attributes.unicode = "e";
            attributes.color = "#ADD8E6";    // Light Blue
        }
        else if (code.toUpperCase() == "DH") {
            attributes.unicode = "f";
            attributes.color = "#0000FF";    // Blue
        }
        else if (code.toUpperCase() == "WG") {
            attributes.unicode = "h";
        }
        else if (code.toUpperCase() == "SH") {
            attributes.unicode = "g";
            attributes.color = "#FF00FF";    // Fuchsia
        }
        else if (code.toUpperCase() == "IM") {
            attributes.unicode = "i";
            attributes.color = "#00FFFF";    // Cyan/Aqua
        }
        else if (code.toUpperCase() == "CR") {
            attributes.unicode = "J";
        }
        else if (code.toUpperCase() == "GR") {
            attributes.unicode = "o";
        }
        else if (code.toUpperCase() == "MF") {
            attributes.unicode = "O";
            attributes.color = "#FF0000";
        }
        // Hardness codes
        else if (code.toUpperCase() == "F-" || code.toUpperCase() == "F" || code.toUpperCase() == "F+") {
            attributes.unicode = "";
        }
        else if (code.toUpperCase() == "4F-" || code.toUpperCase() == "4F" || code.toUpperCase() == "4F+") {
            attributes.unicode = "2";
        }
        else if (code.toUpperCase() == "1F-" || code.toUpperCase() == "1F" || code.toUpperCase() == "1F+") {
            attributes.unicode = "3";
        }
        else if (code.toUpperCase() == "P-" || code.toUpperCase() == "P" || code.toUpperCase() == "P+") {
            attributes.unicode = "4";
        }
        else if (code.toUpperCase() == "K-" || code.toUpperCase() == "K" || code.toUpperCase() == "K+") {
            attributes.unicode = "5";
        }
        else if (code.toUpperCase() == "I-" || code.toUpperCase() == "I" || code.toUpperCase() == "I+") {
            attributes.unicode = "i";
        } else {
            return null;
        }

        return attributes;
    }

    getPropertiesColumnXCoord(propertiesDataBox, totalColumnWeight, columnWeight, previousColumnXCoord) {
        if (propertiesDataBox && totalColumnWeight && columnWeight && previousColumnXCoord != null) {
            return previousColumnXCoord + ((propertiesDataBox.width) * (columnWeight) / (totalColumnWeight));
        }
        return null;
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
        if (temperatureBox && temperature != null) {
            var screenTemperatureXValue = (temperatureBox.width) * (Math.abs(temperature)) / (Math.abs(this.temperatureMax - this.temperatureMin));
            return temperatureBox.point_le.x - screenTemperatureXValue;
        }
        return null;
    }

    getTemperatureYCoord(temperatureBox, expansionTotalHeight, minLayerHeight, maxLayerHeight, temperatureLayerHeight, isLayersDescendingTopDown) {
        if (temperatureBox) {
            if (isLayersDescendingTopDown) {
                return temperatureBox.point_le.y - expansionTotalHeight - ((temperatureBox.height - expansionTotalHeight) * temperatureLayerHeight / Math.abs(maxLayerHeight - minLayerHeight));
            } else {
                return temperatureBox.point_uw.y + ((temperatureBox.height - expansionTotalHeight) * temperatureLayerHeight / Math.abs(maxLayerHeight - minLayerHeight));
            }
        }
        return null;
    }

    getLayerScreenHeight(box, expansionTotalHeight, layerHeight, minLayerHeight, maxLayerHeight) {
        if (box) {
            return (box.height - expansionTotalHeight) * (layerHeight) / (maxLayerHeight - minLayerHeight);
        }
        return 0;
    }

    addSnowSymbolsIACSSvgFont(svg) {
        // Create defs if not exists
        let defs = svg.querySelector('defs');
        if (!defs) {
            defs = document.createElementNS(PowdercloudSvg.NS, 'defs');
            svg.appendChild(defs);
        }

        const font = document.createElementNS(PowdercloudSvg.NS, 'font');
        font.setAttribute('id', this.GLYPH_SNOW_SYMBOLS_IACS_SVG);
        font.setAttribute('horiz-adv-x', '936');
        defs.appendChild(font);

        const glyphs = [
            { unicode: "a", glyphName: "a", d: "M547 519V295H770V223H547V0H475V223H251V295H475V519H547Z" },
            { unicode: "b", glyphName: "b", d: "M581 259Q581 288 561 308T511 329Q482 329 461 309T439 259Q439 230 460 209T511 188Q540 188 560 209T581 259ZM653 259Q653 229 642 203T612 158T566 127T511 116Q481 116 455 127T410 157T379 203T367 259Q367 288 378 314T409 359T455 390T511 401Q540 401 566 390T611 360T642 314T653 259ZM240 259Q240 315 261 364T319 450T405 508T511 530Q567 530 616 509T702 451T760 365T782 259Q782 203 761 154T703 68T617 10T511 -12Q455 -12 406 9T319 67T261 153T240 259ZM312 259Q312 218 327 182T370 119T433 77T511 61Q552 61 588 76T651 119T693 182T709 259Q709 300 694 336T651 400T588 442T511 458Q470 458 434 443T370 400T328 337T312 259Z" },
            { unicode: "c", glyphName: "c", d: "M216 26L756 544L806 492L266 -26L216 26ZZ" },
            { unicode: "d", glyphName: "d", d: "M292 259Q292 304 309 344T356 414T426 461T511 478Q556 478 595 461T665 414T712 344T729 259Q729 214 712 175T665 105T596 58T511 41Q466 41 426 58T356 105T309 174T292 259Z" },
            { unicode: "e", glyphName: "e", d: "M698 446H324V72H698V446ZM770 0H251V519H770V0Z" },
            { unicode: "f", glyphName: "f", d: "M195 18L511 566L826 18L764 -18L511 421L257 -18L195 18Z" },
            { unicode: "g", glyphName: "g", d: "M826 500L511 -48L195 500L257 537L511 97L764 537L826 500Z" },
            { unicode: "h", glyphName: "h", d: "M240 259Q240 315 261 364T319 450T405 508T511 530Q567 530 616 509T702 451T760 365T782 259Q782 203 761 154T703 68T617 10T511 -12Q455 -12 406 9T319 67T261 153T240 259ZM312 259Q312 218 327 182T370 119T433 77T511 61Q552 61 588 76T651 119T693 182T709 259Q709 300 694 336T651 400T588 442T511 458Q470 458 434 443T370 400T328 337T312 259Z" },
            { unicode: "i", glyphName: "i", d: "M251 91V427H770V91H251Z" },
            { unicode: "j", glyphName: "j", d: "M698 163V355H324V163H698ZM251 91V427H770V91H251Z" },
            { unicode: "k", glyphName: "k", d: "M709 468L899 279L709 89L659 140L762 243H259L362 140L312 89L122 279L312 468L362 416L261 315H760L659 416L709 468Z" },
            { unicode: "l", glyphName: "l", d: "M580 259Q580 230 560 211T510 191Q481 191 461 210T441 259Q441 288 461 309T510 330Q539 330 559 309T580 259ZM620 72Q648 121 672 164T727 259Q698 308 674 352T620 447H401Q387 422 374 399T348 354T322 308T294 259Q322 209 346 166T401 72H620ZM360 0L211 259L360 519H661L810 259L661 0H360Z" },
            { unicode: "m", glyphName: "m", d: "M753 357L583 259L753 161L717 98L547 196V0H475V196L304 98L268 161L438 259L268 357L304 420L475 321V519H547V322L717 420L753 357Z" },
            { unicode: "n", glyphName: "n", d: "M162 14Q198 97 237 175Q253 208 271 243T309 313T347 379T386 436Q428 491 483 519T598 547Q656 547 710 519T804 434L860 350L799 311Q790 326 780 340Q772 352 762 366T744 393Q717 435 679 455T598 475Q556 475 515 454T443 393Q416 356 387 305H591V233H348Q323 187 302 143T264 64Q245 23 228 -14L162 14Z" },
            { unicode: "o", glyphName: "o", d: "M251 530H448L351 698L413 734L511 565V566L608 734L670 698L573 530H770V458H573L837 0H184L448 458H251V530ZM712 72L511 421L309 72H712Z" },
            { unicode: "p", glyphName: "p", d: "M184 0L511 566L837 0H184Z" },
            { unicode: "q", glyphName: "q", d: "M184 0L511 566L837 0H184ZM712 72L511 421L309 72H712ZM581 187Q581 158 561 139T511 119Q482 119 462 138T442 187Q442 216 462 237T511 258Q540 258 560 237T581 187Z" },
            { unicode: "r", glyphName: "r", d: "M729 505L511 -48L292 505L359 532L418 383H603L662 532L729 505ZM511 149L575 311H446L511 149Z" },
            { unicode: "s", glyphName: "s", d: "M581 259Q581 288 561 308T511 329Q482 329 461 309T439 259Q439 230 460 209T511 188Q540 188 560 209T581 259ZM653 259Q653 229 642 203T612 158T566 127T511 116Q481 116 455 127T410 157T379 203T367 259Q367 288 378 314T409 359T455 390T511 401Q540 401 566 390T611 360T642 314T653 259ZM240 259Q240 315 261 364T319 450T405 508T511 530Q567 530 616 509T702 451T760 365T782 259Q782 203 761 154T703 68T617 10T511 -12Q455 -12 406 9T319 67T261 153T240 259ZM312 259Q312 218 327 182T370 119T433 77T511 61Q552 61 588 76T651 119T693 182T709 259Q709 300 694 336T651 400T588 442T511 458Q470 458 434 443T370 400T328 337T312 259Z" },
            { unicode: "t", glyphName: "t", d: "M191 52L731 570L781 518L706 446Q741 409 761 361T782 259Q782 203 761 154T703 68T617 10T511 -12Q454 -12 404 10T315 71L241 0L191 52ZM511 116Q480 116 454 127T408 159L368 121Q395 92 432 77T511 61Q552 61 588 76T651 119T693 182T709 259Q709 299 695 334T654 396L614 357Q632 337 642 313T653 259Q653 229 642 203T612 158T566 127T511 116ZM581 259Q581 273 576 285T561 307L460 209Q481 188 511 188Q540 188 560 209T581 259Z" },
            { unicode: "u", glyphName: "u", d: "M216 26L756 544L806 492L266 -26L216 26Z" },
            { unicode: "v", glyphName: "v", d: "M547 344Q576 371 609 404Q638 432 676 467T756 544L806 492Q764 451 726 416T659 352Q626 319 597 292L547 344ZM216 26Q245 53 278 86Q307 114 344 149T424 226L474 174Q432 133 395 98T328 34Q295 1 266 -26L216 26Z" },
            { unicode: "w", glyphName: "w", d: "M603 259Q603 240 596 223T576 194T546 174T510 166Q491 166 474 173T445 193T425 223T417 259Q417 278 424 295T444 324T474 344T510 352Q529 352 546 345T576 325T596 295T603 259Z" },
            { unicode: "x", glyphName: "x", d: "M292 259Q292 304 309 344T356 414T426 461T511 478Q556 478 595 461T665 414T712 344T729 259Q729 214 712 175T665 105T596 58T511 41Q466 41 426 58T356 105T309 174T292 259Z" },
            { unicode: "y", glyphName: "y", d: "M292 259Q292 304 309 344T356 414T426 461T511 478Q548 478 581 467T641 434L756 544L806 492L691 382Q709 356 719 325T729 259Q729 214 712 175T665 105T596 58T511 41Q474 41 441 52T380 84L266 -26L216 26L330 136Q312 162 302 193T292 259Z" },
            { unicode: "z", glyphName: "z", d: "M292 519H729V207Q729 162 712 122T665 52T595 5T510 -12Q465 -12 426 5T356 52T309 122T292 207V519ZM510 354Q540 354 567 343T614 312T645 265T657 208V446H364V214Q365 243 377 268T408 313T454 343T510 354Z" },
            { unicode: "A", glyphName: "A", d: "M698 446H324V72H698V446ZM770 0H251V519H770V0Z" },
            { unicode: "B", glyphName: "B", d: "M770 0H251V519H770V0ZM698 396L374 72H698V396ZM324 123L647 446H324V123Z" },
            { unicode: "C", glyphName: "C", d: "M292 311Q292 356 309 396T356 466T426 513T511 530Q556 530 595 513T665 466T712 396T729 311V0H292V311ZM364 72H657V239H364V72ZM657 311Q657 341 646 368T614 415T568 446T511 458Q481 458 454 447T407 415T376 368T364 311H657Z" },
            { unicode: "D", glyphName: "D", d: "M195 18L511 566L826 18L764 -18L511 421L257 -18L195 18Z" },
            { unicode: "E", glyphName: "E", d: "M208 61V458H813V61H741V386H280V61H208Z" },
            { unicode: "F", glyphName: "F", d: "M428 18L586 291L511 421L257 -18L195 18L511 566L826 18L764 -18L627 219L490 -18L428 18Z" },
            { unicode: "G", glyphName: "G", d: "M197 76L372 458H649L824 76L759 45L705 162H316Q302 133 289 104T263 45L197 76ZM349 234H672L603 386H418L349 234Z" },
            { unicode: "H", glyphName: "H", d: "M168 100L361 435Q389 483 428 506T511 530Q553 530 593 507T661 435L854 100L791 63L598 399V398Q581 428 558 443T511 458Q487 458 464 443T423 398V399L230 63L168 100Z" },
            { unicode: "I", glyphName: "I", d: "M826 500L511 -48L195 500L257 537L511 97L764 537L826 500Z" },
            { unicode: "J", glyphName: "J", d: "M511 97L656 349Q689 333 720 315L511 -48L302 315Q318 325 334 333T366 349L511 97ZM228 443Q289 485 360 507T511 530Q590 530 661 508T793 444L757 381Q704 417 642 437T511 458Q442 458 380 438T264 380L228 443Z" },
            { unicode: "K", glyphName: "K", d: "M854 419L661 83Q633 35 593 12T511 -12Q468 -12 429 11T361 83L168 419L230 455L423 120Q441 91 464 76T511 61Q534 61 557 76T598 120L791 455L854 419Z" },
            { unicode: "L", glyphName: "L", d: "M673 150Q673 117 660 88T625 36T574 1T510 -12Q477 -12 448 1T396 36T362 87T349 150Q349 183 359 209Q330 213 305 227T262 263T234 311T223 369Q223 402 235 431T270 483T321 517T385 530Q423 530 455 514T510 470Q533 498 566 514T637 530Q671 530 700 518T752 483T786 432T799 369Q799 338 789 311T760 263T716 228T662 209Q673 181 673 150ZM546 365Q548 329 574 304T637 279Q675 279 701 305T727 369Q727 406 701 432T637 458Q600 458 574 433T546 372V369V365ZM601 150Q601 188 575 214T510 240Q473 240 447 214T421 150Q421 113 447 87T510 61Q548 61 574 87T601 150ZM474 369Q474 406 449 432T385 458Q366 458 350 451T321 432T302 404T295 369Q295 350 302 334T321 305T349 286T385 279Q423 279 448 305T474 369Z" },
            { unicode: "M", glyphName: "M", d: "M385 530Q423 530 455 514T511 470Q534 498 566 514T637 530Q671 530 700 518T752 483T786 432T799 369Q799 339 789 312T760 263T717 228T663 208Q673 182 673 150Q673 117 660 88T625 36T574 1T511 -12Q477 -12 448 1T396 36T362 87T349 150Q349 165 351 179T359 208Q330 213 306 227T263 263T234 311T223 369Q223 402 236 431T271 483T322 517T385 530ZM475 369Q475 406 449 432T385 458Q347 458 321 432T295 369Q295 331 321 305T385 279Q407 279 427 290L463 228Q443 214 432 194T421 150Q421 113 447 87T511 61Q549 61 575 87T601 150Q601 173 590 193T559 228L593 290Q617 279 637 279Q675 279 701 305T727 369Q727 406 701 432T637 458Q599 458 573 432T547 369H475Z" },
            { unicode: "N", glyphName: "N", d: "M364 479Q364 510 343 531T290 553Q259 553 237 532T215 479Q215 447 237 426T290 404Q322 404 343 425T364 479ZM437 479Q437 448 426 422T394 375T348 344T290 332Q260 332 233 343T186 375T155 421T143 479Q143 509 154 536T186 582T233 613T290 625Q321 625 347 614T394 583T425 536T437 479ZM806 479Q806 510 784 531T731 553Q699 553 678 532T657 479Q657 447 678 426T731 404Q762 404 784 425T806 479ZM878 479Q878 448 867 422T835 375T788 344T731 332Q700 332 674 343T627 375T596 421T584 479Q584 509 595 536T627 582T673 613T731 625Q761 625 788 614T835 583T866 536T878 479ZM584 96Q584 127 563 148T510 170Q479 170 457 149T435 96Q435 64 457 43T510 21Q541 21 562 42T584 96ZM657 96Q657 65 646 39T614 -8T567 -39T510 -51Q480 -51 453 -40T406 -8T374 38T362 96Q362 126 373 153T405 200T453 231T510 243Q540 243 566 232T613 200T645 153T657 96Z" },
            { unicode: "O", glyphName: "O", d: "M1299 770Q1405 770 1498 730T1660 621T1770 458T1810 259Q1810 153 1770 60T1661 -102T1498 -212T1299 -252Q1240 -252 1185 -239T1079 -201T984 -142T905 -65Q870 -107 826 -141T732 -200T625 -238T511 -252Q405 -252 312 -212T150 -103T40 60T0 259Q0 365 40 458T149 620T312 730T511 770Q569 770 625 757T731 718T826 659T905 583Q940 625 984 659T1078 718T1184 756T1299 770ZM1299 697Q1242 697 1187 680T1081 632T986 557T905 458Q869 512 824 556T729 632T623 680T511 697Q420 697 340 663T201 569T107 430T72 259Q72 168 106 88T200 -51T340 -145T511 -180Q568 -180 623 -163T728 -115T824 -39T905 60Q941 6 985 -38T1081 -114T1187 -163T1299 -180Q1390 -180 1469 -146T1608 -52T1702 88T1737 259Q1737 350 1703 429T1609 568T1470 662T1299 697ZM240 259Q240 315 261 364T319 450T405 508T511 530Q567 530 616 509T702 451T760 365T782 259Q782 203 761 154T703 68T617 10T511 -12Q455 -12 406 9T319 67T261 153T240 259ZM312 259Q312 218 327 182T370 119T433 77T511 61Q552 61 588 76T651 119T693 182T709 259Q709 300 694 336T651 400T588 442T511 458Q470 458 434 443T370 400T328 337T312 259Z" },
            { unicode: "P", glyphName: "P", d: "M251 91V427H770V91H251Z" },
            { unicode: "Q", glyphName: "Q", d: "M342 519H679V0H342V519Z" },
            { unicode: "R", glyphName: "R", d: "M251 91V427H770V91H251ZM324 241H698V355H324V241Z" },
            { unicode: "S", glyphName: "S", d: "M713 335H308V408H713V335ZM713 140H308V212H713V140Z" },
            { unicode: "T", glyphName: "T", d: "M713 238H308V310H713V238Z" },
            { unicode: "U", glyphName: "U", d: "M3953 238H0V310H3953V238Z" },
            { unicode: "V", glyphName: "V", d: "M36 271Q36 227 52 189T97 123T164 78T247 61Q290 61 328 77T396 122T441 189T458 271Q458 330 480 381T541 471T631 532T742 555Q800 555 851 533T941 472T1002 382T1024 271Q1024 227 1040 189T1086 123T1153 78T1235 61Q1279 61 1317 77T1384 122T1429 189T1446 271Q1446 330 1468 381T1529 471T1619 532T1730 555Q1788 555 1840 533T1930 472T1990 382T2013 271Q2013 227 2029 189T2074 123T2141 78T2223 61Q2267 61 2305 77T2373 122T2418 189T2435 271Q2435 330 2457 381T2518 471T2607 532T2718 555Q2777 555 2828 533T2918 472T2979 382T3001 271Q3001 227 3017 189T3062 123T3129 78T3211 61Q3255 61 3293 77T3361 122T3406 189T3423 271Q3423 330 3445 381T3506 471T3596 532T3707 555Q3765 555 3816 533T3906 472T3967 382T3989 271H3917Q3917 315 3901 353T3856 420T3789 465T3707 482Q3663 482 3625 466T3557 421T3512 354T3495 271Q3495 212 3473 161T3412 71T3322 11T3211 -12Q3152 -12 3101 10T3012 71T2951 160T2929 271Q2929 315 2913 353T2867 420T2800 465T2718 482Q2674 482 2636 466T2569 421T2524 354T2507 271Q2507 212 2485 161T2424 71T2334 11T2223 -12Q2164 -12 2113 10T2023 71T1963 160T1940 271Q1940 315 1924 353T1879 420T1812 465T1730 482Q1686 482 1648 466T1581 421T1536 354T1519 271Q1519 212 1497 161T1436 71T1346 11T1235 -12Q1176 -12 1125 10T1035 71T975 160T952 271Q952 315 936 353T891 420T824 465T742 482Q698 482 660 466T592 421T547 354T530 271Q530 212 508 161T447 71T357 11T247 -12Q188 -12 137 10T47 71T-14 160T-36 271H36Z" },
            { unicode: "W", glyphName: "W", d: "M3953 -12Q3869 -12 3792 13T3651 83T3537 190T3459 326Q3430 252 3381 190T3268 83T3126 13T2965 -12Q2881 -12 2804 13T2663 83T2549 190T2471 326Q2442 252 2393 190T2279 83T2137 13T1976 -12Q1892 -12 1816 13T1675 82T1561 189T1482 325Q1453 251 1404 189T1291 83T1149 13T988 -12Q904 -12 827 13T686 83T572 190T494 326Q465 252 416 190T303 83T161 13T0 -12V61Q94 61 177 97T323 195T422 340T458 519H530Q530 424 566 341T664 195T809 97T988 61Q1083 61 1166 97T1312 195T1410 340T1446 519H1519Q1519 424 1555 341T1653 195T1798 97T1976 61Q2071 61 2154 97T2300 195T2399 340T2435 519H2507Q2507 424 2543 341T2641 195T2786 97T2965 61Q3059 61 3142 97T3288 195T3387 340T3423 519H3495Q3495 424 3531 341T3629 195T3775 97T3953 61V-12Z" },
            { unicode: "X", glyphName: "X", d: "M0 530Q84 530 161 505T302 435T416 328T494 192Q523 266 572 328T685 435T827 505T988 530Q1072 530 1149 505T1290 436T1404 329T1482 193Q1511 267 1560 329T1674 435T1816 505T1977 530Q2061 530 2138 505T2279 435T2393 328T2471 192Q2500 266 2549 328T2662 435T2804 505T2965 530Q3049 530 3126 505T3267 436T3381 329T3459 193Q3488 267 3537 329T3651 435T3792 505T3953 530V458Q3858 458 3775 422T3630 324T3532 179T3496 0H3423Q3423 95 3387 178T3289 324T3144 422T2965 458Q2870 458 2787 422T2641 324T2543 179T2507 0H2435Q2435 95 2399 178T2301 324T2155 422T1977 458Q1882 458 1799 422T1653 324T1555 179T1519 0H1446Q1446 95 1410 178T1312 324T1167 422T988 458Q893 458 810 422T665 324T566 179T530 0H458Q458 95 422 178T324 324T178 422T0 458V530Z" },
            { unicode: "Y", glyphName: "Y", d: "M3978 234L3706 -37L3212 457L2718 -37L2224 457L1730 -37L1236 457L740 -39L247 456L25 234L-25 284L249 558L742 63L1236 557L1730 63L2224 557L2718 63L3212 557L3706 63L3928 284L3978 234Z" },
            { unicode: "0", glyphName: "zero", d: "M638 716V-199H566V716H638ZM1078 716V-199H1006V716H1078ZM1517 716V-199H1445V716H1517ZM199 716V-199H127V716H199Z" },
            { unicode: "2", glyphName: "two", d: "M894 691L178 -25L127 25L843 742L894 691Z" },
            { unicode: "3", glyphName: "three", d: "M894 691L561 358L894 25L843 -25L510 307L178 -25L127 25L460 358L127 691L178 742L510 408L843 742L894 691Z" },
            { unicode: "4", glyphName: "four", d: "M792 691L178 77L127 128L741 742L792 691ZM229 25L843 639L894 588L280 -25L229 25Z" },
            { unicode: "5", glyphName: "five", d: "M843 77L613 307L561 255L792 25L741 -25L510 204L281 -25L230 25L460 255L408 307L178 77L127 128L357 358L127 588L178 639L408 409L459 460L229 691L280 742L510 511L741 742L792 691L561 460L613 408L844 639L895 588L664 358L894 128L843 77ZM459 358L511 306L562 357L510 409L459 358Z" },
            { unicode: "7", glyphName: "seven", d: "M199 716V-199H127V716H199Z" },
            { unicode: "8", glyphName: "eight", d: "M199 716V-199H127V716H199ZM638 716V-199H566V716H638Z" },
            { unicode: "9", glyphName: "nine", d: "M199 716V-199H127V716H199ZM638 716V-199H566V716H638ZM1078 716V-199H1006V716H1078Z" }
        ];

        glyphs.forEach(g => {
            const glyph = document.createElementNS(PowdercloudSvg.NS, 'glyph');
            glyph.setAttribute('unicode', g.unicode);
            glyph.setAttribute('glyph-name', g.glyphName);
            glyph.setAttribute('horiz-adv-x', '1021');
            glyph.setAttribute('d', g.d);
            font.appendChild(glyph);
        });
    }
}

export class PowdercloudSnowProfileGraph extends LitElement {
    static properties = {
        data: { type: Object },
        width: { type: Number },
        height: { type: Number }
    };

    static styles = css`
        :host {
            display: block;
            width: 100%;
            height: 100%;
        }
        svg {
            width: 100%;
            height: 100%;
            overflow: visible;
        }
    `;

    constructor() {
        super();
        this.width = 800;
        this.height = 600;
        this.data = this._generateDummyData();
    }

    firstUpdated() {
        this._renderGraph();
    }

    updated(changedProperties) {
        if (changedProperties.has('data') || changedProperties.has('width') || changedProperties.has('height')) {
            this._renderGraph();
        }
    }

    _renderGraph() {
        const svg = this.shadowRoot.querySelector('svg');
        if (!svg) return;

        const graph = new PowdercloudSvgSnowprofile(this.width, this.height);
        graph.drawData(svg, this.data, null);
    }

    _generateDummyData() {
        // Simplified dummy data based on powdercloud.data.dummy.js
        return {
            surfaceTemperature: -8,
            airTemperature: -5,
            isLayersDescendingTopDown: true,
            snowLayers: [
                { heightStart: 230, heightEnd: 200, snowHardness: "F", snowForm01: "FC", snowForm02: "DH" },
                { heightStart: 200, heightEnd: 198, snowHardness: "P", snowForm01: "FC", snowForm02: "DH" },
                { heightStart: 198, heightEnd: 197, snowHardness: "P", snowForm01: "FC", snowForm02: "DH" },
                { heightStart: 197, heightEnd: 195, snowHardness: "P", snowForm01: "FC", snowForm02: "DH" },
                { heightStart: 195, heightEnd: 75, snowHardness: "1F-", snowForm01: "PP", snowForm02: "DF" },
                { heightStart: 75, heightEnd: 0, snowHardness: "I", snowForm01: "SH", snowForm02: "IM" }
            ],
            temperatureLayers: [
                { height: 150, temperature: -10 },
                { height: 100, temperature: -12 },
                { height: 50, temperature: -20 }
            ]
        };
    }

    render() {
        return html`
            <svg viewBox="0 0 ${this.width} ${this.height}"></svg>
        `;
    }
}

customElements.define('powdercloud-snow-profile-graph', PowdercloudSnowProfileGraph);
