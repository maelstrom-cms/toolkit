import React, { Component } from 'react'

export default class VideoColumn extends Component {

    oembed = null;

    get style() {
        const defaultStyle = {
            borderRadius: '5px',
            height: '30px',
            width: '50px',
            backgroundImage: `url(${this.oembed.thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }

        return { ...defaultStyle, ...this.props.style }
    }

    UNSAFE_componentWillMount() {
        try {
            if (typeof this.props.text === 'string') {
                this.oembed = JSON.parse(this.props.text)
            } else {
                this.oembed = this.props.text
            }
        } catch (e) {
            this.oembed = null
        }
    }

    render() {
        if (!this.oembed) {
            return <span>-</span>
        }

        return (
            <a className="inline-block" href={ this.oembed.url } target="_blank" rel="noopener noreferrer" title={ this.oembed.title }>
                <div style={ this.style } >&nbsp;</div>
            </a>
        )
    }
}
