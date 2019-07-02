<form action="{{ $action }}" method="post" enctype="multipart/form-data" autocomplete="off">
    @csrf
    @method($method)

    {{ $slot }}

    @if ($buttons ?? null)
        {{ $buttons }}
    @else
        @include('maelstrom::buttons.form-controls')
    @endif
</form>
