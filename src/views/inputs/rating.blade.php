@php $entry = $entry ?? maelstrom()->getEntry(); @endphp

<div
    id="{{ $name }}_field"
    data-component="RatingInput"
    data-value="{{ old($name, data_get($entry, $name, ($default ?? 0))) }}"
    data-label="{{ $label ?? $name }}"
    data-name="{{ $name }}"
    data-help="{{ $help ?? null }}"
    data-error="{{ $errors->first($name) }}"
    data-required="{{ bool_to_string($required ?? false) }}"

    data-count="{{ $count ?? 5 }}"
    data-allow-half="{{ bool_to_string($allow_half ?? false) }}"
    data-allow-clear="{{ bool_to_string($allow_clear ?? false) }}"
    data-icon="{{ $icon ?? null }}"
    data-character="{{ $character ?? null }}"
    data-colour="{{ $colour ?? null }}"
></div>
