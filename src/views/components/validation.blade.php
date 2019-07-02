@if ($errors->any())
    <div
        class="mt-6"
        data-component="ValidationAlert"
        data-style="{{ $type ?? 'error' }}"
        data-errors='@json($errors->all())'
    ></div>
@endif
