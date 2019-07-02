@php
    $panel = $panel ?? maelstrom();
    $flash = session()->get('flash', '');

    $message = is_string($flash) ? $flash : ($message['message'] ?? '');
    $style = $flash['type'] ?? 'info';
@endphp

@if ($message)
    <div
        class="mt-6"
        data-component="FlashAlert"
        data-style="{{ $style }}"
        data-message="{{ $message }}"
    ></div>
@elseif ($panel && $panel->isEntryTrashed())
    <div
        class="mt-6"
        data-component="FlashAlert"
        data-style="warning"
        data-message="This item is currently in the trash."
    ></div>
@endif
