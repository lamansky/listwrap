# listwrap

Wraps any list-like object with an interface containing a full set of superpowered, chainable list methods, including toggle, replace, etc.

## Installation

Requires [Node.js](https://nodejs.org/) 6.0.0 or above.

```bash
npm i listwrap
```

## Usage

The module exports a single class. The constructor expects an object argument with 6 function properties: `add`, `remove`, `has`, `values`, `item`, and `length`. These are the 6 foundational functions which `Listwrap` combines to produce new functions like `toggle` and `replace`. The object argument may optionally also include the optional methods `removeAll` and/or `sanitize`.

The following example makes use of `Listwrap` to extend the basic JavaScript array with new methods:

```javascript
const Listwrap = require('listwrap')
const vdel = require('vdel')

class SuperArray extends Listwrap {
  constructor () {
    const array = []
    super({
      add: v => { array.push(v) },
      remove: v => { vdel(array, v) },
      has: v => array.includes(v),
      values: () => array,
      item: i => array[i],
      length: () => array.length,
    })
  }
}

const super = new SuperArray()
super.add(1, 2, 3)
  .toggle(1) // Removes 1 if present
  .replace(3, 4) // Replaces 3 with 4
  .hasAny(4, 5) // Returns true, since one of the arguments (4) is present
super.values() // [2, 4]
```

## Methods

In the function definitions below, the `...items` parameter is a [rest parameter](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/rest_parameters) that will accept any number of arguments.

* **constructor (methods)**
  * `methods`: An object containing the underlying methods for the list:
    * Required functions: `add`, `remove`, `has`, `values`, `item`, and `length`.
    * Optional functions: `removeAll` and `sanitize`.
* **has (...items)**
  * Will return true only if all items are present.
* **hasAny (...items)**
  * Will return true if at least one item is present.
* **add (...items)**
* **remove (...items)**
* **removeIf (callback)**
* **removeAll()**
* **removeAllExcept (...permittedValues)**
* **replace (oldItems, newItems)**
  * `oldItems`: A value or an array of values.
  * `newItems`: A value or an array of values.
  * If all the `oldItems` are present, they are removed and replaced with `newItems`.
* **toggle (...items)**
  * For each given item, removes it if it’s present, and adds it if not. Each item is toggled independently of the others.
* **toggleTogether (...items)**
  * If all given items are present, removes all of them. Otherwise adds any that are not present. Ensures that no item is present or absent without the others.
* **if (condition, thenItems, [elseItems])**
  * `condition`: A boolean that determines whether or not the items should be present.
  * `thenItems`: A value or an array of values.
  * `elseItems`: A value or an array of values.
  * If `condition` is `true`, removes `elseItems` and adds `thenItems`. Otherwise removes `themItems` and adds `elseItems`.
* **item (index)**
* **length**
