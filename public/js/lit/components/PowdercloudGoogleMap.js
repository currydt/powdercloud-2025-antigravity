import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

/**
 * PowdercloudGoogleMap - A Lit wrapper for Google Maps
 * 
 * @property {string} apiKey - Google Maps API Key
 * @property {number} lat - Center latitude
 * @property {number} lng - Center longitude
 * @property {number} zoom - Zoom level
 * @property {Array} markers - Array of {lat, lng, title} objects
 * 
 * @fires map-ready - When map is loaded
 * @fires marker-click - When a marker is clicked
 */
export class PowdercloudGoogleMap extends LitElement {
    static properties = {
        apiKey: { type: String },
        lat: { type: Number },
        lng: { type: Number },
        zoom: { type: Number },
        markers: { type: Array }
    };

    static styles = css`
        :host {
            display: block;
            width: 100%;
            height: 100%; /* Changed from fixed 400px to fill container */
            min-height: 300px; 
            background: #eee;
            position: relative;
        }
        
        #map {
            width: 100%;
            height: 100%;
        }

        .error {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #666;
            padding: 20px;
            text-align: center;
        }
    `;

    constructor() {
        super();
        this.lat = 50.1163; // Default: Whistler
        this.lng = -122.9574;
        this.zoom = 10;
        this.markers = [];
        this.map = null;
        this.googleMarkers = [];
        this.markerColor = null;
    }

    firstUpdated() {
        if (window.google && window.google.maps) {
            this.initMap();
        } else if (this.apiKey) {
            this.loadScript();
        } else {
            // Check if script is already present but maybe not loaded yet (e.g. from existing ExtJS page)
            if (document.querySelector('script[src*="maps.googleapis.com"]')) {
                // Simple retry mechanism or wait
                setTimeout(() => {
                    if (window.google && window.google.maps) this.initMap();
                }, 1000);
            } else {
                console.warn('PowdercloudGoogleMap: No API key provided and Google Maps SDK not detected.');
            }
        }
    }

    updated(changedProperties) {
        if (this.map) {
            if (changedProperties.has('lat') || changedProperties.has('lng')) {
                this.map.setCenter({ lat: this.lat, lng: this.lng });
            }
            if (changedProperties.has('zoom')) {
                this.map.setZoom(this.zoom);
            }
            if (changedProperties.has('markers')) {
                this.updateMarkers();
            }
        }
    }

    loadScript() {
        if (document.getElementById('google-maps-script')) {
            return; // Script already loading
        }

        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}`;
        script.async = true;
        script.defer = true;

        script.onload = () => this.initMap();
        script.onerror = () => console.error('PowdercloudGoogleMap: Failed to load Google Maps script');

        document.head.appendChild(script);
    }

    initMap() {
        const mapEl = this.shadowRoot.getElementById('map');
        if (!mapEl) return;

        this.map = new google.maps.Map(mapEl, {
            center: { lat: this.lat, lng: this.lng },
            zoom: this.zoom,
            mapTypeId: 'terrain',
            streetViewControl: false
        });

        this.updateMarkers();

        this.dispatchEvent(new CustomEvent('map-ready', {
            detail: { map: this.map },
            bubbles: true,
            composed: true
        }));
    }

    updateMarkers() {
        // Clear existing markers
        this.googleMarkers.forEach(m => m.setMap(null));
        this.googleMarkers = [];

        if (!this.markers) return;

        // Add new markers with optional colors
        this.markers.forEach((m, index) => {
            const markerOptions = {
                position: { lat: m.lat, lng: m.lng },
                map: this.map,
                title: m.title || ''
            };

            // Use marker-specific color, or global styled color
            if (this.markerColor) {
                markerOptions.icon = {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: this.markerColor,
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2
                };
            } else if (m.color) {
                markerOptions.icon = {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: m.color,
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2
                };
            }

            const marker = new google.maps.Marker(markerOptions);

            marker.addListener('click', () => {
                this.dispatchEvent(new CustomEvent('marker-click', {
                    detail: { marker: m, index },
                    bubbles: true,
                    composed: true
                }));
            });

            this.googleMarkers.push(marker);
        });
    }

    render() {
        return html`
            <div id="map"></div>
        `;
    }
}

customElements.define('powdercloud-google-map', PowdercloudGoogleMap);
