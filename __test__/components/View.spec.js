import React from 'react'
import View from '../../src/components/View'
import { shallow, render } from 'enzyme'
import renderer from 'react-test-renderer'
import { decodeStream } from 'iconv-lite';

const setup = () => {
  const props = {
    className: 'customClass',
    onClick: jest.fn()
  }
  const wrapper = shallow(<View {...props}>hello</View>)
  return {
    props,
    wrapper
  }
}

describe('View', function() {
  const { props, wrapper } = setup()
  it('props', () => {
    const jsx = (
      <View
        row
        align={'flex-end'}
        flex={1}
        width={200}
        height={100}
        wrap
        justify={'stretch'}
        background={'red'}
        color={'white'}
        radius={5}
        style={{ lineHeight: '24px' }}
      >
        good
      </View>
    )
    const v = shallow(jsx)
    const style = v.prop('style')
    expect(v.text()).toEqual('good')
    expect(style).toHaveProperty('flexDirection', 'row')
    expect(style).toHaveProperty('alignItems', 'flex-end')
    expect(style).toHaveProperty('flexWrap', 'wrap')
    expect(style).toHaveProperty('justifyContent', 'stretch')
    expect(style).toHaveProperty('flex', 1)
    expect(style).toHaveProperty('width', 200)
    expect(style).toHaveProperty('height', 100)
    expect(style).toHaveProperty('background', 'red')
    expect(style).toHaveProperty('color', 'white')
    expect(style).toHaveProperty('borderRadius', 5)
    expect(style).toHaveProperty('lineHeight', '24px')
    const rendered = renderer.create(jsx)

    expect(rendered.toJSON()).toMatchSnapshot()

    const columnView = shallow(<View column>column</View>)
    expect(columnView.prop('style')).toHaveProperty('flexDirection', 'column')
    expect(View.displayName).toEqual('View')
    expect(View.Center.displayName).toEqual('View.Center')

    const layoutView = render(
      <View row>
        <View width={200}>1</View>
        <View flex={1} background={'#eee'} />
      </View>
    )
    expect(layoutView.find('div').length).toBe(2)
  })

  it('render layout', () => {
    const rendered = renderer.create(
      <View row>
        <View width={200}>1</View>
        <View flex={1} background={'#eee'} />
      </View>
    )
    expect(rendered.toJSON()).toMatchSnapshot()
  })

  it('render View.Center', () => {
    const tree = renderer.create(<View.Center>Hello</View.Center>).toJSON()
    expect(tree).toHaveStyleRule('align-items', 'center !important')
    expect(tree).toHaveStyleRule('justify-content', 'center !important')
    expect(tree).toMatchSnapshot()
  })

  it('should click event be called', () => {
    wrapper.simulate('click', { key: 'Click' })
    expect(props.onClick).toBeCalled()
  })

  it('should has custom classname', () => {
    expect(wrapper.is('.customClass')).toEqual(true)
  })

  it('layout 2', () => {
    const w = renderer.create(
      <View wrap row style={{ margin: '0 -10px'}}>
        <View height={100} flex={1} background='red' />
        <View height={100} flex={1} background='green' />
        <View height={100} flex={1} background='blue' />
      </View>
    ).toJSON()
    expect(w).toMatchSnapshot()
  })
})
