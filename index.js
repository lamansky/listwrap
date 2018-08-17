'use strict'

const arrify = require('arrify')
const extend = require('extend-prototype')
const _ = require('private-parts').createKey()

const methodNames = ['add', 'remove', 'has', 'values', 'item', 'length', 'removeAll', 'sanitize']
const optionalMethodNames = ['removeAll', 'sanitize']

module.exports = Listwrap

/**
 * @constructor
 * @param {object} methods Methods which operate on the underlying list.
 *   Required methods are 'add', 'remove', 'has', 'values', 'item', and 'length'.
 *   Optional methods are 'removeAll' and 'sanitize'.
 */
function Listwrap (methods) {
  for (const methodName of methodNames) {
    if (typeof methods[methodName] === 'function') {
      _(this)[methodName] = methods[methodName]
    } else if (!optionalMethodNames.includes(methodName)) {
      throw new Error(`Listwrap constructor expects its argument object to include a function named \`${methodName}\`.`)
    }
  }
  if (typeof _(this).sanitize !== 'function') {
    _(this).sanitize = v => v
  }
}

Listwrap.extend = extend

Listwrap.prototype = {

  /**
   * Whether or not all specified items are present in the list. Returns false
   * if any one item is missing.
   * @param {...any} items One or more items to check.
   * @return {bool}
   */
  has (...items) {
    items = _(this).sanitize(items)
    if (!items.length) {
      return false
    }
    for (const item of items) {
      if (!_(this).has(item)) {
        return false
      }
    }
    return true
  },

  /**
   * Whether or not at least one of the specified items is present in the list.
   * @param {...any} items One or more items to check.
   * @return {bool}
   */
  hasAny (...items) {
    items = _(this).sanitize(items)
    for (const item of items) {
      if (_(this).has(item)) {
        return true
      }
    }
    return false
  },

  /**
   * Adds one or more items to the list.
   * @param {...any} items One or more items to add.
   * @return {this}
   */
  add (...items) {
    items = _(this).sanitize(items)
    for (const item of items) {
      if (!_(this).has(item)) {
        _(this).add(item)
      }
    }
    return this
  },

  /**
   * Removes one or more items from the list.
   * @param {...any} items One or more items to remove.
   * @return {this}
   */
  remove (...items) {
    items = _(this).sanitize(items)
    for (const item of items) {
      _(this).remove(item)
    }
    return this
  },

  /**
   * Passes each item through a callback. Removes the item if the callback
   * returns true. Retains the item if the callback returns false.
   * @param {Listwrap~purge} callback
   * @return {this}
   */
  removeIf (callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('Listwrap.purge() expects its argument to be a function')
    }
    const toRemove = []
    for (let i = 0; i < this.length; i++) {
      const item = this.item(i)
      if (callback(item)) toRemove.push(item)
    }
    for (const item of toRemove) {
      _(this).remove(item)
    }
    return this
  },

  /**
   * Removes all items from the list.
   * @return {this}
   */
  removeAll () {
    if (typeof _(this).removeAll === 'function') {
      _(this).removeAll()
    } else {
      for (const item of Array.from(this.values())) {
        _(this).remove(item)
      }
    }
    return this
  },

  /**
   * Removes all items except the ones provided, if they are present.
   * @param {...any} permittedValues One or more items which
   *   should remain in the list if already present.
   * @return {this}
   */
  removeAllExcept (...permittedValues) {
    permittedValues = _(this).sanitize(permittedValues)
    this.removeIf(item => !permittedValues.includes(item))
    return this
  },

  /**
   * If given items are present, remove them and replace them with others.
   * The replacement only happens if all the `oldItems` are present.
   * (If you want to add `newItems` regardless of whether or not `oldItems`
   * exist, you’re better off doing a chained `list.remove('old').add('new')`
   * call.)
   * @param {any|array.<any>} oldItems The items to be removed and
   *   replaced if present.
   * @param {any|array.<any>} newItems The items which will replace the
   *   `oldItems` if they are present.
   * @return {this}
   */
  replace (oldItems, newItems) {
    oldItems = arrify(oldItems)
    newItems = arrify(newItems)
    if (this.has(...oldItems)) {
      this.remove(...oldItems)
      this.add(...newItems)
    }
    return this
  },

  /**
   * For each given item, removes it if it’s present, and adds it if not.
   * Each item is toggled independently of the others.
   * @param {...any} items One or more items to toggle.
   * @return {this}
   */
  toggle (...items) {
    items = _(this).sanitize(items)
    for (const item of items) {
      if (_(this).has(item)) {
        _(this).remove(item)
      } else {
        _(this).add(item)
      }
    }
    return this
  },

  /**
   * If all given items are present, removes all of them. Otherwise adds any
   * that are not present. Ensures that no item is present without the others.
   * @param {...any} items One or more items to toggle.
   * @return {this}
   */
  toggleTogether (...items) {
    if (this.has(...items)) {
      this.remove(...items)
    } else {
      this.add(...items)
    }
    return this
  },

  /**
   * Adds items if the given condition is true and removes them if it’s false.
   * @param {bool} condition The boolean condition to which the presence of the
   *   items is tied.
   * @param {any} thenItems One or more items that should be present if the
   *   `condition` is true or absent if the `condition` is false.
   * @param {?any} elseItems One or more items that should be present if the
   *   `condition` is false or absent if the `condition` is true.
   * @return {this}
   */
  if (condition, thenItems, elseItems) {
    thenItems = arrify(thenItems)
    elseItems = arrify(elseItems)
    if (condition) {
      this.remove(...elseItems).add(...thenItems)
    } else {
      this.remove(...thenItems).add(...elseItems)
    }
    return this
  },

  /**
   * Returns all the items in the list.
   * @return {iterable}
   */
  values () {
    return _(this).values()
  },

  [Symbol.iterator] () {
    return this.values()
  },

  /**
   * Returns the value at a given index.
   * @param {int} index
   * @return {any}
   */
  item (index) {
    return _(this).item(index)
  },

  /**
   * The number of items in the list.
   * @return {int}
   */
  get length () {
    return _(this).length()
  },
}

/**
 * Decides for each individual item whether or not it should be removed from the list.
 * @callback Listwrap~purge
 * @param {any} item A single item.
 * @return {bool} Whether or not the item should be removed from the list.
 */
