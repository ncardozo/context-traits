// [Context Traits](https://github.com/tagae/context-traits).
// Copyright © 2012—2015 UCLouvain.

module("Context Prototypes");

test("Context", function() {
  ok((typeof Context !== 'undefined' && Context),
    "Context prototype exists.");
  ok($.isFunction(Context),
    "Context is a (constructor) function.");
  noerror((() => new Context()),
    "Contexts can be created.");
  return ok(new Context() instanceof Context,
    "The `instanceof` operator correctly detects contexts.");
});

test("Default context", function() {
  ok((contexts.Default),
    "The default context is defined.");
  ok(contexts.Default instanceof Context,
    "The default context is indeed a context.");
  ok(contexts.Default.isActive(),
    "The default context is active.");
  const current = contexts.Default;
  return strictEqual(current, contexts.Default,
    "The default context is persistent.");
});
