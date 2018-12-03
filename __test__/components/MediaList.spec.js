import React from 'react'
import MediaList, { List, FileName } from '../../src/components/MediaList'
import { shallow, render, mount } from 'enzyme'
import renderer from 'react-test-renderer'

export const getThumbnail = (id, width, height) =>
  `/bos/api/v1/files/${id}/thumbnail/?width=${width}&height=${height}&mode=zoom_cut`
export const getFile = id => `/bos/api/v1/files/${id}/`
export const getDownload = id => `/bos/api/v1/files/${id}/download/`

const setup = () => {
  MediaList.bindGetFileFunctions({ getThumbnail, getFile, getDownload })

  const medias = [
    {
      type: 'pdf',
      media_id: 'E77SKH7F7HXQ06YNZAF64GFC76Q9SEZA',
      id: 'E77SKH7F7HXQ06YNZAF64GFC76Q9SEZA',
      name: 'LastOfUs2.pdf'
    },
    {
      course_resource_id: 163,
      data: 'YM0JXBCAA84DJ7WEZ20TY5D4HZV3DHW3',
      id: 381,
      name: '【中文版】ETU PBL Backwards Design Template.docx',
      type: 'word',
      media_id: 'YM0JXBCAA84DJ7WEZ20TY5D4HZV3DHW3'
    },
    {
      media_id: '67BD020K2E6JMGX9R00NZ8DQ8KBSSWPG',
      type: 'picture',
      name: '1530871462174.jpg',
      extra: {
        url: '/api/v1/files/67BD020K2E6JMGX9R00NZ8DQ8KBSSWPG/',
        created_at: '2018-07-06T10:04:23Z',
        hash_sha1: '96239c7247d3dd043d2050dc9c95942089cb1a9f',
        created_by: 11001,
        height: 0,
        width: 0,
        attrs: {
          cdn_url: 'https://f-test.etuschool.org/67BD020K2E6JMGX9R00NZ8DQ8KBSSWPG',
          cdn_uid: 'FpYjnHJH090EPSBQ3JyVlCCJyxqf',
          file_name: '1530871462174.jpg',
          height: 460,
          width: 690,
          duration: '0',
          media_type: 'image/jpeg',
          rotation: 0
        },
        is_original: false,
        id: '67BD020K2E6JMGX9R00NZ8DQ8KBSSWPG',
        size: 53943
      }
    },
    {
      media_id: '73VS29QWEZNRYSVDQX30TV4VFMBBYK37',
      type: 'picture',
      extra: {
        url: '/api/v1/files/73VS29QWEZNRYSVDQX30TV4VFMBBYK37/',
        created_at: '2018-07-06T10:04:23Z',
        hash_sha1: '672f3eb6d34028fb7b9468d0fd1ad87fc154c7ef',
        created_by: 11001,
        height: 0,
        width: 0,
        attrs: {
          cdn_url: 'https://f-test.etuschool.org/73VS29QWEZNRYSVDQX30TV4VFMBBYK37',
          cdn_uid: 'FmcvPrbTQCj7e5Ro0P0a2H_BVMfv',
          file_name: '1530871462178.jpg',
          height: 509,
          width: 720,
          duration: '0',
          media_type: 'image/jpeg',
          rotation: 0
        },
        is_original: false,
        id: '73VS29QWEZNRYSVDQX30TV4VFMBBYK37',
        size: 46835
      }
    }
  ]
  const props = {
    items: medias,
    margin: 5,
    background: '#fff',
    fixed: true,
    noName: true,
    bordered: false,
    lazyLoad: false,
    width: 160,
    height: 120,
    hasDeleteButton: false
  }
  const wrapper = shallow(<MediaList {...props} />)
  const rendered = render(<MediaList {...props} />)
  const renderedSnap = renderer.create(<MediaList {...props} />)
  return {
    medias,
    props,
    rendered,
    renderedSnap,
    wrapper
  }
}

describe('MediaList', function() {
  const { props, medias, renderedSnap, rendered, wrapper } = setup()

  it('correct view', () => {
    expect(rendered.find('.ant-card').length).toEqual(medias.length)
    expect(wrapper.prop('margin')).toEqual(5)

    const style = wrapper
      .dive()
      .childAt(0)
      .prop('style')
    expect(style.width).toEqual(160)
    expect(style.height).toEqual(120)
    expect(
      wrapper
        .dive()
        .childAt(0)
        .prop('bordered')
    ).toEqual(false)
    expect(renderedSnap.toJSON()).toMatchSnapshot()
  })

  it('another view', () => {
    const otherProps = {
      ...props,
      noName: false,
      fixed: false,
      background: '#666',
      width: 40,
      bordered: true,
      lazyLoad: true,
      hasDeleteButton: true
    }
    const v = shallow(<MediaList {...otherProps} />)
    expect(v.find('Icon').length).toEqual(4)
    expect(
      v
        .find('Icon')
        .at(0)
        .prop('type')
    ).toEqual('delete')
    const card = v.childAt(0)
    const cardProps = card.props()

    expect(cardProps).toHaveProperty('background', '#666')
    expect(cardProps).toHaveProperty('fixed', 0)
    expect(cardProps).toHaveProperty('bordered', true)

    const style = card.prop('style')
    expect(style).toHaveProperty('width', 40)
    expect(card.find('FileName').length).toEqual(1)
    expect(v.find('FileIcon').length).toEqual(2)
    expect(v.find('ImageCard').length).toEqual(2)
  })

  it('function', () => {
    expect(MediaList.getFileName({})).toEqual(undefined)
    expect(MediaList.getFileName(medias[0])).toEqual('LastOfUs2.pdf')
    expect(MediaList.getFileName({ extra: { attrs: { file_name: 'world' } } })).toEqual('world')
    const media_id = medias[0].media_id
    expect(MediaList.getFile(media_id)).toEqual(`/bos/api/v1/files/${media_id}/`)
    expect(MediaList.getDownload(media_id)).toEqual(`/bos/api/v1/files/${media_id}/download/`)
    expect(MediaList.getThumbnail(media_id, 100, 50)).toEqual(
      `/bos/api/v1/files/${media_id}/thumbnail/?width=100&height=50&mode=zoom_cut`
    )
  })

  it('FileName', () => {
    const v = shallow(<FileName name={'hello'} fixed />)
    expect(v.prop('fixed')).toEqual(1)
    expect(v.find('Tooltip').length).toEqual(1)
    expect(
      v
        .find('Tooltip')
        .children()
        .text()
    ).toEqual('hello')
  })

  it('List', () => {
    const tree = renderer.create(<List margin={3}><List.Item>hello</List.Item></List>).toJSON()
    expect(tree).toHaveStyleRule('margin', '0 -3px')
    expect(tree.children[0].children[0].children[0]).toEqual('hello')
  })
})
