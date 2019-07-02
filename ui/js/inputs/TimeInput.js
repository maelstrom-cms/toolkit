import moment from 'moment'
import React, { Component } from 'react'
import { Form, TimePicker } from 'antd'
import ParseProps from '../support/ParseProps'

moment.suppressDeprecationWarnings = true

export default class TimeInput extends Component {

    constructor(props) {
        super(props)

        this.required = ParseProps(props, 'required', false)

        this.allowClear = ParseProps(props, 'allow_clear', false)

        this.disabledHours = ParseProps(props, 'disabled_hours', [])

        this.disabledMinutes = ParseProps(props, 'disabled_minutes', [])

        this.disabledSeconds = ParseProps(props, 'disabled_seconds', [])

        this.hourStep = ParseProps(props, 'hour_step', 1)

        this.minuteStep = ParseProps(props, 'minute_step', 5)

        this.secondStep = ParseProps(props, 'second_step', 15)

        this.use12Hour = ParseProps(props, 'use_12_hour', true)

        this.displayFormat = props.displayFormat || 'HH:mm A'

        this.saveFormat = props.saveFormat || 'HH:mm:ss'

        this.placeholder = props.placeholder || 'Pick a time'

        let value = ParseProps(props, 'value', undefined)

        this.state = {
            value: value ? moment(value, this.saveFormat).utc() : null,
        }
    }

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
            <TimePicker
                id={`time_${Date.now().toString()}`}
                style={{ width: 160 }}
                showTime={ true }
                value={ this.state.value }
                allowClear={ this.allowClear }
                format={ this.displayFormat }
                placeholder={ this.placeholder }
                onChange={ this.onChange }
                disabledHours={ this.disallowedTimes().disabledHours }
                disabledMinutes={ this.disallowedTimes().disabledMinutes }
                disabledSeconds={ this.disallowedTimes().disabledSeconds }
                hourStep={ this.hourStep }
                minuteStep={ this.minuteStep }
                secondStep={ this.secondStep }
                use12Hours={ this.use12Hour }
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
