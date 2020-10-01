// [Context Traits](https://github.com/tagae/context-traits).
// Copyright © 2012—2015 UCLouvain.

module("Context Activation");

test("Infrastructure", function() {
  ok($.isFunction(Context.prototype.activate),
    "Method for context activation exists.");
  ok($.isFunction(Context.prototype.deactivate),
    "Method for context deactivation exists.");
  return ok($.isFunction(Context.prototype.isActive),
    "Method for context activation state test exists.");
});

test("Basic activation", function() {
  const context = new Context();
  ok(!context.isActive(),
    "A fresh context is initially inactive.");
  noerror((() => context.activate()),
    "Freshly created context can be activated.");
  ok(context.isActive(),
    "Activation leaves the context in an active state.");
  noerror((() => context.deactivate()),
    "Freshly activated context can be deactivated.");
  ok(!context.isActive(),
    "Deactivation leaves the context in an inactive state.");
  strictEqual(context, context.activate(),
    "activate() returns the receiver object.");
  return strictEqual(context, context.deactivate(),
    "deactivate() returns the receiver object.");
});

test("Multiple activation", function() {
  let n;
  const context = new Context();
  for (n = 1; n <= 10; n++) { context.activate(); }
  ok(context.isActive(),
    "A multiply-activated context is active.");
  for (n = 1; n <= 9; n++) { context.deactivate(); }
  ok(context.isActive(),
    "Context stays active for fewer deactivations than activations.");
  context.deactivate();
  return ok(!context.isActive(),
    "Context becomes inactive after matching number of deactivations.");
});

test("Disallowed deactivation", function() {
  let n;
  const context = new Context();
  throws((() => context.deactivate()),
    /cannot.*deactivate.*context/i,
    "Deactivation of inactive contexts is disallowed.");
  for (n = 1; n <= 3; n++) { context.activate(); }
  for (n = 1; n <= 3; n++) { context.deactivate(); }
  return throws((() => context.deactivate()),
    /cannot.*deactivate.*context/i,
    "Previous context activity should not interfere with disallowed deactivations.");
});
