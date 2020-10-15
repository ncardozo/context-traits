/* [Context Traits](https://github.com/ncardozo/context-traits).
 * Copyright © 2012—2015 UCLouvain.
 *             2016- Uniandes
*/

// If there is no explicit `exports`, take global namespace
if(!exports) {
  exports = this;
}

// Export objects.
exports.Context = Context;
exports.Namespace = Namespace;
exports.Policy = Policy;
exports.Trait = Trait; // from traits.js

// Export namespaces.
exports.contexts = contexts;
