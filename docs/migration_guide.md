
# Migration Guide

While we don't implement everything that jQuery provides, everything what we do implement should be compatible with jQuery.

However there are some minor differences that you should be aware about when migrating to Cash.

## Differences

### Binary CSS operators

Some CSS operators are binary, they operate on something before and after them: `>`, `~`, `+`. jQuery allows you to use them at the beginning of your selectors inside `$.fn.find`.

Cash only supports selectors the browser recognizes as valid, so you can't use `> .bar` like you sometimes can with jQuery.

If you only target modern browsers you could use the [`:scope`](https://developer.mozilla.org/en-US/docs/Web/CSS/:scope) CSS pseudo-class.

```javascript
// jQuery
$('#foo').find ( '> .bar' );
$('#foo').find ( '~ .bar' );
$('#foo').find ( '+ .bar' );
// Cash
$('#foo').children ( '.bar' );
$('#foo').nextAll ( '.bar' );
$('#foo').next ( '.bar' );
// :scope
$('#foo').find ( ':scope > .bar' );
$('#foo').find ( ':scope ~ .bar' );
$('#foo').find ( ':scope + .bar' );
```

### Data caching

In jQuery the `$.fn.data` function caches retrieved values, and doesn't refresh them when they are updated outside of jQuery (e.g. via the `dataset` API), this makes jQuery's `$.fn.data` function unusable with libraries like React. Cash doesn't implement such caching functionality and doesn't have this problem, the retrieved values are always fresh.

Also values set via `$.fn.data` are stored as JSON values in `data-*` attributes set on the DOM nodes, so for instance calling `$('#foo').data ( 'test', 123 )` will add a `data-test="123"` attribute to the `#foo` node.

### Events

Cash's event system relies heavily on the browser's underlying event system so there are some differences when comparing it with jQuery's.

Custom jQuery-provided methods are not available.

```javascript
// jQuery
event.isDefaultPrevented ();
event.isPropagationStopped ();
event.isImmediatePropagationStopped ();
event.originalEvent;
// Cash
event.defaultPrevented;
event.cancelBubble;
// No way of knowing if `stopImmediatePropagation` was called
event;
```

When using event delegation calling `event.stopPropagation` or returning `false` stops the propagation from the target element, not the delegate element.

There's no perfect workaround for this unfortunately, but in most practical cases you could call `event.stopImmediatePropagation` instead.

```javascript
// jQuery
$('#foo').on ( 'click', '.bar', event => false ); // First function called
$('#foo').on ( 'click', '.bar', event => {} ); // Second function called
$('#foo').on ( 'click', event => {} ); // Function never called
$('.bar').trigger ( 'click' );
// Cash
$('#foo').on ( 'click', '.bar', event => false ); // First function called
$('#foo').on ( 'click', '.bar', event => {} ); // Second function called
$('#foo').on ( 'click', event => {} ); // Third function called
$('.bar').trigger ( 'click' );
// Cash with `stopImmediatePropagation`
$('#foo').on ( 'click', '.bar', event => { // First function called
  event.stopImmediatePropagation ();
});
$('#foo').on ( 'click', '.bar', event => {} ); // Function never called
$('#foo').on ( 'click', event => {} ); // Function never called
$('.bar').trigger ( 'click' );
```

### Inserting plain text

jQuery supports inserting plain text via different methods (`$.fn.after`, `$.fn.append` etc.):

```javascript
$('.foo').append ( 'something' );
```

Cash doesn't support that because it instead supports receiving a selector as an argument, and that can be ambigous when also supporting plain text:

```javascript
$('.foo').append ( '.foo' ); // Is that a target or do we actually wanto to append ".foo"?
```

You should generally wrap your plain texts in a `<span>` element, or create a `textNode` node manually:

```javascript
$('.foo').append ( '<span>something</span>' );
$('.foo').append ( document.createTextNode ( 'something' ) );
```

### Width/height of hidden element

If you're trying to retrieve the width/height of an hidden element jQuery will briefly try to render it in order to compute it's dimension, this is unreliable and should be avoided, Cash doesn't implement such functionality.

If you need this anyway you'll have to show/hide the element on your own.

```javascript
// jQuery
$('#foo').width ();
// Cash
$('#foo').show ();
$('#foo').width ();
$('#foo').hide ();
```

### Negative width/height

Negative width/height get automatically converted to `0` by jQuery, both when setting them via `$.fn.width|height` and `$.fn.css`.

We discourage you from setting a negative width/height, if you want this to work like jQuery you'll have to convert negative values to `0` on your own.

```javascript
// jQuery
$('#foo').width ( myWidth );
$('#foo').css ( width, myWidth );
$('#foo').css ({ width: myWidth });
// Cash
myWidth = Math.max ( 0, parseFloat ( myWidth ) );
$('#foo').width ( myWidth );
$('#foo').css ( width, myWidth );
$('#foo').css ({ width: myWidth });
```

### Parsing `<script>` tags

Cash can parse `<script>` tags and execute their code when they are attached to the page.

However we do not support script tags inside iframes or script tags with a `src` attribute.

If you need to load arbitrary JavaScript files you can find a reference implementation for `$.getScript` [here](https://github.com/kenwheeler/cash/blob/master/src/extra/get_script.ts).

### No CSS auto-suffixing support for `zoom`

CSS values are auto-suffixed when appropriate, same as in jQuery, so for instance the two following calls are equivalent:

```javascript
$('#foo').css ( height, 10 );
$('#foo').css ( height, '10px' );
```

But we don't support the [`zoom`](https://developer.mozilla.org/en-US/docs/Web/CSS/zoom) property, which is not standard and should never be used.

### Relative CSS values

jQuery supports relative CSS values.

```javascript
$('#foo').css ( 'padding-left', '+=10' );
```

This is not supported in Cash.

### Function that returns a value

In many places jQuery can accept a `function` instead of the actual value.

```javascript
$('#foo').attr ( 'bar', () => Math.random () );
```

This is not supported in Cash.

## Contributing

Did you find another difference between jQuery and Cash during your migration? Please add that to this page so that future migrations will be smoother for others.
