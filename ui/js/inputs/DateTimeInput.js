import moment from 'moment'
import React, { Component } from 'react'
import { Form, DatePicker } from 'antd'
import ParseProps from '../support/ParseProps'

export default class DateTimeInput extends Component {

    constructor(props) {
        super(props)

        this.required = ParseProps(props, 'required', false)

        this.allowClear = ParseProps(props, 'allow_clear', false)

        this.showToday = ParseProps(props, 'show_today', true)

        this.allowFuture = ParseProps(props, 'allow_future', false)

        this.allowPast = ParseProps(props, 'allow_past', false)

        this.disabledDates = ParseProps(props, 'disabled_dates', [])

        this.disabledHours = ParseProps(props, 'disabled_hours', [])

        this.disabledMinutes = ParseProps(props, 'disabled_minutes', [])

        this.disabledSeconds = ParseProps(props, 'disabled_seconds', [])

        this.displayFormat = props.displayFormat || 'DD/MM/YYYY'

        this.saveFormat = props.saveFormat || 'YYYY-MM-DD'

        this.placeholder = props.placeholder || 'Pick a date & time'

        let value = ParseProps(props, 'value', undefined)

        this.state = {
            value: value ? moment(value, this.saveFormat) : null,
        }
    }

    disallowedDates = (date) => {
        if (this.disabledDates.indexOf(date.format('YYYY-MM-DD')) !== -1) {
            return true
        }

        const now = moment()

        if (!this.allowPast && date.isBefore(now)) {
            return true
        }

        if (!this.allowFuture && date.isAfter(now)) {
            return true
        }

        return false
    };

    disallowedTimes = () => ({
        disabledHours: () => this.disabledHours,
        disabledMinutes: () => this.disabledMinutes,
        disabledSeconds: () => this.disabledSeconds,
    });

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
                showTime={ true }
                value={ this.state.value }
                allowClear={ this.allowClear }
                showToday={ this.showToday }
                format={ this.displayFormat }
                placeholder={ this.placeholder }
                onChange={ this.onChange }
                disabledDate={ this.disallowedDates }
                disabledTime={ this.disallowedTimes }
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
                { !this.props.onChange && <input value={ this.state.value ? this.state.value.format(this.saveFormat) : '' } type="hidden" name={ this.props.name } /> }
                { this.renderInput() }
            </Form.Item>
        )
    }
}
