import React from 'react'
import FileIcon, { getIconType } from '../../src/components/FileIcon'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

const setup = () => {
  const props = {
    className: 'customClass',
    type: 'ppt',
    size: 40,
    style: { color: '#ff0000', lineHeight: '20px' },
    onClick: jest.fn()
  }
  const wrapper = shallow(<FileIcon {...props} />)
  return {
    props,
    wrapper
  }
}

describe('FileIcon', function() {
  const { props, wrapper } = setup()
  it('correct icon type', () => {
    expect(getIconType('doc')).toEqual('word')
    expect(getIconType('docx')).toEqual('word')
    expect(getIconType('pptx')).toEqual('ppt')
    expect(getIconType('ppt')).toEqual('ppt')
    expect(getIconType('mp3')).toEqual('audio')
    expect(getIconType('wma')).toEqual('audio')
    expect(getIconType('mov')).toEqual('video')
    expect(getIconType('ogg')).toEqual('video')
    expect(getIconType('blurblurblur')).toEqual('unknown')
  })

  it('props size and type', () => {
    const style = wrapper.prop('style')
    expect(style).toHaveProperty('fontSize', 40)
    expect(wrapper.prop('type')).toEqual('icon-ppt')
  })

  it('custom classname', () => {
    expect(wrapper.is('.customClass')).toEqual(true);
  })

  it('should click event be called', () => {
    wrapper.simulate('click', { key: 'Click' })
    expect(props.onClick).toBeCalled()
  })


  it('custom style', () => {
    const style = wrapper.prop('style')
    expect(style).toHaveProperty('lineHeight', '20px')
    expect(style).toHaveProperty('color', '#ff0000')
  })

  it('doc\'s icon type: icon-word', () => {
    const v = shallow(<FileIcon type='doc' />)
    expect(v.prop('type')).toEqual('icon-word')
  })

  it('render correctly', () => {
    const rendered = renderer.create(<FileIcon type={'pdf'} />)
    expect(rendered.toJSON()).toMatchSnapshot()
  })

})
