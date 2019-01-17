import React from 'react'
import { findDOMNode } from 'react-dom'
import classnames from 'classnames'
import { DragSource, DropTarget, ConnectDropTarget, ConnectDragSource } from 'react-dnd'

const cardSource = {
  beginDrag: props => ({
    id: props.id,
    index: props.index
  })
}

const cardTarget = {
  hover(props, monitor, component) {
    if (!component) return null
    const dragIndex = monitor.getItem().index
    const hoverIndex = props.index
    if (dragIndex === hoverIndex) return

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

    // Determine mouse position
    const clientOffset = monitor.getClientOffset()

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top
    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

    // Time to actually perform the action
    props.onSort(dragIndex, hoverIndex)
    monitor.getItem().index = hoverIndex
  }
}

const Sortable = ({
  isDragging,
  isOver,
  connectDragSource,
  connectDropTarget,
  children,
  overClassName = '',
  draggingClassName = '',
  overStyle = { border: '1px solid #999', margin: -1 },
  draggingStyle = {}
}) => {
  const props = {
    style: {
      opacity: isDragging ? 0 : 1,
      ...(isOver ? overStyle : {}),
      ...(isDragging ? draggingStyle : {})
    },
    className: classnames({ [draggingClassName]: isDragging, [overClassName]: isOver })
  }
  return connectDragSource(connectDropTarget(<div {...props}>{children}</div>))
}

export const generateSortable = (ITEM_TYPE = 'CARD') => (
  DropTarget(ITEM_TYPE, cardTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }))(
    DragSource(ITEM_TYPE, cardSource, (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    }))(Sortable)
  )
)

export default generateSortable('SORT_ITEM')
