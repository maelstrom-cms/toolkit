import React, { Component } from 'react'
import { Form, Upload, Button, Icon } from 'antd'
import ParseProps from '../support/ParseProps'

export default class FileInput extends Component {

    constructor(props) {
        super(props)

        this.required = ParseProps(props, 'required', false)

        this.listType = 'text'

        this.ref = React.createRef()

        this.icon = ParseProps(props, 'icon', 'upload')

        this.button = ParseProps(props, 'button', 'Select file')

        this.state = {
            dirty: false,
            value: props.value,
            file: null,
        }
    }

    fileList = () => {
        if (this.state.file) {
            return [
                this.state.file,
            ]
        }

        if (this.state.value && !this.state.dirty) {
            return [{
                uid: this.state.value,
                name: this.state.value,
                status: 'done',
                thumbUrl: this.state.value,
            }]
        }

        return []
    };

    attachFile = file => {
        const data = new DataTransfer()

        data.items.add(file)

        file.thumbUrl = URL.createObjectURL(file)

        this.setState({ file, dirty: true })
        this.ref.current.files = data.files

        this.props.onChange && this.props.onChange(file)

        return false
    };

    removeFile = () => {
        const data = new DataTransfer()

        this.ref.current.files = data.files

        this.setState({
            file: null,
            dirty: true,
        })

        this.props.onChange && this.props.onChange(null)

        return {
            fileList: [],
        }
    };

    renderHiddenInputs = () => {
        return (
            <>
                <input className="hidden" ref={ this.ref } type="file" name={ this.state.file ? this.props.name : undefined } />
                { !this.props.onChange && <input type="hidden" name={ !this.state.file ? this.props.name : undefined } value={ this.props.value } readOnly /> }
            </>
        )
    };

    renderUploader = () => {
        return (
            <Upload
                beforeUpload={ this.attachFile }
                onRemove={ this.removeFile }
                fileList={ this.fileList() }
                listType={ this.listType }
            >
                <Button>
                    <Icon type={ this.icon } /> { this.button }
                </Button>
            </Upload>
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
                { this.renderHiddenInputs() }
                { this.renderUploader() }
            </Form.Item>
        )
    }
}
