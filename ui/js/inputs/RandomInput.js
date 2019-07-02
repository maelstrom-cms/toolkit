import React from 'react'
import { Icon } from 'antd'
import TextInput from './TextInput'
import ParseProps from '../support/ParseProps'

export default class RandomInput extends TextInput {

    constructor(props) {
        super(props)

        this.timeout = null

        this.strLength = ParseProps(props, 'str_length', 32)

        this.allowClear = false

        this.charset = this.props.charset || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@£$%^&*()-_=+[]{};:|/.,<>'

        this.state.spin = false
    }

    onClick = event => {
        event.preventDefault()

        this.setState({
            spin: true,
        })

        this.makeRandomString()

        clearTimeout(this.timeout)

        this.timeout = setTimeout(() => {
            this.setState({
                spin: false,
            })
        }, 500)
    };

    makeRandomString() {
        let value = ''

        for (let i = 0; i < this.strLength; i++) {
            value += this.charset.charAt(Math.floor(Math.random() * this.charset.length))
        }

        this.props.onChange && this.props.onChange(value)

        this.setState({
            value,
        })
    }

    renderSuffix = () => {
        return (
            <button tabIndex="-1" type="button" className="block border-0 appearance-none p-0 m-0 cursor-pointer outline-none hover:outline-none" onClick={ this.onClick }>
                <Icon type="sync" spin={ this.state.spin }  />
            </button>
        )
    }
}
