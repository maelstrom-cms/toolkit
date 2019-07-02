import React, { Component } from 'react'
import { Form, Select } from 'antd'
import reqwest from 'reqwest'
import { NestedResource } from '../buttons'
import ParseProps from '../support/ParseProps'

export default class SelectInput extends Component {

    constructor(props) {
        super(props)

        this.originalValue = ParseProps(props, 'value', null)

        this.required = ParseProps(props, 'required', false)

        this.placeholder = ParseProps(props, 'placeholder', undefined)

        this.mode = this.props.mode || 'default'

        this.allowClear = ParseProps(props, 'allow_clear', false)

        this.showSearch = ParseProps(props, 'show_search', true)

        this.remoteUri = ParseProps(props, 'remote_uri', null)

        this.createButton = ParseProps(props, 'create_button', null)

        const options = ParseProps(props, 'options', [{ label: 'Yes', value: '1' }, { label: 'No', value: '0' }])

        this.state = {
            value: undefined,
            options: this.mapOptions(options),
        }
    }

    async componentWillMount() {
        document.addEventListener('refresh-data', this.fetchRemoteData)

        await this.fetchRemoteData()

        this.setState({
            value: this.getDefaultValue(),
        })
    }

    componentDidMount() {
        this.mounted = true
    }

    componentWillUnmount() {
        this.mounted = false
        document.removeEventListener('refresh-data', this.fetchRemoteData)
    }

    getDefaultValue = () => {
        let value = this.originalValue

        if (Array.isArray(this.originalValue)) {
            value = this.state.options.filter(o => value.indexOf(`${o.key}`) !== -1)
        } else {
            value = `${value}`
            value = this.state.options.find(o => o.key === value)
        }

        return value
    }

    fetchRemoteData = async () => {
        if (!this.remoteUri) {
            return null
        }

        const data = await reqwest(this.remoteUri)
        const options = this.mapOptions(data)

        if (!this.mounted) {
            return
        }

        this.setState({
            options,
        })
    };

    mapOptions(options) {
        if (!Array.isArray(options)) {
            return []
        }

        return options.map(o => {
            return {
                key: `${o.value}`,
                label: `${o.label}`,
            }
        })
    }

    onChange = value => {
        if (Array.isArray(value)) {
            this.props.onChange && this.props.onChange(value.map(v => v.key))
        } else {
            this.props.onChange && this.props.onChange(value.key)
        }

        this.setState({
            value,
        })
    };

    shouldShowItem = (search, option) => {
        const keyword = (search || '').toLowerCase()
        const label = (option.props.children || '').toLowerCase()

        return label.indexOf(keyword) !== -1
    };

    renderInput = () => {
        if (!this.createButton) {
            return this.renderSelect()
        }

        return (
            <div className="flex items-center">
                <div className="flex-1 pr-2">{ this.renderSelect() }</div>
                <div>{ this.renderExtras() }</div>
            </div>
        )
    };

    renderExtras = () => {
        return <NestedResource { ...this.createButton } />
    };

    renderSelect = () => {
        let options = [ ...this.state.options ]

        return (
            <Select
                mode={ this.mode }
                labelInValue={ true }
                filterOption={ this.shouldShowItem }
                placeholder={ this.placeholder }
                showSearch={ this.showSearch }
                allowClear={ this.allowClear }
                value={ this.state.value }
                onChange={ this.onChange }
            >
                { options.map(o => <Select.Option key={ o.key } value={ `${o.key}` }>{ o.label }</Select.Option>) }
            </Select>
        )
    };

    renderHidden = () => {
        if (this.props.onChange) {
            return null
        }

        if (Array.isArray(this.state.value)) {
            return this.state.value.map(v => <input key={ `${ this.props.name }_${ v.key }` } value={ v.key } type="hidden" name={ `${this.props.name}[]` } />)
        }

        return <input value={ this.state.value ? this.state.value.key : '' } type="hidden" name={ this.props.name } />
    };

    render() {
        return (
            <Form.Item
                label={ this.props.label }
                validateStatus={ this.props.error ? 'error' : null }
                help={ this.props.error || this.props.help }
                required={ this.required }
            >
                { this.renderHidden() }
                { this.renderInput() }
            </Form.Item>
        )
    }
}
