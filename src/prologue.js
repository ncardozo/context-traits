/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 */
// [Context Traits](https://github.com/ncardozo/context-traits).
// Copyright © 2012—2015 UCLouvain.
//             2016- Uniandes
// Host Features
// -------------

// Check whether a required object exists. If unavailable, load
// corresponding module: in Node.js, use `require`; in web pages,
// modules must be inserted by hand using `<script>` tags, but this
// function can at least remind the user that such libraries need to be
// loaded.
const ensureObject = function(name, file, path = []) {
  let object = this[name]; // reads current module or `window` object
  if (object == null) {
    if (typeof require !== 'undefined' && require) {
      object = require(file);
      for (let attribute of path) {
        object = object[attribute];
      }
      return this[name] = object;
    } else {
      throw new Error(`Required object //${name} of library //${file} not found`);
    }
  }
};

// Check dependencies.
ensureObject('us', 'underscore');
ensureObject('Trait', 'traits', ['Trait']);



// Object Orientation
// ------------------

// Change function prototype so that objects created through this
// constructor will delegate to the given `parent`.
if (Function.prototype.inheritFrom == null) { Function.prototype.inheritFrom = function(parent) {
  this.prototype = new parent();
  return this;
}; }

// Data Structures
// ---------------

// If there is `push` and `pop` by default, why not `top`?
Array.prototype.top = function() {
  return this[this.length-1];
};
