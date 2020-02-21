import Language from './Language'
import Url from '../../Routing/Constants/Url'
import { Validator } from '../../Utils'

const CS = Language.CS
const EN = Language.EN

export default {

    nav: {
        links: [
            { text: { [CS]: 'Přehled', [EN]: 'Overview' }, pathname: Url.HOME, icon: 'Overview' },
            { text: { [CS]: 'Databáze', [EN]: 'Database' }, pathname: Url.DATABASE, icon: 'Database' },
            { text: { [CS]: 'Učení', [EN]: 'Learning' }, pathname: Url.AI, icon: 'AI' }
        ]
    },

    home: {
        title: {
            [CS]: 'Nadpis',
            [EN]: 'Title'
        },
        toggle: {
            [CS]: 'Změnit jazyk',
            [EN]: 'Change language'
        },
        help: {
            [CS]: 'Nápověda',
            [EN]: 'Help'
        }
    },

    help: {
        home: {
            [CS]: 'Domů',
            [EN]: 'Home'
        }
    },

    filter: {
        relations: {
            [Validator.Relation.CONTAINS]: {
                [CS]: 'Obsahuje',
                [EN]: 'Contains'
            },
            [Validator.Relation.EQUALS]: {
                [CS]: 'Rovná se',
                [EN]: 'Equals'
            }
        },
        value: {
            [CS]: 'Hodnota filtru...',
            [EN]: 'Filter value...'
        }
    }

}