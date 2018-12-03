import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon } from 'antd'
import View from './View'
import FileIcon from './FileIcon'

const Container = styled(View)`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
`
const Header = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1;
  text-align: right;
`

const Main = styled(View)`
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  position: relative;
`

const Sider = styled(View)`
  width: 100px;
  min-width: 100px;
  height: 100%;
  overflow-y: auto;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  li {
    height: 80px;
    background-size: cover !important;
    margin-top: 8px;
    text-align: center;
  }
  .onSelected {
    outline: 3px solid #fff;
  }
`

const BaseIcon = styled.a`
  color: #fff;
  transition: opacity 0.1s;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
  opacity: 0.8;
  font-size: 30px;
  &:hover {
    color: #fff;
    opacity: 1;
  }
  cursor: pointer;
`
const DirectionIcon = styled(BaseIcon)`
  position: absolute;
  display: flex;
  align-items: center;
  width: 20%;
  height: 100%;
  font-size: 36px;
`

export default class SlideShow extends Component {
  static displayName = 'SlideShow'

  static propTypes = {
    visible: PropTypes.bool,
    mediaSize: PropTypes.number,
    onClose: PropTypes.func,
    medias: PropTypes.array,
    current: PropTypes.number
  }

  static defaultProps = {
    visible: false,
    medias: [],
    mediaSize: 600,
    current: 0
  }

  static getDerivedStateFromProps(props, state) {
    if (props.visible && !state.visible) return { current: props.current, visible: props.visible }
    if (!props.visible) return { visible: false, current: 0 }
    return null
  }

  static getThumbnail = (id, width, height) => {}
  static getFile = id => {}
  static getDownload = id => {}
  // 绑定获取文件地址函数
  static bindGetFileFunctions = ({ getThumbnail, getFile, getDownload }) => {
    SlideShow.getFile = getFile
    SlideShow.getThumbnail = getThumbnail
    SlideShow.getDownload = getDownload
  }
  state = {
    current: this.props.current,
    visible: this.props.visible
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible && !prevProps.visible) {
      document.addEventListener('keydown', this.onKeyDown, false)
      document.body.style.overflow = 'hidden'
    }
    if (!this.props.visible && prevProps.visible) {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', this.onKeyDown)
    }
  }

  onKeyDown = e => {
    if (!this.props.medias || this.props.medias.length < 1) return
    if (e.keyCode === 37 || e.keyCode === 38) {
      e.preventDefault()
      e.stopPropagation()
      this.prevMedia()
    } else if (e.keyCode === 39 || e.keyCode === 40) {
      e.preventDefault()
      e.stopPropagation()
      this.nextMedia()
    } else if (e.keyCode === 27) {
      this.handleClose()
    }
    return false
  }

  getMedia = idx => {
    const media = this.props.medias[idx]
    if (typeof media.extra === 'object') return media
    let extra = {}
    try {
      extra = JSON.parse(media.extra)
      if (extra.attrs) {
        extra = extra.attrs
      }
    } catch (e) {
      extra = {}
    }
    return {
      ...media,
      extra
    }
  }

  handleClose = () => {
    this.props.onClose && this.props.onClose()
  }

  get currentMedia() {
    return this.getMedia(this.state.current)
  }

  handleChange = idx => {
    this.setState({ current: idx })
  }

  prevMedia = () => {
    if (!this.props.sidebar) return
    let idx = this.state.current - 1
    if (this.state.current === 0) {
      idx = this.props.medias.length - 1
    }
    this.handleChange(idx)
  }

  nextMedia = () => {
    if (!this.props.sidebar) return
    let idx = 0
    if (this.state.current !== this.props.medias.length - 1) {
      idx = this.state.current + 1
    }
    this.handleChange(idx)
  }

  get isMultiple() {
    return this.props.medias.length > 1
  }

  renderDownloadIcon(item) {
    if (this.props.canDownload) {
      return (
        <BaseIcon
          href={SlideShow.getDownload(item.media_id)}
          rel="noopener noreferrer"
          target="_blank"
          download
          style={{ marginRight: 20 }}
        >
          <Icon type="download" size={32} />
        </BaseIcon>
      )
    }
    if (item.type !== 'picture' && item.type !== 'video') {
      return (
        <BaseIcon
          as="a"
          href={SlideShow.getFile(item.media_id)}
          rel="noopener noreferrer"
          target="_blank"
          style={{ marginRight: 20 }}
        >
          <Icon type="eye" size={32} />
        </BaseIcon>
      )
    }
    return (
      <BaseIcon as="a" style={{ marginRight: 20 }}>
        {' '}
      </BaseIcon>
    )
  }
  renderCurrentMedia() {
    const media = this.currentMedia,
      size = this.isMultiple ? 80 : 40,
      mediaWidth = window.document.body.clientWidth - size,
      mediaHeight = window.document.body.clientHeight - 20,
      { media_id, type } = media

    const url = SlideShow.getFile(media_id)

    return (
      <View flex={1} className={'relative'}>
        <Header>
          {this.renderDownloadIcon(media)}
          <BaseIcon onClick={this.handleClose}>
            <Icon type="close-circle" theme="filled" />
          </BaseIcon>
        </Header>
        <Main
          onClick={
            this.isMultiple
              ? undefined
              : e => {
                  if (e.target.tagName !== 'VIDEO' && e.target.tagName !== 'IMG') {
                    this.handleClose()
                  }
                }
          }
        >
          {this.isMultiple && this.props.sidebar && (
            <DirectionIcon onClick={this.prevMedia} style={{ justifyContent: 'flex-start', left: 0 }}>
              <Icon type="left" />
            </DirectionIcon>
          )}
          <div style={{ maxWidth: mediaWidth, maxHeight: mediaHeight, textAlign: 'center', width: '100%' }}>
            {type === 'picture' && (
              <img
                key={url} // 不设置 Key 会导致 React 替换 src 属性而不是创建新的元素，在新的图像加载完成之前都不会显示出来
                src={url + 'thumbnail/'}
                style={{ maxHeight: mediaHeight, maxWidth: '100%' }}
                alt={url}
              />
            )}
            {type === 'video' && (
              <video
                key={url}
                src={url}
                controls
                autoPlay
                controlsList="nodownload"
                style={{ maxHeight: mediaHeight, maxWidth: 'calc(100% - 40%)' }}
              />
            )}

            {type !== 'picture' && type !== 'video' && (
              <a href={SlideShow.getFile(media.media_id)} rel="noopener noreferrer" target="_blank">
                <View align={'center'}>
                  <FileIcon type={type} size={100} />
                  <p className={'t-white m-t-20 f18'}>{media.name}</p>
                </View>
              </a>
            )}
          </div>
          {this.isMultiple && this.props.sidebar && (
            <DirectionIcon onClick={this.nextMedia} style={{ justifyContent: 'flex-end', right: 0 }}>
              <Icon type="right" />
            </DirectionIcon>
          )}
        </Main>
      </View>
    )
  }

  render() {
    const { medias, sidebar } = this.props
    if (!this.props.visible) return null
    return (
      <Container row align="stretch">
        {this.renderCurrentMedia()}
        {sidebar && medias.length > 1 && (
          <Sider>
            <ul>
              {medias.map((m, idx) => {
                const item = this.getMedia(idx)
                if (item.type === 'video' || item.type === 'picture') {
                  const url = SlideShow.getThumbnail(item.media_id, 160, 160)
                  return (
                    <li
                      key={item.media_id}
                      className={idx === this.state.current ? 'onSelected' : ''}
                      title={item.name}
                      style={{ background: `url(${url}) center no-repeat` }}
                      onClick={this.handleChange.bind(null, idx)}
                    />
                  )
                }

                return (
                  <li
                    key={item.media_id}
                    className={idx === this.state.current ? 'onSelected' : ''}
                    title={item.name}
                    onClick={this.handleChange.bind(null, idx)}
                  >
                    <FileIcon type={item.type} size={50} style={{ margin: '0 auto', paddingTop: 10 }} />
                  </li>
                )
              })}
            </ul>
          </Sider>
        )}
      </Container>
    )
  }
}
