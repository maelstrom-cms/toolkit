import React, { Component, createRef } from 'react'
import { Form } from 'antd'
import AlgoliaPlaces from 'algolia-places-react'
import ParseProps from '../support/ParseProps'

export default class PlaceInput extends Component {

    constructor(props) {
        super(props)

        this.required = ParseProps(props, 'required', false)

        this.placeholder = ParseProps(props, 'placeholder', undefined)

        this.element = createRef()

        this.defaultOptions = ParseProps(props, 'options', [])

        this.state = {
            value: ParseProps(props, 'value', ''),
        }
    }

    get label() {
        if (this.state.value) {
            const label = []

            label.push(this.state.value.locale_names[0])
            label.push(this.state.value.administrative[0])
            label.push(this.state.value.country)

            return label.join(', ')
        }

        return null
    }

    get options() {
        return Object.assign({}, { ...this.defaultOptions })
    }

    componentDidMount() {
        const input = this.element.current.autocomplete.autocomplete[0]

        this.fixInput(input)
        this.fixIcons(input)
    }

    fixInput = input => {
        if (!input.classList.contains('ant-input')) {
            input.classList.add('ant-input')
        }

        input.value = this.label
        setTimeout(() => input.autocomplete = 'new-password', 1000)
    };

    fixIcons = input => {
        const clearButton = input.parentNode.querySelector('.ap-icon-clear')

        clearButton.innerHTML = '<svg viewBox="64 64 896 896" data-icon="close-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path></svg>'

        if (this.label) {
            const pinButton = input.parentNode.querySelector('.ap-icon-pin')

            pinButton.setAttribute('style', 'display: none;')
            clearButton.removeAttribute('style')
        }
    };

    onChange = ({ suggestion }) => {
        if (!suggestion) {
            this.props.onChange && this.props.onChange(null)

            return this.setState({
                value: '',
            })
        }

        const value = { ...suggestion.hit }

        delete value._geoloc
        delete value._highlightResult
        delete value._tags

        this.setState({
            value,
        })

        this.props.onChange && this.props.onChange(value)
    };

    onClear = () => {
        this.setState({
            value: null,
        })
    };

    renderInput = () => {
        return (
            <AlgoliaPlaces
                ref={ this.element }
                placeholder={ this.placeholder }
                options={ this.options }
                onClear={ this.onClear }
                onChange={ this.onChange }
            />
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
                { !this.props.onChange && <input value={ this.state.value ? JSON.stringify(this.state.value) : '' } type="hidden" name={ this.props.name } /> }
                { this.renderInput() }
                <input type="hidden" name="_encoded[]" value={ this.props.name } />
            </Form.Item>
        )
    }
}
