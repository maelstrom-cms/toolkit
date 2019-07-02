@php $entry = $entry ?? maelstrom()->getEntry(); @endphp

<div
    id="{{ $name }}_field"
    data-component="SecretInput"
    data-value="{{ old($name, data_get($entry, $name, ($default ?? null))) }}"
    data-label="{{ $label ?? $name }}"
    data-name="{{ $name }}"
    data-help="{{ $help ?? null }}"
    data-autocomplete="{{ $autocomplete ?? null }}"
    data-error="{{ $errors->first($name) }}"
    data-required="{{ bool_to_string($required ?? false) }}"
    data-allow-clear="{{ bool_to_string($allow_clear ?? false) }}"

    data-prefix='{{ $prefix ?? null }}'
    data-prefix-icon="{{ $prefix_icon ?? null }}"

    data-addon-before='{{ $addon_before ?? null }}'
    data-addon-before-icon="{{ $addon_before_icon ?? null }}"
    data-addon-after='{{ $addon_after ?? null }}'
    data-addon-after-icon="{{ $addon_after_icon ?? null }}"
></div>
