@php $entry = $entry ?? maelstrom()->getEntry(); @endphp

<div
    id="{{ $name }}_field"
    data-component="SwitchInput"
    data-value="{{ old(str_replace('.', '_', $name), data_get($entry, $name, ($default ?? ($offValue ?? 0)))) }}"
    data-label="{{ $label ?? $name }}"
    data-name="{{ $name }}"
    data-help="{{ $help ?? null }}"
    data-error="{{ $errors->first(str_replace('.', '_', $name)) }}"
    data-required="{{ bool_to_string($required ?? false) }}"
    data-on-value="{{ $on_value ?? 1 }}"
    data-off-value="{{ $off_value ?? 0 }}"
    data-on-text="{{ $on_text ?? null }}"
    data-off-text="{{ $off_text ?? null }}"
    data-on-icon="{{ $on_icon ?? null }}"
    data-off-icon="{{ $off_icon ?? null }}"
    data-hide-on='@json($hide_on ?? [])'
    data-hide-off='@json($hide_off ?? [])'
></div>
