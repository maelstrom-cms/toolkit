@php $entry = $entry ?? maelstrom()->getEntry(); @endphp

<div
    id="{{ $name }}_field"
    data-component="DateTimeInput"
    data-value="{{ old(str_replace('.', '_', $name), data_get($entry, $name, ($default ?? null))) }}"
    data-label="{{ $label ?? $name }}"
    data-name="{{ $name }}"
    data-help="{{ $help ?? null }}"
    data-error="{{ $errors->first(str_replace('.', '_', $name)) }}"
    data-required="{{ bool_to_string($required ?? false) }}"
    data-allow-clear="{{ bool_to_string($allow_clear ?? false) }}"
    data-placeholer="{{ $placeholder ?? null }}"
    data-display-format="{{ $display_format ?? 'DD/MM/YYYY HH:mm A' }}"
    data-save-format="{{ $save_format ?? 'YYYY-MM-DD HH:mm:ss' }}"
    data-show-today="{{ bool_to_string($show_today ?? false) }}"
    data-allow-future="{{ bool_to_string($allow_future ?? true) }}"
    data-allow-past="{{ bool_to_string($allow_past ?? true) }}"
    data-disabled-dates='@json($disabled_dates ?? [])'
    data-disabled-hours='@json($disabled_hours ?? [])'
    data-disabled-minutes='@json($disabled_minutes ?? [])'
    data-disabled-seconds='@json($disabled_seconds ?? [])'
></div>
