<form class="maelstrom-form" method="POST" action="{{ $action }}" enctype="multipart/form-data" autocomplete="{{ $autocomplete ?? 'off' }} {{ isset($novalidate) ? 'novalidate' : '' }}">
    @csrf
    @method(strtoupper($method))

    {{ $slot }}

    @if ($buttons ?? null)
        {{ $buttons }}
    @else
        @include('maelstrom::buttons.form-controls')
    @endif
</form>
