import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class PowdercloudDisclaimer extends LitElement {
    createRenderRoot() {
        return this; // Use Light DOM to inherit global styles
    }

    render() {
        return html`
            <p style="font-weight: 300; font-style: italic; color: #888; font-size: 0.85em; margin-top: 20px;">Disclaimer<br>Persons accessing Powdercloud.com information have agreed to a Release of Liability, Waiver of
            Claims and Assumption of Risk Agreement and assume all risk of injury resulting from using this information.
            They further agree to release the contributors from liability and waive all claims against the contributors
            for any personal injury, death, property damage, loss or expense that may be sustained as a result of using
            the information provided herein by the contributors, due to any cause whatsoever, including negligence,
            breach of contract or breach of any statutory or other duty of care on the part of the contributors.</p>
        `;
    }
}

customElements.define('powdercloud-disclaimer', PowdercloudDisclaimer);
