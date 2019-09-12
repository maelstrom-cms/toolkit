export default function hasParentClass(element, classname) {
    if ((element.className || '').split(' ').indexOf(classname) >= 0) {
        return element;
    }

    return element.parentNode && hasParentClass(element.parentNode, classname);
}
