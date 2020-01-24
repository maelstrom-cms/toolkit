import React, { Component } from 'react'
import { Form, Input, Icon } from 'antd'
import ParseProps from '../support/ParseProps'

export default class TextInput extends Component {

    constructor(props) {
        super(props)

        this.required = ParseProps(props, 'required', false)

        this.autoSize = ParseProps(props, 'auto_size', false)

        this.allowClear = ParseProps(props, 'allow_clear', false)

        this.htmlType = ParseProps(props, 'html_type', 'text')

        this.autoComplete = ParseProps(props, 'autocomplete', 'off')

        this.readOnly = ParseProps(props, 'readonly', false);

        this.disabled = ParseProps(props, 'disabled', false);

        this.state = {
            value: props.value,
        }
    }

    onChange = value => {
        this.props.onChange && this.props.onChange(value)

        this.setState({
            value,
        })
    };

    renderAddonBefore = () => {
        if (this.props.addonBeforeIcon) {
            return <Icon type={ this.props.addonBeforeIcon } />
        }

        if (this.props.addonBefore) {
            return this.props.addonBefore
        }

        return null
    };

    renderAddonAfter = () => {
        if (this.props.addonAfterIcon) {
            return <Icon type={ this.props.addonAfterIcon } />
        }

        if (this.props.addonAfter) {
            return this.props.addonAfter
        }

        return null
    };

    renderPrefix = () => {
        if (this.props.prefixIcon) {
            return <Icon type={ this.props.prefixIcon } />
        }

        if (this.props.prefix) {
            return this.props.prefix
        }

        return null
    };

    renderSuffix = () => {
        if (this.props.suffixIcon) {
            return <Icon type={ this.props.suffixIcon } />
        }

        if (this.props.suffix) {
            return this.props.suffix
        }

        return null
    };

    renderTextInput = onChange => {
        return <Input
            allowClear={ this.allowClear }
            addonBefore={ this.renderAddonBefore() }
            addonAfter={ this.renderAddonAfter() }
            prefix={ this.renderPrefix() }
            suffix={ this.renderSuffix() }
            type={ this.htmlType }
            value={ this.state.value }
            onChange={ onChange }
            autoComplete={ this.autoComplete }
            disabled={ this.disabled }
            readOnly={ this.readOnly }
        />
    };

    renderTextArea = onChange => {
        return <Input.TextArea
            autoSize={ this.autoSize }
            value={ this.state.value }
            onChange={ onChange }
            disabled={ this.disabled }
            readOnly={ this.readOnly }
        />
    };

    renderInput = () => {
        const onChange = ({ target }) => this.onChange(target.value)

        if (this.props.htmlType === 'textarea') {
            return this.renderTextArea(onChange)
        }

        return this.renderTextInput(onChange)
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
