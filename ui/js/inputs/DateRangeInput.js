import moment from 'moment'
import React, { Component } from 'react'
import { Form, DatePicker } from 'antd'
import ParseProps from '../support/ParseProps'

export default class DateRangeInput extends Component {

    constructor(props) {
        super(props)

        this.required = ParseProps(props, 'required', false)

        this.allowClear = ParseProps(props, 'allow_clear', false)

        this.showToday = ParseProps(props, 'show_today', true)

        this.showTime = ParseProps(props, 'show_time', true)

        this.allowFuture = ParseProps(props, 'allow_future', false)

        this.allowPast = ParseProps(props, 'allow_past', false)

        this.disabledDates = ParseProps(props, 'disabled_dates', [])

        this.disabledHours = ParseProps(props, 'disabled_hours', [])

        this.disabledMinutes = ParseProps(props, 'disabled_minutes', [])

        this.disabledSeconds = ParseProps(props, 'disabled_seconds', [])

        this.displayFormat = props.displayFormat || 'DD/MM/YYYY'

        this.saveFormat = props.saveFormat || 'YYYY-MM-DD'

        this.placeholder = props.placeholder || 'Pick a date'

        this.state = {
            value: [null, null],
        }

        if (props.value) {
            const value = JSON.parse(props.value)

            this.state.value = [
                moment(value[0], this.saveFormat), moment(value[1], this.saveFormat),
            ]
        } else if (props.valueStart && props.valueEnd) {
            this.state.value = [
                (props.valueStart ? moment(props.valueStart) : null),
                (props.valueEnd ? moment(props.valueEnd) : null),
            ]
        }
    }

    disallowedDates = (date) => {
        if (!date) {
            return false
        }

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
        this.props.onChange && this.props.onChange([
            value[0].format(this.props.saveFormat),
            value[1].format(this.props.saveFormat),
        ])

        this.setState({
            value,
        })
    };

    renderInput = () => {
        return (
            <DatePicker.RangePicker
                style={{ width: 400 }}
                showTime={ this.showTime }
                showToday={ this.showToday }
                allowClear={ this.allowClear }
                value={ this.state.value }
                format={ this.displayFormat }
                onChange={ this.onChange }
                disabledDate={ this.disallowedDates }
                disabledTime={ this.disallowedTimes }
                disabledSeconds={ this.disabledSeconds }
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
                { !this.props.onChange && <input value={ this.state.value[0] ? this.state.value[0].format(this.saveFormat) : '' } type="hidden" name={ this.props.nameStart } /> }
                { !this.props.onChange && <input value={ this.state.value[1] ? this.state.value[1].format(this.saveFormat) : '' } type="hidden" name={ this.props.nameEnd } /> }
                { this.renderInput() }
            </Form.Item>
        )
    }
}
