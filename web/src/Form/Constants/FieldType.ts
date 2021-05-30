import { Validator } from '../../Native'

const FieldType = {

    TEXT: {
        name: 'text',
        validator: () => true
    },

    NUMBER: {
        name: 'number',
        validator: (value: any) => /[0-9]*/.test(value)
    },

    EMAIL: {
        name: 'email',
        validator: (value: string) => !value || Validator.isEmail(value)
    },

    PASSWORD: {
        name: 'password',
        validator: () => true
    },

    TEXTAREA: {
        name: 'textarea',
        validator: () => true
    },

    DATE: {
        name: 'date',
        validator: () => true
    },

    SELECT: {
        name: 'select',
        validator: () => true
    },

    CHECKBOX: {
        name: 'checkbox',
        validator: () => true
    },

    IMAGE: {
        name: 'file',
        validator: () => true
    }

}

export default FieldType