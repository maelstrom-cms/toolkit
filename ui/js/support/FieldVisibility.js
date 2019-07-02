const findElement = (field, config) => {
    if (!config.repeater) {
        return document.getElementById(`${field}_field`)
    }

    const parent = document
        .querySelector(`[data-repeater="${ config.repeater }"]`)

    if (parent) {
        return parent.querySelector(`[data-field="${ field }"]`)
    }
}

const hide = element => {
    element && element.classList.add('hidden')
}

const show = element => {
    element && element.classList.remove('hidden')
}

const off = config => {
    config.off.forEach(name => {
        hide(findElement(name, config))
    })

    config.on.map(name => {
        show(findElement(name, config))
    })
}

const on = config => {
    config.on.forEach(name => {
        hide(findElement(name, config))
    })

    config.off.map(name => {
        show(findElement(name, config))
    })
}

export default (checked, config) => {
    if (checked) {
        on(config)
    } else {
        off(config)
    }

    window.dispatchEvent(new Event('resize'))
}
