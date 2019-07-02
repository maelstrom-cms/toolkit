@stack('head_before')

@if ($css = config('maelstrom.core_css_path'))
<link rel="stylesheet" href="{{ mix($css) }}">
@endif

@foreach (config('maelstrom.custom_css', []) as $url)
    <link rel="stylesheet" href="{{ $url }}">
@endforeach

@stack('head_after')
