@php
    $entry = $entry ?? maelstrom()->getEntry();
    $options = $options ?? [['label' => 'Yes', 'value' => '1'], ['label' => 'No', 'value' => '0']];
@endphp

<div
    id="{{ $name }}_field"
    data-component="CheckboxInput"
    data-value='{!! json_encode(old($name, data_get($entry, $name, ($default ?? [])))) !!}'
    data-label="{{ $label ?? $name }}"
    data-name="{{ $name }}"
    data-help="{{ $help ?? null }}"
    data-error="{{ $errors->first(str_replace('.', '_', $name)) }}"
    data-options='@json($options)'
    data-required="{{ bool_to_string($required ?? false) }}"
></div>
