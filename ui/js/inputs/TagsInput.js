import React from 'react'
import SelectInput from './SelectInput'
import ParseProps from '../support/ParseProps'

export default class TagsInput extends SelectInput {

    constructor(props) {
        super(props)

        this.mode = 'tags'

        this.createButton = false

        this.originalValue = ParseProps(props, 'value', [])

        this.wildOptions = ParseProps(props, 'allow_wild_values', false)

        this.saveLabels = ParseProps(props, 'save_labels', false)
    }

    getDefaultValue = () => {
        let value = this.originalValue

        if (!value) {
            return []
        }

        value = this.state.options.filter(o => value.indexOf(`${o.key}`) !== -1)

        if (this.wildOptions) {
            this.originalValue.forEach(v => {
                if (!value.find(o => `${o.key}` === `${v}`)) {
                    value.push({
                        key: v,
                        label: v,
                    })
                }
            })
        }
        
        return value
    }

    renderHidden = () => {
        if (this.props.onChange) {
            return null
        }

        if (Array.isArray(this.state.value)) {
            return this.state.value.map(v => <input key={ `${ this.props.name }_${ v.key }` } value={ (this.saveLabels ? v.label : v.key) } type="hidden" name={ `${this.props.name}[]` } />)
        }

        return <input value={ this.state.value ? (this.saveLabels ? this.state.value.label : this.state.value.key) : '' } type="hidden" name={ this.props.name } />
    };

}
