// [Context Traits](https://github.com/tagae/context-traits).
// Copyright © 2012—2015 UCLouvain.

module("Context Composition", {
  setup() {
    this.phone = {
      advertise() { return 'ringtone'; },
      toString() { return 'phone'; }
    };

    this.quiet = new Context('quiet');
    this.quietPhone = Trait({advertise() { return 'vibrator'; }});

    this.screening = new Context('screening');
    return this.screeningPhone = Trait({advertise() { return `${this.proceed()} with screening`; }});
  }
}
);

test("Composition through proceed", function() {
  this.screening.adapt(this.phone, this.screeningPhone);
  equal(this.phone.advertise(), 'ringtone',
    "Default behaviour is initially exhibited.");
  this.screening.activate();
  equal(this.phone.advertise(), 'ringtone with screening',
    "Adapted behaviour is overlaid on top of default behaviour");
  return this.screening.deactivate();
});

test("Handling of original arguments in proceed", function() {
  const person = {greet(peer) { return `Hello ${peer}`; }};
  const party = new Context('party');
  const enthusiasticPerson = Trait({greet(peer) { return this.proceed() + '!'; }});
  party.adapt(person, enthusiasticPerson);
  equal(person.greet('Ken'), 'Hello Ken',
    "Default behaviour handles parameter as expected.");
  party.activate();
  return equal(person.greet('Ken'), 'Hello Ken!',
    "Original arguments are passed through by parameter-less proceed invocation.");
});

test("Proceed with explicit arguments", function() {
  const person = {greet(peer) { return `Hello ${peer}`; }};
  const atWork = new Context('atWork');
  const formalPerson = Trait({greet(peer) { return this.proceed(`Mr. ${peer}`); }});
  atWork.adapt(person, formalPerson);
  equal(person.greet('Ken'), 'Hello Ken',
    "Default behaviour handles parameter as expected.");
  atWork.activate();
  return equal(person.greet('Loach'), 'Hello Mr. Loach',
    "Adapted behaviour takes explicit proceed parameter into account.");
});

test("Invalid proceed", function() {
  this.phone.advertise = function() { return this.proceed(); };
  this.screening.adapt(this.phone, this.screeningPhone);
  this.screening.activate();
  return throws((function() { return this.phone.advertise(); }),
    /cannot proceed further/i,
    "Cannot proceed from default method.");
});

test("Nested activation", function() {
  this.quiet.adapt(this.phone, this.quietPhone);
  this.screening.adapt(this.phone, this.screeningPhone);
  equal(this.phone.advertise(), 'ringtone',
    "Default behaviour is initially exhibited.");
  this.quiet.activate();
  equal(this.phone.advertise(), 'vibrator',
    "Adapted behaviour is exhibited after activation of context.");
  this.screening.activate();
  equal(this.phone.advertise(), 'vibrator with screening',
    "Extended behaviour is overlaid on top of adapted behaviour.");
  this.screening.deactivate();
  equal(this.phone.advertise(), 'vibrator',
    "Adapted behaviour is exhibited again after deactivation of extended behaviour.");
  this.quiet.deactivate();
  return equal(this.phone.advertise(), 'ringtone',
    "Behaviour is back to default after deactivation of all contexts.");
});

test("Interleaved activation", function() {
  this.quiet.adapt(this.phone, this.quietPhone);
  this.screening.adapt(this.phone, this.screeningPhone);
  this.quiet.activate();
  equal(this.phone.advertise(), 'vibrator',
    "Adapted behaviour is exhibited after activation of context.");
  this.screening.activate();
  equal(this.phone.advertise(), 'vibrator with screening',
    "Extended behaviour is overlaid on top of adapted behaviour.");
  this.quiet.deactivate();
  equal(this.phone.advertise(), 'ringtone with screening',
    "Early deactivation of context is supported.");
  this.screening.deactivate();
  return equal(this.phone.advertise(), 'ringtone',
    "Behaviour is restored to default.");
});

test("Composition with delegation", function() {
  this.screening.adapt(this.phone, this.screeningPhone);
  const bobsPhone = Object.create(this.phone);
  equal(this.phone.advertise(), 'ringtone',
    'Prototype exhibits default behaviour.');
  equal(bobsPhone.advertise(), 'ringtone',
    "Object exhibits prototype behaviour.");
  this.screening.activate();
  equal(this.phone.advertise(), 'ringtone with screening',
    "Prototype exhibits adapted behaviour.");
  equal(bobsPhone.advertise(), 'ringtone with screening',
    "Object exhibits behaviour of adapted prototype.");
  this.screening.deactivate();
  equal(this.phone.advertise(), 'ringtone',
    "Prototype reacts to context deactivation.");
  return equal(bobsPhone.advertise(), 'ringtone',
    "Object exhibits behaviour of readapted prototype.");
});
