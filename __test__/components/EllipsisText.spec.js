import React from 'react'
import EllipsisText from '../../src/components/EllipsisText'
import { shallow, render } from 'enzyme'
import renderer from 'react-test-renderer'

const setup = () => {
  const props = {
    className: 'customClass',
    textClassName: 'textClass',
    textStyle: { color: 'white' },
    width: 100,
    height: 30,
    onClick: jest.fn()
  }
  const wrapper = shallow(<EllipsisText {...props}>hello</EllipsisText>)
  return {
    props,
    wrapper
  }
}

describe('EllipsisText', function() {
  const { props, wrapper } = setup()

  it('snap', () => {
    const w = renderer.create(
      <EllipsisText>
        Consequat exercitation non duis mollit ad sunt proident occaecat ullamco aliquip in. Incididunt cillum sint sint consequat aliqua enim est fugiat occaecat non dolore sunt id do. Est deserunt nisi duis quis fugiat excepteur enim ad amet pariatur. Cillum et velit ad dolor occaecat ex laboris proident est.
      </EllipsisText>
    ).toJSON()
    expect(w).toMatchSnapshot()
  })

  it('should click event be called', () => {
    wrapper.simulate('click', { key: 'Click' })
    expect(props.onClick).toBeCalled()
  })

  it('should has custom classname', () => {
    expect(wrapper.is('.customClass')).toEqual(true)
  })
  // it('should has custom text classname', () => {
  //   expect(wrapper.children.is('.textClass')).toEqual(true)
  // })

  it('props', () => {
    const jsx = (
      <EllipsisText flex={1} width={200} height={24}>good</EllipsisText>
    )
    const v = shallow(jsx)
    const style = v.prop('style')
    expect(v.text()).toEqual('good')
    expect(style).toHaveProperty('flex', 1)
    expect(style).toHaveProperty('width', 200)
    expect(style).toHaveProperty('height', 24)
    const rendered = renderer.create(jsx)

    expect(rendered.toJSON()).toMatchSnapshot()
  })

  it('render layout', () => {
    const tree = renderer.create(<EllipsisText width={100} textClassName='customTextClass' textStyle={{ lineHeight: 24 }}>Hello</EllipsisText>).toJSON()
    expect(tree.children[0].props.style.lineHeight).toEqual(24)
    expect(tree.children[0].props.className).toEqual('customTextClass')
    expect(tree.props.style.width).toEqual(100)
    expect(tree).toMatchSnapshot()
  })
})
