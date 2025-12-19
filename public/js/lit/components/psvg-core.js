/**
 * psvg-core.js
 * 
 * Core SVG utilities for Powdercloud legacy chart porting.
 * Implements a "Naive SVG" wrapper to mimic jquery.svg.js functionality using standard DOM APIs.
 */

export class PowdercloudSvg {

    static isSvgFontSupported() {
        return true; // Modern browsers support SVG fonts or web fonts seamlessly
    }

    static createPoint(x, y) {
        return { x: x, y: y };
    }

    static createBox(point1, point2) {
        // Calculate upper-left (uw) and lower-right (le) regardless of input order
        const minX = Math.min(point1.x, point2.x);
        const maxX = Math.max(point1.x, point2.x);
        const minY = Math.min(point1.y, point2.y);
        const maxY = Math.max(point1.y, point2.y);

        return {
            point_uw: { x: minX, y: minY },
            point_le: { x: maxX, y: maxY },
            width: maxX - minX,
            height: maxY - minY
        };
    }

    static createSvgElement(name, attributes) {
        const el = document.createElementNS("http://www.w3.org/2000/svg", name);
        if (attributes) {
            for (const key in attributes) {
                el.setAttribute(key, attributes[key]);
            }
        }
        return el;
    }

    // --- Drawing Methods ---

    static addSvgRect(svg, x, y, width, height, stroke, strokeWidth, strokeOpacity, dashArray, fill, fillOpacity) {
        const rect = this.createSvgElement("rect", {
            x: x,
            y: y,
            width: width,
            height: height,
            stroke: stroke || "none",
            "stroke-width": strokeWidth || 0,
            "stroke-opacity": strokeOpacity !== undefined ? strokeOpacity : 1,
            "stroke-dasharray": dashArray || "none",
            fill: fill || "none",
            "fill-opacity": fillOpacity !== undefined ? fillOpacity : 1
        });
        svg.appendChild(rect);
        return rect;
    }

    static addSvgLine(svg, x1, y1, x2, y2, stroke, strokeWidth, strokeOpacity, dashArray) {
        const line = this.createSvgElement("line", {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            stroke: stroke || "black",
            "stroke-width": strokeWidth || 1,
            "stroke-opacity": strokeOpacity !== undefined ? strokeOpacity : 1,
            "stroke-dasharray": dashArray || "none"
        });
        svg.appendChild(line);
        return line;
    }

    static addSvgText(svg, x, y, text, fontFamily, fontSize, stroke, strokeWidth, strokeOpacity, anchor) {
        const t = this.createSvgElement("text", {
            x: x,
            y: y,
            "font-family": fontFamily || "sans-serif",
            "font-size": fontSize || 12,
            fill: stroke || "black", // Mimic stroke as fill color for text usually
            "text-anchor": anchor || "start"
        });
        t.textContent = text;
        svg.appendChild(t);
        return t;
    }

    static addSvgCircle(svg, cx, cy, r, fill, stroke, strokeWidth, dashArray, strokeColor, fillOpacity) {
        const circle = this.createSvgElement("circle", {
            cx: cx,
            cy: cy,
            r: r,
            fill: fill || "none",
            "fill-opacity": fillOpacity !== undefined ? fillOpacity : 1,
            stroke: strokeColor || stroke || "none",
            "stroke-width": strokeWidth || 1,
            "stroke-dasharray": dashArray || "none"
        });
        svg.appendChild(circle);
        return circle;
    }

    static addSvgPath3Point(svg, p1, p2, p3, stroke, strokeWidth, fill, fillOpacity) {
        const d = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} Z`;
        const path = this.createSvgElement("path", {
            d: d,
            stroke: stroke,
            "stroke-width": strokeWidth,
            fill: fill,
            "fill-opacity": fillOpacity !== undefined ? fillOpacity : 1
        });
        svg.appendChild(path);
        return path;
    }

    // Generic 'other' method for arbitrary elements (used for fonts/defs)
    static other(parent, name, attributes) {
        const el = this.createSvgElement(name, attributes);
        parent.appendChild(el);
        return el;
    }

    static defs(parent) {
        let d = parent.querySelector("defs");
        if (!d) {
            d = this.createSvgElement("defs");
            parent.insertBefore(d, parent.firstChild);
        }
        return d;
    }
}
