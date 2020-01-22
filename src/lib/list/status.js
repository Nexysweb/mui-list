import React from 'react';
import { OptionGroup } from '../components/form';

 /*** STATUS WIDGET ***/
export default props => {
  const { status, filters, onChange } = props;
  // TODO: work with status name?
  return (
    <OptionGroup
      name="status"
      options={status}
      selectedValue={filters.status.value}
      handleChange={onChange}
      label={'status.select'} // TODO: translation: i18n.translate('status.select')
      // selectedColor={adminColor}
      compact
      simple
      all
    />
  );
}