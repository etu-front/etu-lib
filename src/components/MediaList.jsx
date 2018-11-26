import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import LazyLoad from 'react-lazyload'
import styled from 'styled-components'

import { Card, Icon, Tooltip } from 'antd'
import FileIcon from './FileIcon'

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

const List = styled.div`
  clear: both;
  margin: 0 -${props => props.margin}px;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
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

const FileName = ({ name, fixed }) => (
  <List.Name fixed={fixed ? 1 : 0}>
    <Tooltip title={name.length < 20 ? '' : name} placement="topLeft">
      {name}
    </Tooltip>
  </List.Name>
)

const Close = styled.div`
  position: absolute;
  right: 2px;
  top: 2px;
  color: red;
  cursor: pointer;
  .anticon-iconfont {
    font-size: 18px;
  }
`

export default class MediaList extends PureComponent {
  static displayName = 'MediaList'
  static propTypes = {
    items: PropTypes.array.isRequired,
    noName: PropTypes.bool,
    margin: PropTypes.number,
    bordered: PropTypes.bool,
    onDelete: PropTypes.func,
    hasDeleteButton: PropTypes.bool,
    pdfPrevView: PropTypes.bool,
    lazyLoad: PropTypes.bool,
    onClick: PropTypes.func
  }

  static defaultProps = {
    items: [],
    background: 'transparent',
    width: 100,
    height: 100,
    margin: 5,
    bordered: true,
    noName: true,
    pdfPrevView: false,
    lazyLoad: true
  }

  static getThumbnail = (id, width, height) => {}
  static getFile = id => {}
  static getDownload = id => {}
  static getFileName = data => {
    if (data.name) return data.name
    if (data.extra && data.extra.attrs) return data.extra.attrs.file_name
  }

  handleRemoveItem = (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.onDelete && this.props.onDelete(id)
  }

  onClick = (items, index) => {
    const item = items[index]
    if (item.type !== 'picture' && item.type !== 'video') {
      const a = window.document.createElement('a')
      a.href =
        this.props.pdfPrevView && item.type === 'pdf'
          ? MediaList.getFile(item.data || item.media_id)
          : MediaList.getDownload(item.data || item.media_id)
      console.log(a.href)
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

  renderMediaNode = data => {
    const { width, height, lazyLoad, fixed } = this.props,
      id = data.media_id
    const mediaType = data.type

    let thumbnail,
      imgWidth = width / (fixed ? 1 : 1.8),
      imgHeight = height / (fixed ? 1 : 2.5)

    thumbnail = MediaList.getThumbnail(id, width, height)
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
    const { items, margin, bordered, background, noName, fixed, width, height, hasDeleteButton = false } = this.props
    return (
      <List margin={margin}>
        {items.map((data, mediaIndex) => {
          const fileName = !noName && MediaList.getFileName(data)
          return (
            <List.Item
              onClick={this.onClick.bind(null, items, mediaIndex)}
              key={data.media_id + '_' + mediaIndex}
              bordered={bordered && !noName}
              style={{ width, height }}
              fixed={fixed ? 1 : 0}
              margin={margin}
              background={background}
            >
              {this.renderMediaNode(data)}
              {hasDeleteButton && (
                <Close onClick={this.handleRemoveItem.bind(null, data.media_id)}>
                  <Icon type="delete" />
                </Close>
              )}
              {fileName && <FileName fixed={fixed} name={fileName} />}
            </List.Item>
          )
        })}
      </List>
    )
  }
}
