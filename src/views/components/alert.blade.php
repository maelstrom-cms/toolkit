@if ($message ?? null)
    <div
        class="mt-6"
        data-component="FlashAlert"
        data-style="{{ $style ?? 'info' }}"
        data-message="{{ $message }}"
    ></div>
@endif
