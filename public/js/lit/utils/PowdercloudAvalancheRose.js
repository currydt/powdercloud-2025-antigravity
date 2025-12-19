import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import { PowdercloudSvg } from './PowdercloudSnowProfileGraph.js';

class PowdercloudSvgRose {
    constructor(width, height, _isMini, _hasLegend, _legendWidth) {
        this.canvasWidth = 0;
        this.canvasHeight = 0;
        this.isMini = false;
        this.hasLegend = false;
        this.legendWidth = 150;

        // Cardinal Lines Styles
        this.cardinalStrokeColor = "#BBBBBB";
        this.cardinalStrokeWidth = 1;
        this.cardinalStrokeOpacity = 1;
        this.cardinalStrokeDashArray = "none";
        this.isCardinalLabelsShown = true;

        // Elevation Circles Styles
        this.elevationCircleStrokeColor = "#BBBBBB";
        this.elevationCircleStrokeWidth = 1;
        this.elevationCircleStrokeOpacity = 1;
        this.elevationCircleStrokeDashArray = "none";
        this.elevationCircleFill = "none";
        this.elevationCircleFillOpacity = 0;
        this.isElevationLabelsShown = true;

        // Avalanche Styles
        this.isDrawCornerPointsForMultipleAv = false;
        this.AVALANCHE_PATH_STROKE_DEFAULT = "white";
        this.AVALANCHE_PATH_STROKE_WIDTH_DEFAULT = 0;
        this.AVALANCHE_PATH_FILL_OPACITY_DEFAULT = 0.6;
        this.AVALANCHE_LINE_STROKE_WIDTH = 3;
        this.AVALANCHE_COLOUR_DEFAULT = "black";
        this.AVALANCHE_COLOUR_SIZE_LESS_THAN_EQUAL_1 = "blue";
        this.AVALANCHE_COLOUR_SIZE_LESS_THAN_EQUAL_2 = "yellow";
        this.AVALANCHE_COLOUR_SIZE_GREATER_THAN_2 = "red";

        // Text Styles
        this.FONT_FAMILY_DEFAULT = "Roboto,sans-serif,Helvetica,Arial";
        this.FONT_SIZE_DEFAULT = 12;
        this.TEXT_STROKE_COLOR_DEFAULT = "#BBBBBB";
        this.TEXT_STROKE_WIDTH_DEFAULT = 0.1;
        this.TEXT_STROKE_OPACITY_DEFAULT = 1;
        this.TEXT_ANCHOR_MIDDLE = "middle";
        this.TEXT_ANCHOR_START = "start";
        this.TEXT_ANCHOR_END = "end";

        this.FONT_SIZE_LEGEND_H1 = 18;
        this.FONT_SIZE_LEGEND_H2 = 16;
        this.FONT_SIZE_LEGEND_ITEM = 12;

        // Model Constants
        this.TYPE_AVALANCHE = "Avalanche";
        this.SUB_TYPE_AVALANCHE_SINGLE = "Single";
        this.SUB_TYPE_AVALANCHE_MULTIPLE = "Multiple";
        this.SUB_TYPE_AVALANCHE_NOTABLE = "Notable";
        this.TYPE_WEATHER = "Weather";
        this.TYPE_SNOWPACK_TEST = "SnowpackTest";
        this.TYPE_SNOWPROFILE = "Snowprofile";

        // Model Variables
        this.canvasOffset = 30;
        this.numElevationCircles = 4;
        this.elevationInterval = 1000;
        this.obsBoxWidthHeight = 12;

        if (width) this.canvasWidth = width;
        if (height) this.canvasHeight = height;
        if (_hasLegend) this.hasLegend = _hasLegend;
        if (_legendWidth) this.legendWidth = _legendWidth;
        if (_isMini) {
            this.isMini = _isMini;
            this.FONT_SIZE_DEFAULT = 9;
            this.hasLegend = false;
            this.legendWidth = 0;
        }
    }

    drawChart(svg) {
        if (this.hasLegend == false) {
            this.legendWidth = 0;
        }

        this.top_y = 0 + this.canvasOffset;
        this.bottom_y = this.canvasHeight - this.canvasOffset;
        this.left_x = 0 + this.canvasOffset;
        this.right_x = this.canvasWidth - this.canvasOffset - this.legendWidth;
        this.center_x = (this.canvasWidth - this.legendWidth) / 2;
        this.center_y = this.canvasHeight / 2;

        this.drawCardinalLines(svg);
        this.drawElevationCircles(svg);

        if (this.hasLegend) {
            this.drawLegend(svg);
        }
    }

    radians(degrees) {
        return degrees * Math.PI / 180;
    }

    drawCardinalLines(svg) {
        PowdercloudSvg.addSvgLine(svg, this.center_x, this.top_y, this.center_x, this.bottom_y, this.cardinalStrokeColor, this.cardinalStrokeWidth, this.cardinalStrokeOpacity, this.cardinalStrokeDashArray, null);
        PowdercloudSvg.addSvgLine(svg, this.right_x, this.center_y, this.left_x, this.center_y, this.cardinalStrokeColor, this.cardinalStrokeWidth, this.cardinalStrokeOpacity, this.cardinalStrokeDashArray, null);

        var radians_45 = this.radians(45);
        var sinValue_45 = Math.sin(radians_45);
        var hypotenuse_45 = (this.right_x - this.left_x) / 2;
        var opposite_45 = sinValue_45 * hypotenuse_45;
        var cosValue_45 = Math.cos(radians_45);
        var adjacent_45 = cosValue_45 * hypotenuse_45;

        PowdercloudSvg.addSvgLine(svg, (this.center_x + adjacent_45), (this.center_y - opposite_45), (this.center_x - adjacent_45), (this.center_y + opposite_45), this.cardinalStrokeColor, this.cardinalStrokeWidth, this.cardinalStrokeOpacity, this.cardinalStrokeDashArray, null);
        PowdercloudSvg.addSvgLine(svg, (this.center_x + adjacent_45), (this.center_y + opposite_45), (this.center_x - adjacent_45), (this.center_y - opposite_45), this.cardinalStrokeColor, this.cardinalStrokeWidth, this.cardinalStrokeOpacity, this.cardinalStrokeDashArray, null);

        var radians_67_5 = this.radians(67.5);
        var sinValue_67_5 = Math.sin(radians_67_5);
        var hypotenuse_67_5 = (this.right_x - this.left_x) / 2;
        var opposite_67_5 = sinValue_67_5 * hypotenuse_67_5;
        var cosValue_67_5 = Math.cos(radians_67_5);
        var adjacent_67_5 = cosValue_67_5 * hypotenuse_67_5;

        PowdercloudSvg.addSvgLine(svg, (this.center_x + adjacent_67_5), (this.center_y - opposite_67_5), (this.center_x - adjacent_67_5), (this.center_y + opposite_67_5), this.cardinalStrokeColor, this.cardinalStrokeWidth, this.cardinalStrokeOpacity, this.cardinalStrokeDashArray, null);
        PowdercloudSvg.addSvgLine(svg, (this.center_x + adjacent_67_5), (this.center_y + opposite_67_5), (this.center_x - adjacent_67_5), (this.center_y - opposite_67_5), this.cardinalStrokeColor, this.cardinalStrokeWidth, this.cardinalStrokeOpacity, this.cardinalStrokeDashArray, null);

        var radians_22_5 = this.radians(22.5);
        var sinValue_22_5 = Math.sin(radians_22_5);
        var hypotenuse_22_5 = (this.right_x - this.left_x) / 2;
        var opposite_22_5 = sinValue_22_5 * hypotenuse_22_5;
        var cosValue_22_5 = Math.cos(radians_22_5);
        var adjacent_22_5 = cosValue_22_5 * hypotenuse_22_5;

        PowdercloudSvg.addSvgLine(svg, (this.center_x + adjacent_22_5), (this.center_y - opposite_22_5), (this.center_x - adjacent_22_5), (this.center_y + opposite_22_5), this.cardinalStrokeColor, this.cardinalStrokeWidth, this.cardinalStrokeOpacity, this.cardinalStrokeDashArray, null);
        PowdercloudSvg.addSvgLine(svg, (this.center_x + adjacent_22_5), (this.center_y + opposite_22_5), (this.center_x - adjacent_22_5), (this.center_y - opposite_22_5), this.cardinalStrokeColor, this.cardinalStrokeWidth, this.cardinalStrokeOpacity, this.cardinalStrokeDashArray, null);

        if (this.isCardinalLabelsShown) {
            PowdercloudSvg.addSvgText(svg, this.center_x, this.top_y - 10, "N", this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE);
            PowdercloudSvg.addSvgText(svg, this.center_x, this.bottom_y + 15, "S", this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE);
            PowdercloudSvg.addSvgText(svg, this.right_x + 10, this.center_y, "E", this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE);
            PowdercloudSvg.addSvgText(svg, this.left_x - 10, this.center_y, "W", this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE);
            PowdercloudSvg.addSvgText(svg, (this.center_x + adjacent_45 + 15), (this.center_y - opposite_45 - 10), "NE", this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE);
            PowdercloudSvg.addSvgText(svg, (this.center_x - adjacent_45 - 10), (this.center_y + opposite_45 + 15), "SW", this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE);
            PowdercloudSvg.addSvgText(svg, (this.center_x + adjacent_45 + 10), (this.center_y + opposite_45 + 15), "SE", this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE);
            PowdercloudSvg.addSvgText(svg, (this.center_x - adjacent_45 - 15), (this.center_y - opposite_45 - 5), "NW", this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE);
        }
    }

    drawElevationCircles(svg) {
        var radius_max = (this.bottom_y - this.top_y) / 2;
        var circleInterval = radius_max / this.numElevationCircles;

        for (let i = 1; i <= this.numElevationCircles; i++) {
            PowdercloudSvg.addSvgCircle(svg, this.center_x, this.center_y, circleInterval * i, this.elevationCircleStrokeColor, this.elevationCircleStrokeWidth, this.elevationCircleStrokeOpacity, this.elevationCircleStrokeDashArray, this.elevationCircleFill, this.elevationCircleFillOpacity);
        }

        for (let i = 0; i < this.numElevationCircles; i++) {
            if (this.isElevationLabelsShown) {
                if (this.isMini) {
                    if (i != 0 && i != (this.numElevationCircles - 1)) {
                        continue;
                    }
                }
                var elevationIntervalText = (this.elevationInterval * i) + "";
                PowdercloudSvg.addSvgText(svg, this.left_x + circleInterval * i, this.center_y + 15, elevationIntervalText, this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE);
                PowdercloudSvg.addSvgText(svg, this.right_x - circleInterval * i, this.center_y + 15, elevationIntervalText, this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE);
            }
        }
    }

    drawData(svg, data) {
        if (svg == null) return;

        while (svg.firstChild) {
            svg.firstChild.remove();
        }

        this.drawChart(svg);

        if (data != null) {
            var avalancheObs = [];
            var weatherObs = [];
            var snowpackTestObs = [];
            var snowprofileObs = [];

            for (let i = 0; i < data.length; i++) {
                if (data[i] && data[i].type) {
                    if (data[i].type == this.TYPE_AVALANCHE) {
                        avalancheObs.push(data[i]);
                    } else if (data[i].type == this.TYPE_WEATHER) {
                        weatherObs.push(data[i]);
                    } else if (data[i].type == this.TYPE_SNOWPACK_TEST) {
                        snowpackTestObs.push(data[i]);
                    } else if (data[i].type == this.TYPE_SNOWPROFILE) {
                        snowprofileObs.push(data[i]);
                    }
                }
            }

            this.drawAvalanches(svg, avalancheObs);
            this.drawWeatherObs(svg, weatherObs);
            this.drawSnowpackTestObs(svg, snowpackTestObs);
            this.drawSnowprofileObs(svg, snowprofileObs);
        }
    }

    drawAvalanches(svg, data) {
        if (data == null || data.length == 0) return;

        var listSingleAv = [];
        var listNotableAv = [];
        var listMultipleAvSinglePoint = [];
        var listMultipleAvLine = [];
        var listMultipleAvArcLine = [];
        var listMultipleAvArcPath = [];

        for (let i = 0; i < data.length; i++) {
            if (data[i].type == this.TYPE_AVALANCHE) {
                if (data[i].subtype == this.SUB_TYPE_AVALANCHE_SINGLE) {
                    listSingleAv.push(data[i]);
                } else if (data[i].subtype == this.SUB_TYPE_AVALANCHE_NOTABLE) {
                    listNotableAv.push(data[i]);
                } else if (data[i].subtype == this.SUB_TYPE_AVALANCHE_MULTIPLE) {
                    var elevationRangeStart = data[i].elevationRangeStart;
                    var elevationRangeEnd = data[i].elevationRangeEnd;
                    var avSizeRangeStart = data[i].avSizeRangeStart;
                    var avSizeRangeEnd = data[i].avSizeRangeEnd;
                    var aspectRangeStart = data[i].aspectRangeStart;
                    var aspectRangeEnd = data[i].aspectRangeEnd;

                    if (elevationRangeStart == null || elevationRangeEnd == null) {
                        if (elevationRangeStart == null && elevationRangeEnd != null) {
                            elevationRangeStart = elevationRangeEnd;
                            data[i].elevationRangeStart = elevationRangeEnd;
                        } else if (elevationRangeStart != null && elevationRangeEnd == null) {
                            elevationRangeEnd = elevationRangeStart;
                            data[i].elevationRangeEnd = elevationRangeStart;
                        } else {
                            continue;
                        }
                    }

                    if (avSizeRangeStart == null || avSizeRangeEnd == null) {
                        if (avSizeRangeStart == null && avSizeRangeEnd != null) {
                            avSizeRangeStart = avSizeRangeEnd;
                            data[i].avSizeRangeStart = avSizeRangeEnd;
                        } else if (avSizeRangeStart != null && avSizeRangeEnd == null) {
                            avSizeRangeEnd = avSizeRangeStart;
                            data[i].avSizeRangeEnd = avSizeRangeStart;
                        } else {
                            continue;
                        }
                    }

                    if (aspectRangeStart == null || aspectRangeEnd == null) {
                        if (aspectRangeStart == null && aspectRangeEnd != null) {
                            aspectRangeStart = aspectRangeEnd;
                            data[i].aspectRangeStart = aspectRangeEnd;
                        } else if (aspectRangeStart != null && aspectRangeEnd == null) {
                            aspectRangeEnd = aspectRangeStart;
                            data[i].aspectRangeEnd = aspectRangeStart;
                        } else {
                            continue;
                        }
                    }

                    if (elevationRangeStart == elevationRangeEnd && aspectRangeStart == aspectRangeEnd) {
                        listMultipleAvSinglePoint.push(data[i]);
                    } else if (elevationRangeStart != elevationRangeEnd && aspectRangeStart == aspectRangeEnd) {
                        listMultipleAvLine.push(data[i]);
                    } else if (elevationRangeStart == elevationRangeEnd && aspectRangeStart != aspectRangeEnd) {
                        listMultipleAvArcLine.push(data[i]);
                    } else {
                        listMultipleAvArcPath.push(data[i]);
                    }
                }
            }
        }

        for (let i = 0; i < listMultipleAvArcPath.length; i++) {
            this.drawAvalanchMultipleArcPath(svg, listMultipleAvArcPath[i].subtype, listMultipleAvArcPath[i].triggerCode, listMultipleAvArcPath[i].aspectRangeStart, listMultipleAvArcPath[i].aspectRangeEnd, listMultipleAvArcPath[i].elevationRangeStart, listMultipleAvArcPath[i].elevationRangeEnd, listMultipleAvArcPath[i].avSizeRangeStart, listMultipleAvArcPath[i].avSizeRangeEnd);
        }

        for (let i = 0; i < listMultipleAvLine.length; i++) {
            this.drawAvalanchMultipleLine(svg, listMultipleAvLine[i].subtype, listMultipleAvLine[i].triggerCode, listMultipleAvLine[i].aspectRangeStart, listMultipleAvLine[i].aspectRangeEnd, listMultipleAvLine[i].elevationRangeStart, listMultipleAvLine[i].elevationRangeEnd, listMultipleAvLine[i].avSizeRangeStart, listMultipleAvLine[i].avSizeRangeEnd);
        }

        for (let i = 0; i < listMultipleAvArcLine.length; i++) {
            this.drawAvalanchMultipleArcLine(svg, listMultipleAvArcLine[i].subtype, listMultipleAvArcLine[i].triggerCode, listMultipleAvArcLine[i].aspectRangeStart, listMultipleAvArcLine[i].aspectRangeEnd, listMultipleAvArcLine[i].elevationRangeStart, listMultipleAvArcLine[i].elevationRangeEnd, listMultipleAvArcLine[i].avSizeRangeStart, listMultipleAvArcLine[i].avSizeRangeEnd);
        }

        for (let i = 0; i < listNotableAv.length; i++) {
            this.drawAvalancheSingleNotable(svg, listNotableAv[i].aspectCode, listNotableAv[i].elevation, listNotableAv[i].size, listNotableAv[i].subtype, listNotableAv[i].triggerCode);
        }

        for (let i = 0; i < listMultipleAvSinglePoint.length; i++) {
            this.drawAvalancheSingleNotable(svg, listMultipleAvSinglePoint[i].aspectRangeEnd, listMultipleAvSinglePoint[i].elevationRangeEnd, listMultipleAvSinglePoint[i].avSizeRangeEnd, listMultipleAvSinglePoint[i].subtype, listMultipleAvSinglePoint[i].triggerCode);
        }

        for (let i = 0; i < listSingleAv.length; i++) {
            this.drawAvalancheSingleNotable(svg, listSingleAv[i].aspectCode, listSingleAv[i].elevation, listSingleAv[i].size, listSingleAv[i].subtype, listSingleAv[i].triggerCode);
        }
    }

    drawAvalancheSingleNotable(svg, aspectCode, elevation, size, subtype, triggerCode) {
        var avPoint = this.getPoint(aspectCode, elevation);
        var tooltip = aspectCode + ", " + elevation + ", " + size + ", " + triggerCode;
        this.drawAvalancheSymbol(svg, avPoint, size, subtype, triggerCode, tooltip);
    }

    drawAvalanchMultipleLine(svg, subtype, triggerCode, aspectRangeStart, aspectRangeEnd, elevationRangeStart, elevationRangeEnd, avSizeRangeStart, avSizeRangeEnd) {
        var pointStart = this.getPoint(aspectRangeStart, elevationRangeStart);
        var pointEnd = this.getPoint(aspectRangeStart, elevationRangeEnd);
        if (pointStart == null || pointEnd == null) return;
        PowdercloudSvg.addSvgLine(svg, pointStart.x, pointStart.y, pointEnd.x, pointEnd.y, this.getAvalancheSizeColor(avSizeRangeStart), this.AVALANCHE_LINE_STROKE_WIDTH, 1, "none", null);
    }

    drawAvalanchMultipleArcLine(svg, subtype, triggerCode, aspectRangeStart, aspectRangeEnd, elevationRangeStart, elevationRangeEnd, avSizeRangeStart, avSizeRangeEnd) {
        var pointStartAspectStartElevation = this.getPoint(aspectRangeStart, elevationRangeStart);
        var pointStartAspectEndElevation = this.getPoint(aspectRangeStart, elevationRangeEnd);
        var pointEndAspectEndElevation = this.getPoint(aspectRangeEnd, elevationRangeEnd);
        var pointEndAspectStartElevation = this.getPoint(aspectRangeEnd, elevationRangeStart);

        if (pointStartAspectStartElevation == null || pointStartAspectEndElevation == null || pointEndAspectEndElevation == null || pointEndAspectStartElevation == null) return;

        if (this.isDrawCornerPointsForMultipleAv) {
            if (avSizeRangeStart != null) {
                var tooltip1 = aspectRangeStart + ", " + elevationRangeStart + ", " + avSizeRangeStart + ", " + triggerCode;
                var tooltip2 = aspectRangeEnd + ", " + elevationRangeStart + ", " + avSizeRangeStart + ", " + triggerCode;
                this.drawAvalancheSymbol(svg, pointStartAspectStartElevation, avSizeRangeStart, subtype, triggerCode, tooltip1);
                this.drawAvalancheSymbol(svg, pointStartAspectEndElevation, avSizeRangeStart, subtype, triggerCode, tooltip2);
            }
        }

        var a = Math.abs(pointStartAspectEndElevation.x - this.center_x);
        var b = Math.abs(pointStartAspectEndElevation.y - this.center_y);
        var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
        var arc = {};
        arc.xRadius = c;
        arc.yRadius = c;
        arc.xAxisRotation = 0;
        arc.sweepFlagBinaryValue = true;

        var startAspectDegrees = this.getAspectDegrees(aspectRangeStart);
        var endAspectDegrees = this.getAspectDegrees(aspectRangeEnd);
        if (startAspectDegrees == null || endAspectDegrees == null) return;

        var angle = 0;
        if ((endAspectDegrees - startAspectDegrees) < 0) {
            angle = 360 - (Math.abs(endAspectDegrees - startAspectDegrees));
        } else {
            angle = endAspectDegrees - startAspectDegrees;
        }

        if (angle >= 180) {
            arc.largeArcFlagBinaryValue = true;
        } else {
            arc.largeArcFlagBinaryValue = false;
        }
        var tooltip3 = aspectRangeStart + " - " + aspectRangeEnd + ", " + elevationRangeStart + ", " + avSizeRangeStart + ", " + triggerCode;
        PowdercloudSvg.addSvgPath2Point1Arc(svg, pointStartAspectEndElevation, pointEndAspectEndElevation, arc, this.getAvalancheSizeColor(avSizeRangeStart), this.AVALANCHE_LINE_STROKE_WIDTH, "none", 0, tooltip3);
    }

    drawAvalanchMultipleArcPath(svg, subtype, triggerCode, aspectRangeStart, aspectRangeEnd, elevationRangeStart, elevationRangeEnd, avSizeRangeStart, avSizeRangeEnd) {
        var pointStartAspectStartElevation = this.getPoint(aspectRangeStart, elevationRangeStart);
        var pointStartAspectEndElevation = this.getPoint(aspectRangeStart, elevationRangeEnd);
        var pointEndAspectEndElevation = this.getPoint(aspectRangeEnd, elevationRangeEnd);
        var pointEndAspectStartElevation = this.getPoint(aspectRangeEnd, elevationRangeStart);

        if (pointStartAspectStartElevation == null || pointStartAspectEndElevation == null || pointEndAspectEndElevation == null || pointEndAspectStartElevation == null) return;

        if (this.isDrawCornerPointsForMultipleAv) {
            if (avSizeRangeStart != null) {
                var tooltip1 = aspectRangeStart + ", " + elevationRangeStart + ", " + avSizeRangeStart + ", " + triggerCode;
                var tooltip2 = aspectRangeStart + ", " + elevationRangeEnd + ", " + avSizeRangeStart + ", " + triggerCode;
                var tooltip3 = aspectRangeEnd + ", " + elevationRangeEnd + ", " + avSizeRangeStart + ", " + triggerCode;
                var tooltip4 = aspectRangeEnd + ", " + elevationRangeStart + ", " + avSizeRangeStart + ", " + triggerCode;
                this.drawAvalancheSymbol(svg, pointStartAspectStartElevation, avSizeRangeStart, subtype, triggerCode, tooltip1);
                this.drawAvalancheSymbol(svg, pointStartAspectEndElevation, avSizeRangeStart, subtype, triggerCode, tooltip2);
                this.drawAvalancheSymbol(svg, pointEndAspectEndElevation, avSizeRangeStart, subtype, triggerCode, tooltip3);
                this.drawAvalancheSymbol(svg, pointEndAspectStartElevation, avSizeRangeStart, subtype, triggerCode, tooltip4);
            }
        }

        var a_outside = Math.abs(pointEndAspectEndElevation.x - this.center_x);
        var b_outside = Math.abs(pointEndAspectEndElevation.y - this.center_y);
        var c_outside = Math.sqrt(Math.pow(a_outside, 2) + Math.pow(b_outside, 2));
        var a_inside = Math.abs(pointStartAspectStartElevation.x - this.center_x);
        var b_inside = Math.abs(pointStartAspectStartElevation.y - this.center_y);
        var c_inside = Math.sqrt(Math.pow(a_inside, 2) + Math.pow(b_inside, 2));

        var outsideArc = {};
        outsideArc.xRadius = c_outside;
        outsideArc.yRadius = c_outside;
        outsideArc.xAxisRotation = 0;
        outsideArc.sweepFlagBinaryValue = true;

        var insideArc = {};
        insideArc.xRadius = c_inside;
        insideArc.yRadius = c_inside;
        insideArc.xAxisRotation = 0;
        insideArc.sweepFlagBinaryValue = false;

        var startAspectDegrees = this.getAspectDegrees(aspectRangeStart);
        var endAspectDegrees = this.getAspectDegrees(aspectRangeEnd);
        if (startAspectDegrees == null || endAspectDegrees == null) return;

        let angle = 0;
        if ((endAspectDegrees - startAspectDegrees) < 0) {
            angle = 360 - (Math.abs(endAspectDegrees - startAspectDegrees));
        } else {
            angle = endAspectDegrees - startAspectDegrees;
        }

        if (angle >= 180) {
            outsideArc.largeArcFlagBinaryValue = true;
            insideArc.largeArcFlagBinaryValue = true;
        } else {
            outsideArc.largeArcFlagBinaryValue = false;
            insideArc.largeArcFlagBinaryValue = false;
        }
        var tooltip5 = aspectRangeStart + " - " + aspectRangeEnd + ", " + elevationRangeStart + " - " + elevationRangeEnd + ", " + avSizeRangeStart + ", " + triggerCode;
        PowdercloudSvg.addSvgPath4Point2Arc(svg, pointStartAspectStartElevation, pointStartAspectEndElevation, pointEndAspectEndElevation, pointEndAspectStartElevation, outsideArc, insideArc, this.AVALANCHE_PATH_STROKE_DEFAULT, this.AVALANCHE_PATH_STROKE_WIDTH_DEFAULT, this.getAvalancheSizeColor(avSizeRangeStart), this.AVALANCHE_PATH_FILL_OPACITY_DEFAULT, tooltip5);
    }

    drawAvalancheSymbol(svg, avPoint, size, subtype, triggerCode, tooltip) {
        if (avPoint == null) return;

        var color = this.getAvalancheSizeColor(size);
        var circleRadius = 1;
        var drawExclamationPoint = false;
        var exclamationPointPositionRight = true;
        var triggerCodeDistance = 0;

        if (subtype == this.SUB_TYPE_AVALANCHE_SINGLE || subtype == this.SUB_TYPE_AVALANCHE_MULTIPLE) {
            if (size <= 1) {
                color = "black";
                circleRadius = 2;
                triggerCodeDistance = 4;
            } else if (size > 1 && size <= 2) {
                circleRadius = 4;
                triggerCodeDistance = 8;
            } else if (size > 2 && size < 4) {
                circleRadius = 8;
                triggerCodeDistance = 12;
            } else if (size >= 4) {
                circleRadius = 8;
                triggerCodeDistance = 12;
                drawExclamationPoint = true;
            }
        } else if (subtype == this.SUB_TYPE_AVALANCHE_NOTABLE) {
            circleRadius = 8;
            triggerCodeDistance = 12;
            drawExclamationPoint = true;
            exclamationPointPositionRight = false;
        } else {
            return;
        }

        PowdercloudSvg.addSvgCircle(svg, avPoint.x, avPoint.y, circleRadius, color, 0, 0, "none", color, 1, tooltip);

        if (triggerCode != null) {
            PowdercloudSvg.addSvgText(svg, avPoint.x, avPoint.y - triggerCodeDistance, triggerCode, this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE);
        }

        if (drawExclamationPoint == true) {
            let exclamationPointX = avPoint.x;
            if (exclamationPointPositionRight) {
                exclamationPointX += triggerCodeDistance;
            } else {
                exclamationPointX -= triggerCodeDistance;
            }
            PowdercloudSvg.addSvgText(svg, exclamationPointX, avPoint.y, "!", this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE);
        }
    }

    drawWeatherObs(svg, data) {
        if (data == null || data.length == 0) return;

        for (let i = 0; i < data.length; i++) {
            if (data[i].type == this.TYPE_WEATHER) {
                var point = this.getPoint(data[i].aspectCode, data[i].elevation);
                if (point != null) {
                    var tmpLeftX = point.x - (this.obsBoxWidthHeight / 2);
                    var tmpTopY = point.y - (this.obsBoxWidthHeight / 2);
                    this.drawWeatherObsSymbol(svg, tmpLeftX, tmpTopY);
                }
            }
        }
    }

    drawWeatherObsSymbol(svg, x, y) {
        PowdercloudSvg.addSvgRect(svg, x, y, this.obsBoxWidthHeight, this.obsBoxWidthHeight, "blue", 0, 0, "none", "blue", 1);
    }

    drawSnowpackTestObs(svg, data) {
        if (data == null || data.length == 0) return;

        for (let i = 0; i < data.length; i++) {
            if (data[i].type == this.TYPE_SNOWPACK_TEST) {
                var point = this.getPoint(data[i].aspectCode, data[i].elevation);
                if (point != null) {
                    var tmpLeftX = point.x - (this.obsBoxWidthHeight / 2);
                    var tmpTopY = point.y - (this.obsBoxWidthHeight / 2);
                    this.drawSnowpackTestObsSymbol(svg, tmpLeftX, tmpTopY);
                }
            }
        }
    }

    drawSnowpackTestObsSymbol(svg, x, y) {
        PowdercloudSvg.addSvgRect(svg, x, y, this.obsBoxWidthHeight, this.obsBoxWidthHeight, "blue", 2, 1, "none", "white", 1);
    }

    drawSnowprofileObs(svg, data) {
        if (data == null || data.length == 0) return;

        for (let i = 0; i < data.length; i++) {
            if (data[i].type == this.TYPE_SNOWPROFILE) {
                var point = this.getPoint(data[i].aspectCode, data[i].elevation);
                if (point != null) {
                    var tmpLeftX = point.x - (this.obsBoxWidthHeight / 2);
                    var tmpTopY = point.y - (this.obsBoxWidthHeight / 2);
                    this.drawSnowprofileObsSymbol(svg, tmpLeftX, tmpTopY);
                }
            }
        }
    }

    drawSnowprofileObsSymbol(svg, x, y) {
        PowdercloudSvg.addSvgRect(svg, x, y, this.obsBoxWidthHeight, this.obsBoxWidthHeight, "black", 2, 1, "none", "white", 1);

        var spacer = this.obsBoxWidthHeight / 4;
        PowdercloudSvg.addSvgLine(svg, x, (y + spacer), (x + this.obsBoxWidthHeight), (y + spacer), "black", 1, 1, "none", null);
        PowdercloudSvg.addSvgLine(svg, x, (y + (spacer * 2)), (x + this.obsBoxWidthHeight), (y + (spacer * 2)), "black", 1, 1, "none", null);
        PowdercloudSvg.addSvgLine(svg, x, (y + (spacer * 3)), (x + this.obsBoxWidthHeight), (y + (spacer * 3)), "black", 1, 1, "none", null);
    }

    getPoint(aspectCode, elevation) {
        var screenRadius = this.center_y - this.top_y;
        var screenDistanceFromEdge = (elevation * screenRadius) / (this.numElevationCircles * this.elevationInterval);
        var screenDistanceToCenter = screenRadius - screenDistanceFromEdge;

        var point_x;
        var point_y;

        let rad = this.radians(this.getAspectDegrees(aspectCode));
        let sinValue = Math.sin(rad);
        let oppositeLength = sinValue * screenDistanceToCenter;
        let cosValue = Math.cos(rad);
        let adjacentLength = cosValue * screenDistanceToCenter;

        switch (aspectCode) {
            case "N":
                point_x = this.center_x;
                point_y = this.center_y - screenDistanceToCenter;
                break;
            case "NE":
                point_x = this.center_x + adjacentLength;
                point_y = this.center_y - oppositeLength;
                break;
            case "E":
                point_x = this.center_x + screenDistanceToCenter;
                point_y = this.center_y;
                break;
            case "SE":
                point_x = this.center_x - adjacentLength;
                point_y = this.center_y + oppositeLength;
                break;
            case "S":
                point_x = this.center_x;
                point_y = this.center_y + screenDistanceToCenter;
                break;
            case "SW":
                point_x = this.center_x + adjacentLength;
                point_y = this.center_y - oppositeLength;
                break;
            case "W":
                point_x = this.center_x - screenDistanceToCenter;
                point_y = this.center_y;
                break;
            case "NW":
                point_x = this.center_x - adjacentLength;
                point_y = this.center_y + oppositeLength;
                break;
            case "NNE":
                point_x = this.center_x + oppositeLength;
                point_y = this.center_y - adjacentLength;
                break;
            case "ENE":
                point_x = this.center_x + oppositeLength;
                point_y = this.center_y - adjacentLength;
                break;
            case "ESE":
                point_x = this.center_x + oppositeLength;
                point_y = this.center_y - adjacentLength;
                break;
            case "SSE":
                point_x = this.center_x + oppositeLength;
                point_y = this.center_y - adjacentLength;
                break;
            case "SSW":
                point_x = this.center_x + oppositeLength;
                point_y = this.center_y - adjacentLength;
                break;
            case "WSW":
                point_x = this.center_x + oppositeLength;
                point_y = this.center_y - adjacentLength;
                break;
            case "WNW":
                point_x = this.center_x + oppositeLength;
                point_y = this.center_y - adjacentLength;
                break;
            case "NNW":
                point_x = this.center_x + oppositeLength;
                point_y = this.center_y - adjacentLength;
                break;
        }

        if (point_x != null && point_y != null) {
            return { x: point_x, y: point_y };
        } else {
            return null;
        }
    }

    getAspectDegrees(aspectCode) {
        if (aspectCode == null) return null;
        var d = -1;
        switch (aspectCode) {
            case "N": d = 0; break;
            case "NE": d = 45; break;
            case "E": d = 90; break;
            case "SE": d = 135; break;
            case "S": d = 180; break;
            case "SW": d = 225; break;
            case "W": d = 270; break;
            case "NW": d = 315; break;
            case "NNE": d = 22.5; break;
            case "ENE": d = 67.5; break;
            case "ESE": d = 112.5; break;
            case "SSE": d = 157.5; break;
            case "SSW": d = 202.5; break;
            case "WSW": d = 247.5; break;
            case "WNW": d = 292.5; break;
            case "NNW": d = 337.5; break;
            default: d = -1; break;
        }
        return (d == -1) ? null : d;
    }

    getAvalancheSizeColor(size) {
        if (size == null) return this.AVALANCHE_COLOUR_DEFAULT;
        if (size <= 1) return this.AVALANCHE_COLOUR_SIZE_LESS_THAN_EQUAL_1;
        else if (size <= 2) return this.AVALANCHE_COLOUR_SIZE_LESS_THAN_EQUAL_2;
        else if (size > 2) return this.AVALANCHE_COLOUR_SIZE_GREATER_THAN_2;
        return this.AVALANCHE_COLOUR_DEFAULT;
    }
}

export class PowdercloudAvalancheRose extends LitElement {
    static properties = {
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
        this.width = 600;
        this.height = 600;
    }

    firstUpdated() {
        this._renderGraph();
    }

    _renderGraph() {
        const svg = this.shadowRoot.querySelector('svg');
        if (!svg) return;

        const graph = new PowdercloudSvgRose(this.width, this.height, false, false);

        // Dummy Data
        const data = [
            { type: "Avalanche", subtype: "Single", aspectCode: "N", elevation: 2500, size: 1.5, triggerCode: "Na" },
            { type: "Avalanche", subtype: "Single", aspectCode: "NE", elevation: 3000, size: 2.5, triggerCode: "Sc" },
            { type: "Avalanche", subtype: "Notable", aspectCode: "S", elevation: 1500, size: 3.5, triggerCode: "X" },
            { type: "Avalanche", subtype: "Multiple", elevationRangeStart: 2000, elevationRangeEnd: 2500, aspectRangeStart: "NW", aspectRangeEnd: "N", avSizeRangeStart: 2, avSizeRangeEnd: 2, triggerCode: "Na" },
            { type: "Weather", aspectCode: "W", elevation: 2000 },
            { type: "SnowpackTest", aspectCode: "E", elevation: 1800 },
            { type: "Snowprofile", aspectCode: "SE", elevation: 2200 }
        ];

        graph.drawData(svg, data);
    }

    render() {
        return html`
            <svg viewBox="0 0 ${this.width} ${this.height}"></svg>
        `;
    }
}

customElements.define('powdercloud-avalanche-rose', PowdercloudAvalancheRose);
