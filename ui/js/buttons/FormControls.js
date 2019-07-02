import React, { Component } from 'react'
import { Form, Button, Popconfirm } from 'antd'
import ParseProps from "../support/ParseProps";

export default class FormControls extends Component {

    constructor(props) {
        super(props)

        this.deleteButton = React.createRef()

        this.routes = ParseProps(props, 'routes', {})

        this.canDelete = ParseProps(props, 'canDelete', false)

        this.canRestore = ParseProps(props, 'canRestore', false)

        this.canSave = ParseProps(props, 'canSave', true)

        this.state = {
            loading: false
        }
    }

    get trashed() {
        return !!this.props.trashed
    }

    get deletable() {
        return this.props.entryId && !this.trashed && this.canDelete
    }

    get restorable() {
        return this.trashed && this.canRestore
    }

    delete = () => {
        const form = this.deleteButton.current.buttonNode.form

        form.querySelector('input[name="_method"]').value = 'DELETE'
        form.submit()
    };

    render() {
        return (
            <Form.Item>
                <div className="flex justify-between">

                    <div>
                        { this.canSave && <Button.Group>
                            <Button onClick={ event => {
                                if (event.target.form.reportValidity()) {
                                    this.setState({ loading: true })
                                }
                            } } loading={ this.state.loading } type="primary" htmlType="submit" icon="save">
                                Save
                            </Button>
                        </Button.Group> }

                        { !!this.routes.index && <Button.Group>
                            <Button icon="rollback" type="default" href={ this.routes.index }>
                                Back
                            </Button>
                        </Button.Group> }
                    </div>

                    { this.deletable && <div>
                        <Popconfirm
                            title="Are you sure you want to delete this?"
                            okText="Delete"
                            okType="danger"
                            cancelText="Cancel"
                            placement="left"
                            onConfirm={ this.delete }
                        >
                            <Button ref={ this.deleteButton } icon="delete" type="danger" ghost>
                                Delete
                            </Button>
                        </Popconfirm>
                    </div> }

                    { this.restorable && <Button ref={ this.deleteButton } icon="cloud-upload" type="default" onClick={ this.delete }>
                        Restore
                    </Button> }

                </div>
            </Form.Item>
        )
    }
}
