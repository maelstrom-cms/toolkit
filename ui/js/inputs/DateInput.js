import moment from 'moment'
import React, { Component } from 'react'
import { Form, DatePicker } from 'antd'
import ParseProps from '../support/ParseProps'

export default class DateInput extends Component {

    constructor(props) {
        super(props)

        this.required = ParseProps(props, 'required', false)

        this.allowClear = ParseProps(props, 'allow_clear', false)

        this.showToday = ParseProps(props, 'show_today', true)

        this.allowFuture = ParseProps(props, 'allow_future', false)

        this.allowPast = ParseProps(props, 'allow_past', false)

        this.disabledDates = ParseProps(props, 'disabled_dates', [])

        this.displayFormat = props.displayFormat || 'DD/MM/YYYY'

        this.saveFormat = props.saveFormat || 'YYYY-MM-DD'

        this.placeholder = props.placeholder || 'Pick a date'

        const value = ParseProps(props, 'value', undefined)

        this.state = {
            value: value ? moment(value, this.saveFormat).utc() : null,
        }
    }

    disallowedDates = (date) => {
        if (this.disabledDates.indexOf(date.format('YYYY-MM-DD')) !== -1) {
            return true
        }

        const now = moment.utc()

        if (!this.allowPast && date.isBefore(now)) {
            return true
        }

        if (!this.allowFuture && date.isAfter(now)) {
            return true
        }

        return false
    };

    onChange = value => {
        this.props.onChange && this.props.onChange(value.format(this.saveFormat))

        this.setState({
            value,
        })
    };

    renderInput = () => {
        return (
            <DatePicker
                style={{ width: 270 }}
                value={ this.state.value }
                allowClear={ this.allowClear }
                showToday={ this.showToday }
                format={ this.displayFormat }
                placeholder={ this.placeholder }
                onChange={ this.onChange }
                disabledDate={ this.disallowedDates }
            />
        )
    };

    render() {
        return (
            <Form.Item
                label={ this.props.label }
                validateStatus={ this.props.error ? 'error' : null }
                help={ this.props.error || this.props.help }
                required={ JSON.parse(this.props.required) }
            >
                { !this.props.onChange && <input value={ this.state.value ? this.state.value.format(this.saveFormat) : '' } type="hidden" name={ this.props.name } /> }
                { this.renderInput() }
            </Form.Item>
        )
    }
}
