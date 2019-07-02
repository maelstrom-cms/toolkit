import React, { Component } from 'react'

export default class EditLinkColumn extends Component {
    render() {
        return (
            <a href={ this.props.record.panelRoutes.edit }>{ this.props.text }</a>
        )
    }
}
