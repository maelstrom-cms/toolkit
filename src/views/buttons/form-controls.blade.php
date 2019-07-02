@php $panel = $panel ?? maelstrom(); @endphp

<div
    data-component="FormControls"
    data-help="{{ $help ?? null }}"
    data-routes='@json($panel->getRoutes())'
    data-entry-id="{{ $panel->getEntryId() }}"
    data-trashed="{{ $panel->isEntryTrashed() }}"
    data-can-save="{{ bool_to_string($can_save ?? true) }}"
    data-can-delete="{{ bool_to_string($can_delete ?? true) }}"
    data-can-restore="{{ bool_to_string($can_restore ?? true) }}"
></div>
