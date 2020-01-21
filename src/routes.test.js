import React from 'react';
import { render } from '@testing-library/react';
import Public from './public';

test('renders learn react link', () => {
  const { getByText } = render(<Public />);
  const linkElement = getByText(/source/i);
  expect(linkElement).toBeInTheDocument();
});
