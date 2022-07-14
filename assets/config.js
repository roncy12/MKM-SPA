System.config({
  "baseURL": "/assets/",
  "transpiler": "babel",
  "babelOptions": {
    "optional": [
      "runtime"
    ]
  },
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js",
    "bitbucket:*": "jspm_packages/bitbucket/*.js"
  },
  "defaultJSExtensions": true
});

System.config({
  "meta": {
    "*": {
      "format": "es6"
    }
  }
});

System.config({
  "map": {
    "asyncly/EventEmitter2": "github:asyncly/EventEmitter2@0.4.14",
    "babel": "npm:babel-core@5.6.15",
    "babel-runtime": "npm:babel-runtime@5.6.15",
    "bc-baseline": "bitbucket:pixelunion/bc-baseline@1.0.0",
    "bc-carousel": "bitbucket:pixelunion/bc-carousel@2.2.2",
    "bc-modal": "bitbucket:pixelunion/bc-modal@0.0.3",
    "bc-quick-shop": "bitbucket:pixelunion/bc-quick-shop@1.0.2",
    "bc-tabs": "bitbucket:pixelunion/bc-tabs@0.3.0",
    "bigcommerce/citadel": "github:bigcommerce/citadel@2.4.0",
    "bigcommerce/stencil-utils": "github:bigcommerce/stencil-utils@0.3.4",
    "bourbon": "npm:bourbon@4.2.3",
    "bourbon-neat": "npm:bourbon-neat@1.7.2",
    "browserstate/history.js": "github:browserstate/history.js@1.8.0",
    "caolan/async": "github:caolan/async@0.9.2",
    "casperin/nod": "github:casperin/nod@2.0.10",
    "core-js": "npm:core-js@0.9.18",
    "flickity": "npm:flickity@1.1.0",
    "history": "github:browserstate/history.js@1.8.0",
    "hmps/animate.scss": "github:hmps/animate.scss@1.0.1",
    "imagesloaded": "npm:imagesloaded@3.2.0",
    "jquery": "github:components/jquery@2.1.4",
    "jquery-revealer": "github:pixelunion/jquery.revealer@1.1.0",
    "jquery-trend": "npm:jquery-trend@0.1.0",
    "jquery-validetta": "github:PixelUnion/validetta@2.0.0",
    "knockout": "github:knockout/knockout@3.3.0",
    "lodash": "npm:lodash@3.10.1",
    "normalize.scss": "npm:normalize.scss@0.1.0",
    "scrollreveal": "npm:scrollreveal@3.0.6",
    "url": "github:jspm/nodelibs-url@0.1.0",
    "bitbucket:pixelunion/bc-carousel@2.2.2": {
      "imagesloaded": "npm:imagesloaded@3.2.0",
      "jquery": "github:components/jquery@2.1.4",
      "jquery-revealer": "github:pixelunion/jquery.revealer@2.0.0",
      "jquery-trend": "npm:jquery-trend@0.1.0"
    },
    "bitbucket:pixelunion/bc-modal@0.0.2": {
      "jquery": "github:components/jquery@2.1.4",
      "jquery-revealer": "github:pixelunion/jquery.revealer@2.0.0",
      "jquery-trend": "npm:jquery-trend@0.1.0",
      "lodash": "npm:lodash@3.10.1"
    },
    "bitbucket:pixelunion/bc-modal@0.0.3": {
      "jquery": "github:components/jquery@2.1.4",
      "jquery-revealer": "github:pixelunion/jquery.revealer@2.0.0",
      "jquery-trend": "npm:jquery-trend@0.1.0",
      "lodash": "npm:lodash@3.10.1"
    },
    "bitbucket:pixelunion/bc-quick-shop@1.0.2": {
      "imagesloaded": "npm:imagesloaded@3.2.0",
      "jquery": "github:components/jquery@2.1.4",
      "jquery-trend": "npm:jquery-trend@0.1.0"
    },
    "bitbucket:pixelunion/bc-tabs@0.0.2": {
      "jquery": "github:components/jquery@2.1.4"
    },
    "bitbucket:pixelunion/bc-tabs@0.3.0": {
      "jquery": "github:components/jquery@2.1.4"
    },
    "github:bigcommerce/stencil-utils@0.3.2": {
      "asyncly/EventEmitter2": "github:asyncly/EventEmitter2@0.4.14",
      "jquery": "github:components/jquery@2.1.4",
      "lodash": "npm:lodash@3.10.1"
    },
    "github:bigcommerce/stencil-utils@0.3.4": {
      "asyncly/EventEmitter2": "github:asyncly/EventEmitter2@0.4.14",
      "jquery": "github:components/jquery@2.1.4",
      "lodash": "npm:lodash@3.10.1"
    },
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.6.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.2"
    },
    "github:jspm/nodelibs-url@0.1.0": {
      "url": "npm:url@0.10.3"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:babel-runtime@5.6.15": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:buffer@3.6.0": {
      "base64-js": "npm:base64-js@0.0.8",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "ieee754": "npm:ieee754@1.1.6",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:core-js@0.9.18": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:doc-ready@1.0.3": {
      "eventie": "npm:eventie@1.0.6",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:fizzy-ui-utils@1.0.1": {
      "desandro-matches-selector": "npm:desandro-matches-selector@1.0.3",
      "doc-ready": "npm:doc-ready@1.0.3"
    },
    "npm:flickity@1.1.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "desandro-classie": "npm:desandro-classie@1.0.1",
      "desandro-get-style-property": "npm:desandro-get-style-property@1.0.4",
      "desandro-matches-selector": "npm:desandro-matches-selector@1.0.3",
      "doc-ready": "npm:doc-ready@1.0.3",
      "eventie": "npm:eventie@1.0.6",
      "fizzy-ui-utils": "npm:fizzy-ui-utils@1.0.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "get-size": "npm:get-size@1.2.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "tap-listener": "npm:tap-listener@1.1.1",
      "unidragger": "npm:unidragger@1.1.3",
      "wolfy87-eventemitter": "npm:wolfy87-eventemitter@4.2.11"
    },
    "npm:get-size@1.2.2": {
      "desandro-get-style-property": "npm:desandro-get-style-property@1.0.4"
    },
    "npm:imagesloaded@3.2.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "eventie": "npm:eventie@1.0.6",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "wolfy87-eventemitter": "npm:wolfy87-eventemitter@4.2.11"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:lodash@3.10.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:punycode@1.3.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:tap-listener@1.1.1": {
      "unipointer": "npm:unipointer@1.1.0"
    },
    "npm:unidragger@1.1.3": {
      "eventie": "npm:eventie@1.0.6",
      "unipointer": "npm:unipointer@1.1.0"
    },
    "npm:unipointer@1.1.0": {
      "eventie": "npm:eventie@1.0.6",
      "wolfy87-eventemitter": "npm:wolfy87-eventemitter@4.2.11"
    },
    "npm:url@0.10.3": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "punycode": "npm:punycode@1.3.2",
      "querystring": "npm:querystring@0.2.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:wolfy87-eventemitter@4.2.11": {
      "fs": "github:jspm/nodelibs-fs@0.1.2"
    }
  }
});

