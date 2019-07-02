import React from 'react'
import { Input, Form, Spin } from 'antd'
import ReactList from 'react-list'
import Fuse from 'fuse.js'
import Img from 'react-image'
import Uploader from './Uploader'

export default class MediaBrowser extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            keyword: null,
        }
    }

    doSearch = keyword => {
        this.setState({
            keyword,
        })
    }

    render() {

        let results = this.props.items

        if (this.state.keyword) {
            results = new Fuse(this.props.items, {
                keys: ['name', 'alt', 'description', 'path', 'type'],
            }).search(this.state.keyword)
        }

        return (
            <>
                <div className="mb-5 w-full sm:flex">
                    <div className="sm:w-2/6 bg-gray-100 px-4 rounded">
                        <Form.Item label="Search media" help={`Showing ${ results.length } of ${ this.props.items.length }`}>
                            <Input.Search enterButton onSearch={ this.doSearch } onChange={ event => this.doSearch(event.target.value) } />
                        </Form.Item>
                    </div>
                    <div className="sm:w-4/6 pl-4">
                        <Uploader { ...this.props } />
                    </div>
                </div>
                <div style={{ height: 'calc(100vh - 250px)' }} className="overflow-y-scroll">
                    <ReactList
                        length={ results.length }
                        type="uniform"
                        itemRenderer={ key => {
                            const image = results[key]

                            return (
                                <button
                                    data-id={ image.id }
                                    key={ image.id }
                                    onDoubleClick={ () => this.props.attachMedia(image) }
                                    onClick={ () => this.props.setActive(image) }
                                    style={{ minHeight: 100 }}
                                    className={ `w-1/6 p-2 text-center appearance-none border-0 cursor-pointer focus:outline-none rounded overflow-hidden ${this.props.active && this.props.active.id === image.id ? 'bg-gray-200' : 'bg-transparent'}` }
                                >
                                    <Img
                                        alt={ image.name || image.alt }
                                        style={{ maxWidth: '100%', height: 'auto', width: 100 }}
                                        className="rounded"
                                        src={ image.cached_thumbnail_url }
                                        loader={ <Spin /> }
                                        decode={ true }
                                    />
                                </button>
                            )
                        }}
                    />
                </div>
            </>
        )
    }
}

