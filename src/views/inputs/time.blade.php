@php $entry = $entry ?? maelstrom()->getEntry(); @endphp

<div
    id="{{ $name }}_field"
    data-component="TimeInput"
    data-value="{{ old($name, data_get($entry, $name, ($default ?? null))) }}"
    data-label="{{ $label ?? $name }}"
    data-name="{{ $name }}"
    data-help="{{ $help ?? null }}"
    data-error="{{ $errors->first(str_replace('.', '_', $name)) }}"
    data-required="{{ bool_to_string($required ?? false) }}"
    data-allow-clear="{{ bool_to_string($allow_clear ?? false) }}"
    data-placeholer="{{ $placeholder ?? null }}"

    data-use-12-hours="{{ bool_to_string($use_12_hours ?? false) }}"
    data-second-step="{{ $second_step ?? 10 }}"
    data-minute-step="{{ $minute_step ?? 10 }}"
    data-hour-step="{{ $hour_step ?? 1 }}"

    data-display-format="{{ $format ?? 'HH:mm A' }}"
    data-save-format="{{ $format ?? 'HH:mm:ss' }}"

    data-disabled-hours='@json($disabled_hours ?? [])'
    data-disabled-minutes='@json($disabled_minutes ?? [])'
    data-disabled-seconds='@json($disabled_seconds ?? [])'
></div>
