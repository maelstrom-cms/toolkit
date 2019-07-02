import React, { Component } from 'react'
import { Form, Switch, Icon } from 'antd'
import FieldVisibilityHandler from '../support/FieldVisibility'
import ParseProps from '../support/ParseProps'

export default class SwitchInput extends Component {

    constructor(props) {
        super(props)

        this.required = ParseProps(props, 'required', false)

        this.toggleConfiguration = {
            repeater: props.repeater,
            on: ParseProps(props, 'hide_on', []),
            off: ParseProps(props, 'hide_off', []),
        }

        this.onValue = ParseProps(props, 'on_value', 1)

        this.offValue = ParseProps(props, 'off_value', 0)

        this.state = {
            value: ParseProps(props, 'value', 0),
        }
    }

    componentWillMount() {
        FieldVisibilityHandler((this.state.value === this.onValue), this.toggleConfiguration)
    }

    componentDidMount() {
        FieldVisibilityHandler((this.state.value === this.onValue), this.toggleConfiguration)
    }

    renderChecked = () => {
        if (this.props.onIcon) {
            return <Icon type={ this.props.onIcon } />
        }

        if (this.props.onText) {
            return this.props.onText
        }

        return null
    };

    renderUnchecked = () => {
        if (this.props.offIcon) {
            return <Icon type={ this.props.offIcon } />
        }

        if (this.props.offText) {
            return this.props.offText
        }

        return null
    };

    onChange = checked => {
        const value = (checked ? this.onValue : this.offValue)

        this.props.onChange && this.props.onChange(value)

        this.setState({
            value,
        }, () => {
            FieldVisibilityHandler(checked, this.toggleConfiguration)
        })
    };

    renderInput = () => {
        return (
            <Switch
                checkedChildren={ this.renderChecked() }
                unCheckedChildren={ this.renderUnchecked() }
                defaultChecked={ this.state.value === this.onValue }
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
