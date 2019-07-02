import React, { Component } from 'react'
import { Form, Checkbox } from 'antd'
import ParseProps from '../support/ParseProps'

export default class CheckboxInput extends Component {

    constructor(props) {
        super(props)

        this.required = ParseProps(props, 'required', false)

        this.options = ParseProps(props, 'options', [
            { label: 'Yes', value: '1' },
            { label: 'No', value: '0' },
        ])

        this.state = {
            value: ParseProps(props, 'value', []),
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
            <Checkbox.Group
                options={ this.options }
                defaultValue={ this.state.value }
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
                { !this.props.onChange && this.state.value.map(value => <input key={ value } value={ value } type="hidden" name={ `${this.props.name}[]` } />)}
                { this.renderInput() }
            </Form.Item>
        )
    }
}
