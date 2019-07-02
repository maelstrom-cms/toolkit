import React, { Component } from 'react'

export default class ImageColumn extends Component {

    get style() {
        const defaultStyle = {
            borderRadius: '50%',
            height: '35px',
            width: '35px',
            backgroundImage: `url(${this.props.text})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }

        return { ...defaultStyle, ...this.props.style }
    }

    render() {
        if (!this.props.text) {
            return <span>-</span>
        }

        return (
            <a className="inline-block" href={ this.props.text } target="_blank" rel="noreferrer noopener" title={ this.props.text }>
                <div style={ this.style } >&nbsp;</div>
            </a>
        )
    }
}
