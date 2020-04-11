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
            },
            [Validator.Relation.ENDS_WITH]: {
                [CS]: 'Končí na',
                [EN]: 'Ends with'
            },
            [Validator.Relation.STARTS_WITH]: {
                [CS]: 'Začíná na',
                [EN]: 'Starts with'
            },
            [Validator.Relation.LESS_THAN]: {
                [CS]: 'Je menší než',
                [EN]: 'Is less than'
            },
            [Validator.Relation.MORE_THAN]: {
                [CS]: 'Je větší než',
                [EN]: 'Is more than'
            }
        },
        value: {
            [CS]: 'Hodnota filtru...',
            [EN]: 'Filter value...'
        }
    },

    stats: {
        topLevelStats: {
            units: {
                computingTime: 'h'
            },
            discoveredPlanets: {
                [CS]: 'Objevených planet',
                [EN]: 'Discovered planets'
            },
            exploredStars: {
                [CS]: 'Zpracovaných hvězd',
                [EN]: 'Explored Stars'
            },
            computingTime: {
                [CS]: 'Výpočetní čas',
                [EN]: 'Computing time'
            },
            volunteers: {
                [CS]: 'Registrovaných dobrovolníků',
                [EN]: 'REgistered volunteers'
            }
        }
    }

}