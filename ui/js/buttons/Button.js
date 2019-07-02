import React, { Component } from 'react'
import { Form, Button as AntButton } from 'antd'

export default class Button extends Component {

    render() {
        if (this.props.href) {
            return (
                <AntButton
                    icon={ this.props.icon }
                    type={ this.props.style }
                    href={ this.props.href }
                > { this.props.label }
                </AntButton>
            )
        }

        return (
            <Form.Item
                help={ this.props.error || this.props.help }
            >
                <AntButton
                    icon={ this.props.icon }
                    type={ this.props.style }
                    htmlType={ this.props.htmlType }
                >
                    { this.props.label }
                </AntButton>
            </Form.Item>
        )
    }
}
