// sum.test.js
import { expect, test } from 'vitest'
import * as ignorefile from '.'

test('works', () => {
  expect(ignorefile.createIgnoreFile).toBeTypeOf("function")
})
