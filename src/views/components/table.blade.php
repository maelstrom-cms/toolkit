@php $panel = $panel ?? maelstrom(); @endphp

<div
    data-component="EntryTable"
    data-columns='@json($columns)'
    data-entries='@json($entries)'
    data-bulk-actions='@json($bulk_actions ?? null)'
    data-is-trashable="{{ $panel->isTrashable }}"
    data-csrf="{{ csrf_token() }}"
    data-routes='@json($panel->getRoutes())'
    data-media-route="{{ route('maelstrom.media.index') }}"
></div>
