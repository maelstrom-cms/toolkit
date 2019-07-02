import React, { Component } from 'react'
import { Form, InputNumber, Slider, Icon } from 'antd'
import parseProps from '../support/ParseProps'

export default class SliderInput extends Component {

    constructor(props) {
        super(props)

        this.required = parseProps(props, 'required', false)

        this.showInput = parseProps(props, 'show_input', false)

        this.min = parseInt(parseProps(props, 'min', 1))

        this.max = parseInt(parseProps(props, 'max', 1))

        this.step = parseInt(parseProps(props, 'step', 1))

        this.dots = parseProps(props, 'dots', true)

        this.marks = parseProps(props, 'marks', undefined)

        this.state = {
            value: parseInt(parseProps(props, 'value', this.min)),
        }
    }

    onChange = value => {
        this.props.onChange && this.props.onChange(value)

        this.setState({
            value,
        })
    };

    renderSlider = () => {
        return (
            <Slider
                min={ this.min }
                max={ this.max }
                step={ this.step }
                dots={ this.dots }
                marks={ this.marks }
                value={ this.state.value }
                onChange={ this.onChange }
            />
        )
    };

    renderInput = () => {
        return (
            <InputNumber
                min={ this.min }
                max={ this.max }
                step={ this.step }
                style={{ marginLeft: 16 }}
                value={ this.state.value }
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
                { !this.props.onChange && <input value={ this.state.value } type="hidden" name={ this.props.name } /> }

                <div className="flex flex-wrap justify-between items-center">
                    { this.props.prefixIcon && <div className="pr-3"><Icon type={ this.props.prefixIcon } /></div> }

                    <div className="flex-1" style={{ transform: 'translateY(-1px)' }}>
                        { this.renderSlider() }
                    </div>

                    { this.props.suffixIcon && <div className="pl-3"><Icon type={ this.props.suffixIcon } /></div> }
                    { this.showInput && <div>{ this.renderInput() }</div>}
                </div>
            </Form.Item>
        )
    }
}
