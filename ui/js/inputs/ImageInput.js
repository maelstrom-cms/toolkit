import FileInput from './FileInput'

export default class ImageInput extends FileInput {

    constructor(props) {
        super(props)

        this.listType = 'picture-card'
    }

}
