@php
    $entry = $entry ?? maelstrom()->getEntry();
    $value = old($name, data_get($entry, $name, ($default ?? [])));
@endphp

<div
    id="{{ $name }}_field"
    class="multi-uploader"
    data-component="ImagesInput"
    data-value='@json($value)'
    data-label="{{ $label ?? $name }}"
    data-name="{{ $name }}"
    data-help="{{ $help ?? null }}"
    data-error="{{ $errors->first($name) }}"
    data-required="{{ bool_to_string($required ?? false) }}"
    data-max-items="{{ $max_items ?? 1000 }}"
    data-icon="{{ $icon ?? 'file-image' }}"
    data-button="{{ $button ?? 'Select images' }}"
></div>
