import React from 'react'
import reqwest from 'reqwest'
import uniq from 'lodash/uniq'
import SplitView from './SplitView'
import arrayMove from 'array-move'
import ParseProps from '../support/ParseProps'
import { Drawer, Button, Form, message, List, Avatar, Icon } from 'antd'
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'

export default class MediaManager extends React.Component {

    constructor(props) {
        super(props)

        this.required = ParseProps(props, 'required', false)

        this.maxItems = ParseProps(props, 'max_items', 1)

        this.route = props.route

        let value = ParseProps(props, 'value', [])

        if (Array.isArray(value)) {
            value = value.map(v => `${v}`)
        } else {
            value = `${value}`
        }

        this.state = {
            drawerOpen: false,
            drawerActuallyOpen: false,
            items: [],
            active: null,
            value,
            attached: [],
        }
    }

    componentDidMount() {
        this.mounted = true

        this.getItems()
    }

    componentWillUnmount() {
        this.mounted = false
    }

    refreshPreviewList = () => {
        if (this.state.value) {
            if (Array.isArray(this.state.value)) {
                this.setState({
                    attached: [...this.state.value ].map(id => {
                        return this.state.items.find(item => `${item.id}` === `${id}`)
                    }),
                })
            } else {
                this.setState({
                    attached: [this.state.items.find(i => `${i.id}` === `${this.state.value}`)],
                })
            }

            setTimeout(() => window.dispatchEvent(new Event('resize')), 500)
        }
    }

    getItems = async activeId => {
        const items = await reqwest(this.route)

        if (!this.mounted) {
            return
        }

        this.setState({
            items,
            active: activeId ? items.find(i => i.id === activeId) : null,
        }, () => {
            this.refreshPreviewList()
        })
    }

    setActive = active => {
        this.setState({
            active,
        })
    }

    attachMedia = item => {
        if (this.state.attached.length < this.maxItems) {
            if (this.maxItems > 1) {
                let attached = [ ...this.state.attached ]

                attached.push(item)
                attached = uniq(attached)

                this.setState({
                    attached,
                    drawerOpen: false,
                    drawerActuallyOpen: false,
                })

                this.props.onChange && this.props.onChange(attached.map(i => i.id))
            } else {
                this.setState({
                    attached: [item],
                    drawerOpen: false,
                    drawerActuallyOpen: false,
                })

                this.props.onChange && this.props.onChange(item.id)
            }

            message.success(`${item.name} added.`)
        } else {
            message.error(`You can only attach ${this.maxItems} files.`)
        }

        setTimeout(() => {
            window.dispatchEvent(new Event('resize'))
        }, 500)
    }

    openItem = item => {
        this.setState({
            active: item,
            drawerOpen: true,
        })
    }

    removeMedia = item => {
        const attached = this.state.attached.filter(i => i.id !== item.id)

        this.setState({
            attached,
            value: attached.map(i => i.id),
        })

        this.props.onChange && this.props.onChange(attached.map(i => i.id))

        message.success(`${item.name} removed.`)

        setTimeout(() => {
            window.dispatchEvent(new Event('resize'))
        }, 1000)
    }

    onSortEnd = ({ oldIndex, newIndex }) => {
        const attached = arrayMove([ ...this.state.attached ], oldIndex, newIndex)
        const value = arrayMove([ ...this.state.value ], oldIndex, newIndex)

        this.setState({
            attached,
            value,
        }, () => {
            window.dispatchEvent(new Event('resize'))
        })
    }

    renderInput = () => <Button icon="paper-clip" onClick={ () => this.setState({ drawerOpen: true }) } type="primary">Attach Media</Button>

    renderActions = item => {
        return (
            <>
                <this.DragHandle />
                <Button type="danger" onClick={ () => this.removeMedia(item) }>Remove</Button>
            </>
        )
    }

    DragHandle = SortableHandle(() => {
        return <Icon type="colum-height" className="cursor-move mr-3" />
    })

    SortableItem = SortableElement(({ item }) => {
        return (
            <List.Item actions={ [ this.renderActions(item) ] }>
                <List.Item.Meta
                    avatar={
                        <Avatar className="cursor-pointer" src={ item.cached_thumbnail_url } onClick={ () => this.openItem(item) } />
                    }
                    title={ item.name }
                    description={ item.cached_url }
                />
            </List.Item>
        )
    })

    SortableList = SortableContainer(({ items }) => {
        return (
            <List
                className="mt-4"
                dataSource={ items }
                renderItem={ (item, index) => <this.SortableItem index={ index } item={ item } /> }
            />
        )
    })

    renderFileList = () => {
        if (!this.state.attached.length) {
            return null
        }

        return <this.SortableList
            useDragHandle={ true }
            items={ this.state.attached }
            onSortEnd={ this.onSortEnd }
        />
    }

    renderHidden = () => {
        if (this.maxItems === 1) {
            return <input value={ this.state.attached.length ? this.state.attached[0].id : '' } type="hidden" name={ this.props.name } />
        }

        if (!this.state.attached.length) {
            return (
                <>
                    <input value="[]" type="hidden" name={ this.props.name } />
                    <input type="hidden" name="_encoded[]" value={ this.props.name } />
                </>
            )
        }

        return this.state.attached.map(attachment => <input key={ attachment.id } value={ attachment.id } type="hidden" name={ `${this.props.name}[]` } />)
    }

    render() {
        return (
            <>

                <Form.Item
                    label={ this.props.label }
                    validateStatus={ this.props.error ? 'error' : null }
                    help={ this.props.error || this.props.help }
                    required={ this.required }
                >
                    { !this.props.onChange && this.renderHidden() }
                    { this.renderInput() }
                    { this.renderFileList() }
                </Form.Item>
                <Drawer
                    width={ '80vw' }
                    title="Media Manager"
                    visible={ this.state.drawerOpen }
                    onClose={ () => this.setState({ drawerOpen: false }) }
                    destroyOnClose={ true }
                    afterVisibleChange={ drawerActuallyOpen => this.setState({ drawerActuallyOpen }) }
                >
                    { this.state.drawerActuallyOpen && <SplitView { ...this.props } { ...this.state } getItems={ this.getItems } setActive={ this.setActive } attachMedia={ this.attachMedia } /> }
                </Drawer>
            </>
        )
    }

}
