@extends('maelstrom::layouts.wrapper')

@section('main')
    @hasSection('title')
    <div class="bg-gray-100 p-3 flex justify-between items-center">
        <div>
            <h1 class="m-0">@yield('title')</h1>
        </div>
        @if (isset($breadcrumbs))
        <div class="pr-2">
            @include('maelstrom::components.breadcrumbs', [
                'breadcrumbs' => $breadcrumbs,
            ])
        </div>
        @endif
    </div>
    @endif

    @include('maelstrom::components.loader')

    @include('maelstrom::components.flash')

    @include('maelstrom::components.validation')

    <div class="mt-4 cloak">
        @yield('content')
    </div>

    @hasSection('footer')
        <div class="footer mt-8">
            @yield('footer')
        </div>
    @endif
@endsection