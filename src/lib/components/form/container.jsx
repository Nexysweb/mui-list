import React, { Component } from 'react';

import Utils from '@nexys/utils';


const withForm = Form => {
  class FormContainer extends Component {
    constructor(props) {
      super(props);

      const { initData, data } = props;
      this.state = { data: {...initData, ...data} };
    }

    componentWillReceiveProps(nextProps) {
      const { initData, data } = nextProps;
      if (Utils.ds.isEmpty(nextProps.errors)) this.setState({data: {...initData, ...data}});
    }

    // TODO: immutable updates https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns
    // TODO: refactor to handleBoolean
    handleToggle = (field, isInputChecked) => {
      if (isInputChecked !== undefined) {
        // handle checkbox toggle
        const { data } = this.state;
        data[field.target.name] = isInputChecked;
        this.setState({data});
      } else {
        // handle toggle
        return () => {
          const { data } = this.state;
          const bool = data[field];
          data[field] = !bool;
          this.setState({data});
        }
      }
    }

    handleFiles = (files) => {
      const { data } = this.state;
      data.files = files;
      this.setState({data});
    }

    handleChange = newObj => {
      const { handleChange } = this.props;
      if (handleChange) handleChange(newObj);
      const data = Utils.ds.updateObject(this.state.data, newObj);
      this.setState({data});
    }

    handleResetChange = props => newObj => {
      const data = Utils.ds.updateObject(this.state.data, newObj);
      let resetData = {};
      resetData[newObj.name] = data[newObj.name];
      props.forEach(prop => { resetData[prop] = data[prop]; });
      this.setState({data: resetData});
    }

    handleSubmit = e => {
      // TODO: Object.entries() if typeof value == string => newObj.value.trim()
      if (e) e.preventDefault();
      const { data } = this.state;
      const { update, create } = this.props;

      /*
        if (withFiles) {
          if (data.files && data.files.length > 0) {
            data.files.forEach(file => {
              const formData = MyUtils.configureFormData(file);
              create(formData, data, this.props);
            });
          }
        } else {
      */

      if (data.id) update(data.id, data, this.props);
      else create(data, this.props);
    }

    handleEscape = () => {
      const { data, cancel } = this.props;
      if (data) cancel(data.id, this.props);
    }

    handleEscapeKey = e => {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.handleEscape();
      }
    }

    handleSubmitKey = e => {
      if (e.key === 'Escape') {
        e.preventDefault();
        const { data, cancel } = this.props;
        cancel(data.id, this.props);
      } else if (e.key === 'Enter' && !e.shiftKey) {
        // TODO: https://stackoverflow.com/questions/2364141/enter-key-wont-submit-form-in-firefox-but-will-in-chrome-why
        this.handleSubmit(e);
      }
    }

    renderForm = () => {
      return (
        <Form
          {...this.props}
          data={this.state.data}
          handleToggle={this.handleToggle}
          handleChange={this.handleChange}
          handleResetChange={this.handleResetChange}
          handleFiles={this.handleFiles}
          handleSubmit={this.handleSubmit}
          handleEscape={this.handleEscape}
          handleEscapeKey={this.handleEscapeKey}
          handleSubmitKey={this.handleSubmitKey}
        />
      );
    }

    // NOTE: if you have a form with more than one input field, always include a submit button. 
    // Otherwise implicit submission will not work: https://www.tjvantoll.com/2013/01/01/enter-should-submit-forms-stop-messing-with-that/
    render() {
      return this.renderForm();
    }
  }

  FormContainer.displayName = 'FormContainer';
  return FormContainer;
}

export default withForm;