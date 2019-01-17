import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import LazyLoad from 'react-lazyload'
import styled from 'styled-components'
import { Card, Icon, Tooltip } from 'antd'
import FileIcon from './FileIcon'

import dnd from './dnd'

const PlayIcon = styled(Icon)`
  color: white;
  font-size: 28px;
  align-self: center;
  margin: 0 auto;
  &:hover {
    color: #eee;
  }
`

const ImageCard = ({ thumbnail, width, height, backgroundColor = '#F0F0F0', icon }) => (
  <div
    style={{
      backgroundImage: `url(${thumbnail})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      width,
      height,
      margin: '0 auto',
      maxWidth: '100%',
      backgroundColor
    }}
  >
    {icon}
  </div>
)

export const List = styled.div`
  clear: both;
  margin: 0 -${props => props.margin}px;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  & > div, > .ant-card {
    margin: ${props => props.margin + 'px'};
    overflow: hidden;
    border-color: #d5d4d4;
    border-radius: 4px;
    background: ${props => props.background};
    position: relative;
    display: flex;
    align-items: ${props => (props.fixed ? 'center' : 'flex-start')};
    justify-content: center;
  }
`
List.Item = styled(Card)`
  &.ant-card {
    margin: ${props => props.margin + 'px'};
    overflow: hidden;
    border-color: #d5d4d4;
    border-radius: 4px;
    background: ${props => props.background};
    position: relative;
    display: flex;
    align-items: ${props => (props.fixed ? 'center' : 'flex-start')};
    justify-content: center;
  }
  .ant-card-body {
    padding: ${props => (props.fixed ? 0 : '18px 22px')};
    text-align: center;
    cursor: pointer;
  }
`
List.Item.displayName = 'ListItem'

List.Name = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  padding: 0 5px;
  bottom: ${props => (props.fixed ? 0 : '10px')};
  height: 20px;
  font-size: 12px;
  line-height: 20px;
  color: ${props => (props.fixed ? '#fff' : '#787878')};
  background: ${props => (props.fixed ? '#33333399' : 'transparent')};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
`

export const FileName = ({ name, fixed }) => (
  <List.Name fixed={fixed ? 1 : 0}>
    <Tooltip title={name.length < 20 ? '' : name} placement="topLeft">
      {name}
    </Tooltip>
  </List.Name>
)

export const Close = styled.div`
  position: absolute;
  right: 2px;
  top: 2px;
  color: red;
  cursor: pointer;
  .anticon-iconfont {
    font-size: 18px;
  }
`
class MediaList extends PureComponent {
  static displayName = 'MediaList'
  static propTypes = {
    items: PropTypes.array.isRequired,
    noName: PropTypes.bool,
    margin: PropTypes.number,
    bordered: PropTypes.bool,
    fixed: PropTypes.bool,
    onDelete: PropTypes.func,
    hasDeleteButton: PropTypes.bool,
    pdfPrevView: PropTypes.bool,
    lazyLoad: PropTypes.bool,
    onClick: PropTypes.func,
    onSort: PropTypes.func,
    sortOptions: PropTypes.shape({
      type: PropTypes.string,
      overClassName: PropTypes.string,
      draggingClassName: PropTypes.string,
      overStyle: PropTypes.object,
      draggingStyle: PropTypes.object
    })
  }

  static defaultProps = {
    items: [],
    background: '#f5f5f5',
    width: 100,
    height: 100,
    margin: 5,
    bordered: false,
    fixed: true,
    noName: true,
    pdfPrevView: false,
    lazyLoad: true,
    sortOptions: {
      type: 'SORT_ITEM',
      overClassName: '',
      draggingClassName: '',
      overStyle: {},
      draggingStyle: {}
    }
  }

  static getThumbnail = (id, width, height) => {}
  static getFile = id => {}
  static getDownload = id => {}
  // 绑定获取文件地址函数
  static bindGetFileFunctions = ({ getThumbnail, getFile, getDownload }) => {
    MediaList.getFile = getFile
    MediaList.getThumbnail = getThumbnail
    MediaList.getDownload = getDownload
  }

  static getFileName = data => {
    if (data.name) return data.name
    if (data.extra && data.extra.file_name) return data.extra.file_name
    if (data.extra && data.extra.attrs) return data.extra.attrs.file_name
  }

  static getFileId = item => {
    if (item.data) return item.data
    return item.media_id || item.file_id || item.id
  }

  // static getDerivedStateFromProps(props, state) {
  //   if (props.items !== state.items) {
  //     return {
  //       ...state,
  //       items: props.items
  //     }
  //   }
  //   return state
  // }
  // state = {
  //   items: this.props.items
  // }

  handleRemoveItem = (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.onDelete && this.props.onDelete(id)
  }

  onClick = (items, index) => {
    const item = items[index]
    if (item.type !== 'picture' && item.type !== 'video') {
      const a = window.document.createElement('a')
      const fileId = MediaList.getFileId(item)
      a.href = this.props.pdfPrevView && item.type === 'pdf' ? MediaList.getFile(fileId) : MediaList.getDownload(fileId)
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      setTimeout(function() {
        document.body.removeChild(a)
      }, 0)
    } else {
      this.props.onClick && this.props.onClick(items, index)
    }
  }

  sortItem = (dragIndex, hoverIndex) => {
    const items = [...this.props.items]
    const item = items[dragIndex]
    if (!item) return
    items.splice(dragIndex, 1)
    items.splice(hoverIndex, 0, item)
    this.props.onSort(items)
  }

  renderMediaNode = data => {
    const { width, height, lazyLoad, fixed } = this.props
    const fileId = MediaList.getFileId(data)
    const mediaType = data.type

    let thumbnail,
      imgWidth = width / (fixed ? 1 : 1.8),
      imgHeight = height / (fixed ? 1 : 2.5)

    thumbnail = MediaList.getThumbnail(fileId, width, height)
    // 预览模式，小图
    if (mediaType === 'video' || mediaType === 'picture') {
      const img = (
        <ImageCard
          thumbnail={thumbnail}
          width={imgWidth}
          height={imgHeight}
          icon={mediaType === 'video' && <PlayIcon type="play-circle" />}
        />
      )
      if (lazyLoad) {
        return (
          <LazyLoad height={height} offset={50} once>
            {img}
          </LazyLoad>
        )
      }
      return img
    }
    return <FileIcon type={mediaType} size={fixed ? width / 2 : imgHeight} style={{ margin: '0 auto' }} />
  }

  // 视频和图片
  render() {
    const {
      margin,
      bordered,
      background,
      noName,
      fixed,
      width,
      height,
      hasDeleteButton = false,
      onSort,
      sortOptions
    } = this.props
    const { items } = this.props
    const nodes = items.map((item, index) => {
      const fileName =
        (!noName || (item.type !== 'picture' && item.type !== 'video')) && MediaList.getFileName(item)
      const fileId = MediaList.getFileId(item)
      const key = fileId + '_' + index
      const node = (
        <List.Item
          onClick={this.onClick.bind(null, items, index)}
          key={key}
          bordered={bordered && !noName}
          style={{ width, height }}
          fixed={fixed ? 1 : 0}
          margin={margin}
          background={background}
        >
          {this.renderMediaNode(item)}
          {hasDeleteButton && (
            <Close onClick={this.handleRemoveItem.bind(null, fileId)}>
              <Icon type="delete" />
            </Close>
          )}
          {fileName && <FileName fixed={fixed} name={fileName} />}
        </List.Item>
      )
      if (nodes.length > 1 && onSort) {
        const { type: sortType, ...sortProps } = sortOptions
        const Sortable = dnd.generateSortable(sortType)
        return <Sortable key={key} index={index} onSort={this.sortItem} {...sortProps}>{node}</Sortable>
      }
      return node
    })
    return <List margin={margin}>{nodes}</List>
  }
}

export default dnd.wrap(MediaList)
