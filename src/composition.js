/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS203: Remove `|| {}` from converted for-own loops
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
/* [Context Traits](https://github.com/ncardozo/context-traits).
 * Copyright © 2012—2015 UCLouvain.
 *             2016- Uniandes
 */

traits = {};

traits.Extensible = Trait({
  proceed() {
    const {
      manager
    } = contexts.Default;
    const {
      invocations
    } = manager;
    if (invocations.length === 0) {
      throw new Error("Proceed must be called from an adaptation");
    }
    let [object, method, name, args] = invocations.top();
    // Arguments passed to `proceed` take precedence over those of the
    // original invocation.
    args = arguments.length === 0 ? args : arguments;
    // Find next method.
    const alternatives = manager.orderedMethods(object, name);
    const index = alternatives.indexOf(method);
    if (index === -1) {
      throw new Error("Cannot proceed from an inactive adaptation");
    }
    if ((index + 1) === alternatives.length) {
      throw new Error("Cannot proceed further");
    }
    // Invoke next method.
    return alternatives[index+1].apply(this, args);
  }
});

traceableMethod = function(object, name, method) {
  var wrapper = function() {
    const {
      invocations
    } = contexts.Default.manager;
    invocations.push([object, wrapper, name, arguments]);
    try {
      return method.apply(this, arguments);
    } finally {
      invocations.pop();
    }
  };
  return wrapper;
};

traceableTrait = function(trait, object) {
  const newTrait = Trait.compose(trait); // copy
  for (let name of Object.keys(newTrait || {})) {
    const propdesc = newTrait[name];
    if (us.isFunction(propdesc.value)) {
      propdesc.value = traceableMethod(object, name, propdesc.value);
    }
  }
  return newTrait;
};

// Extend `Manager` with methods related to composition.

us.extend(Manager.prototype, {

  orderedMethods(object, name) {
    const adaptations = this.adaptationChainFor(object);
    return adaptations.map((adaptation) =>
      adaptation.trait[name].value);
  }
}
);

// Extend `Policy` with methods related to composition.

us.extend(Policy.prototype, {

  order(adaptations) {
    const self = this;
    return adaptations.sort(function(adaptation1, adaptation2) {
      if (adaptation1.object !== adaptation2.object) {
        throw new Error("Refusing to order adaptations of different objects");
      }
      return self.compare(adaptation1, adaptation2);
    });
  },

  compare(adaptation1, adaptation2) {
    throw new Error("There is no criterium to order adaptations");
  },

  toString() {
    return this.name() + ' policy';
  },

  name() {
    return 'anonymous';
  }
}
);

// ### Activation Age Policy

// The _activation age policy_ is the policy used by the default
// context manager.

ActivationAgePolicy = function() {
  Policy.call(this);
  return this;
};

ActivationAgePolicy.inheritFrom(Policy);

us.extend(ActivationAgePolicy.prototype, {

  compare(adaptation1, adaptation2) {
    // Result as expected by `Array.sort()`
    return adaptation1.context.activationAge() - adaptation2.context.activationAge();
  },

  name() {
    return 'activation age';
  }
}
);

us.extend(Context.prototype, {

  activationAge() {
    return this.manager.totalActivations - this.activationStamp;
  }
}
);
