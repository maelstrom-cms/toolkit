import React, { Component } from 'react'
import ParseProps from '../support/ParseProps'

export default class MediaManagerColumn extends Component {

    constructor(props) {
        super(props)

        document.addEventListener('media-fetched', this.findMedia, {
            once: true,
            passive: true,
        })

        this.maxItems = ParseProps(props, 'max_items', 3)

        this.library = []

        this.ids = Array.isArray(props.text) ? props.text : [props.text]

        this.state = {
            images: [],
        }
    }

    findMedia = ({ detail }) => {
        this.library = detail

        const images = this.ids.map(id => {
            return this.library.find(image => `${image.id}` === `${id}`)
        })

        this.setState({
            images,
        })
    }

    get style() {
        const defaultStyle = {
            borderRadius: '50%',
            height: '35px',
            width: '35px',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }

        return { ...defaultStyle, ...this.props.style }
    }

    renderSingle = image => {
        return (
            <a key={ image.id } className="inline-block" href={ image.cached_url } target="_blank" rel="noreferrer noopener" title={ image.name }>
                <div style={{ ...this.style, backgroundImage: `url(${ image.cached_thumbnail_url })` }} >&nbsp;</div>
            </a>
        )
    }

    render() {
        if (!this.ids.length) {
            return <span>-</span>
        }

        return <div className="media-column"> { this.state.images.slice(0, this.maxItems).map(i => this.renderSingle(i)) }</div>
    }
}
