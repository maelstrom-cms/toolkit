import SelectInput from './SelectInput'
import ParseProps from '../support/ParseProps'

export default class SelectMultipleInput extends SelectInput {

    constructor(props) {
        super(props)

        this.mode = 'multiple'

        this.originalValue = ParseProps(props, 'value', [])
    }

}
