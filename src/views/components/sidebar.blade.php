<div
    data-component="Sidebar"
    data-theme="{{ $theme ?? config('maelstrom.theme') }}"
    data-items='@json($items)'
    data-width="{{ $width ?? 210 }}"
    data-guess-selected="{{ (isset($guess_selected) && $guess_selected === true) || !isset($guess_selected) ? 'true' : 'false' }}"
    data-can-collapse="{{ (isset($can_collapse) && $can_collapse === true) || !isset($can_collapse) ? 'true' : 'false' }}"
>
    <ul class="ant-menu ant-menu-{{ $theme ?? 'light' }} ant-menu-root ant-menu-inline" role="menu" style="height: 100vh; width: {{ $width ?? 210 }}px;">
        <li>
            <div class="p-4 ant-skeleton ant-skeleton-active" style="opacity: {{ isset($theme) && $theme === 'light' ? '.9' : '.1' }}">
                <div class="ant-skeleton-content">
                    <h3 class="ant-skeleton-title" style="width: 38%;">&nbsp;</h3>
                    <ul class="ant-skeleton-paragraph">
                        <li>&nbsp;</li>
                        <li>&nbsp;</li>
                        <li style="width: 61%;">&nbsp;</li>
                    </ul>
                </div>
            </div>
        </li>
    </ul>
</div>
