@extends('maelstrom::layouts.wrapper')

@section('title')
    {{ $title }}
@endsection

@section('main')
    <div class="bg-gray-100 p-3 flex justify-between items-center">
        <div>
            <h1 class="m-0">{{ $title }}</h1>
        </div>
        @if (isset($breadcrumbs))
        <div class="pr-2">
            @include('maelstrom::components.breadcrumbs', [
                'title' => $title,
                'crumbs' => $breadcrumbs,
            ])
        </div>
        @endif
    </div>

    @include('maelstrom::components.loader')

    @include('maelstrom::components.flash')

    @include('maelstrom::components.validation')

    <div class="form mt-4 cloak">
        @yield('content')
    </div>

    @hasSection('footer')
        <div class="footer mt-8">
            @yield('footer')
        </div>
    @endif
@endsection
