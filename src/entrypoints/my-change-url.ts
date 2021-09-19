import "@material/mwc-button";
import {
  customElement,
  html,
  LitElement,
  TemplateResult,
  state,
  query,
  PropertyValues,
} from "lit-element";
import "../components/my-url-input";
import "../components/my-instance-info";
import { getInstanceUrl } from "../data/instance_info";
import { extractSearchParamsObject } from "../util/search-params";
import { MyUrlInputMain } from "../components/my-url-input";

const changeRequestedFromRedirect = extractSearchParamsObject().redirect;

@customElement("my-change-url")
class MyChangeUrl extends LitElement {
  @state() private _instanceUrl = getInstanceUrl();

  @state() private _error?: string;

  @query("my-url-input") private _urlInput?: MyUrlInputMain;

  createRenderRoot() {
    return this;
  }

  protected firstUpdated(changedProps: PropertyValues) {
    super.firstUpdated(changedProps);
    this.updateComplete.then(() => this._urlInput?.focus());
  }

  protected shouldUpdate() {
    return this._instanceUrl !== undefined;
  }

  protected render(): TemplateResult {
    return html`
      ${changeRequestedFromRedirect && !this._instanceUrl
        ? html`
            <div class="highlight">
              You are seeing this page because you have been linked to a page in
              your Jenkins instance but have not configured My Home
              Assistant. Enter the URL of your Jenkins instance to
              continue.
            </div>
          `
        : ""}
      <div class="card-content">
        ${this._instanceUrl
          ? html`<p>
              Configure My Jenkins by entering the URL of your Home
              Assistant instance.
            </p>`
          : ""}

        <my-url-input
          .value=${this._instanceUrl}
          @value-changed=${this._handleUrlChanged}
        ></my-url-input>

        ${this._error ? html`<div class="error">${this._error}</div>` : ""}

        <p>Note: This URL is only stored in your browser.</p>
      </div>
    `;
  }

  private _handleUrlChanged(ev: CustomEvent) {
    const instanceUrl = ev.detail.value;

    if (!instanceUrl) {
      this._error = "You need to configure a URL to use My Jenkins.";
      return;
    }

    this._error = undefined;

    if (changeRequestedFromRedirect) {
      window.location.assign(
        `/redirect/${decodeURIComponent(changeRequestedFromRedirect)}`
      );
    } else {
      // Shouldn't happen, but keep it as fallback
      history.back();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-change-url": MyChangeUrl;
  }
}
