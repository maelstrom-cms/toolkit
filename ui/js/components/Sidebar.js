import URI from 'urijs'
import React, { Component } from 'react'
import { Menu, Icon } from 'antd'
import debounce from 'lodash/debounce'
import ComponentRegistry from '../support/Registry'
import ParseProps from '../support/ParseProps'

export default class Sidebar extends Component {

    constructor(props) {
        super(props)

        this.root = ParseProps(props, 'root', '/admin')

        this.items = ParseProps(props, 'items', [])

        this.width = ParseProps(props, 'width', 210)

        this.height = ParseProps(props, 'height', 'calc(100vh - 56px)')

        this.guessSelected = ParseProps(props, 'guessSelected', true)

        this.canCollapse = ParseProps(props, 'canCollapse', true)

        this.defaultSelectedKeys = []

        this.defaultOpenKeys = []

        this.menuRef = React.createRef()

        this.state = {
            collapsed: (localStorage.getItem('maelstrom::menu_collapsed') || 'n') === 'y',
        }
    }

    handleResize = () => {
        const offset = this.menuRef.current.offsetTop

        this.setState({
            height: `calc(100vh - ${offset}px)`,
        }, () => {
            const bodyHeight = document.querySelector('.maelstrom-wrapper').clientHeight
            const height = bodyHeight - offset

            this.setState({
                height,
            })
        })
    };

    UNSAFE_componentWillMount() {
        this.handleResize = debounce(this.handleResize, 200)

        window.addEventListener('resize', this.handleResize)

        this.items.forEach(item => {
            this.markSelectedItems(item)
        })
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
    }

    componentDidMount() {
        this.handleResize()
    }

    renderSubMenu(item) {
        return (
            <Menu.SubMenu key={ item.id } title={
                <span>
                    { item.icon && <Icon type={ item.icon } /> }
                    <span>{ item.label }</span>
                </span>
            }>
                { item.children.map((item, key) => this.renderSomething(item, key)) }
            </Menu.SubMenu>
        )
    }

    renderMenuGroup(item) {
        return (
            <Menu.ItemGroup key={ item.id } title={ item.label }>
                { item.children.map((item, key) => this.renderSomething(item, key)) }
            </Menu.ItemGroup>
        )
    }

    renderMenuDivider(item) {
        return <Menu.Divider key={ item.id }/>
    }

    renderMenuItem(item) {
        return (
            <Menu.Item key={ item.id } title={ item.label }>
                <a href={ item.url }>
                    { item.icon && <Icon type={ item.icon } /> }
                    <span>{ item.label }</span>
                </a>
            </Menu.Item>
        )
    }

    renderHTML(item) {
        return (
            <Menu.Item key={ item.id }>
                <div dangerouslySetInnerHTML={{ __html: item.html }} />
            </Menu.Item>
        )
    }

    renderCustomComponent(item, key) {
        const component = ComponentRegistry.resolve(item.component)

        if (component) {
            return React.createElement(
                component,
                { ...item, key, collapsed: this.state.collapsed }
            )
        }

        return (
            <Menu.Item key={ key } title="Error">
                { 'Custom component not found in registry as: ' + item.component }
            </Menu.Item>
        )
    }

    renderCollapseButton() {
        if (!this.canCollapse) {
            return null
        }

        return (
            <li key="collapse" className="ant-menu-item" role="menuitem" style={{ paddingLeft: 24 }}>
                <div role="button" onClick={ () => this.toggleMenuSize() }>
                    <Icon type={ this.state.collapsed ? 'menu-unfold' : 'menu-fold' } />
                    <span>{ this.state.collapsed ? 'Open' : 'Collapse' }</span>
                </div>
            </li>
        )
    }

    renderSomething(item, key) {
        item.id = item.id || item.label

        switch ((item.type || 'link').toLowerCase()) {
            case 'link':
                return this.renderMenuItem(item)
            case 'group':
                return this.renderMenuGroup(item)
            case 'submenu':
            case 'collapsible':
                return this.renderSubMenu(item)
            case 'html':
                return this.renderHTML(item)
            case 'divider':
                return this.renderMenuDivider(item)
            case 'custom':
                return this.renderCustomComponent(item, key)
            default:
                return (
                    <Menu.Item key={ key } title="Error">
                        { 'Sidebar item type not recognised: ' + item.type }
                    </Menu.Item>
                )
        }
    }

    markSelectedItems(item, parent = null) {
        const itemUrl = item.url ? new URI(item.url).path() : undefined;

        // If the item has been forcefully selected, e.g. PHP has defined it as selected
        if (item.selected) {
            this.defaultSelectedKeys.push(item.id)

            // If it can be collapsed, we can expand he collapser.
            const itemType = item.type.toLowerCase()

            if (itemType === 'collapsible' || itemType === 'submenu') {
                this.defaultOpenKeys.push(item.id)
            }

            if (parent && !this.state.collapsed) {
                this.defaultSelectedKeys.push(parent.id)

                const parentType = parent.type.toLowerCase()

                if (parentType === 'collapsible' || parentType === 'submenu') {
                    this.defaultOpenKeys.push(parent.id)
                }
            }
        }

        // If we're on a dashboard-like page e.g. the admin root.
        if (itemUrl === this.root && (new URI).path() !== item.url) {
            return
        }

        // If active state guessing is enabled.
        // We basically check if the URL provided for the menu item e.g. /admin/users
        // is within the current URL e.g. /admin/users/edit/1
        // If it is, we just assume its nested so it's marked as active.
        if (
            this.guessSelected &&
            itemUrl &&
            item.selected !== false &&
            window.location.toString().indexOf(itemUrl) !== -1
        ) {
            if (this.defaultSelectedKeys.indexOf(item.id) === -1) {
                this.defaultSelectedKeys.push(item.id)
            }

            if (parent && this.defaultOpenKeys.indexOf(parent.id) === -1 && !this.state.collapsed) {
                this.defaultOpenKeys.push(parent.id)
            }
        }

        // If the item has children, we loop around everything until the nesting is complete.
        if (item.children && Array.isArray(item.children)) {
            item.children.forEach(child => this.markSelectedItems(child, item))
        }
    }

    toggleMenuSize() {
        const collapsed = !this.state.collapsed

        localStorage.setItem('maelstrom::menu_collapsed', collapsed ? 'y' : 'n')

        this.setState({
            collapsed,
        })
    }

    render() {
        return (
            <div ref={ this.menuRef } style={ this.state.collapsed ? undefined : { width: this.width }}>
                <Menu
                    defaultOpenKeys={ this.defaultOpenKeys }
                    defaultSelectedKeys={ this.defaultSelectedKeys }
                    style={{ minHeight: this.state.height }}
                    mode="inline"
                    theme={ this.props.theme }
                    inlineCollapsed={ this.state.collapsed }
                >
                    { this.items.map((item, key) => this.renderSomething(item, key))}

                    { this.renderCollapseButton() }
                </Menu>
            </div>
        )
    }
}
