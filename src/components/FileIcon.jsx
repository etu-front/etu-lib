import React from 'react'
import { Icon } from 'antd'

const icons = ['ai', 'attachment', 'audio', 'box-notes', 'csv', 'eps', 'excel']
icons.push('exe', 'flash', 'doc', 'gpres', 'gsheet', 'html', 'image', 'keynote')
icons.push('link', 'mp4', 'overlay', 'pack', 'pages', 'pdf', 'ppt', 'psd', 'rtf')
icons.push('slide', 'stypi', 'txt', 'video', 'visio', 'webex', 'word', 'xml', 'zip')

export const getIconType = fileType => {
  if (!fileType) return 'attachment'
  const type = fileType.toLowerCase()
  if (['doc', 'docx'].includes(type)) return 'word'
  if (['ppt', 'pptx'].includes(type)) return 'ppt'
  if (icons.indexOf(type) >= 0) return type
  if (['mp3', 'wav', 'ape', 'flac', 'wma'].includes(type)) return 'audio'
  if (['mov', 'ogg', 'avi', 'rmvb', 'flv', 'wmv', 'asf'].includes(type)) return 'video'
  return 'attachment'
}

const CustomIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_922089_bk9l48330b8.js' // 在 iconfont.cn 上生成
})

const FileIcon = ({ style = {}, size = 50, type, ...rest }) => {
  const iconType = getIconType(type)
  return <CustomIcon type={`icon-${iconType}`} style={{ ...style, fontSize: size }} {...rest} />
}
FileIcon.displayName = 'FileIcon'
export default FileIcon
