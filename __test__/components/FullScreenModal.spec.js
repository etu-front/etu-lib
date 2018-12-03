import React from 'react'
import FullScreenModal from '../../src/components/FullScreenModal'
import { mount, shallow, render } from 'enzyme'

describe('FullScreenModal', function() {

  it('ok', () => {
    const onOk = jest.fn()
    const wrap = mount(<FullScreenModal visible hasFooter onOk={onOk} />)
    wrap.find('.ant-btn-primary').simulate('click')
    expect(onOk).toBeCalled()
  })

  it('cancel', () => {
    const onCancel = jest.fn()
    const wrap = mount(<FullScreenModal visible hasHeader hasFooter onCancel={onCancel} showHeader/>)
    wrap.find('.anticon-close').simulate('click')
    expect(onCancel).toBeCalled()
  })

  it('render', () => {
    const wrap = mount(<FullScreenModal visible wrapClassName='customClassName' hasHeader background='black' />)
    expect(wrap.find('.customClassName').length).toEqual(1)
    expect(wrap.find('.ant-modal-mask').length).toEqual(0)
    expect(wrap.find('.anticon-close').length).toEqual(1)
    const content = wrap.find('.ant-modal-content').getDOMNode()
    expect(window.getComputedStyle(content)).toHaveProperty('background', 'black')

    const body = wrap.find('.ant-modal-body').getDOMNode()
    expect(window.getComputedStyle(body)).toHaveProperty('padding', '60px 24px')
  })
})
