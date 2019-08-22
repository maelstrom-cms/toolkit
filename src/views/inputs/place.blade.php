@php
    $entry = $entry ?? maelstrom()->getEntry();
    $value = old($name, data_get($entry, $name, ($default ?? null)));

    if (is_object($value) && !count(get_object_vars($value))) {
        $value = null;
    }
@endphp

<div
    id="{{ $name }}_field"
    data-component="PlaceInput"
    data-value='{{ $value ? json_encode($value) : null }}'
    data-label="{{ $label ?? $name }}"
    data-name="{{ $name }}"
    data-help="{{ $help ?? null }}"
    data-error="{{ $errors->first(str_replace('.', '_', $name)) }}"
    data-required="{{ bool_to_string($required ?? false) }}"
    data-options='@json($options ?? [])'
    data-placeholder="{{ $placeholder ?? 'Search for a location' }}"
></div>
