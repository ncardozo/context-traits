/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// [Context Traits](https://github.com/tagae/context-traits).
// Copyright © 2012—2015 UCLouvain.

// QUnit
// -----

// Extend QUnit with "noerror", the reciprocal of the "throws" assertion.
const noerror = function(block, message) {
  try {
    block.call();
  } catch (error) {
    QUnit.pushFailure(message, null, `Unexpected exception: ${error.message}`);
    return;
  }
  return QUnit.push(true, null, null, message);
};


// Ancillary functions
// -------------------

const makeName = function(length) {
  // Generate random name through representation of number in base 36.
  if (length == null) { length = 5; }
  return Math.random().toString(36).substring(length);
};
