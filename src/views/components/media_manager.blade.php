@php
    $entry = $entry ?? maelstrom()->getEntry();
    $value = old(str_replace('.', '_', $name), data_get($entry, $name, ($default ?? null)));

    if (is_iterable($value)) {
        $value = json_encode($value);
    }
@endphp

<div
    id="{{ $name }}_field"
    data-component="MediaManager"
    data-route="{{ route('maelstrom.media.index') }}"
    data-value='{{ $value }}'
    data-label="{{ $label ?? $name }}"
    data-name="{{ $name }}"
    data-help="{{ $help ?? null }}"
    data-error="{{ $errors->first($name) }}"
    data-required="{{ bool_to_string($required ?? false) }}"
    data-max-items="{{ $max_items ?? 1 }}"
    data-csrf="{{ csrf_token() }}"
></div>
