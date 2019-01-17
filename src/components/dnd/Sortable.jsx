import React from 'react'
import { findDOMNode } from 'react-dom'
import classnames from 'classnames'
import { DragSource, DropTarget } from 'react-dnd'

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
  overStyle = {},
  draggingStyle = {},
  component
}) => {
  const props = {
    style: {
      opacity: isDragging ? 0 : 1,
      ...(isOver ? overStyle : {}),
      ...(isDragging ? draggingStyle : {})
    },
    className: classnames({ [draggingClassName]: isDragging, [overClassName]: isOver })
  }
  const Item = component || 'div'
  return connectDragSource(connectDropTarget(<Item {...props}>{children}</Item>))
}

export const generateSortable = (ITEM_TYPE = 'SORT_ITEM') => (
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

export const sort = (dragIndex, hoverIndex, data) => {
  const items = [...data]
  const item = items[dragIndex]
  if (!item) return
  items.splice(dragIndex, 1)
  items.splice(hoverIndex, 0, item)
  return items
}
export default generateSortable('SORT_ITEM')
