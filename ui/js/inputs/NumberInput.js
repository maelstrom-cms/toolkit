import React, { Component } from 'react'
import { Form, InputNumber } from 'antd'
import ParseProps from '../support/ParseProps'

export default class NumberInput extends Component {

    constructor(props) {
        super(props)

        this.required = ParseProps(props, 'required', false)

        this.min = ParseProps(props, 'min', 0)

        this.max = ParseProps(props, 'max', 500)

        this.step = ParseProps(props, 'step', 1)

        this.precision = ParseProps(props, 'precision', 0)

        this.state = {
            value: ParseProps(props, 'value', this.min),
        }
    }

    onChange = value => {
        this.props.onChange && this.props.onChange(value)

        this.setState({
            value,
        })
    };

    renderInput = () => {
        return (
            <InputNumber
                min={ this.min }
                max={ this.max }
                step={ this.step }
                precision={ this.precision }
                value={ this.state.value }
                onChange={ this.onChange }
            />
        )
    };

    render() {
        return (
            <Form.Item
                label={ this.props.label }
                validateStatus={ this.props.error ? 'error' : null }
                help={ this.props.error || this.props.help }
                required={ this.required }
            >
                { !this.props.onChange && <input value={ this.state.value } type="hidden" name={ this.props.name } /> }
                { this.renderInput() }
            </Form.Item>
        )
    }
}
