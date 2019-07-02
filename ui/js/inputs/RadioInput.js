import React, { Component } from 'react'
import { Form, Radio } from 'antd'
import ParseProps from '../support/ParseProps'

export default class RadioInput extends Component {

    constructor(props) {
        super(props)

        this.required = ParseProps(props, 'required', false)

        this.state = {
            value: props.value,
            options: ParseProps(props, 'options', [
                { label: 'On', value: '1' },
                { label: 'Off', value: '0' },
            ]),
        }
    }

    onChange = value => {
        this.props.onChange && this.props.onChange(value)

        this.setState({
            value,
        })
    };

    renderRadioGroup = () => {
        return (
            <Radio.Group
                defaultValue={ this.state.value }
                onChange={ ({ target }) => this.onChange(target.value) }
            >
                { this.state.options.map(o => <Radio key={ o.value } value={ o.value }>{ o.label }</Radio>)}
            </Radio.Group>
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
                { this.renderRadioGroup() }
            </Form.Item>
        )
    }
}
