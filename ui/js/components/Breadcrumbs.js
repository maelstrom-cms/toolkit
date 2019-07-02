import React, { Component } from 'react'
import { Breadcrumb, Icon } from 'antd'
import ParseProps from '../support/ParseProps'

export default class Breadcrumbs extends Component {

    constructor(props) {
        super(props)

        this.routes = ParseProps(props, 'routes', [])

        this.method = ParseProps(props, 'method', '').toLowerCase()

        this.entityName = ParseProps(props, 'entityName', null)

        this.crumbs = this.getCrumbs()
    }

    getCrumbs = () => {
        const crumbs = ParseProps(this.props, 'crumbs', [])

        if (this.method === 'index') {
            crumbs.push({
                label: this.entityName,
            })
        }

        if (this.method === 'post' || this.method === 'put') {
            crumbs.push({
                label: this.entityName,
                url: this.routes.index,
            })
        }

        if (this.method === 'post') {
            crumbs.push({
                label: 'Create',
            })
        }

        if (this.method === 'put') {
            crumbs.push({
                label: 'Editing',
            })
        }

        return crumbs
    }

    renderCrumb(crumb, key) {
        if (crumb.url) {
            return (
                <Breadcrumb.Item key={ `${key}` } href={ crumb.url }>
                    { crumb.icon && <Icon type={ crumb.icon } /> }
                    { crumb.label && <span>{ crumb.label }</span> }
                </Breadcrumb.Item>
            )
        }

        return (
            <Breadcrumb.Item key={ `${key}` }>
                { crumb.icon && <Icon type={ crumb.icon } /> }
                { crumb.label && <span>{ crumb.label }</span> }
            </Breadcrumb.Item>
        )
    }

    render() {
        if (!this.crumbs.length) {
            return null
        }

        return (
            <Breadcrumb>
                { this.crumbs.map((crumb, key) => this.renderCrumb(crumb, key))}
            </Breadcrumb>
        )
    }
}
