import { determineDisplayedSegment } from './pagination';

test('determineDisplayedSegment', () => {
  expect(determineDisplayedSegment(1, 2)).toEqual([1, 2]);
  expect(determineDisplayedSegment(3, 3)).toEqual([1, 2, 3]);
  expect(determineDisplayedSegment(3, 4)).toEqual([1, 2, 3, 4]);
});