import React from 'react'
import { Upload, Icon } from 'antd'
import debounce from 'lodash/debounce'
import get from 'lodash/get'
import first from 'lodash/first'
import toArray from 'lodash/toArray'

export default class Uploader extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            busy: false,
        }
    }

    onChange = debounce(async function ({ fileList }) {
        await this.props.getItems()

        this.props.setActive(this.props.items[0])

        let busy = !!fileList.find(f => f.status !== 'done')

        this.setState({
            busy,
        })
    }.bind(this), 500)

    onError = (error, body) => {
        const errorMessage = first(first(toArray(get(body, 'errors', [])))) || 'Sorry an unknown error occured, please try again.'

        message.error(errorMessage)

        setTimeout(() => {
            this.setState({
                busy: false,
            })
        }, 700)
    }

    beforeUpload = () => {
        this.setState({
            busy: true,
        })

        return true
    }

    uploadData = payload => {
        payload._token = this.props.csrf

        return payload
    }

    render() {
        return (
            <Upload.Dragger
                multiple
                name="file"
                accept="image/*,.pdf,.svg"
                action={ this.props.route }
                onChange={ this.onChange }
                showUploadList={ false }
                withCredentials={ true }
                data={ this.uploadData }
                beforeUpload={ this.beforeUpload }
            >
                <p className="ant-upload-drag-icon">
                    <Icon type={ !this.state.busy ? 'inbox' : 'loading' } />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
            </Upload.Dragger>
        )
    }

}
