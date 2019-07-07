import React, { Component } from 'react'
import { Form, Icon, Button, Input } from 'antd'
import debounce from 'lodash/debounce'
import ReactList from 'react-list'
import ParseProps from '../support/ParseProps'

export default class IconInput extends Component {

    constructor(props) {
        super(props)

        this.type = props.type

        this.required = ParseProps(props, 'required', false)

        // https://ant.design/components/icon/
        // JSON.stringify(Array.from(document.querySelectorAll('.anticon-class')).map(e => e.innerText))
        const icons = ParseProps(props, 'icons', [])

        this.icons = icons.length ? icons : ['step-backward', 'step-forward', 'fast-backward', 'fast-forward', 'shrink', 'arrows-alt', 'down', 'up', 'left', 'right', 'caret-up', 'caret-down', 'caret-left', 'caret-right', 'up-circle', 'down-circle', 'left-circle', 'right-circle', 'double-right', 'double-left', 'vertical-left', 'vertical-right', 'vertical-align-top', 'vertical-align-middle', 'vertical-align-bottom', 'forward', 'backward', 'rollback', 'enter', 'retweet', 'swap', 'swap-left', 'swap-right', 'arrow-up', 'arrow-down', 'arrow-left', 'arrow-right', 'play-circle', 'up-square', 'down-square', 'left-square', 'right-square', 'login', 'logout', 'menu-fold', 'menu-unfold', 'border-bottom', 'border-horizontal', 'border-inner', 'border-outer', 'border-left', 'border-right', 'border-top', 'border-verticle', 'pic-center', 'pic-left', 'pic-right', 'radius-bottomleft', 'radius-bottomright', 'radius-upleft', 'radius-upright', 'fullscreen', 'fullscreen-exit', 'question', 'question-circle', 'plus', 'plus-circle', 'pause', 'pause-circle', 'minus', 'minus-circle', 'plus-square', 'minus-square', 'info', 'info-circle', 'exclamation', 'exclamation-circle', 'close', 'close-circle', 'close-square', 'check', 'check-circle', 'check-square', 'clock-circle', 'warning', 'issues-close', 'stop', 'edit', 'form', 'copy', 'scissor', 'delete', 'snippets', 'diff', 'highlight', 'align-center', 'align-left', 'align-right', 'bg-colors', 'bold', 'italic', 'underline', 'strikethrough', 'redo', 'undo', 'zoom-in', 'zoom-out', 'font-colors', 'font-size', 'line-height', 'column-height', 'dash', 'small-dash', 'sort-ascending', 'sort-descending', 'drag', 'ordered-list', 'unordered-list', 'radius-setting', 'column-width', 'area-chart', 'pie-chart', 'bar-chart', 'dot-chart', 'line-chart', 'radar-chart', 'heat-map', 'fall', 'rise', 'stock', 'box-plot', 'fund', 'sliders', 'android', 'apple', 'windows', 'ie', 'chrome', 'github', 'aliwangwang', 'dingding', 'weibo-square', 'weibo-circle', 'taobao-circle', 'html5', 'weibo', 'twitter', 'wechat', 'youtube', 'alipay-circle', 'taobao', 'skype', 'qq', 'medium-workmark', 'gitlab', 'medium', 'linkedin', 'google-plus', 'dropbox', 'facebook', 'codepen', 'code-sandbox', 'amazon', 'google', 'codepen-circle', 'alipay', 'ant-design', 'ant-cloud', 'aliyun', 'zhihu', 'slack', 'slack-square', 'behance', 'behance-square', 'dribbble', 'dribbble-square', 'instagram', 'yuque', 'alibaba', 'yahoo', 'reddit', 'sketch', 'alert', 'account-book', 'api', 'appstore', 'audio', 'bank', 'bell', 'book', 'build', 'bulb', 'calculator', 'calendar', 'camera', 'car', 'carry-out', 'cloud', 'code', 'compass', 'contacts', 'container', 'control', 'credit-card', 'crown', 'customer-service', 'dashboard', 'database', 'dislike', 'environment', 'experiment', 'eye-invisible', 'eye', 'file-add', 'file-excel', 'file-exclamation', 'file-image', 'file-markdown', 'file-pdf', 'file-ppt', 'file-text', 'file-unknown', 'file-word', 'file-zip', 'file', 'filter', 'fire', 'flag', 'folder-add', 'folder-open', 'folder', 'frown', 'funnel-plot', 'gift', 'hdd', 'heart', 'home', 'hourglass', 'idcard', 'insurance', 'layout', 'like', 'lock', 'medicine-box', 'mail', 'meh', 'message', 'mobile', 'money-collect', 'notification', 'pay-circle', 'phone', 'picture', 'play-square', 'printer', 'profile', 'project', 'property-safety', 'pushpin', 'read', 'reconciliation', 'red-envelope', 'rest', 'rocket', 'safety-certificate', 'save', 'security-scan', 'schedule', 'setting', 'shop', 'shopping', 'skin', 'smile', 'sound', 'star', 'tablet', 'switcher', 'tag', 'tags', 'thunderbolt', 'tool', 'trophy', 'unlock', 'usb', 'video-camera', 'wallet', 'apartment', 'audit', 'barcode', 'bars', 'block', 'border', 'branches', 'ci', 'cloud-download', 'cloud-server', 'cloud-sync', 'cloud-upload', 'cluster', 'coffee', 'copyright', 'deployment-unit', 'desktop', 'disconnect', 'dollar', 'download', 'ellipsis', 'euro', 'exception', 'export', 'file-done', 'file-jpg', 'file-protect', 'file-search', 'file-sync', 'fork', 'gateway', 'global', 'gold', 'import', 'inbox', 'key', 'laptop', 'line', 'link', 'loading-3-quarters', 'loading', 'man', 'menu', 'monitor', 'more', 'number', 'paper-clip', 'percentage', 'pound', 'poweroff', 'qrcode', 'reload', 'robot', 'safety', 'scan', 'search', 'select', 'shake', 'share-alt', 'shopping-cart', 'solution', 'sync', 'table', 'team', 'to-top', 'trademark', 'transaction', 'upload', 'user-add', 'user-delete', 'user', 'usergroup-add', 'usergroup-delete', 'wifi', 'woman']

        this.state = {
            preview: props.value,
            value: props.value,
            show: false,
            keyword: null,
        }
    }

    handleKeyDown = event => {
        if (event.code === 'Escape') {
            this.closePicker()
        }
    };

    openPicker = () => {
        this.setState({
            show: true,
            keyword: null,
        }, () => {
            window.dispatchEvent(new Event('resize'))
        })

        window.dispatchEvent(new Event('resize'))
        document.addEventListener('keydown', this.handleKeyDown)
    };

    closePicker = () => {
        this.setState({
            show: false,
            keyword: null,
        }, () => {
            window.dispatchEvent(new Event('resize'))
        })

        window.dispatchEvent(new Event('resize'))
        document.removeEventListener('keydown', this.handleKeyDown)
    };

    onChange = value => {
        this.props.onChange && this.props.onChange(value)

        this.setState({
            value,
            preview: value,
        })
    };

    doSearch = keyword => {
        this.setState({
            keyword,
        })
    };

    renderPicker = () => {
        const icons = [ ...this.icons ].filter(icon => {
            if (this.state.keyword) {
                return (icon || '').indexOf(this.state.keyword) !== -1
            }

            return true
        })

        const debouncedUpdate = debounce(value => this.doSearch(value), 200)

        return (
            <div style={{ width: 280 }} className="p-3 shadow bg-white rounded border border-gray-400">
                <div>
                    <Input placeholder="Search" onChange={({ target: { value } }) => debouncedUpdate(value)} />
                </div>
                <div className="mt-3 overflow-scroll flex flex-wrap" style={{ maxHeight: 215 }}>
                    <ReactList
                        itemRenderer={ index => {
                            const icon = icons[index]

                            return (
                                <div key={ icon } className="pr-1 pb-1 inline-block">
                                    <Button title={ icon } onClick={ () => {
                                        this.closePicker()
                                        this.props.onChange && this.props.onChange(icon)
                                        this.setState({ value: icon })
                                    }} className="bg-black-500">
                                        <Icon type={ icon } />
                                    </Button>
                                </div>
                            )
                        }}
                        length={ icons.length }
                        type="uniform"
                    />
                </div>
            </div>
        )
    };

    renderInput = () => {
        if (!this.state.show) {
            return null
        }

        return (
            <>
                <div onClick={() => this.closePicker()} className="fixed top-0 right-0 left-0 bottom-0 w-full h-full z-30"/>
                <div className="inline-block absolute z-40 left-0">
                    { this.renderPicker() }
                </div>
            </>
        )
    };

    renderThumb = () => {
        return (
            <>
                <div onClick={ () => this.openPicker() } className="ant-input cursor-pointer" style={{ padding: 10, width: 41, height: 40 }}>
                    { this.state.value && <Icon type={ this.state.value } style={{ fontSize: 20 }} /> }
                </div>
                { this.renderInput() }
            </>
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
                { !this.props.onChange && <input value={ this.state.value } type="hidden" name={ this.props.name } /> }
                { this.renderThumb() }
            </Form.Item>
        )
    }
}
