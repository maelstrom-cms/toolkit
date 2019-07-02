import React from 'react'
import reqwest from 'reqwest'
import { Form, message } from 'antd'
import TextInput from './TextInput'
import ParseProps from '../support/ParseProps'

window.blackhole = window.blackhole || function () {}

message.config({
    maxCount: 1,
})

export default class VideoInput extends TextInput {

    constructor(props) {
        super(props)

        this.required = ParseProps(props, 'required', false)

        this.driver = null

        this.htmlType = 'url'

        this.drivers = [YouTubeDriver, VimeoDriver]

        this.originalValue = ParseProps(props, 'value', {})

        this.state = {
            oembed: this.originalValue,
            value: this.originalValue.url,
        }
    }

    get inputValue() {
        if (Object.keys(this.state.oembed).length) {
            return JSON.stringify(this.state.oembed)
        }

        return ''
    }

    analyseInput = value => {
        // value = 'https://www.youtube.com/watch?v=dE3dqlFzDeg';
        // value = 'https://vimeo.com/338463318';

        this.setState({
            value,
        })

        if (!value) {
            this.props.onChange && this.props.onChange(value)

            this.setState({
                oembed: {},
            })
        }

        this.drivers.forEach(driver => {
            const matchedId = driver.is(value)

            if (matchedId) {
                this.setState({
                    driver: new driver(matchedId),
                }, () => {
                    this.state.driver.fetch(this.updatePreview)
                })
            }
        })
    };

    updatePreview = oembed => {
        if (oembed.title && oembed.thumbnail && oembed.id && oembed.url) {
            this.setState({
                oembed,
            }, () => {
                window.dispatchEvent(new Event('resize'))
            })

            this.props.onChange && this.props.onChange(oembed)
        } else {
            console.error(oembed)
            message.error('Could not find video.')
        }
    };

    renderInput = () => {
        const onChange = ({ target }) => this.analyseInput(target.value)

        return (
            <div className="flex flex-wrap items-center justify-between">
                <div className={`flex-1 ${Object.keys(this.state.oembed).length ? 'pr-4' : ''}`}>
                    { this.renderTextInput(onChange) }
                </div>
                { Object.keys(this.state.oembed).length === 4 && <div className="w-1/4">
                    <a href={ this.state.oembed.url } target="_blank" rel="noopener noreferrer" className="flex flex-wrap items-center">
                        <div className="w-1/4 pr-2"><img className="max-w-full rounded" src={ this.state.oembed.thumbnail } alt={ this.state.oembed.title } /></div>
                        <div className="w-3/4"><span className="leading-tight text-xs flex-1">{ this.state.oembed.title.substring(0, 70) }...</span></div>
                    </a>
                </div> }
            </div>
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
                { !this.props.onChange && <input value={ this.inputValue } type="hidden" name={ this.props.name } /> }
                { this.renderInput() }
                <input type="hidden" name="_encoded[]" value={ this.props.name } />
            </Form.Item>
        )
    }
}

class VideoDriver {
    constructor(id) {
        this.data = {
            id: id,
            url: null,
            thumbnail: null,
            title: null,
        }
    }

    static is = () => {
        return false
    };

    async fetch(callback) {
        return callback()
    }
}

class VimeoDriver extends VideoDriver {

    static is = value => {
        const pattern = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/i
        const result = value.match(pattern)

        if (result && result[3]) {
            return result[3]
        }
    };

    async fetch(callback) {
        this.data.url = `https://vimeo.com/${this.data.id}`

        try {
            const url = 'https://noembed.com/embed?url='
                + encodeURIComponent(this.data.url)
                + '&callback=backhole'

            const oembed = await reqwest({
                url,
                type: 'jsonp',
            })

            this.data.title = oembed.title
            this.data.thumbnail = oembed.thumbnail_url

            return callback(this.data)
        } catch (error) {
            console.error(error)
        }
    }
}

class YouTubeDriver extends VideoDriver {

    static is = value => {
        const pattern = /^.*(youtu\.be\/|vi?\/|u\/\w\/|embed\/|\?vi?=|&vi?=)([^#&?]*).*/i
        const result = value.match(pattern)

        if (result && result[2]) {
            return result[2]
        }

        return false
    };

    async fetch(callback) {
        this.data.url = `https://www.youtube.com/watch?v=${this.data.id}`

        try {
            const url = 'https://noembed.com/embed?url='
                + encodeURIComponent(this.data.url)
                + '&callback=backhole'

            const oembed = await reqwest({
                url,
                type: 'jsonp',
            })

            this.data.title = oembed.title
            this.data.thumbnail = oembed.thumbnail_url

            return callback(this.data)
        } catch (error) {
            console.error(error)
        }
    }
}
