import React, { Component } from 'react'
import { Form, Transfer } from 'antd'
import reqwest from 'reqwest'
import { NestedResource } from '../buttons'
import ParseProps from '../support/ParseProps'

export default class TransferInput extends Component {

    constructor(props) {
        super(props)

        this.required = ParseProps(props, 'required', false)

        this.remoteUri = ParseProps(props, 'remote_uri', null)

        this.createButton = ParseProps(props, 'create_button', null)

        const options = ParseProps(props, 'options', [{ label: 'Option 1', value: 1 }, { label: 'Option 2', value: 2 }])

        this.state = {
            value: ParseProps(props, 'value', []).map(value => `${value}`),
            options: this.mapOptions(options),
        }
    }

    UNSAFE_componentWillMount() {
        document.addEventListener('refresh-data', this.fetchRemoteData)

        this.fetchRemoteData()
    }

    componentWillUnmount() {
        this.mounted = false
        document.removeEventListener('refresh-data', this.fetchRemoteData)
    }

    componentDidMount() {
        this.mounted = true
        Array.from(document.querySelectorAll('.ant-transfer-list-search')).forEach(el => {
            el.type = 'search'
        })
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
                value: `${o.value}`,
                label: `${o.label}`,
            }
        })
    }

    filterLogic = (keyword, option) => option.label.indexOf(keyword) !== -1;

    onSearch = () => null;

    onChange = (value) => {
        this.props.onChange && this.props.onChange(value)

        this.setState({
            value,
        })
    };

    renderInput = () => {
        return (
            <Transfer
                height={ 400 }
                listStyle={{ width: 300, height: 320 }}
                showSearch
                dataSource={ this.state.options }
                filterOption={ this.filterLogic }
                targetKeys={ this.state.value }
                onChange={ this.onChange }
                onSearch={ this.onSearch }
                render={ item => item.label }
                footer={ this.renderExtras }
            />
        )
    };

    renderHidden = () => {
        if (this.props.onChange) {
            return null
        }

        if (this.state.value.length) {
            return this.state.value.map(value => <input key={ `${this.props.name}_${value}` } value={ value } type="hidden" name={ `${this.props.name}[]` } />)
        }

        return <input type="hidden" value="1" name={ `${this.props.name}_is_empty` } />
    };

    renderExtras = () => {
        if (!this.createButton) {
            return null
        }

        return (
            <div className="m-1 float-right">
                <NestedResource { ...this.createButton } buttonSize="small" />
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
                { this.renderHidden() }
                { this.renderInput() }
            </Form.Item>
        )
    }
}
