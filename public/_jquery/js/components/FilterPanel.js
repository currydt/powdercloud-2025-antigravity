import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class FilterPanel extends LitElement {
    static properties = {
        title: { type: String },
        tagline: { type: String }
    };

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
            <h1>${this.title || 'Page Title'}</h1>
            ${this.tagline ? html`<p>${this.tagline}</p>` : ''}
            
            <div class="dvFilterWrap">
                <div id="dvFilterHead" class="dvFilterHeadOpen">
                    <img id="imgFilter" src="/img/arrow-down.gif" /> Filter
                </div>
                <div id="dvFilter" style="display: block;">
                    <form name="frmFilter">
                        <div id="dvFilterOptions">
                            Mode:<br />
                            <input type="radio" id="idRadFilter1" name="flt_mode" value="c" /><label class="dis" for="idRadFilter1">Community</label>
                            <input type="radio" id="idRadFilter2" name="flt_mode" value="f" /><label class="dis" for="idRadFilter2">Favourites</label>
                            <input checked="checked" type="radio" id="idRadFilter3" name="flt_mode" value="o" /><label class="dis" for="idRadFilter3">Operations</label>
                        </div>
                        <div>
                            From:<br />
                            <input type="text" class="frmTextInput w90" name="filtdstart_d" value="Today - 7" id="infiltdstart" />
                        </div>
                        <div>
                            To:<br />
                            <input type="text" class="frmTextInput w90" name="filtdend_d" value="Today" id="infiltdend" />
                        </div>
                        <div style="float: right;">
                            <br />
                            <a href="#filter" id="mode-daterange-filter-button" class="fg-button ui-state-default fg-button-icon-left ui-corner-all">
                                <span class="ui-icon ui-icon-refresh"></span>Update
                            </a>
                        </div>
                        <br class="brC" />
                    </form>
                </div>
            </div>
        `;
    }
}

customElements.define('filter-panel', FilterPanel);
