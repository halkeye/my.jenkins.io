import "@material/mwc-button";
import {
  createSearchParam,
  extractSearchParamsObject,
} from "../util/search-params";
import {getInstanceUrl} from "../data/instance_info";
import {Redirect} from "../const";
import {svgPencil} from "../components/svg-pencil";
import {validateParam} from "../util/validate";

declare global {
  interface Window {
    redirect: Redirect;
  }
}

const createRedirectParams = (): string => {
  const redirectParams = window.redirect.params;
  const userParams = extractSearchParamsObject();
  if (!redirectParams) {
    return "";
  }
  const params = {};
  Object.entries(redirectParams).forEach(([key, type]) => {
    if (!userParams[key] || validateParam(type, userParams[key])) {
      throw Error("Wrong parameters");
    }
    params[key] = userParams[key];
  });
  return `?${createSearchParam(params)}`;
};

let changingInstance = false;

const render = (showTroubleshooting: boolean) => {
  const instanceUrl = getInstanceUrl();

  let params: string;
  try {
    params = createRedirectParams();
  } catch (err) {
    alert("Invalid parameters given.");
    document.location.assign(
      `/create-link?redirect=${window.redirect.redirect}`
    );
    return;
  }

  const changeUrl = `/redirect/_change/?redirect=${encodeURIComponent(
    window.redirect.redirect + "/" + params
  )}`;

  if (instanceUrl === null) {
    changingInstance = true;
    document.location.assign(changeUrl);
    return;
  }

  const redirectUrl = `${instanceUrl}/${window.redirect.redirect}${params}`;

  document.querySelector(".open-link")!.outerHTML = `
    <a href="${redirectUrl}" class='open-link' rel="noopener">
      <mwc-button>Open Link</mwc-button>
    </a>
  `;

  let changeInstanceEl = document.querySelector(".instance-footer")!;
  changeInstanceEl.innerHTML = `
    <b>Your instance URL:</b> ${instanceUrl}
    <a href="${changeUrl}">
      ${svgPencil}
    </a>
  `;
  changeInstanceEl.querySelector("a")!.addEventListener("click", () => {
    changingInstance = true;
  });

  // When we were changing the instance, we're not going to mess with troubleshooting.
  if (changingInstance) {
    changingInstance = false;
    return;
  }

  (document.querySelector(
    ".highlight"
  ) as HTMLDivElement).style.display = showTroubleshooting ? "block" : "none";
};

render(false);

// For Safari/FF to handle history.back() after update instance URL
window.onpageshow = (event: PageTransitionEvent) => {
  if (event.persisted) {
    render(true);
  }
};
