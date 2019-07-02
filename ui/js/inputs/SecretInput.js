import React from 'react'
import { Input } from 'antd'
import TextInput from './TextInput'

export default class SecretInput extends TextInput {

    renderTextInput = onChange => {
        return <Input.Password
            allowClear={ this.allowClear }
            addonBefore={ this.renderAddonBefore() }
            addonAfter={ this.renderAddonAfter() }
            prefix={ this.renderPrefix() }
            value={ this.state.value }
            onChange={ onChange }
            autoComplete="new-password"
        />
    };
}
