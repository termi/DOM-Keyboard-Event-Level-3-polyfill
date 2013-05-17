# DOM Keyboard Event Level 3 polyfill
Implementation of [DOM 3 Keyboard Events](http://www.w3.org/TR/DOM-Level-3-Events/#events-keyboardevents)

## Important note:

	Current version conflicted with the latest w3c spec. New version will coming as soon as I get free time

## Status

	Beta 3

## Demo

[demo 1](http://h123.ru/-/tests/KeyboardEvent/)

[demo 2](http://jsfiddle.net/termi/yjc5F/)

## Example

	document.addEventListener("keydown", function(e){ console.log(e.type, e.key, e.char, e.shiftKey) })
	document.dispatchEvent(new KeyboardEvent("keydown", { key: "1", char: "!", shiftKey: true }))

## Goal

* Normalize Keyroard Events across modern browsers
* Implement ["map event.key to character values of a normal QUERTY (en-US) layout"](https://www.w3.org/Bugs/Public/show_bug.cgi?id=19827) proposal
* Implement [KeyboardEvent constructor](http://www.w3.org/TR/DOM-Level-3-Events/#idl-interface-KeyboardEvent-initializers)

## TODO

* more readme
* tests
* examples
* fixing more Opera 12- keyboard event bugs

## Tested browsers
* IE9
* Opera 12
* Safari 5.1
* Chrome 18
* FireFox 11

### Other browsers
* Theoretically polyfill would work in any browser with `addEventListener` support
* You can bring IE6-8 support with [DOM and ES5 shim](http://github.com/termi/ES5-DOM-SHIM) (need tests)

## Licence
	
	MIT
