import React, { Component } from 'react'
import { Alert } from 'antd'

export default class ValidationAlert extends Component {

    messages = () => {
        return (
            <div>
                { JSON.parse(this.props.errors).map(error => <div key={ error }>{ error }</div>) }
            </div>
        )
    };

    render() {

        return (
            <Alert
                showIcon
                type={ this.props.style }
                message={ this.messages() }
            />
        )
    }
}
