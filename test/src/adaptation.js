// [Context Traits](https://github.com/tagae/context-traits).
// Copyright © 2012—2015 UCLouvain.

module("Context Adaptation");

test("Infrastructure", () => ok($.isFunction(Context.prototype.adapt),
  "Method to define behavioural adaptations exists."));

test("Overriding adaptation", function() {
  const person = {
    greet() { return 'hello'; },
    toString() { return 'person'; }
  };
  const noisy = new Context('noisy');
  const noisyPerson = Trait({greet() { return 'HELLO'; }});
  noerror((() => noisy.adapt(person, noisyPerson)),
    "Definition of a simple adaptation succeeds.");
  equal(person.greet(), 'hello',
    "Default behaviour is exhibited when context is inactive.");
  noisy.activate();
  equal(person.greet(), 'HELLO',
    "Adapted behaviour is exhibited after context activation.");
  noisy.deactivate();
  return equal(person.greet(), 'hello',
    "Default behaviour is exhibited again after context deactivation.");
});

test("Adaptation to active context", function() {
  const person = {greet() { return 'hello'; }};
  const noisyPerson = Trait({greet() { return 'HELLO'; }});
  const noisy = new Context();
  noisy.activate();
  equal(person.greet(), 'hello',
    "Default behaviour is exhibited prior to introduction of adaptation.");
  noerror((() => noisy.adapt(person, noisyPerson)),
    "Adaptation can be introduced in active context.");
  equal(person.greet(), 'HELLO',
    "Adapted behaviour for active context is observed.");
  noisy.deactivate();
  equal(person.greet(), 'hello',
    "Default behaviour is persistent.");
  noisy.activate();
  equal(person.greet(), 'HELLO',
    "Adapted behaviour is persistent.");
  return noisy.deactivate();
});

test("Multiple extension", function() {
  const person = {
    name() { return 'Ken'; },
    greet() { return 'Hi there'; }
  };
  const formalPerson = Trait({name() { return 'Ken Loach'; }});
  const formalGreeter = Trait({greet() { return 'Hello'; }});
  const formal = new Context('formal');
  noerror((() => formal.adapt(person, formalPerson)),
    "Object can be adapted as usual.");
  noerror((() => formal.adapt(person, formalGreeter)),
    "Adaptation of object to same context can be extended with new behaviour.");
  formal.activate();
  equal(person.name(), "Ken Loach",
    "Original adapted behaviour is exhibited.");
  equal(person.greet(), "Hello",
    "Additional adapted behaviour is exhibited.");
  return formal.deactivate();
});

test("Detection of ambiguous extension", function() {
  const person = {name() { return 'Ken'; }};
  const formalPerson = Trait({name() { return 'Ken Loach'; }});
  const veryFormalPerson = Trait({name() { return 'Mr. Ken Loach'; }});
  const formal = new Context('formal');
  noerror((() => formal.adapt(person, formalPerson)),
    "Method can be adapted to context.");
  return throws((() => formal.adapt(person, veryFormalPerson)),
    /property.*already adapted/i,
    "Rejection of two method definitions for the same context.");
});

test("Preservation of receiver identity", function() {
  const person = {
    name() { return this.firstName; },
    firstName: 'Ken',
    lastName: 'Loach'
  };
  equal(person.name(), "Ken",
    "Object identity is well-defined in default behaviour.");
  const formalPerson = Trait({
    name() { return this.firstName + ' ' + this.lastName; }});
  const formal = new Context('formal');
  formal.adapt(person, formalPerson);
  equal(person.name(), "Ken",
    "Object identity is preserved after definition of adaptation.");
  formal.activate();
  equal(person.name(), "Ken Loach",
    "Object identity is preserved in adapted behaviour.");
  return formal.deactivate();
});

test("Adaptation of primitive values", function() {
  const upsideDown = new Context();
  const upsideDownNumber = Trait({"+"(a, b) { return a - b; }});
  return throws((() => upsideDown.adapt(42, upsideDownNumber)),
    /value.*cannot be adapted/i,
    "Numbers cannot be adapted in JavaScript, unfortunately.");
});

test("Adaptation through delegation", function() {
  const Person = {greet() { return 'hello'; }};
  const NoisyPerson = Trait({greet() { return 'HELLO'; }});
  const noisy = new Context();
  noisy.adapt(Person, NoisyPerson);
  const bob = Object.create(Person);
  equal(Person.greet(), 'hello',
    "Prototype exhibits default behaviour.");
  equal(bob.greet(), 'hello',
    "Object exhibits prototype behaviour.");
  noisy.activate();
  equal(Person.greet(), 'HELLO',
    "Prototype exhibits adapted behaviour.");
  equal(bob.greet(), 'HELLO',
    "Object exhibits behaviour of adapted prototype.");
  noisy.deactivate();
  equal(Person.greet(), 'hello',
    "Prototype reacts to context deactivation.");
  return equal(bob.greet(), 'hello',
    "Object exhibits behaviour of readapted prototype.");
});
