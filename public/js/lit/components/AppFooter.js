import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class AppFooter extends LitElement {
    createRenderRoot() {
        return this; // Use Light DOM to inherit global styles
    }

    render() {
        return html`
      <div id="dvFooterWrap">
        <div id="dvFooter">
            <div class="dvFooterCols">
                <div class="dvFooterCol"></div>
                <div class="dvFooterCol"></div>
                <div class="dvFooterCol"></div>
                <div class="dvFooterCol"></div>
            </div>
            <div class="dvFooterLegal">
                <ul>
                    <li class="header">About Us</li>
                    <li><a href="/?r_cmd=1">PowderCloud Website</a></li>
                    <li><a href="/about/contact-us/">Contact Us</a></li>
                    <li><a href="#">Legal &amp; Privacy</a></li>
                </ul>
                <p style="margin-top: 30px; font-size: 0.8em;">
                    &copy;Copyright 2004-2011
                    <a href="http://www.powdercloud.com/" title="PowderCloud Software Inc. website">PowderCloud Software
                        Inc.</a>.
                    All Rights Reserved.
                    v1.01.118.
                </p>
            </div>
            <br style="clear: both;" />
        </div>
    </div>
    `;
    }
}

customElements.define('app-footer', AppFooter);
