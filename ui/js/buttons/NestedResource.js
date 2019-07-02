import React from 'react'
import { Drawer, Button, Spin } from 'antd'
import URI from 'urijs'
import ParseProps from '../support/ParseProps'

export default class NestedResource extends React.Component {

    constructor(props) {
        super(props)

        this.icon = ParseProps(props, 'icon', 'plus')

        this.buttonText = ParseProps(props, 'text', 'Create')

        this.buttonStyle = ParseProps(props, 'style', 'primary')

        this.buttonSize = ParseProps(props, 'size', 'default')

        this.state = {
            visible: false,
            renderFrame: false,
            loaded: false,
        }
    }

    get url() {
        const url = this.props.url || '/'
        const uri = new URI(url)

        uri.addQuery('iframe', 1)

        return uri.toString()
    }

    openDrawer() {
        this.setState({
            visible: true,
        })
    }

    closeDrawer() {
        this.setState({
            visible: false,
            renderFrame: false,
            loaded: false,
        }, () => {
            document.dispatchEvent(
                new CustomEvent('refresh-data')
            )
        })
    }

    animationComplete() {
        if (this.state.visible) {
            this.setState({
                renderFrame: true,
            })
        }
    }

    frameLoaded() {
        this.setState({
            loaded: true,
        })
    }

    renderButton() {
        return (
            <Button ghost onClick={ () => this.openDrawer() } icon={ this.icon } type={ this.buttonStyle } size={ this.buttonSize }>
                { this.buttonText }
            </Button>
        )
    }

    renderLoader() {
        if (this.state.loaded) {
            return null
        }

        return (
            <div className="h-screen p-2 text-center flex items-center justify-center ant-spin-nested-loading">
                <Spin tip="Loading" />
            </div>
        )
    }

    renderFrame() {
        if (!this.state.renderFrame) {
            return null
        }

        return (
            <iframe
                onLoad={ () => this.frameLoaded() }
                src={ this.state.visible ? this.url : undefined }
                className={`block w-full h-full border-0 ${!this.state.loaded ? 'hidden' : ''}`}
            />
        )
    }

    renderDrawer() {
        return (
            <Drawer
                width={ '80vw' }
                onClose={ () => this.closeDrawer() }
                visible={ this.state.visible }
                afterVisibleChange={ () => this.animationComplete() }
                destroyOnClose={ true }
            >
                { this.renderLoader() }
                { this.renderFrame() }
            </Drawer>
        )
    }

    render() {
        return (
            <>
                { this.renderButton() }
                { this.renderDrawer() }
            </>
        )
    }
}

const isNested = window.location !== window.parent.location

if (isNested) {
    document.querySelector('.maelstrom-wrapper').classList.add('iframe-mode')
}
