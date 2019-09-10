@php $entry = $entry ?? maelstrom()->getEntry(); @endphp

<div
    id="{{ $name }}_field"
    data-component="IconInput"
    data-value="{{ old(str_replace('.', '_', $name), data_get($entry, $name, ($default ?? null))) }}"
    data-label="{{ $label ?? $name }}"
    data-name="{{ $name }}"
    data-help="{{ $help ?? null }}"
    data-error="{{ $errors->first(str_replace('.', '_', $name)) }}"
    data-required="{{ bool_to_string($required ?? false) }}"
    data-icons='@json($icons ?? [])'
></div>
