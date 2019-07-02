<div data-component="Loader" class="ant-spin-nested-loading mt-8">
    <div>
        <div class="ant-spin ant-spin-spinning ant-spin-show-text">
            <span class="ant-spin-dot ant-spin-dot-spin">
                <i class="ant-spin-dot-item"></i>
                <i class="ant-spin-dot-item"></i>
                <i class="ant-spin-dot-item"></i>
                <i class="ant-spin-dot-item"></i>
            </span>
            <div class="ant-spin-text">
                {{ $message ?? 'Loading' }}
            </div>
        </div>
    </div>

    <div class="ant-spin-container ant-spin-blur">
        <div data-show="true" class="ant-alert ant-alert-info ant-alert-with-description ant-alert-no-icon" style="padding: 30px 0;">&nbsp;</div>
    </div>
</div>
