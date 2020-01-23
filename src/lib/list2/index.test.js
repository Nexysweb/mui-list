import * as Index from './index';

test('addRemoveToArray', () => {
  expect(Index.addRemoveToArray(2)).toEqual([2]);
  expect(Index.addRemoveToArray(2, [3])).toEqual([3, 2]);
  expect(Index.addRemoveToArray(3, [3, 2])).toEqual([2])
  expect(Index.addRemoveToArray(4, [3, 2])).toEqual([3, 2, 4])
  expect(Index.addRemoveToArray(4, [4])).toEqual([])
})