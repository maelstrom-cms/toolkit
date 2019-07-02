import React from 'react'
import reqwest from 'reqwest'
import Img from 'react-image'
import { Form, Input, Select, Button, message, Spin, Upload, Popconfirm } from 'antd'

const bytesToSize = function (bytes) {
    const sizes = ['b', 'kb', 'mb', 'gb', 'tb']

    if (bytes === 0) {
        return 'n/a'
    }

    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)

    if (i === 0) {
        return `${bytes} ${sizes[i]})`
    }

    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
}

export default class EditPane extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            busy: false,
            id: this.props.active.id,
            name: this.props.active.name,
            alt: this.props.active.alt,
            description: this.props.active.description,
            tags: this.props.active.tags,
            file: null,
        }
    }

    componentWillReceiveProps(props) {
        if (props.active.id !== this.state.id) {
            this.setState({
                busy: false,
                id: props.active.id,
                name: props.active.name,
                alt: props.active.alt,
                description: props.active.description,
                tags: props.active.tags,
                file: null,
            })

        }
    }

    remove = () => {
        reqwest({
            url: `${this.props.route}/${this.props.active.id}`,
            method: 'DELETE',
            success: () => {
                message.success(`${this.state.name} has been deleted.`)
                this.props.getItems(null)
            },
            error: error => console.error(error),
        })
    }

    update = () => {
        if (!this.state.name) {
            return false
        }

        this.setState({
            busy: true,
        }, () => {

            const data = new FormData()

            data.append('_method', 'PUT')
            data.append('name', this.state.name || '')
            data.append('alt', this.state.alt || '')
            data.append('description', this.state.description || '')

            if (this.state.tags) {
                this.state.tags.forEach(tag => {
                    data.append('tags[]', tag)
                })
            }

            this.state.file && data.append('file', this.state.file)

            reqwest({
                url: `${this.props.route}/${this.props.active.id}`,
                method: 'POST',
                data,
                processData: false,
                success: () => {
                    this.props.getItems(this.props.active.id)

                    this.setState({
                        busy: false,
                        file: null,
                    })

                    message.success(`${this.state.name} has been saved.`)
                },
                error: error => console.error(error),
            })
        })
    }

    render() {
        const image = this.props.active

        return (
            <div>
                <h2>{ image.name }</h2>
                <hr style={{ border: 0, height: 1, background: '#e8e8e8' }} />

                <div className="flex flex-wrap items-center justify-between" style={{ minHeight: 100 }}>
                    <div className="w-1/2 py-3 pr-3">
                        <a href={ image.cached_url } target="_blank" rel="noreferrer noopener">
                            <Img
                                loader={ <Spin /> }
                                src={ image.cached_thumbnail_url }
                                className="w-full h-auto rounded"
                            />
                        </a>
                    </div>
                    <div className="w-1/2">
                        <Upload beforeUpload={ file => {
                            this.setState({ file })

                            return false
                        } } fileList={ this.state.file ? [this.state.file] : []}>
                            <Button icon="upload" type="dashed">Replace</Button>
                        </Upload>
                        <div className="mt-4 text-xs">
                            Size: { bytesToSize(image.size) }<br />
                            Dimensions: { image.dimensions }
                        </div>
                    </div>
                    <div className="w-full my-4 flex flex-wrap items-center">
                        <div className="w-1/2 py-3 pr-3">
                            <Button onClick={ () => this.props.attachMedia(image) } icon="paper-clip" type="primary">Insert</Button>
                        </div>

                    </div>
                </div>

                <div>
                    <Form.Item label="Name" required={ true }>
                        <Input value={ this.state.name } onChange={ ({ target }) => this.setState({ name: target.value })} />
                    </Form.Item>

                    <Form.Item label="Alt text">
                        <Input value={ this.state.alt } onChange={ ({ target }) => this.setState({ alt: target.value })} />
                    </Form.Item>

                    <Form.Item label="Long Description / Caption">
                        <Input.TextArea value={ this.state.description } onChange={ ({ target }) => this.setState({ description: target.value })} />
                    </Form.Item>

                    <Form.Item label="Tags">
                        <Select style={{ width: '100%' }} mode="tags" value={ this.state.tags || [] } onChange={ tags => this.setState({ tags })} />
                    </Form.Item>

                    <Button onClick={ this.update } type="default" icon="save" loading={ this.state.busy } disabled={ !this.state.name }>
                        { this.state.busy ? 'Saving' : 'Save' }
                    </Button>

                    <Popconfirm placement="left" title={(
                        <>
                            <div>Are you sure you want to delete this?</div>
                            <div> All content using this image will be left without.</div>
                        </>
                    )} onConfirm={ this.remove }>
                        <Button className="float-right" icon="delete" type="danger" shape="circle" />
                    </Popconfirm>
                </div>

            </div>
        )
    }

}

