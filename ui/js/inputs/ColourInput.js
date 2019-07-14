import React, { Component } from 'react'
import { Form } from 'antd'
import { BlockPicker, ChromePicker, CirclePicker, CompactPicker, GithubPicker, MaterialPicker, PhotoshopPicker, SketchPicker, SliderPicker, SwatchesPicker, TwitterPicker } from 'react-color'
import ParseProps from '../support/ParseProps'
import Capitalise from '../support/Capitalise'

export default class ColourInput extends Component {

    constructor(props) {
        super(props)

        this.required = ParseProps(props, 'required', false)

        this.type = Capitalise(ParseProps(props, 'type', 'Circle'))

        this.colours = ParseProps(props, 'colours', undefined)

        this.alwaysOpen = ['Github', 'Twitter'].indexOf(this.type) !== -1

        this.inline = ['Circle', 'Slider', 'Compact', 'Material'].indexOf(this.type) !== -1

        this.state = {
            show: false,
            value: props.value,
            preview: props.value,
        }
    }

    handleKeyDown = event => {
        if (event.code === 'Escape') {
            return this.closePicker()
        }
    };

    openPicker = () => {
        this.setState({
            show: true,
        }, () => {
            window.dispatchEvent(new Event('resize'))
        })

        window.dispatchEvent(new Event('resize'))
        document.addEventListener('keydown', this.handleKeyDown)
    };

    closePicker = () => {
        this.setState({
            show: false,
        }, () => {
            window.dispatchEvent(new Event('resize'))
        })

        window.dispatchEvent(new Event('resize'))
        document.removeEventListener('keydown', this.handleKeyDown)
    };

    onChange = colour => {
        this.props.onChange && this.props.onChange(colour.hex)

        this.setState({
            value: colour.hex,
            preview: colour,
        })
    };

    renderPicker = () => {
        switch (this.type) {
        // Always Open
        case 'Github':
            if (this.colours) {
                return <GithubPicker colors={ this.colours } color={ this.state.preview } className="mt-3" onChange={ this.onChange } width={ 212 } />
            } else {
                return <GithubPicker color={ this.state.preview } className="mt-3" onChange={ this.onChange } width={ 212 } />
            }
        case 'Twitter':
            if (this.colours) {
                return <TwitterPicker colors={ this.colours } color={ this.state.preview } className="mt-4" onChange={ this.onChange } />
            } else {
                return <TwitterPicker color={ this.state.preview } className="mt-4" onChange={ this.onChange } />
            }
            // Inline
        case 'Circle':
            if (this.colours) {
                return <CirclePicker colors={ this.colours } color={ this.state.preview } onChange={ this.onChange } />
            } else {
                return <CirclePicker color={ this.state.preview } onChange={ this.onChange } />
            }
        case 'Compact':
            if (this.colours) {
                return <CompactPicker colors={ this.colours } color={this.state.preview} onChange={this.onChange} width={ 240 } />
            } else {
                return <CompactPicker color={ this.state.preview } onChange={ this.onChange } width={ 240 } />
            }
        case 'Material':
            return <MaterialPicker color={ this.state.preview } onChange={ this.onChange } />
        case 'Slider':
            return <div style={{ maxWidth: 280 }}><SliderPicker color={ this.state.preview } onChange={ this.onChange } /></div>
            // Popup Pickers
        case 'Sketch':
            if (this.colours) {
                return <SketchPicker presetColors={ this.colours } disableAlpha={ true } color={ this.state.preview } onChange={ this.onChange } />
            } else {
                return <SketchPicker disableAlpha={ true } color={ this.state.preview } onChange={ this.onChange } />
            }
        case 'Photoshop':
            return <PhotoshopPicker disableAlpha={ true } colors={ this.colours } color={ this.state.preview } onChange={ this.onChange } onAccept={ this.closePicker } onCancel={ this.closePicker } />
        case 'Chrome':
            return <ChromePicker color={ this.state.preview } disableAlpha={ true } onChange={ this.onChange } />
        case 'Swatches':
            if (this.colours) {
                return <SwatchesPicker color={ this.state.preview } onChange={ this.onChange } />
            } else {
                return <SwatchesPicker color={ this.state.preview } onChange={ this.onChange } />
            }
        case 'Block':
            if (this.colours) {
                return <BlockPicker colors={ this.colours } triangle="hide" color={ this.state.preview } onChange={ this.onChange } />
            } else {
                return <BlockPicker triangle="hide" color={ this.state.preview } onChange={ this.onChange } />
            }
        default:
            return <div>Cannot find picker.</div>
        }
    };

    renderInput = () => {
        if (this.alwaysOpen) {
            return this.renderPicker()
        }

        if (!this.state.show) {
            return null
        }

        return (
            <>
                <div onClick={() => this.closePicker()} className="fixed top-0 right-0 left-0 bottom-0 w-full h-full z-30"/>
                <div className="inline-block absolute z-40 left-0">
                    { this.renderPicker() }
                </div>
            </>
        )
    };

    renderThumb = () => {
        if (this.inline) {
            return this.renderPicker()
        }

        return (
            <>
                <div onClick={ () => this.openPicker() } className="ant-input cursor-pointer" style={{ padding: 5, maxWidth: 80 }}>
                    <div className="h-full w-full" style={{ borderRadius: 2, background: this.state.value }} />
                </div>
                { this.renderInput() }
            </>
        )
    };

    render() {
        return (
            <Form.Item
                className="colour-picker"
                label={ this.props.label }
                validateStatus={ this.props.error ? 'error' : null }
                help={ this.props.error || this.props.help }
                required={ this.required }
            >
                { !this.props.onChange && <input value={ this.state.value } type="hidden" name={ this.props.name } /> }
                { this.renderThumb() }
            </Form.Item>
        )
    }
}
