/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// [Context Traits](https://github.com/ncardozo/context-traits).
// Copyright © 2012—2015 UCLouvain.
//             2016- Uniandes


// Discovery of unknown objects

//Manager discovery API
us.extend(Manager.protorype, {
	registerAdaptation(ctx, adaptationTrait) {
		return this.discovery.advertiseContext(ctx);
	}
}
);
		

//Discovery methods
us.extend(Discovery.prototype,
	{advertiseContext(ctx) {}});
	