import Registry from './support/Registry'

import { Button, FormControls, NestedResource } from './buttons'

import {
    TextLinkColumn, MediaManagerColumn,
    EditLinkColumn, ImageColumn,
    ActionsColumn, VideoColumn,
    BooleanColumn, IconColumn,
} from './columns'

import {
    EntryTable, FlashAlert, ValidationAlert, Loader,
    Breadcrumbs, Sidebar, Tabs, Repeater,
} from './components'

import {
    TextInput, RadioInput, RatingInput, SelectInput, VideoInput,
    TransferInput, WysiwygInput, FileInput, FilesInput, SwitchInput,
    ImageInput, ImagesInput, CheckboxInput, NumberInput, SliderInput,
    DateInput, DateTimeInput, TimeInput, DateRangeInput, ColourInput,
    SecretInput, RandomInput, MarkdownInput, PlaceInput, IconInput,
    SelectMultipleInput, TagsInput,
} from './inputs'

import MediaManager from './media_manager/MediaManager'

window.Registry = Registry

Registry.register({
    MediaManager,
})

Registry.register({
    Button,
    FormControls,
    NestedResource,
})

Registry.register({
    EditLinkColumn,
    ImageColumn,
    ActionsColumn,
    VideoColumn,
    BooleanColumn,
    IconColumn,
    TextLinkColumn,
    MediaManagerColumn,
})

Registry.register({
    TextInput,
    RatingInput,
    RadioInput,
    SelectInput,
    WysiwygInput,
    FileInput,
    FilesInput,
    ImageInput,
    ImagesInput,
    TransferInput,
    CheckboxInput,
    NumberInput,
    SliderInput,
    SwitchInput,
    DateInput,
    DateTimeInput,
    TimeInput,
    DateRangeInput,
    VideoInput,
    SecretInput,
    RandomInput,
    MarkdownInput,
    PlaceInput,
    ColourInput,
    IconInput,
    TagsInput,
    SelectMultipleInput,
})

Registry.register({
    FlashAlert,
    ValidationAlert,
    EntryTable,
    Loader,
    Breadcrumbs,
    Sidebar,
    Tabs,
    Repeater,
})

Array.from(document.querySelectorAll('.cloak')).forEach(element => element.classList.remove('cloak'))
