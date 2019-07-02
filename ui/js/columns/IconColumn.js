import React, { Component } from 'react'
import { Icon } from 'antd'

export default class IconColumn extends Component {
    render() {
        if (!this.props.text) {
            return <span>-</span>
        }

        return (
            <Icon style={{ fontSize: 21 }} type={ this.props.text } />
        )
    }
}
