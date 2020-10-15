/* [Context Traits](https://github.com/ncardozo/context-traits).
 * Copyright © 2012—2015 UCLouvain.
 *             2016- Uniandes
*/

// A _context_ represents a situation that might arise during program
// execution, and which may affect the way the program behaves. This
// corresponds to the normal notion of context found in dictionaries
// such as
// [Merriam-Webster](http://merriam-webster.com/dictionary/context) and
// [Cambridge](http://dictionary.cambridge.org/dictionary/british/context_1).

Context = function(obj) {
  this.activationCount = 0
  this.adaptations = []
  this.manager = contexts.Default?.manager || new Manager()
  this.name =  (() => {if(obj != null) obj.name})
  this.slice = (() => { if(typeof obj.slice == 'undefined')  
                          `context.default.${obj.name}`
                        else `${obj.slice}.${obj.name}` })
  return this
}

// An _adaptation_ represents the adaptation of an object to a
// particular context, as specified by a given trait. The trait
// contains properties that are specific to the context.
Adaptation = function(context, object, trait) {
  this.context = context
  this.object = object
  this.trait = trait
  return this
}

// The _context manager_ coordinates interaction among contexts.
Manager = function() {
  // Array of active adaptations. The manager needs not keep track of
  // inactive adaptations.
  this.adaptations = []
  this.invocations = []
  this.policy = new ActivationAgePolicy()
  this.totalActivations = 0
  return this
}

// Composition policies help resolving conflicts that arise during
// composition of adaptations.
Policy = function() {
  return this
}

//The _context discovery_ orchestrates the advertising and browsing of contexts
Discovery = function() {
	this.exportingBehavior = []
	this.volitileContexts = []
  return this
}