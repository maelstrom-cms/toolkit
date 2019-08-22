@php $entry = $entry ?? maelstrom()->getEntry(); @endphp

<div
    id="{{ $name }}_field"
    data-component="ColourInput"
    data-value="{{ old($name, data_get($entry, $name, ($default ?? '#fff'))) }}"
    data-label="{{ $label ?? $name }}"
    data-name="{{ $name }}"
    data-help="{{ $help ?? null }}"
    data-error="{{ $errors->first(str_replace('.', '_', $name)) }}"
    data-required="{{ bool_to_string($required ?? false) }}"
    data-type="{{ $type ?? 'Circle' }}"
    data-colours='@if($colours ?? false) @json($colours) @endif'
></div>
