@php $entry = $entry ?? maelstrom()->getEntry(); @endphp

<div
    id="{{ $name }}_field"
    data-component="ImageInput"
    data-value="{{ old($name, data_get($entry, $name, ($default ?? null))) }}"
    data-label="{{ $label ?? $name }}"
    data-name="{{ $name }}"
    data-help="{{ $help ?? null }}"
    data-error="{{ $errors->first($name) }}"
    data-required="{{ bool_to_string($required ?? false) }}"
    data-icon="{{ $icon ?? 'file-image' }}"
    data-button="{{ $button ?? 'Select image' }}"
></div>
