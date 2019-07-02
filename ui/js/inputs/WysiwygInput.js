import React, { Component } from 'react'
import { Form, Switch, Icon } from 'antd'
import parseProps from '../support/ParseProps'

// Code Editor
import AceEditor from 'react-ace'
import 'brace/mode/html'
import 'brace/theme/xcode'
import 'brace/ext/language_tools'

// WYSIWYG
import { HtmlEditor as Wysiwyg, MenuBar } from '@aeaton/react-prosemirror'
import { options, menu } from '@aeaton/react-prosemirror-config-default'

const pretty = require('prettify-html')

export default class WysiwygInput extends Component {

    constructor(props) {
        super(props)

        this.required = parseProps(props, 'required', false)

        this.options = options

        this.menu = menu

        this.state = {
            value: this.pretty(this.props.value),
            showWysiwyg: true,
        }
    }

    pretty = html => {
        html = (html || '').replace(/<p><\/p>/gi, '')
        html = pretty(html)

        return html
    };

    onChange = value => {
        this.props.onChange && this.props.onChange(value)

        this.setState({
            value,
        }, () => {
            window.dispatchEvent(new Event('resize'))
        })
    };

    toggleMode = ({ showWysiwyg }) => {
        // When you think you've emptied out the editor, there's secret p tags.
        // We'll remove these to make your validation and database seem sane.
        const value = this.pretty(this.state.value, {
            ocd: true,
        })

        this.setState({
            value,
            showWysiwyg,
        }, () => {
            window.dispatchEvent(new Event('resize'))
        })
    };

    renderCodeEditor = () => {
        return (
            <div className="ant-input h-auto p-0 overflow-hidden" style={{ transition: 'none' }}>
                <AceEditor
                    mode="html"
                    theme="xcode"
                    value={ this.state.value }
                    width="100%"
                    height="200"
                    wrapEnabled={ true }
                    enableBasicAutocompletion={ true }
                    enableLiveAutocompletion={ true }
                    onChange={ this.onChange }
                    debounceChangePeriod={ 100 }
                    name={ `ace_${this.props.name}` }
                    editorProps={{ $blockScrolling: true }}
                />
            </div>
        )
    };

    renderWysiwyg = () => {
        return (
            <div className="ant-input h-auto" style={{ paddingTop: 15, transition: 'none' }}>
                <Wysiwyg
                    value={ this.state.value }
                    options={ this.options }
                    onChange={ this.onChange }
                    render={({ editor, view }) => (
                        <>
                            <MenuBar menu={ this.menu } view={ view } />
                            { editor }
                        </>
                    )}
                />
            </div>
        )
    };

    renderEditor = () => {
        if (this.state.showWysiwyg) {
            return this.renderWysiwyg()
        }

        return this.renderCodeEditor()
    };

    renderEditorToggle = () => {
        return (
            <div className="absolute top-0 right-0">
                <Switch
                    checked={ this.state.showWysiwyg }
                    onChange={ showWysiwyg => this.toggleMode({ showWysiwyg })}
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
