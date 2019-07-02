@include('maelstrom::inputs.select', array_merge([
    'component' => 'TagsInput',
    'allow_wild_values' => $wild_values ?? false,
    'save_labels' => $save_labels ?? false,
    'options' => $options ?? [],
    get_defined_vars()
]))
