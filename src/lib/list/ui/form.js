import React from 'react';

export const SearchUnit = props => {
  const { name, onChange, value } = props;

  const handleChange = e => {
    const value = e.target.value;
    const v = {name, value};
    onChange(v);
  }

  return <input value={value} type="text" name={name} onChange={handleChange}/>;
}
