import React, { Component } from 'react'
import ReactMde from 'react-mde'
import * as Showdown from 'showdown'
import { Form, Switch, Icon } from 'antd'
import 'react-mde/lib/styles/css/react-mde-toolbar.css'
import 'react-mde/lib/styles/css/react-mde-editor.css'
import ParseProps from '../support/ParseProps'

const inputStyle = {
    minHeight: 60,
    transition: 'none',
}

export default class MarkdownInput extends Component {

    constructor(props) {
        super(props)

        this.required = ParseProps(props, 'required', false)

        this.showdown = new Showdown.Converter()

        this.state = {
            value: props.value,
            showEditor: true,
        }
    }

    onChange = value => {
        this.props.onChange && this.props.onChange(value)

        this.setState({
            value,
        })
    };

    renderMde = () => {
        return (
            <div className="ant-input h-auto p-0 overflow-hidden" style={ inputStyle }>
                <ReactMde
                    onChange={ this.onChange }
                    value={ this.state.value }
                />
            </div>
        )
    };

    renderPreview = () => {
        return (
            <div className="ant-input h-auto" style={ inputStyle }>
                <div dangerouslySetInnerHTML={{ __html: this.showdown.makeHtml(this.state.value) }} />
            </div>
        )
    };

    renderEditor = () => {
        if (this.state.showEditor) {
            return this.renderMde()
        }

        return this.renderPreview()
    };

    renderEditorToggle = () => {
        return (
            <div className="absolute top-0 right-0">
                <Switch
                    checked={ this.state.showEditor }
                    onChange={ showEditor => this.setState({ showEditor })}
                    unCheckedChildren={ <Icon type="code" /> }
                />
            </div>
        )
    };

    render() {
        return (
            <div className="relative">
                <Form.Item
                    label={ this.props.label }
                    validateStatus={ this.props.error ? 'error' : null }
                    help={ this.props.error || this.props.help }
                    required={ this.required }
                >
                    { !this.props.onChange && <input value={ this.state.value } type="hidden" name={ this.props.name } /> }
                    { this.renderEditor() }
                </Form.Item>

                { this.renderEditorToggle() }
            </div>
        )
    }
}
