import React from 'react';
import PropTypes from 'prop-types';
//import Input from '../../form/input';
//import Icon from '../icon';
//import Datepicker from '../../form/date';
import Popover from './popover';
import TableCell from '@material-ui/core/TableCell';

import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { KeyboardArrowUp as ChevronUp, KeyboardArrowDown as ChevronDown } from '@material-ui/icons';

const Datepicker = props => <span>Datepicker</span>;
const Input = props => <span>Input</span>;

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    // it should be possible to initialize the state of filters
    const filterBooleans = {};
    props.columns.map(x => {
      if (x.filterName) filterBooleans[x.filterName] = false;
      return true;
    });
    // console.log(filterBooleans)
    const selectedFilter = props.filters ? props.filters : {};
    this.state = {selectedFilter, filterBooleans};

    

    this.handleChangeSingleFilter = this.handleChangeSingleFilter.bind(this);
    this.handleChangeMultiFilter = this.handleChangeMultiFilter.bind(this);
    this.handleClearFilter = this.handleClearFilter.bind(this);
    this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  static propTypes = {
    columns: PropTypes.array.isRequired,
    onSort: PropTypes.func,
    onFilter: PropTypes.func,
    filters: PropTypes.object
  }

  handleChangeSingleFilter(e) {
    const fName = e.currentTarget ? e.currentTarget.name : e.name;
    const fValue = e.currentTarget ? isNaN(e.currentTarget.id) ? e.currentTarget.id : Number(e.currentTarget.id) : e.value;
    const selectedFilter = this.state.selectedFilter;
    selectedFilter[fName] = fValue;

    this.setState({selectedFilter});
  }

  handleChangeMultiFilter(e) {
    const fName = e.currentTarget.name;
    const fValue = isNaN(e.currentTarget.id) ? e.currentTarget.id : Number(e.currentTarget.id);
    const selectedFilter = this.state.selectedFilter;
    if (selectedFilter[fName] && selectedFilter[fName].includes(fValue)) {
      selectedFilter[fName].splice(selectedFilter[fName].indexOf(fValue), 1);
    } else {
      if (!selectedFilter[fName]) {
        selectedFilter[fName] = [];
      }
      selectedFilter[fName].push(fValue);
    }
    this.setState({selectedFilter});
  }

  handleClearFilter(e) {
    const fName = e.currentTarget.id;
    const selectedFilter = this.state.selectedFilter;
    selectedFilter[fName] = Array.isArray(selectedFilter[fName]) ? [] : '';
    this.props.onFilter(fName, selectedFilter[fName]);
    this.setState({selectedFilter});
    document.body.click();
  }

  handleSubmitFilter(e) {
    const fName = e.currentTarget.id;
    this.props.onFilter(fName, this.state.selectedFilter[fName]);
    document.body.click();
  }

  handleKeyDown(e) {
    if (e.keyCode === 13) {
      this.handleSubmitFilter(e);
    }
  }

  handleTogglePopover = n => {
    const { filterBooleans } = this.state;
    filterBooleans[n] = !filterBooleans[n];
    this.setState({filterBooleans})
  }

  renderListPopover(c, typeId) {
    const fItems = c.filters.map((x, i) => {
      const filter = this.state.selectedFilter[c.filterName];
      let isChecked = false;
      if (filter && ((Array.isArray(filter) && filter.includes(x.value)) || (filter === x.value))) {
        isChecked = true;
      }
      if (typeId === 1) {
        return <div key={i}><input name={c.filterName} id={x.value} type="radio" onChange={this.handleChangeSingleFilter} checked={isChecked}/> {x.text}</div>;
      }
      return <div key={i}><input name={c.filterName} id={x.value} type="checkbox" onChange={this.handleChangeMultiFilter} checked={isChecked}/> {x.text}</div>;
    });

    const { filterBooleans } = this.state;
    const selected = this.state.selectedFilter[c.filterName] && this.state.selectedFilter[c.filterName].length > 0;
    return (<Popover icon="filter" name={c.filterName} selected={selected} isOpen={filterBooleans[c.filterName]} onTogglePopover={_ => this.handleTogglePopover(c.filterName)}>
      { fItems }
      <div className="filter-action-panel">
        <button className="button-unstyled" id={c.filterName} onClick={this.handleSubmitFilter}>OK</button>
        <span className="pull-right"><button className="button-unstyled" id={c.filterName} onClick={this.handleClearFilter}>Clear</button></span>
      </div>
    </Popover>)
  }

  renderSearchPopover(c) {
    const { filterBooleans } = this.state;
    const selected = this.state.selectedFilter[c.filterName] && this.state.selectedFilter[c.filterName].length > 0;
    
    return (<Popover icon="search" name={c.filterName} selected={selected} isOpen={filterBooleans[c.filterName]} onTogglePopover={_ => this.handleTogglePopover(c.filterName)}>
      <div id={c.filterName} onKeyDown={this.handleKeyDown}>
        <Input name={c.filterName} placeholder="Search..." value={this.state.selectedFilter[c.filterName]} onChange={this.handleChangeSingleFilter} autoFocus/>
        <br/>
        <center>
          <button className="btn btn-primary" id={c.filterName} onClick={this.handleSubmitFilter}>Go!</button>
          &nbsp;
          <button className="btn btn-primary" id={c.filterName} onClick={this.handleClearFilter}>Clear</button>
        </center>
      </div>
    </Popover>)
  }

  renderDatePopover(c) {
    const { filterBooleans } = this.state;

    const selected = this.state.selectedFilter[c.filterName] && this.state.selectedFilter[c.filterName].length > 0;
    return (<Popover icon="calendar" name={c.filterName} selected={selected} isOpen={filterBooleans[c.filterName]} onTogglePopover={_ => this.handleTogglePopover(c.filterName)}>
      <div id={c.filterName} onKeyDown={this.handleKeyDown}>
          <Datepicker name={c.filterName} value={this.state.selectedFilter[c.filterName] || ''} onChange={this.handleChangeSingleFilter}/>
        </div>
        <br/>
        <center>
          <button className="btn btn-primary" id={c.filterName} onClick={this.handleSubmitFilter}>Go!</button>
          &nbsp;
          <button className="btn btn-primary" id={c.filterName} onClick={this.handleClearFilter}>Clear</button>
        </center>
    </Popover>)
  }

  // renderClearFilter(c) {
  //   if (this.state.selectedFilter[c.filterName] && this.state.selectedFilter[c.filterName].length > 0) {
  //     return (
  //       <a id={c.filterName} onClick={this.handleClearFilter}>
  //         <Icon name="times"/>
  //       </a>
  //     );
  //   }
  // }

  renderFilter(c, i) {
    if (!c.filterName) {
      return null;
    }
    switch (c.filterType) {
      case 'single':
        return this.renderListPopover(c, 1);
      case 'multi':
        return this.renderListPopover(c, 2);
      case 'search':
        return this.renderSearchPopover(c);
      case 'date':
        return this.renderDatePopover(c);
      default:
        return this.renderSearchPopover(c);
    }
  }

  renderSorter(c) {
    const handleClickUp = a => {
      this.props.onSort(a)
    }

    if (c.sort) {
      /* eslint-disable */
      return (<span>
        <a onClick={this.props.onSort} id={c.key} name="true"> 
          <ChevronUp/>
        </a>
        &nbsp;
        <a onClick={handleClickUp} id={c.key} name="false">
          <ChevronDown/>
        </a>
      </span>); 
      /* eslint-enable */
    }
    return null;
  }

  render() {
    return (<TableHead>
      <TableRow>
        {this.props.columns.map((c, i) => {
          const sorter = this.renderSorter(c);
          const filter = this.renderFilter(c, i);
          // const filter = null;
          const clearFilter = null;// this.renderClearFilter(c);
          return <TableCell key={i}>{c.title} {sorter} {filter} {clearFilter}</TableCell>;
        })}
      </TableRow>
    </TableHead>);
  }
}