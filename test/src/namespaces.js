/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// [Context Traits](https://github.com/tagae/context-traits).
// Copyright © 2012—2015 UCLouvain.

module("Context Namespaces");

test("Infrastruture", function() {
  ok((typeof Namespace !== 'undefined' && Namespace !== null),
    "Namespace prototype exists.");
  return ok($.isFunction(Context.prototype.path),
    "Method for context path retrieval exists.");
});

test("Default namespaces", () => ok(contexts instanceof Namespace,
  "Root namespace `contexts` exists."));

test("Context paths", function() {
  const context = new Context();
  ok(!context.path(),
    "Freshly created context does not belong to any namespace.");
  // Generate random name through representation of number in base 36 (maximum).
  const name = makeName();
  // Register context in namespace
  contexts[name] = context;
  // Find out context path
  const path = context.path();
  ok(path,
    "Context in root namespace is effectively found by `path` method.");
  ok($.isArray(path),
    "Context path is an array.");
  ok(path.every(element => _.isString(element)),
    "Context path contains only names (strings).");
  deepEqual(path, [ name ],
    "A context in the root namespace has a path consisting of only its name.");
  // Remove context from namespace
  delete contexts[name];
  ok(!context.path(),
    "Context removed from its namespace is no longer found by `path` method.");
  const name2 = makeName();
  contexts[name] = new Namespace(contexts);
  contexts[name][name2] = context;
  deepEqual(context.path(), [name, name2],
    "Context with path of depth 2 is effectively found.");
  delete contexts[name];
  ok(!context.path(),
    "Context from trimmed (subtree) namespace is no longer found.");
  return deepEqual(contexts.Default.path(), ["Default"],
    "Default context detects its path correctly.");
});

test("Context name based on path", function() {
  const context = new Context();
  contexts.a = new Namespace(contexts);
  contexts.a.b = context;
  equal(context.name(), "a.b",
    "Context name follows path in the `contexts` namespace.");
  delete contexts.a;
  return equal(context.name(), "anonymous",
    "Context name reverts to anonymous when removed from namespace.");
});

asyncTest("Context module loading", function() {
  ok(((typeof contexts !== 'undefined' && contexts !== null ? contexts.platform : undefined) == null),
    "The platform namespace is initially not loaded.");
  return contexts.load('platform', {
    success() {
      ok(((typeof contexts !== 'undefined' && contexts !== null ? contexts.platform : undefined) != null),
        "The platform namespace can be loaded.");
      ok(contexts.platform instanceof Namespace,
        "Loaded object is namespace.");
      return start();
    },
    failure(error) {
      ok(false,
        "Failed to load platform namespace: " + error);
      return start();
    }
  }
  );
});
