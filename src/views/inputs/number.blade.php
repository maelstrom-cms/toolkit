@php $entry = $entry ?? maelstrom()->getEntry(); @endphp

<div
    id="{{ $name }}_field"
    data-component="NumberInput"
    data-value="{{ old($name, data_get($entry, $name, ($default ?? 0))) }}"
    data-label="{{ $label ?? $name }}"
    data-name="{{ $name }}"
    data-help="{{ $help ?? null }}"
    data-min="{{ $min ?? 0 }}"
    data-max="{{ $max ?? 100000 }}"
    data-precision="{{ $precision ?? 0 }}"
    data-step="{{ $step ?? 1 }}"
    data-error="{{ $errors->first(str_replace('.', '_', $name)) }}"
    data-required="{{ bool_to_string($required ?? false) }}"
></div>
