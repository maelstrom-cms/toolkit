@extends('maelstrom::layouts.form')

@section('content')
    @component('maelstrom::components.form', [
        'action' => $action,
        'method' => $method,
    ])

        <h2 class="cloak">Account information</h2>

        @include('maelstrom::inputs.text', [
            'label' => 'Full name',
            'name' => 'name',
            'required' => true,
        ])

        @include('maelstrom::inputs.text', [
            'label' => 'Email address',
            'name' => 'email',
            'html_type' => 'email',
            'required' => true,
        ])

        <h2 class="cloak">Security</h2>

        @include('maelstrom::inputs.secret', [
            'label' => 'Change password',
            'name' => 'new_password',
            'help' => 'Only enter your password here if you want to change it.',
            'autocomplete' => 'new-password'
        ])

        @slot('buttons')
            <div class="mt-6">
                @include('maelstrom::buttons.save')
            </div>
        @endslot

    @endcomponent
@endsection
