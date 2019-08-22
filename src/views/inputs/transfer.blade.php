@php
    $entry = $entry ?? maelstrom()->getEntry();
    $valueField = $valueField ?? $name;

    if (old($name . '_is_empty')) {
        $values = [];
    } else {
        $values = old($name, data_get($entry, $valueField, ($default ?? [])));
    }

    if (is_iterable($values)) {
        foreach ($values as $k => $tester) {
            // Looks like we've already got a list of IDs.
            if (is_string($tester) || is_numeric($tester)) {
                break;
            }

            // If we can get the ID from it.
            if (method_exists($tester, 'getKey')) {
                $values[$k] = $tester->getKey();
            }
        }
    }

    $options = $options ?? [['label' => 'Option 1', 'value' => 1], ['label' => 'Option 2', 'value' => 2]];
@endphp
<div
    id="{{ $name }}_field"
    data-component="TransferInput"
    data-value='{{ json_encode($values) }}'
    data-label="{{ $label ?? $name }}"
    data-name="{{ $name }}"
    data-help="{{ $help ?? null }}"
    data-error="{{ $errors->first(str_replace('.', '_', $name)) }}"
    data-options='@json($options)'
    data-required="{{ bool_to_string($required ?? false) }}"
    data-remote-uri="{{ $remote_uri ?? null }}"
    data-create-button="{{ isset($create_button) ? json_encode($create_button) : null }}"
></div>
