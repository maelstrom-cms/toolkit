import React, { Component } from 'react'
import { Alert } from 'antd'

export default class FlashAlert extends Component {
    render() {
        return (
            <Alert
                showIcon
                type={ this.props.style }
                message={ this.props.message }
            />
        )
    }
}
