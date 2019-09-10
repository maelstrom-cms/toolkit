@php $entry = $entry ?? maelstrom()->getEntry(); @endphp

<div
    id="{{ $name }}_field"
    data-component="TextInput"
    data-value="{{ old(str_replace('.', '_', $name), data_get($entry, $name, ($default ?? null))) }}"
    data-label="{{ $label ?? $name }}"
    data-name="{{ $name }}"
    data-disabled="{{ bool_to_string($disabled ?? false) }}"
    data-readonly="{{ bool_to_string($readonly ?? false) }}"

    data-help="{{ $help ?? null }}"
    data-error="{{ $errors->first(str_replace('.', '_', $name)) }}"
    data-required="{{ bool_to_string($required ?? false) }}"
    data-html-type="{{ $html_type ?? 'text' }}"
    data-autocomplete="{{ $autocomplete ?? null }}"
    data-auto-size='@json($auto_size ?? ['minRows' => 3, 'maxRows' => 10])'
    data-allow-clear="{{ bool_to_string($allow_clear ?? true) }}"

    data-prefix='{{ $prefix ?? null }}'
    data-prefix-icon="{{ $prefix_icon ?? null }}"
    data-suffix='{{ $suffix ?? null }}'
    data-suffix-icon="{{ $suffix_icon ?? null }}"

    data-addon-before='{{ $addon_before ?? null }}'
    data-addon-before-icon="{{ $addon_before_icon ?? null }}"
    data-addon-after='{{ $addon_after ?? null }}'
    data-addon-after-icon="{{ $addon_after_icon ?? null }}"
></div>
