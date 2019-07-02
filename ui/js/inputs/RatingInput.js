import React, { Component } from 'react'
import { Form, Rate, Icon } from 'antd'
import ParseProps from '../support/ParseProps'

export default class RatingInput extends Component {

    constructor(props) {
        super(props)

        this.required = ParseProps(props, 'required', false)

        this.count = parseInt(ParseProps(props, 'count', 5))

        this.character = ParseProps(props, 'character', null)

        this.icon = ParseProps(props, 'icon', null)

        this.allowHalf = ParseProps(props, 'allow_half', false)

        this.allowClear = ParseProps(props, 'allow_clear', false)

        this.style = {
            color: ParseProps(props, 'colour', undefined),
        }

        this.state = {
            value: parseInt(ParseProps(props, 'value', 0)),
        }
    }

    onChange = value => {
        this.props.onChange && this.props.onChange(value)

        this.setState({
            value,
        })
    };

    renderCharacter() {
        if (this.character) {
            return this.character
        }

        if (this.icon) {
            return <Icon type={ this.icon } />
        }

        return undefined
    }

    renderRating = () => {
        return (
            <Rate
                count={ this.count }
                value={ this.state.value }
                onChange={ this.onChange }
                allowClear={ this.allowClear }
                allowHalf={ this.allowHalf }
                character={ this.renderCharacter() }
                style={ this.style }
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
                { !this.props.onChange && <input value={ this.state.value } type="hidden" name={ this.props.name } /> }
                { this.renderRating() }
            </Form.Item>
        )
    }
}
