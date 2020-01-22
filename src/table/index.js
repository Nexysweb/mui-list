import Main from './main';
import Pagination from './pagination';
import Filters from './filters';
import Sorting from './sorting';

export const list = [
  {label: 'Main', path: '/table', Component: Main},
  {label: 'Pagination', path: '/pagination', Component: Pagination},
  {label: 'Filtering', path: '/filters', Component: Filters},
  {label: 'Sorting', path: '/sorting', Component: Sorting},
]