import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class AppAvatar extends LitElement {
    static properties = {
        src: { type: String },
        alt: { type: String },
        initials: { type: String },
        size: { type: String }, // 'sm', 'md', 'lg', 'xl'
        shape: { type: String } // 'circle', 'square'
    };

    constructor() {
        super();
        this.src = '';
        this.alt = 'Avatar';
        this.initials = '';
        this.size = 'md';
        this.shape = 'circle';
    }

    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        return html`
            <style>
                .app-avatar {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    background-color: #bdbdbd;
                    color: white;
                    font-weight: bold;
                    text-transform: uppercase;
                    vertical-align: middle;
                    border: 1px solid rgba(0,0,0,0.1);
                }

                /* Sizes */
                .app-avatar.sm { width: 24px; height: 24px; font-size: 10px; }
                .app-avatar.md { width: 40px; height: 40px; font-size: 16px; }
                .app-avatar.lg { width: 64px; height: 64px; font-size: 24px; }
                .app-avatar.xl { width: 96px; height: 96px; font-size: 36px; }

                /* Shapes */
                .app-avatar.circle { border-radius: 50%; }
                .app-avatar.square { border-radius: 4px; }

                .app-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            </style>

            <div class="app-avatar ${this.size} ${this.shape}" title="${this.alt}">
                ${this.src
                ? html`<img src="${this.src}" alt="${this.alt}" @error="${e => e.target.style.display = 'none'}" />`
                : this.initials}
            </div>
        `;
    }
}

customElements.define('app-avatar', AppAvatar);
