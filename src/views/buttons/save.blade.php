@php $panel = $panel ?? maelstrom(); @endphp

<div
    data-component="FormControls"
    data-help="{{ $help ?? null }}"
    data-routes='@json($panel->getRoutes())'
    data-entry-id="{{ $panel->getEntryId() }}"
    data-can-save="true"
    data-can-delete="false"
    data-can-restore="false"
></div>
