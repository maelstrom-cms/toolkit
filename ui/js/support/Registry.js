import React from 'react'
import { render } from 'react-dom'

class Registry {

    constructor() {
        this.items = {}
    }

    register(components) {
        Object.keys(components).forEach(name => {
            let component = components[name]

            // Only register it once.
            if (this.items[name]) {
                return
            }

            this.items[name] = component

            Array.from(document.querySelectorAll(`[data-component="${name}"]`)).forEach(async element => {
                const $el = element.cloneNode(true)

                if (component.toLocaleString().indexOf('then(__webpack_require') !== -1) {
                    const lazyLoadedComponent = await component();
                    component = lazyLoadedComponent.default;
                }

                render(
                    React.createElement(component, { ...element.dataset, $el }),
                    element
                )
            })
        })
    }

    resolve(name) {
        const component = this.items[name]

        if (!component) {
            console.error(`Component: '${name}' cannot be found.`)
        }

        return component
    }
}

const registry = new Registry()

export default registry
