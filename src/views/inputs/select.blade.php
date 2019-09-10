@php
    $entry = $entry ?? maelstrom()->getEntry();
    $options = $options ?? [['label' => 'Yes', 'value' => '1'], ['label' => 'No', 'value' => '0']];
    $value = old(str_replace('.', '_', $name), data_get($entry, $name, ($default ?? null)));

    if (is_object($value) || is_array($value)) {
        $value = json_encode($value);
    }

@endphp

<div
    id="{{ $name }}_field"
    data-component="{{ $component ?? 'SelectInput' }}"
    data-value='{{ $value }}'
    data-label="{{ $label ?? $name }}"
    data-name="{{ $name }}"
    data-help="{{ $help ?? null }}"
    data-error="{{ $errors->first(str_replace('.', '_', $name)) }}"
    data-options='@json($options)'
    data-allow-clear="{{ bool_to_string($allow_clear ?? true) }}"
    data-show-search="{{ bool_to_string($show_search ?? true) }}"
    data-placeholder="{{ $placeholder ?? 'Please Select' }}"
    data-required="{{ bool_to_string($required ?? false) }}"
    data-mode="{{ $mode ?? 'default' }}"
    data-remote-uri="{{ $remote_uri ?? null }}"
    data-create-button="{{ isset($create_button) ? json_encode($create_button) : null }}"

    data-allow-wild-values="{{ bool_to_string($allow_wild_values ?? false) }}"
    data-save-labels="{{ bool_to_string($save_labels ?? false) }}"
></div>
