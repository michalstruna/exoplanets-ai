import EmailValidator from 'email-validator'
import UrlValidator from 'is-valid-http-url'

module Validator {

    export const isEmail = (text: string): boolean => (
        EmailValidator.validate(text)
    )

    export const isUrl = (text: string): boolean => (
        UrlValidator(text)
    )

}

export default Validator