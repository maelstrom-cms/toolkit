import React, { Component } from 'react'
import { Icon } from 'antd'

export default class BooleanColumn extends Component {
    render() {
        if (this.props.text) {
            return <Icon type="check-circle" theme="twoTone" />
        }

        return <Icon style={{ opacity: .5 }} type="close-circle" theme="twoTone" twoToneColor="#eb2f96" />
    }
}
