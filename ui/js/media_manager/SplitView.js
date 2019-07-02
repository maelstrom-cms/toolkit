import React from 'react'
import MediaBrowser from './MediaBrowser'
import EditPane from './EditPane'

export default class SplitView extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <>
                <div className="flex">
                    <div className="flex-1 pr-6">
                        <div className="w-full">
                            <MediaBrowser { ...this.props } />
                        </div>
                    </div>
                    <div style={{ width: 300 }}>
                        { this.props.active && <EditPane { ...this.props } /> }
                    </div>
                </div>
            </>
        )
    }

}
