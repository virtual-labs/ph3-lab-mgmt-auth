const path = require("path");
const log = require("./logger.js");

const Lab = {
  descriptor_name: "lab-descriptor",
  build_dir: "build",
  exp_build_dir: "exprepos",
  exp_deploy_dir: "exp",
  deployment_dest: "/var/www/html",
  stage_dir: "stage",
  ui_template_name: "templates",
  static_content_dir: "static_content",
  partials: [
    ["analytics_head", "lab-analytics-head"],
    ["analytics_body", "lab-analytics-body"],
    ["validation_body", "lab-validation-body"],
    ["commons", "commons"],
    ["header", "header"],
    ["breadcrumbs", "lab-breadcrumbs"],
    ["side_menu", "sidemenu"],
    ["content", "content"],
    ["footer", "footer"],
    ["popup_menu", "popupmenu"],
    ["simulation_header", "simulation-header"],
    ["bug_report_mobile", "bug-report-mobile"],
    ["svc_rating_display", "svc-rating-display"],
    ["svc_rating_submit", "svc-rating-submit"],
    ["nav_menu_items", "nav-menu-items"],
  ],
  pages: [
    {

    }
  ]
};

const Experiment = {
  descriptor_name: "experiment-descriptor.json",
  default_descriptor: "default-experiment-descriptor.json",
  build_dir: "build",
  exp_dir: "experiment",
  ui_template_name: "templates",
  static_content_dir: "static_content",
  partials: [
    ["analytics_head", "analytics-head"],
    ["analytics_body", "analytics-body"],
    ["validation_body", "validation-body"],
    ["meta", "meta"],
    ["commons", "commons"],
    ["header", "header"],
    ["breadcrumbs", "breadcrumbs"],
    ["tools", "tools"],
    ["side_menu", "sidemenu"],
    ["content", "content"],
    ["footer", "footer"],
    ["popup_menu", "popupmenu"],
    ["simulation_header", "simulation-header"],
    ["bug_report_mobile", "bug-report-mobile"],
    ["svc_rating_display", "svc-rating-display"],
    ["svc_rating_submit", "svc-rating-submit"],
    ["nav_menu_items", "nav-menu-items"],
  ],
  optional_pages: [
    "Observations",
    "Assignment",
    "Quiz"
  ]
};

const PROJECT_ROOT = path.resolve(__dirname);


/*
Experiment build path
-------------------------
This is here to avoid circular dependency between
Experiment moudle and Task module.
*/
function build_path(src) {
  return path.resolve(src, Experiment.build_dir, path.basename(path.resolve(src)));
}

function assets_path() {
  return path.resolve(__dirname, "assets");
}

function isURL(source) {
  try {
    new URL(source);
    return true;
  } catch (e) {
    log.debug(`${source} is not a valid URL`);
    return false;
  }
}

const VLAB_INFRA_CONFIG = {
  "production": {
    "url": "https://cdn.vlabs.ac.in/config/vlabs-config.js",
    "urlAlt": "https://cdn.vlabs.ac.in/config/vlabs-config.umd.cjs"
  },
  "testing": {
    "url": "https://cdn.vlabs.ac.in/config/vlabs-config.js",
    "urlAlt": "https://cdn.vlabs.ac.in/config/vlabs-config.umd.cjs"
  },
  "local": {
    "url": "https://cdn.vlabs.ac.in/config/vlabs-config.js",
    "urlAlt": "https://cdn.vlabs.ac.in/config/vlabs-config.umd.cjs"
  }
};

// Virtual Labs sign-in (docs/auth.md): the auth service whose widget.js every
// page loads, by build environment. VLAB_AUTH_URL overrides it.
const AUTH_URL = {
  "production": "https://auth.vlabs.ac.in",
  "testing": "https://auth.vlabs.ac.in",
  "local": "http://localhost:8080"
};

// authWidgetUrl returns the sign-in widget's URL for a build, or null when
// the build leaves sign-in out (--disableAuth).
function authWidgetUrl(options) {
  if (options.addAuth === false) {
    return null;
  }
  const base = process.env.VLAB_AUTH_URL || AUTH_URL[options.env] || AUTH_URL.production;
  return base.replace(/\/+$/, "") + "/widget.js";
}

module.exports.Experiment = Experiment;
module.exports.Lab = Lab;
module.exports.build_path = build_path;
module.exports.assets_path = assets_path;
module.exports.isURL = isURL;
module.exports.PROJECT_ROOT = PROJECT_ROOT;
module.exports.VLAB_INFRA_CONFIG = VLAB_INFRA_CONFIG; 
module.exports.authWidgetUrl = authWidgetUrl;
