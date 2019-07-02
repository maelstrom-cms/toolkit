@include('maelstrom::inputs.select', array_merge([
    'component' => 'TagsInput',
    'allow_wild_values' => $wild_values ?? false,
    'save_labels' => $save_labels ?? false,
    get_defined_vars()
]))
