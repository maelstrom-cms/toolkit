import React from 'react'
import { Upload, Icon } from 'antd'
import debounce from 'lodash/debounce'

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

    beforeUpload = () => {
        this.setState({
            busy: true,
        })

        return true
    }

    render() {
        return (
            <div>
                <Upload.Dragger
                    multiple
                    name="file"
                    accept="image/*,.pdf,.svg"
                    action={ this.props.route }
                    onChange={ this.onChange }
                    showUploadList={ false }
                    withCredentials={ true }
                    beforeUpload={ this.beforeUpload }
                >
                    <p className="ant-upload-drag-icon">
                        <Icon type={ !this.state.busy ? 'inbox' : 'loading' } />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                </Upload.Dragger>
            </div>
        )
    }

}
