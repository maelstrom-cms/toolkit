@php
    use Illuminate\Support\Str;
    $entry = $entry ?? maelstrom()->getEntry();

    $components = array_map(function ($item) {
        $type = data_get($item, 'component') . '_input';
        $type = Str::studly($type);
        data_set($item, 'component', $type);

        if ($type === 'MediaManagerInput') {
            data_set($item, 'component', 'MediaManager');
            data_set($item, 'route', route('maelstrom.media.index'));
        }

        return $item;
    }, $fields ?? []);

    $value = old(str_replace('.', '_', $name), data_get($entry, $name, ($default ?? [])));

    if (is_json_string($value)) {
        $value = json_decode($value, true);
    }

    $value = array_map(function ($item) {
        if (data_get($item, '_key', null) === null) {
            data_set($item, '_key', Str::uuid());
        }

        return $item;
    }, $value, array_keys($value));
@endphp

<div
    id="{{ $name }}_field"
    data-component="Repeater"
    data-value='@json($value)'
    data-label="{{ $label ?? $name }}"
    data-name="{{ $name }}"
    data-components='@json($components, true)'
    data-min-items="{{ $min_items ?? 0 }}"
    data-max-items="{{ $max_items ?? 100 }}"
    data-button="{{ $button ?? 'Item' }}"
></div>
