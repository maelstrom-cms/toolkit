import React, { Component } from 'react'
import arrayMove from 'array-move'
import debounce from 'lodash/debounce'
import Registry from '../support/Registry'
import ParseProps from '../support/ParseProps'
import { Form, Icon, Button, message } from 'antd'
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'

export default class Repeater extends Component {

    constructor(props) {
        super(props)

        this.maxItems = ParseProps(props, 'max_items', 100)

        this.minItems = ParseProps(props, 'min_items', 0)

        this.button = ParseProps(props, 'button', 'Item')

        this.components = ParseProps(props, 'components', []).map(config => {
            config.key = config.name
            config.options = ParseProps(config, 'options', undefined)
            config.required = config.required || false
            config.label = config.label || config.name
            config.help = config.help || null
            config.error = config.error || null

            return config
        })

        this.state = {
            value: ParseProps(props, 'value', []),
        }
    }

    UNSAFE_componentWillMount() {
        if (this.state.value.length === 0 && this.minItems >= 1) {
            this.addItem(0)
        }
    }

    componentDidUpdate() {
        Array.from(document.querySelectorAll('.repeatable-items input')).forEach(el => {
            el.autocomplete = 'off'
        })
    }

    onChange = debounce(function (name, index, change) {

        const value = [ ...this.state.value ]

        value[index]['_order'] = index
        value[index][name] = change

        this.setState({
            value,
        })
    }, 200);

    addItem = index => {
        if (this.state.value.length === this.maxItems) {
            return message.warn('Sorry limit reached')
        }

        const items = [ ...this.state.value ]
        const row = {
            _key: Date.now().toString(),
        }

        items.splice(index + 1, 0, row)

        this.setState({
            value: items,
        }, () => {
            window.dispatchEvent(new Event('resize'))
        })
    };

    removeItem = index => {
        if (this.state.value.length === this.minItems) {
            return message.warn('Sorry minimum reached')
        }

        const items = [ ...this.state.value ]

        items.splice(index, 1)

        this.setState({
            value: items,
        }, () => {
            window.dispatchEvent(new Event('resize'))
        })
    };

    onSortEnd = ({ oldIndex, newIndex }) => {
        const items = arrayMove([ ...this.state.value ], oldIndex, newIndex).map((item, position) => {
            item._order = position

            return item
        })

        this.setState({
            value: items,
        }, () => {
            window.dispatchEvent(new Event('resize'))
        })
    }

    renderTopControls = () => {
        return (
            <div className="mb-3">
                <Button onClick={ () => {
                    const index = this.state.value.length - 1

                    this.addItem(index)
                }}>Add { this.button }</Button>
            </div>
        )
    };

    renderBottomControls = () => {
        if (this.state.value.length) {
            return this.renderTopControls()
        }
    };

    renderComponents = (value, index) => {
        return this.components.map(props => {
            props.repeater = value._key
            props.key = `${props.name}_${index}`

            props.onChange = v => {
                return this.onChange(props.name, index, v)
            }

            if (typeof value[props.name] === 'object') {
                props.value = JSON.stringify(value[props.name])
            } else {
                props.value = value[props.name] || props.default
            }

            return <div data-field={ props.name } key={ props.key }> { React.createElement(Registry.resolve(props.component || 'TextInput'), props) }</div>
        })
    };

    DragHandle = SortableHandle(() => {
        return <Icon role="button" title={ `Reorder ${ this.button }` } type="column-height" className="cursor-move" />
    })

    SortableItem = SortableElement(({ value, position }) => {
        return (
            <div data-repeater={ value._key } className="p-3 bg-gray-100 mb-4 flex rounded">
                <div className="flex-1">
                    { this.renderComponents(value, position) }
                </div>
                <div className="flex flex-col items-center pl-3 text-gray-500 hover:text-gray-500">
                    <Icon role="button" title={`Add ${this.button} below`} type="plus-circle" className="mb-2" onClick={ () => this.addItem(position) } />
                    <Icon role="button" title={`Remove ${this.button}`} type="minus-circle" className="mb-2" onClick={ () => this.removeItem(position) } />
                    <this.DragHandle />
                </div>
            </div>
        )
    })

    SortableList = SortableContainer(({ items }) => {
        return (
            <div>
                { items.map((value, index) => <this.SortableItem
                    key={ value._key }
                    index={ index }
                    value={ value }
                    position={ index }
                />)}
            </div>
        )
    })

    render() {
        return (
            <div>
                <Form.Item
                    label={ this.props.label }
                >
                    <div className="repeatable-header">
                        { this.renderTopControls() }
                    </div>

                    <div className="repeatable-items">
                        <this.SortableList
                            useDragHandle={ true }
                            items={ this.state.value }
                            onSortEnd={ this.onSortEnd }
                        />
                    </div>

                    <div className="repeatable-footer">
                        { this.renderBottomControls() }
                    </div>

                </Form.Item>

                <input type="hidden" name={ this.props.name } value={ JSON.stringify(this.state.value) } />
                <input type="hidden" name="_encoded[]" value={ this.props.name } />
            </div>
        )
    }

}
