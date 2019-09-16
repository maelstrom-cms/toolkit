import React, { Component, createRef } from 'react'
import { Tabs as TabSet, Icon } from 'antd'
import debounce from 'lodash/debounce'
import URI from 'urijs'
import hasParentClass from '../support/HasParentClass';

window.URI = URI

export default class Tabs extends Component {

    state = {
        width: 768,
    };

    tabBar = createRef();

    tabs = Array.from(document.querySelectorAll('.js-tab-single')).map(element => {
        return {
            element: element,
            title: element.getAttribute('title'),
            id: element.dataset.tab,
            icon: element.dataset.icon,
            active: JSON.parse(element.dataset.active),
            hasError: (element.querySelector('.has-error') || Array.from(element.querySelectorAll('[data-error]')).find(element => element.dataset.error)),
        }
    });

    direction = this.props.direction === 'horizontal' ? 'top' : 'left';

    UNSAFE_componentWillMount() {
        // If a field has errors, make one of these the active tabs.
        this.activeTabFromErrors()

        // If we've defined a tab in the URL we set this to the active tab.
        this.activateTabFromHash()

        // If no active tab has been found, set it to the first.
        if (!this.activeTab) {
            this.activeTab = this.tabs[0]
        }

        // Allows the tab bar to scroll for extra items.
        this.handleResizing()
    }

    activeTabFromErrors() {
        const errorTab = this.tabs.find(t => t.hasError)

        if (errorTab) {
            this.activeTab = errorTab
        }
    }

    activateTabFromHash() {
        const uri = new URI()

        if (uri.fragment() && uri.fragment().indexOf('tab-') !== -1) {
            const tabIndex = uri.fragment().replace(/^\D+/g, '')

            this.activeTab = this.tabs[parseInt(tabIndex) - 1]
        }
    }

    handleResizing() {
        if (this.direction === 'top') {
            this.calculateSize()

            const listener = debounce(() => this.calculateSize(), 300)

            window.addEventListener('resize', listener)
        }
    }

    get activeTab() {
        return this.tabs.find(tab => tab.active)
    }

    set activeTab(tab) {
        this.tabs.forEach(t => {
            t.element.classList.add('hidden')
            t.active = false
        })

        tab.active = true

        const formControls = document.querySelector('[data-component="FormControls"]');

        if (formControls) {
            if (hasParentClass(tab.element, 'maelstrom-form')) {
                formControls.classList.remove('hidden')
            } else {
                formControls.classList.add('hidden')
            }
        }

        window.requestAnimationFrame(() => {
            tab.element.classList.remove('hidden')
            window.dispatchEvent(new Event('resize'))
        })
    }

    calculateSize() {
        const container = document.querySelector('.js-tabs-container')

        this.setState({
            width: 758,
        }, () => {
            this.setState({
                width: container.clientWidth,
            })
        })
    }

    onChange(active) {
        this.activeTab = this.tabs.find(t => {
            return t.id === active
        })
    }

    renderTabTitle(tab) {
        if (tab.icon) {
            return (
                <span>
                    <Icon type={ tab.icon } />
                    { tab.title }
                </span>
            )
        }

        return tab.title
    }

    renderTab(tab) {
        return <TabSet.TabPane tab={ this.renderTabTitle(tab) } key={ tab.id } />
    }

    render() {
        return (
            <TabSet
                ref={ this.tabBar }
                onChange={ active => this.onChange(active) }
                defaultActiveKey={ this.activeTab.id }
                tabPosition={ this.direction }
                hideAdd={ true }
                style={ this.direction === 'top' ? { width: this.state.width } : undefined }
            >
                { this.tabs.map(tab => this.renderTab(tab)) }
            </TabSet>
        )
    }
}
