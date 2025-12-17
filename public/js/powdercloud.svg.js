/**
 * Powdercloud Svg class
 *
 * requires jquery.svg.js, found here: http://keith-wood.name/svg.html or http://plugins.jquery.com/project/svg
 */
PowdercloudSvg = {
	
	/************* jQuery Svg - Start *******************/
	addSvgText: function(svg, x, y, text, fontFamily, fontSize, stroke, strokeWidth, fillOpacity, textAnchor, parent) {
		
		if (parent == undefined) {
			parent = null;
		}
		
		if (textAnchor == undefined) {
			textAnchor = null;
		}
		
		if (svg == undefined || x == undefined || y == undefined || text == undefined || fontFamily == undefined || stroke == undefined || strokeWidth == undefined || fillOpacity == undefined) {
			return;
		} else {
			return svg.text(parent, x, y, text, {'font-family': fontFamily, 'font-size': fontSize, 'stroke': stroke, 'stroke-width': strokeWidth, 'fill-opacity': fillOpacity, 'text-anchor': textAnchor});
		}
	},
	
	/**
	 * Example on how to create a Path:
	 *    var pathId = "yAxisLabelPath";
	 *    var path = svg.createPath(); 
	 *    svg.path( path.move(50, 90).line(150, 30),{id: pathId}); 
	 *
	 * Then use 'pathId' as a parameter for this function.
	 */
	addSvgTextPath: function(svg, textString, pathId, fontFamily, fontSize, stroke, strokeWidth, fillOpacity, parent) {
		
		if (parent == undefined) {
			parent = null;
		}
		
		if (svg == undefined || textString == undefined || pathId == undefined || fontFamily == undefined || fontSize == undefined || stroke == undefined || strokeWidth == undefined || fillOpacity == undefined) {
			return;
		} else {
			var text = svg.text("", {'font-family': fontFamily, 'font-size': fontSize, 'stroke': stroke, 'stroke-width': strokeWidth, 'fill-opacity': fillOpacity}); 
			var texts = svg.createText(); 
			return svg.textpath(parent, text, "#"+pathId, texts.string(textString));
		}
	},
	
	addSvgLine: function(svg, startX, startY, endX, endY, stroke, strokeWidth, strokeOpacity, strokeDashArray, parent) {
		
		if (parent == undefined) {
			parent = null;
		}
		
		if (svg == undefined || startX == undefined || startY == undefined || endX == undefined || endY == undefined || stroke == undefined || strokeWidth == undefined || strokeOpacity == undefined || strokeDashArray == undefined) {
			return;
		} else {
			return svg.line(parent, startX, startY, endX, endY, {'stroke': stroke, 'stroke-width': strokeWidth, 'stroke-opacity': strokeOpacity, 'stroke-dasharray': strokeDashArray});
		}
	},
	
	addSvgCircle: function(svg, x, y, radius, stroke, strokeWidth, strokeOpacity, strokeDashArray, fill, fillOpacity, tooltip, parent) {
		
		if (parent == undefined) {
			parent = null;
		}
		
		if (tooltip == undefined) {
			tooltip = null;
		}
		
		if (svg == undefined || x == undefined || y == undefined || radius == undefined || stroke == undefined || strokeWidth == undefined || strokeOpacity == undefined || strokeDashArray == undefined || fill == undefined || fillOpacity == undefined) {
			return;
		} else {
			return svg.circle(parent, x, y, radius, {'stroke': stroke, 'stroke-width': strokeWidth, 'stroke-opacity': strokeOpacity, 'stroke-dasharray': strokeDashArray, 'fill': fill, 'fill-opacity': fillOpacity});
		}
		
		/* 
			// TODO: tooltip R&D 
			add:
			'onmousemove': "ShowTooltip(evt, '" + tooltipText + "')", 'onmouseout': "HideTooltip(evt)"
			to settings for tooltip
			*/	
	},
	
	addSvgRect: function(svg, leftX, topY, width, height, stroke, strokeWidth, strokeOpacity, strokeDashArray, fill, fillOpacity, parent) {
		
		if (parent == undefined) {
			parent = null;
		}
		
		if (svg == undefined || leftX == undefined || topY == undefined || width == undefined || height == undefined || stroke == undefined || strokeWidth == undefined || strokeOpacity == undefined || strokeDashArray == undefined || fill == undefined || fillOpacity == undefined) {
			return;
		} else {
			return svg.rect(parent, leftX, topY, width, height, {'stroke': stroke, 'stroke-width': strokeWidth, 'stroke-opacity': strokeOpacity, 'stroke-dasharray': strokeDashArray, 'fill': fill, 'fill-opacity': fillOpacity});
		}
	},
	
	addSvgPath3Point: function(svg, point1, point2, point3, stroke, strokeWidth, fill, fillOpacity, parent) {
		
		if (parent == undefined) {
			parent = null;
		}
		
		if (svg == undefined || point1 == undefined || point2 == undefined || point3 == undefined || stroke == undefined || strokeWidth == undefined || fill == undefined || fillOpacity == undefined) {
			return;
		} else {
			var path = svg.createPath(); 
			
			// move
			// line to
			// line to
			// close	
			return svg.path(parent, path.move(point1.x, point1.y).line(point2.x, point2.y).line(point3.x, point3.y).close(),{'fill': fill, 'fill-opacity': fillOpacity, 'stroke': stroke, 'stroke-width': strokeWidth});
		}
	},
	
	addSvgPath4Point2Arc:function(svg, point1, point2, point3, point4, arc1, arc2, stroke, strokeWidth, fill, fillOpacity, tooltipText, parent) {
		
		if (parent == undefined) {
			parent = null;
		}
		
		if (tooltipText == undefined) {
			tooltipText = null;
		}
		
		if (svg == undefined || point1 == undefined || point2 == undefined || point3 == undefined || point4 == undefined || arc1 == undefined || arc2 == undefined || stroke == undefined || strokeWidth == undefined || fill == undefined || fillOpacity == undefined) {
			return;
		} else {
			var path = svg.createPath(); 
			
			// move
			// line to
			// arc
			// line to
			// arc	
			return svg.path(parent, path.move(point1.x, point1.y).line(point2.x, point2.y).arc(arc1.xRadius, arc1.yRadius, arc1.xAxisRotation, arc1.largeArcFlagBinaryValue, arc1.sweepFlagBinaryValue, point3.x, point3.y).line(point4.x, point4.y).arc(arc2.xRadius, arc2.yRadius, arc2.xAxisRotation, arc2.largeArcFlagBinaryValue, arc2.sweepFlagBinaryValue, point1.x, point1.y),{'fill': fill, 'fill-opacity': fillOpacity, 'stroke': stroke, 'stroke-width': strokeWidth});
		}
		/* 
		// TODO: tooltip R&D 
		add:
		'onmousemove': "ShowTooltip(evt, '" + tooltipText + "')", 'onmouseout': "HideTooltip(evt)"
		to settings for tooltip
		*/	
	},

	addSvgPath2Point1Arc:function(svg, point1, point2, arc1, stroke, strokeWidth, fill, fillOpacity, tooltipText, parent) {
		
		if (parent == undefined) {
			parent = null;
		}
		
		if (tooltipText == undefined) {
			tooltipText = null;
		}
		
		if (svg == undefined || point1 == undefined || point2 == undefined || arc1 == undefined || stroke == undefined || strokeWidth == undefined || fill == undefined || fillOpacity == undefined) {
			return;
		} else {
			var path = svg.createPath(); 
			
			// move
			// arc		
			return svg.path(parent, path.move(point1.x, point1.y).arc(arc1.xRadius, arc1.yRadius, arc1.xAxisRotation, arc1.largeArcFlagBinaryValue, arc1.sweepFlagBinaryValue, point2.x, point2.y),{'fill': fill, 'fill-opacity': fillOpacity, 'stroke': stroke, 'stroke-width': strokeWidth});
		}
		/* 
		// TODO: tooltip R&D 
		add:
		'onmousemove': "ShowTooltip(evt, '" + tooltipText + "')", 'onmouseout': "HideTooltip(evt)"
		to settings for tooltip
		*/	
	},
	/************* jQuery Svg - End *******************/
	
	/************* Helper Functions - Start *******************/
	
	/**
	 * Returns an Array of the object's properties.
	 */
	getObjectProperties: function(obj) {
		var props = new Array();

		for (var s in obj)
		{
			if (typeof(obj[s]) != "function") {
				props[props.length] = s;
			}
		}

		return props;
	},
	
	/**
	 * Returns whether current browser/version has SVG-font support.
	 * According to: http://caniuse.com/svg-fonts
	 */
	isSvgFontSupported: function() {
		if (BrowserDetect.browser == "Safari" || BrowserDetect.browser == "Chrome" || BrowserDetect.browser == "Opera") {
			return true;
		}
		return false;
	},
	
	/************* Helper Functions - End *******************/
	
	/************* Object Definitions - Start *******************/
		
		
	/**
	box = new Object(); // box
	box.point_uw; // upper west point
	box.point_le; // lower east point
	box.width;
	box.height;
	*/	
	createPoint: function(x, y) {
		if (x != null && y != null) {
			var point = new Object();
			point.x = x;
			point.y = y;
			return point;
		}
		return null;
	},
	
	/**
	point = new Object(); // point
	point.x; // x coord
	point.y; // y coord
	*/
	createBox: function(point_uw, point_le) {
		if (point_uw != null && point_uw != null) {
			var box = new Object();
			box.point_uw = point_uw; // upper west point
			box.point_le = point_le; // lower east point
			box.width = point_le.x - point_uw.x; // width
			box.height = point_le.y - point_uw.y; // height
			return box;
		}
		return null;
	}
	/************* Object Definitions - Start *******************/
}

/* 
// TODO: tooltip R&D 
function ShowTooltip(evt, mouseovertext)
{
	tooltip.setAttributeNS(null,"x",evt.clientX+11);
	tooltip.setAttributeNS(null,"y",evt.clientY+27);
	tooltip.firstChild.data = mouseovertext;
	tooltip.setAttributeNS(null,"visibility","visible");

	length = tooltip.getComputedTextLength();
	tooltip_bg.setAttributeNS(null,"width",length+8);
	tooltip_bg.setAttributeNS(null,"x",evt.clientX+8);
	tooltip_bg.setAttributeNS(null,"y",evt.clientY+14);
	tooltip_bg.setAttributeNS(null,"visibility","visibile");
}
function HideTooltip(evt)
{
	tooltip.setAttributeNS(null,"visibility","hidden");
	tooltip_bg.setAttributeNS(null,"visibility","hidden");
}
*/

/**
 * Usage:
 * BrowserDetect.browser
 * BrowserDetect.version
 * BrowserDetect.OS
 */
var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();
