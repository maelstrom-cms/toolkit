@php $panel = $panel ?? maelstrom(); @endphp

@extends('maelstrom::layouts.wrapper')

@hasSection('title')
    {{-- nothing here --}}
@else
    @section('title')
        @if ($panel->getEntry())
            Editing {{ $panel->getEntryName() }}
        @else
            Adding {{ $panel->getEntityName() }}
        @endif
    @endsection
@endif

@section('main')
    @stack('form_before')

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

    <div class="form mt-4">
        @yield('content')
    </div>

    @stack('form_after')

    @hasSection('footer')
        <div class="footer mt-8">
            @yield('footer')
        </div>
    @endif
@endsection
