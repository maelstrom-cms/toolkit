@php $panel = $panel ?? maelstrom(); @endphp
@php $entries = $entries ?? $panel->getEntries(); @endphp
@extends('maelstrom::layouts.wrapper')

@hasSection('title')
    {{-- nothing here --}}
@else
    @section('title')
        Showing {{ $entries->count() }} of {{ $entries->total() }} {{ ($panel ?? maelstrom())->getEntityName(true) }}
    @endsection
@endif

@section('main')
    <div class="bg-gray-100 p-3 flex justify-between items-center">
        <div>
            <h1 class="m-0">@yield('title')</h1>
        </div>
        <div class="pr-2">
            @include('maelstrom::components.breadcrumbs')
        </div>
    </div>

    @include('maelstrom::components.loader')

    @include('maelstrom::components.flash')

    @include('maelstrom::components.validation')

    @hasSection('buttons')
        <div class="buttons mt-8">
            @yield('buttons')
        </div>
    @endif

    <div class="content mt-4">
        @hasSection('content')
            @yield('content')
        @else
            @include('maelstrom::components.table')
        @endif
    </div>

    @hasSection('footer')
        <div class="footer mt-8">
            @yield('footer')
        </div>
    @endif
@endsection
