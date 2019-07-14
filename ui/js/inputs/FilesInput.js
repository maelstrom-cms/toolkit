import React, { Component } from 'react'
import { Form, Upload, Button, Icon, Alert } from 'antd'
import ParseProps from '../support/ParseProps'

const hash = function (string) {
    let hash = 0, i, chr

    if (string.length === 0) {
        return hash
    }

    for (i = 0; i < string.length; i++) {
        chr   = (string || '').charCodeAt(i)
        hash  = ((hash << 5) - hash) + chr
        hash |= 0
        // ^^ Convert to 32bit integer
    }

    return hash
}

export default class FilesInput extends Component {

    constructor(props) {
        super(props)

        this.required = ParseProps(props, 'required', false)

        this.listType = 'text'

        this.ref = React.createRef()

        this.maxItems = ParseProps(props, 'max_items', 100)

        this.icon = ParseProps(props, 'icon', 'upload')

        this.button = ParseProps(props, 'button', 'Select file')

        this.state = {
            dirty: false,
            previewableList: [],
            value: ParseProps(props, 'value', []),
            files: ParseProps(props, 'value', []).map(file => ({
                uid: file,
                name: file,
                status: 'done',
                thumbUrl: file,
            })),
        }
    }

    componentDidMount() {
        this.buildFileList()
    }

    buildFileList = () => {
        let previewableList = []

        // These are freshly added files
        if (this.state.files.length) {
            this.state.files.forEach(file => {
                previewableList.push({
                    uid: file.uid,
                    name: file.name,
                    status: 'done',
                    thumbUrl: file.thumbUrl || URL.createObjectURL(file),
                })
            })
        }

        // These are pre-existing files, e.g. a URL
        if (!this.state.files.length && !this.state.dirty && this.state.value.length) {
            this.state.value.forEach(file => {
                previewableList.push({
                    uid: file,
                    name: file,
                    status: 'done',
                    thumbUrl: file,
                })
            })
        }

        this.setState({
            previewableList,
        }, () => {
            window.dispatchEvent(new Event('resize'))
        })
    };

    attachFile = file => {
        if (this.state.files.length >= this.maxItems) {
            return false
        }

        // New data object, push on the existing items
        // then add the new file.
        const data = new DataTransfer()

        // If it's already uploaded, dont push it to the data object.
        this.state.files.forEach(file => {
            if (file.uid.indexOf('http') === -1) {
                data.items.add(file)
            }
        })

        // Push the new attachment to the end.
        data.items.add(file)

        this.ref.current.files = data.files

        // Update state so the UI is in sync
        const files = this.state.files

        files.push(file)

        this.setState({
            files,
            dirty: true,
        }, () => this.buildFileList())

        this.props.onChange && this.props.onChange(files)

        // Returning false tells Ant not to do an ajax upload.
        return false
    };

    removeFile = file => {
        // Get a new array with only what we want
        const files = this.state.files.filter(f => f.uid !== file.uid)

        // Create a new data object, and push in the files to replace
        // the existing files in memory.
        const data = new DataTransfer()

        files.forEach(file => {
            // Only new files to the uploader.
            if (file.uid.indexOf('http') === -1) {
                data.items.add(file)
            }
        })

        this.ref.current.files = data.files

        // Update state so the UI is in sync.
        this.setState({
            files,
            dirty: true,
        }, () => this.buildFileList())

        // Returning true tells ant all is okay!
        return true
    };

    renderHiddenInputs = () => {
        return (
            <>
                { this.state.files.filter(file => (file.thumbUrl || '').indexOf('http') === 0).map(file => <input readOnly key={ file.thumbUrl } value={ file.thumbUrl } type="hidden" name={ this.state.files.length ? `${this.props.name}[${hash(file.thumbUrl)}]` : undefined } />) }
                <input className="hidden" ref={ this.ref } type="file" multiple name={ this.state.files.length ? `${this.props.name}[]` : undefined } />
                <input type="hidden" name={ !this.state.files.length ? this.props.name : undefined } value="" readOnly />
            </>
        )
    };

    renderUploader = () => {
        if (this.props.onChange) {
            return <Alert showIcon={ true } type="error" message="Input not supported inside a repeater." />
        }

        return (
            <Upload
                beforeUpload={ this.attachFile }
                onRemove={ this.removeFile }
                fileList={ this.state.previewableList }
                listType={ this.listType }
                multiple={ true }
            >
                { this.state.files.length < this.maxItems && <Button>
                    <Icon type={ this.icon } /> { this.button }
                </Button> }
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
