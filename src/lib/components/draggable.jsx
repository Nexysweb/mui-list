import React from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';


// taken from ES6 code: https://react-dnd.github.io/react-dnd/docs-drag-source.html
const rowSource = {
// Return the data describing the dragged item
  beginDrag: (props) => {
    return { id: props.id, idx: props.idx };
  }
};

const rowTarget = {
  // taken from: https://react-dnd.github.io/react-dnd/examples-sortable-simple.html
  hover: (props, monitor, component) => {
    const dragIndex = monitor.getItem().idx
    const hoverIndex = props.idx

    // Don't replace items with themselves
    if (dragIndex !== hoverIndex) {
      monitor.getItem().idx = hoverIndex;
      monitor.getItem().lastId = props.id;
      const dragId = monitor.getItem().id;
      props.onMove(dragId, props.id, props);
      //props.onMove(dragIndex, hoverIndex)
      // NOTE: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
    }
  },
  drop: (props, monitor) => {
    const targetId = monitor.getItem().lastId;
    const draggedId = monitor.getItem().id;
    if (draggedId !== targetId) {
      props.onDrop(draggedId, targetId, props);
    }
  }
};

const sourceCollect = (connect, monitor) => {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDragSource: connect.dragSource(),
    // You can ask the monitor about the current drag state:
    isDragging: monitor.isDragging()
  };
}

const targetCollect = (connect) => {
  return {
    connectDropTarget: connect.dropTarget()
  };
}


// NOTE: this is a thunk with arrow functions: https://daveceddia.com/what-is-a-thunk/
const draggable = Component => children => {
  class Draggable extends React.Component {
    connect = instance => {
      const { connectDragSource, connectDropTarget } = this.props;
      const node = findDOMNode(instance);
      connectDragSource(node);
      connectDropTarget(node);
    }

    render() {
      const { isDragging } = this.props;
      const opacity = isDragging ? 0 : 1;
      const style = {opacity, backgroundColor: 'rgba(255, 255, 255, .8)'};
      // for native components (<div> etc.): connectDragSource(connectDropTarget(component)); 
      // ref is fix for non-native elements taken from https://github.com/react-dnd/react-dnd/issues/347
      return <Component ref={this.connect} style={style}>{children}</Component>;
    }
  }
  const source = DragSource('item', rowSource, sourceCollect)(Draggable);
  return DropTarget('item', rowTarget, targetCollect)(source);
}

export default draggable;