/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 */
// [Context Traits](https://github.com/ncardozo/context-traits).
// Copyright © 2012—2015 UCLouvain.
//             2016- Uniandes

const Namespace = function(name, parent = null) {
  if (!name) {
    throw new Error("Namespaces must have a name");
  }
  this.name = name;
  this.parent = parent;
  if (!parent) {
    this.home = findScriptHome();
  }
  return this;
};

// Define main behaviour of `Namespace`.

us.extend(Namespace.prototype, {

  root() {
    if (this.parent != null) {
      return this.parent.root();
    } else {
      return this;
    }
  },

  path() {
    if (this.parent != null) {
      const path = this.parent.path();
      path.push(this.name);
      return path;
    } else {
      return [ this.name ];
    }
  },

  normalizePath(path) {
    if (us.isString(path)) {
      return path = path.split('.');
    } else if (us.isArray(path)) {
      return path;
    } else {
      throw new Error("Invalid path specification");
    }
  },

  ensure(path) {
    path = this.normalizePath(path);
    let namespace = this;
    for (let name of path) {
      if (namespace[name] == null) {
        namespace[name] = new Namespace(name, namespace);
      }
      namespace = namespace[name];
    }
    return namespace;
  },

  add(properties) {
    return us.extend(this, properties);
  },

  load(path, options) {
    const success = options.success || (function() {});
    const failure = options.failure || (function() {});
    path = this.normalizePath(path);
    if (typeof document !== 'undefined' && document !== null) {
      return this.loadInBrowser(path, success, failure);
    } else {
      throw new Error("Loading of context modules not supported in current JavaScript platform.");
    }
  },

  loadInBrowser(path, success, failure) {
    if (typeof $ === 'undefined' || $ === null) {
      throw new Error("Context module loading depends on jQuery");
    }
    const target = this;
    const url = target.root().home + (target.path().concat(path)).join('/') + '.js';
    return $.ajax({
      url,
      dataType: "text", // Prevent premature evaluation
      success(data, textStatus, jqXHR) {
        try {
          let origExports;
          if (window.hasOwnProperty('exports')) {
            origExports = window.exports;
          }
          window.exports = {};
          $.globalEval(data);
          const leaf = target.ensure(path);
          leaf.add(window.exports);
          if (origExports != null) {
            window.exports = origExports;
          } else {
            delete window.exports;
          }
          console.log('Loaded ' + url);
          return success();
        } catch (error) {
          return failure(error);
        }
      },
      error(jqXHR, status, error) {
        console.log(`Failed to load ${url} (${status}): ${error}`);
        return failure(error);
      }
    });
  }
}
);

// Extend `Context` with behaviour related to namespaces.

us.extend(Context.prototype, {

  path(from) {
    if (from == null) { from = contexts; }
    const keys = us.keys(from);
    const values = us.values(from);
    let i = values.indexOf(this);
    if (i !== -1) {
      return [ keys[i] ];
    } else {
      for (i = 0; i < values.length; i++) {
        const subspace = values[i];
        if (subspace instanceof Namespace && (keys[i] !== 'parent')) {
          const p = this.path(subspace);
          if (p) {
            p.unshift(keys[i]);
            return p;
          }
        }
      }
      return false;
    }
  },

  name() {
    const path = this.path();
    if (path) {
      return path.join('.');
    } else {
      return 'anonymous';
    }
  },

  toString() {
    return `${this.name()} context`;
  }
}
);

// Ancilliary Functions
// --------------------

// Find the absolute path from which the current script has been
// loaded. If unable, return a falsy value.

var findScriptHome = function() {
  try {
    throw new Error;
  } catch (error) {
    // Obtain textual stacktrace from exception object
    const trace = error.stack || error.stacktrace;
    if (trace) {
      // Find first line mentioning a URL
      for (let line of trace.split('\n')) {
        const matches = /(http|file):\/\/[^/]*(\/.*\/)[^/]*\.js/.exec(line);
        if (matches != null) {
          return matches[2];
        }
      }
    } else if (error.sourceURL) {
      // Internet Explorer
      throw new Error('TODO: error.sourceURL not supported yet.');
    } else {
      throw new Error('Could not determine script home directory.');
    }
  }
  return null;
};
