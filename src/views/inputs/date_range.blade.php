@php $entry = $entry ?? maelstrom()->getEntry(); @endphp

<div
    id="{{ $name_start }}_field"
    data-component="DateRangeInput"
    data-value-start="{{ old($name_start, data_get($entry, $name_start, ($default ?? null))) }}"
    data-value-end="{{ old($name_end, data_get($entry, $name_end, ($default ?? null))) }}"
    data-label="{{ $label ?? $name_start }}"
    data-name-start="{{ $name_start }}"
    data-name-end="{{ $name_end }}"
    data-help="{{ $help ?? null }}"
    data-error="{{ $errors->first($name_start) ?: $errors->first($name_end) }}"
    data-required="{{ bool_to_string($required ?? false) }}"
    data-allow-clear="{{ bool_to_string($allow_clear ?? false) }}"
    data-show-time="{{ bool_to_string($show_time ?? false) }}"
    data-display-format="{{ $format ?? 'DD/MM/YYYY' }}"
    data-save-format="{{ $format ?? 'YYYY-MM-DD' }}"
    data-allow-future="{{ bool_to_string($allow_future ?? true) }}"
    data-allow-past="{{ bool_to_string($allow_past ?? true) }}"
    data-disabled-dates='@json($disabled_dates ?? [])'
    data-disabled-hours='@json($disabled_hours ?? [])'
    data-disabled-minutes='@json($disabled_minutes ?? [])'
    data-disabled-seconds='@json($disabled_seconds ?? [])'
></div>
