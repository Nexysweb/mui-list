import React from 'react';
import Icon from '@material-ui/core/Icon';
import { Wrapper, Input } from '../components/form';

/*** SEARCH WIDGET ***/
export default props => {
  const { filters, onChange } = props;

  // TODO
  // - debounce: https://toughcompetent.com/blog/es5-es6-debounce-react-events-on-inputs/
  // - throttle: https://www.peterbe.com/plog/how-to-throttle-and-debounce-an-autocomplete-input-in-react
  // use: https://www.npmjs.com/package/throttle-debounce
  return (
    <Wrapper name="search" label={'filters.search'} inline>
      <Input
        value={filters.search.value}
        onChange={onChange}
        placeholder={'filters.search.type'} // TODO: i18n.translate(..)
        suffix={<Icon color="primary">search</Icon>}
      />
    </Wrapper>
  );
}