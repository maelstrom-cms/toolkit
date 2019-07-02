@stack('footer_before')

@if ($js = config('maelstrom.core_js_path'))
<script src="{{ mix($js) }}"></script>
@endif

@foreach (config('maelstrom.custom_js', []) as $url)
<script src="{{ $url }}"></script>
@endforeach

@stack('footer_after')
