@php $entry = $entry ?? maelstrom()->getEntry(); @endphp

<div
    id="{{ $name }}_field"
    data-component="ImageInput"
    data-value="{{ old(str_replace('.', '_', $name), data_get($entry, $name, ($default ?? null))) }}"
    data-thumbnail="{{ data_get($entry, ($thumbnail ?? $name), null) }}"
    data-label="{{ $label ?? $name }}"
    data-name="{{ $name }}"
    data-help="{{ $help ?? null }}"
    data-error="{{ $errors->first(str_replace('.', '_', $name)) }}"
    data-required="{{ bool_to_string($required ?? false) }}"
    data-icon="{{ $icon ?? 'file-image' }}"
    data-button="{{ $button ?? 'Select image' }}"
></div>
