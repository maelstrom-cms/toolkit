<div
    class="tab-single js-tab-single hidden"
    title="{{ $label }}"
    data-tab="{{ $id ?? Str::slug($label) }}"
    data-icon="{{ $icon ?? null }}"
    data-active="{{ bool_to_string($active ?? false) }}"
>
    <div class="tab-content">
        {{ $slot }}
    </div>
</div>
