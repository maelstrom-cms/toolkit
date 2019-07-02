import React, { Component } from 'react'
import { Icon } from 'antd'
import dotGet from 'lodash/get'

export default class TextLinkColumn extends Component {

    get linkText() {
        if (this.props.label) {
            return this.props.label
        }

        return dotGet(this.props.record, this.props.labelIndex, `${ this.props.labelIndex } not found.`)
    }

    renderIcon() {
        if (this.props.icon) {
            return <Icon style={{ transform: 'translateY(-1px)', fontSize: 13, marginLeft: 10 }} type={ this.props.icon } />
        }

        return null
    }

    render() {
        return (
            <a href={ this.props.text } target={ this.props.newTab ? '_blank' : '_self' } rel="noreferrer noopener">
                <span>{ this.linkText }</span>
                { this.renderIcon() }
            </a>
        )
    }
}
