@php
    $entry = $entry ?? maelstrom()->getEntry();
    $options = $options ?? [['label' => 'On', 'value' => '1'], ['label' => 'Off', 'value' => '0']];
@endphp

<div
    id="{{ $name }}_field"
    data-component="RadioInput"
    data-value="{{ old(str_replace('.', '_', $name), data_get($entry, $name, ($default ?? '0'))) }}"
    data-label="{{ $label ?? $name }}"
    data-name="{{ $name }}"
    data-help="{{ $help ?? null }}"
    data-error="{{ $errors->first(str_replace('.', '_', $name)) }}"
    data-required="{{ bool_to_string($required ?? false) }}"
    data-options='@json($options)'
></div>
