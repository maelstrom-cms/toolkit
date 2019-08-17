import URI from 'urijs'
import reqwest from 'reqwest'
import uniq from 'lodash/uniq'
import React, { Component } from 'react'
import ParseProps from '../support/ParseProps'
import ComponentRegistry from '../support/Registry'
import { Table, Input, Select, Switch, Icon, Button } from 'antd'

export default class EntryTable extends Component {

    constructor(props) {
        super(props)

        this.uri = new URI

        this.routes = ParseProps(props, 'routes', {})

        this.inTrash = props.isTrashable && this.uri.hasQuery('in_trash')

        this.customBulkActions = ParseProps(props, 'bulkActions', null)

        this.mediaIds = []

        this.mediaRoute = props.mediaRoute

        this.columns = ParseProps(props, 'columns', []).map(column => {
            column.filteredValue = (this.filter[column.dataIndex] || column.filteredValue)
            column.sortOrder = (this.sort.column === column.dataIndex ? this.sort.direction : column.sortOrder)

            if (column.name && !column.dataIndex) {
                column.dataIndex = column.name
            }

            if (column.label && !column.title) {
                column.title = column.label
            }

            if (column.sortable && !column.sorter) {
                column.sorter = column.sortable
            }

            if (column.filters) {
                column.filters = column.filters.map(filter => {
                    filter.text = filter.text || filter.label

                    return filter
                })
            }

            if (column.type) {
                column.render = (text, record, index) => {
                    const component = ComponentRegistry.resolve(column.type)

                    if (component) {
                        if (column.type === 'MediaManagerColumn') {
                            if (Array.isArray(text)) {
                                this.mediaIds = this.mediaIds.concat(text)
                            } else {
                                this.mediaIds.push(text)
                            }
                        }

                        return React.createElement(
                            component,
                            { ...column, text, record, index }
                        )
                    }

                    return <span>{ text }</span>
                }
            }

            return column
        })

        this.entries = ParseProps(props, 'entries', [])

        this.searchableColumns = this.columns.filter(c => c.searchable)

        this.search = this.uri.hasQuery('search') ? JSON.parse(this.uri.query(true).search) : {
            query: null,
            column: this.searchableColumns.length ? this.searchableColumns[0].title : null,
        }

        this.state = {
            selected: [],
            selectedBulkAction: null,
        }
    }

    componentDidMount() {
        document.dispatchEvent(new Event('table-ready'))

        if (this.mediaIds.length) {
            this.fetchMedia()
        }
    }

    get filter() {
        if (this.uri.hasQuery('filters')) {
            return JSON.parse(this.uri.query(true).filters)
        }

        return []
    }

    get sort() {
        if (this.uri.hasQuery('sort')) {
            return JSON.parse(this.uri.query(true).sort)
        }

        return {
            column: null,
            direction: null,
        }
    }

    get bulkActions() {
        let config = {
            mode: 'merge',
            route: this.routes.bulk,
            actions: [],
        }

        const custom = this.customBulkActions

        if (custom === null) {
            return config
        }

        if (custom === false) {
            return {
                route: null,
                mode: 'overwrite',
                actions: [],
            }
        }

        if (typeof custom === 'string') {
            config.route = custom
        } else {
            Object.assign(config, custom)
        }

        if (typeof config.actions === 'object') {
            config.actions = Object.keys((config.actions || {})).map((key) => {
                return {
                    label: config.actions[key],
                    value: key,
                }
            })
        }

        return config
    }

    get allowRowSelection() {
        if (this.bulkActions.actions.length) {
            return true
        }

        return this.bulkActions.mode === 'merge'
    }

    async fetchMedia() {
        const queryString = reqwest.toQueryString({
            ids: uniq(this.mediaIds),
        })

        const media = await reqwest(`${this.mediaRoute}?${queryString}`)

        document.dispatchEvent(new CustomEvent('media-fetched', {
            detail: media,
        }))
    }

    updateEntries = (pagination, filters, sorter) => {
        const request = new URI()

        // Simple. Encode the sorter as JSON so can be easily used by PHP.
        if (Object.keys(sorter).length) {
            request.setQuery('sort', JSON.stringify({
                column: sorter.field,
                direction: sorter.order,
            }))
        } else {
            request.removeQuery('sort')
        }

        // Filters always returns an object of stuff, so we
        // need to delete the keys if the stuffs empty.
        Object.keys(filters).forEach((column) => {
            if (!filters[column] || !filters[column].length) {
                return delete filters[column]
            }
        })

        // Simple. Encode the filters as JSON so can be easily used by PHP.
        if (Object.keys(filters).length) {
            request.setQuery('filters', JSON.stringify(filters))
        } else {
            request.removeQuery('filters')
        }

        // If we're on page 1, then clear up the URL.
        if (pagination.current !== 1) {
            request.setQuery('page', pagination.current)
        } else {
            request.removeQuery('page')
        }

        // If we're on the default per_page then clear up the URL.
        if (pagination.pageSize !== this.entries.per_page) {
            request.setQuery('per_page', pagination.pageSize)
        }

        // If the sorting, search, per_page or filters have changes, we should reset
        // the pagination to avoid unexpected results.
        if (this.uri.hasQuery('page')) {
            if (
                this.uri.query(true).sort !== request.query(true).sort
                || this.uri.query(true).per_page !== request.query(true).per_page
                || this.uri.query(true).filters !== request.query(true).filters
            ) {
                request.removeQuery('page')
            }
        }

        // Send to request off to the backend.
        window.location = request.normalize().toString()
    };

    toggleTrashed(checked) {
        const request = new URI()

        if (checked) {
            request.setQuery('in_trash', 1)
        } else {
            request.removeQuery('in_trash')
        }

        // Send to request off to the backend.
        setTimeout(() => window.location = request.normalize().toString(), 500)
    }

    doSearch(query) {
        // No query, no search.
        if (!query) {
            return false
        }

        // A controlled search has occurred.
        if (typeof query === 'string') {
            this.search.query = query
        }

        // Check if the clear button has been clicked.
        if (typeof query === 'object' && query.constructor.name === 'Class') {
            this.search.query = null
        }

        // ignore any other events.
        if (typeof query === 'object' && query.constructor.name === 'SyntheticEvent') {
            return false
        }

        const request = new URI()

        // If a search has not yet taken place, don't bother
        // sending the form again as there's nothing to clear.
        if (!request.hasQuery('search') && !this.search.query) {
            return false
        }

        // Reset pagination to page 1
        request.removeQuery('page')

        // If we've got something to search add it in!
        if (this.search.query && this.search.column) {
            request.setQuery('search', JSON.stringify(this.search))
        } else {
            request.removeQuery('search')
        }

        // Send to request off to the backend.
        window.location = request.normalize().toString()
    }

    renderSearch = () => <Input.Search defaultValue={ this.search.query } onChange={ event => this.doSearch(event) } onSearch={ query => this.doSearch(query) } placeholder="Search for..." style={{ width: '70%' }} enterButton allowClear />;

    renderFilters = () => {
        if (!this.searchableColumns.length) {
            return null
        }

        return (
            <Input.Group compact>
                <Select onChange={ value => this.search.column = value } defaultValue={ this.search.column } style={{ width: '30%' }}>
                    { this.searchableColumns.map(column => <Select.Option key={ column.dataIndex } value={ column.searchColumn || column.dataIndex }>{ column.title }</Select.Option>)}
                </Select>
                { this.renderSearch() }
            </Input.Group>
        )
    };

    renderTrashSwitch = () => {
        if (!this.props.isTrashable) {
            return null
        }

        return (
            <Switch
                checkedChildren={ <Icon type="delete" /> }
                unCheckedChildren={ <Icon type="delete" /> }
                onChange={ this.toggleTrashed }
                defaultChecked={ this.inTrash }
            />
        )
    };

    renderTable = () => {
        const pagination = {
            showSizeChanger: true,
            pageSize: this.entries.per_page,
            current: this.entries.current_page,
            total: this.entries.total,
        }

        const entries = [ ...this.entries.data ]

        const rowSelection = {
            onChange: selected => {
                this.setState({
                    selected,
                })
            },
        }

        return (
            <Table
                rowSelection={ this.allowRowSelection ? rowSelection : undefined }
                columns={ this.columns }
                rowKey={ entry => entry.id }
                dataSource={ entries }
                pagination={ pagination }
                onChange={ this.updateEntries }
                footer={ () => this.renderBulkActions() }
                title={ () => {
                    return (
                        <div className="flex flex-wrap justify-between items-center">
                            <div>{ this.renderFilters() }</div>
                            <div>{ this.renderTrashSwitch() }</div>
                        </div>
                    )
                } }
            />
        )
    };

    renderBulkActions = () => {

        const { actions, mode, route } = this.bulkActions

        if (!this.state.selected.length || (mode === 'overwrite' && !actions.length)) {
            return null
        }

        return (
            <form className="m-0" action={ route || undefined } method="post">

                <input type="hidden" name="_token" value={ this.props.csrf } readOnly />
                <input type="hidden" name="action" value={ this.state.selectedBulkAction || '' } readOnly />

                { this.state.selected.map(id => <input key={ id } type="hidden" name="selected[]" value={ id } readOnly />)}

                <Input.Group compact>
                    <Select onChange={ selectedBulkAction => this.setState({ selectedBulkAction })} style={{ minWidth: 200 }} placeholder="Bulk actions">
                        { actions.map(action => <Select.Option key={ action.value }>{ action.label }</Select.Option>)}
                        { mode !== 'overwrite' && !this.inTrash && <Select.Option key="delete">Delete selected</Select.Option> }
                        { mode !== 'overwrite' && this.inTrash && <Select.Option key="perm_delete">Permanently delete selected</Select.Option> }
                        { mode !== 'overwrite' && this.inTrash && <Select.Option key="restore">Restore selected</Select.Option> }
                    </Select>
                    <Button type="primary" htmlType="submit" disabled={ !this.state.selectedBulkAction }>
                        <Icon type="like" />
                    </Button>
                </Input.Group>

            </form>
        )
    };

    render() {
        return (
            <div>
                <div className="table-container">
                    { this.renderTable() }
                </div>
            </div>
        )
    }
}
