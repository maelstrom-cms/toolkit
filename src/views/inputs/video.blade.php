@php
    $entry = $entry ?? maelstrom()->getEntry();
    $value = old(str_replace('.', '_', $name), data_get($entry, $name, ($default ?? null)));

    if (is_object($value) && !count(get_object_vars($value))) {
        $value = null;
    }

    if (is_json_string($value)) {
        $value = json_decode($value);
    }
@endphp

<div
    id="{{ $name }}_field"
    data-component="VideoInput"
    data-value='{{ $value ? json_encode($value) : null }}'
    data-label="{{ $label ?? $name }}"
    data-name="{{ $name }}"
    data-help="{{ $help ?? null }}"
    data-error="{{ $errors->first(str_replace('.', '_', $name)) }}"
    data-required="{{ bool_to_string($required ?? false) }}"
    data-html-type="{{ $type ?? 'url' }}"
    data-allow-clear="{{ bool_to_string($allow_clear ?? true) }}"

    data-prefix='{{ $prefix ?? null }}'
    data-prefix-icon="{{ $prefix_icon ?? null }}"
    data-suffix='{{ $suffix ?? null }}'
    data-suffix-icon="{{ $suffix_icon ?? 'video-camera' }}"

    data-addon-before='{{ $addon_before ?? null }}'
    data-addon-before-icon="{{ $addon_before_icon ?? null }}"
    data-addon-after='{{ $addon_after ?? null }}'
    data-addon-after-icon="{{ $addon_after_icon ?? null }}"
></div>
