'use strict'

const assert = require('assert')
const Listwrap = require('.')
const vdel = require('vdel')

function getConstructorArg (array) {
  return {
    add: v => { array.push(v) },
    remove: v => { vdel(array, v) },
    has: v => array.includes(v),
    values: () => array,
    item: i => array[i],
    length: () => array.length,
  }
}

function createList (array = []) {
  return new Listwrap(getConstructorArg(array))
}

describe('Listwrap', function () {
  describe('#has()', function () {
    it('should return true if single list item is present', function () {
      const list = createList()
      list.add('test')
      assert(list.has('test'))
    })

    it('should return true if multiple list items are all present', function () {
      const list = createList()
      list.add('test1')
      list.add('test2')
      assert(list.has('test1', 'test2'))
    })

    it('should return false if only some list items are present', function () {
      const list = createList()
      list.add('test1')
      assert(!list.has('test1', 'test2'))
    })
  })

  describe('#hasAny()', function () {
    it('should return true if single list item is present', function () {
      const list = createList()
      list.add('test')
      assert(list.hasAny('test'))
    })

    it('should return true if at least one list item is present', function () {
      const list = createList()
      list.add('test1')
      assert(list.hasAny('test1', 'test2'))
    })
  })

  describe('#add()', function () {
    it('should add a single list item', function () {
      const array = []
      const list = createList(array)
      list.add('test')
      assert(array.includes('test'))
    })

    it('should add multiple list items', function () {
      const array = []
      const list = createList(array)
      list.add('test1', 'test2')
      assert(array.includes('test1'))
      assert(array.includes('test2'))
    })
  })

  describe('#remove()', function () {
    it('should remove a single list item', function () {
      const array = []
      const list = createList(array)
      list.add('test')
      assert(array.includes('test'))
      list.remove('test')
      assert(!array.includes('test'))
    })

    it('should silently fail removing a non-existent list item', function () {
      const list = createList()
      list.remove('test')
    })
  })

  describe('#removeAll()', function () {
    it('should remove all list items', function () {
      const array = []
      const list = createList(array)
      list.add('test1')
      list.add('test2')
      assert(array.includes('test1'))
      assert(array.includes('test2'))
      list.removeAll()
      assert(!array.includes('test1'))
      assert(!array.includes('test2'))
    })
  })

  describe('#removeIf()', function () {
    it('should remove list items that match the filter', function () {
      const array = []
      const list = createList(array)
      list.add('test1')
      list.add('test2')
      assert(array.includes('test1'))
      assert(array.includes('test2'))
      list.removeIf(i => i === 'test1')
      assert(!array.includes('test1'))
      assert(array.includes('test2'))
    })
  })

  describe('#removeAllExcept()', function () {
    it('should remove all except the given list items', function () {
      const array = []
      const list = createList(array)
      list.add('test1')
      list.add('test2')
      assert(array.includes('test1'))
      assert(array.includes('test2'))
      list.removeAllExcept('test2')
      assert(!array.includes('test1'))
      assert(array.includes('test2'))
    })
  })

  describe('#replace()', function () {
    it('should remove X and add Y if X exists', function () {
      const array = []
      const list = createList(array)
      list.add('test1')
      assert(array.includes('test1'))
      list.replace('test1', 'test2')
      assert(!array.includes('test1'))
      assert(array.includes('test2'))
    })

    it('should support multiple items at a time', function () {
      const array = []
      const list = createList(array)
      list.add(1)
      list.add(2)
      assert(array.includes(1))
      assert(array.includes(2))
      list.replace([1, 2], [3, 4])
      assert(!array.includes(1))
      assert(!array.includes(2))
      assert(array.includes(3))
      assert(array.includes(4))
    })

    it('should only perform the replacement if all old items are found', function () {
      const array = []
      const list = createList(array)
      list.add(1)
      assert(array.includes(1))
      list.replace([1, 2], [3, 4])
      assert(array.includes(1))
      assert(!array.includes(3))
      assert(!array.includes(4))
    })
  })

  describe('#toggle()', function () {
    it('should add a non-existent list item', function () {
      const array = []
      const list = createList(array)
      list.toggle('test')
      assert(array.includes('test'))
    })

    it('should remove an existing list item', function () {
      const array = []
      const list = createList(array)
      list.add('test')
      assert(array.includes('test'))
      list.toggle('test')
      assert(!array.includes('test'))
    })

    it('should toggle multiple list items independently', function () {
      const array = []
      const list = createList(array)
      list.add('test1')
      assert(array.includes('test1'))
      assert(!array.includes('test2'))
      list.toggle('test1', 'test2')
      assert(!array.includes('test1'))
      assert(array.includes('test2'))
    })
  })

  describe('#toggleTogether()', function () {
    it('should add all non-existent list items if only some exist', function () {
      const array = []
      const list = createList(array)
      list.add('test1')
      assert(array.includes('test1'))
      list.toggleTogether('test1', 'test2', 'test3')
      assert(array.includes('test1'))
      assert(array.includes('test2'))
      assert(array.includes('test3'))
    })

    it('should remove all list items if all exist', function () {
      const array = []
      const list = createList(array)
      list.add('test1')
      list.add('test2')
      assert(array.includes('test1'))
      assert(array.includes('test2'))
      list.toggleTogether('test1', 'test2')
      assert(!array.includes('test1'))
      assert(!array.includes('test2'))
    })
  })

  describe('#if()', function () {
    it('should add list items if the condition is true', function () {
      const array = []
      const list = createList(array)
      list.if(true, 'test1', 'test2')
      assert(array.includes('test1'))
      assert(!array.includes('test2'))
    })

    it('should remove list items if the condition is false', function () {
      const array = []
      const list = createList(array)
      list.add('test1')
      list.add('test2')
      assert(array.includes('test1'))
      assert(array.includes('test2'))
      list.if(false, 'test1', 'test2')
      assert(!array.includes('test1'))
      assert(array.includes('test2'))
    })
  })

  describe('#values()', function () {
    it('should return all list items', function () {
      const list = createList()
      list.add(1)
      list.add(2)
      const values = Array.from(list.values())
      assert.strictEqual(values.length, 2)
      assert(values.includes(1))
      assert(values.includes(2))
    })
  })

  describe('#item()', function () {
    it('should return the list item at a given index', function () {
      const list = createList()
      list.add('test')
      assert.strictEqual(list.item(0), 'test')
    })
  })

  describe('#length', function () {
    it('should return the number of items in the list', function () {
      const list = createList()
      list.add('test1')
      list.add('test2')
      assert.strictEqual(list.length, 2)
    })
  })

  describe('#extend()', function () {
    it('should mix in its methods into another class', function () {
      class CustomList {
        constructor (array = []) {
          Listwrap.call(this, getConstructorArg(array))
        }
      }
      Listwrap.extend(CustomList)

      const array = []
      const list = new CustomList(array)
      list.add(1, 2, 3)
      assert(array.includes(1))
      assert(array.includes(2))
      assert(array.includes(3))
      list.toggle(1)
      assert(!array.includes(1))
    })
  })
})
