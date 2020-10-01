// [Context Traits](https://github.com/ncardozo/context-traits).
// Copyright © 2012—2015 UCLouvain.
//             2016- Uniandes


const platform = contexts.ensure('platform');

us.extend(platform, {
  Mozilla: new Context(),
  WebKit: new Context(),
  Opera: new Context(),
  IE: new Context(),
  NodeJS: new Context()
}
);

if ($) {
  for (let [ browser, flag ] of [
      ['Mozilla', 'mozilla'],
      ['WebKit', 'webkit'],
      ['Opera', 'opera'],
      ['IE', 'msie'] ]) {
    if ($.browser[flag]) { platform[browser].activate(); }
  }
}
