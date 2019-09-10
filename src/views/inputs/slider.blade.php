@php $entry = $entry ?? maelstrom()->getEntry(); @endphp

<div
    id="{{ $name }}_field"
    data-component="SliderInput"
    data-value="{{ old(str_replace('.', '_', $name), data_get($entry, $name, ($default ?? ($min ?? 1)))) }}"
    data-label="{{ $label ?? $name }}"
    data-name="{{ $name }}"
    data-help="{{ $help ?? null }}"
    data-required="{{ bool_to_string($required ?? false) }}"
    data-min="{{ $min ?? 1 }}"
    data-max="{{ $max ?? 10 }}"
    data-step="{{ $step ?? 1 }}"
    data-dots="{{ bool_to_string($dots ?? false) }}"
    data-marks='@json($marks ?? [], JSON_FORCE_OBJECT)'
    data-error="{{ $errors->first(str_replace('.', '_', $name)) }}"
    data-show-input="{{ bool_to_string($show_input ?? false) }}"
    data-prefix-icon="{{ $prefix_icon ?? null }}"
    data-suffix-icon="{{ $suffix_icon ?? null }}"
></div>
