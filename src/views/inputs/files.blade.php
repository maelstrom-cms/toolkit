@php
    $entry = $entry ?? maelstrom()->getEntry();
    $value = old(str_replace('.', '_', $name), data_get($entry, $name, ($default ?? [])));
@endphp

<div
    id="{{ $name }}_field"
    class="multi-uploader"
    data-component="FilesInput"
    data-value='@json($value)'
    data-label="{{ $label ?? $name }}"
    data-name="{{ $name }}"
    data-help="{{ $help ?? null }}"
    data-error="{{ $errors->first(str_replace('.', '_', $name)) }}"
    data-required="{{ bool_to_string($required ?? false) }}"
    data-max-items="{{ $max_items ?? 1000 }}"
    data-icon="{{ $icon ?? 'upload' }}"
    data-button="{{ $button ?? 'Select files' }}"
></div>
