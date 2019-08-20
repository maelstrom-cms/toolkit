<html lang="en">
<head>
    <title>@yield('title') :: {{ config('maelstrom.title_prefix', config('maelstrom.title')) }}</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @include('maelstrom::partials.head-meta')
</head>
<body>
    <div class="maelstrom-wrapper{{ request()->has('iframe') ? ' iframe-mode' : '' }}">

        @include('maelstrom::partials.header')

        <section class="flex">
            <nav class="js-nav">
                @include('maelstrom::partials.sidebar')
            </nav>

            <main class="p-6 flex-1">
                @yield('main')
            </main>
        </section>
    </div>
    @include('maelstrom::partials.footer-scripts')
</body>
</html>
