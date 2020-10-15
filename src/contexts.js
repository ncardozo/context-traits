/* [Context Traits](https://github.com/ncardozo/context-traits).
 * Copyright © 2012—2015 UCLouvain.
 *             2016- Uniandes
*/

// Main context namespace.
const contexts = new Namespace('contexts');

contexts.Default = new Context('default');

// The default context is always active.
contexts.Default.activate();
