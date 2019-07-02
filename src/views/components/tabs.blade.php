@php
    $direction = $direction ?? 'horizontal';
@endphp

<div class="tabs-container js-tabs-container {{ $direction === 'vertical' ? 'flex' : '' }}">

    <nav class="tabs-navigation {{ $direction === 'vertical' ? 'pb-3' : '' }}">
        <div
            data-component="Tabs"
            data-direction="{{ $direction }}"
        ></div>
    </nav>

    <section class="tabs-content {{ $direction === 'vertical' ? 'flex-1' : '' }} pb-5">
        {{ $slot }}
    </section>

</div>
