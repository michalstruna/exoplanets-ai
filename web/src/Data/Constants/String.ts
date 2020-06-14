import Language from './Language'
import Url from '../../Routing/Constants/Url'
import { Validator } from '../../Native'

const CS = Language.CS
const EN = Language.EN

export default {

    nav: {
        links: [
            { text: { [CS]: 'Přehled', [EN]: 'Overview' }, pathname: Url.HOME, icon: 'Overview' },
            { text: { [CS]: 'Databáze', [EN]: 'Database' }, pathname: Url.DATABASE, icon: 'Database' },
            { text: { [CS]: 'Objevování', [EN]: 'Discovery' }, pathname: Url.DISCOVERY, icon: 'Discovery' }
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
    },

    login: {
        email: 'Email',
        password: { [CS]: 'Heslo', [EN]: 'Password' },
        submit: { [CS]: 'Připojit se', [EN]: 'Join' },
        forgotPassword: { [CS]: 'Zapomenuté heslo?', [EN]: 'Forgot password?' },
        error: { [CS]: 'Špatné přihlašovací údaje.', [EN]: 'Bad credentials' },
        missingEmail: { [CS]: 'Napište svůj email', [EN]: 'Type your email' },
        invalidEmail: { [CS]: 'Napište email ve tvaru email@doména.', [EN]: 'Type email in form email@domain.' },
        missingPassword: { [CS]: 'Napište své heslo', [EN]: 'Type your password' },
        or: { [CS]: 'Nebo', [EN]: 'Or' }
    },

    discovery: {
        tutorial: {
            title: 'Chcete poskytnout výkon svého počítače pro hledání exoplanet?',
            steps: [
                {
                    icon: 'Download.svg',
                    download: true,
                    title: 'Stáhněte si klientský program (16,8 kiB)'
                },
                {
                    icon: 'Run.png',
                    title: 'Spusťte stažený program'
                },
                {
                    icon: 'pair.svg',
                    title: 'Spárujte program s webovou aplikací'
                },
                {
                    icon: 'discovery.svg',
                    title: 'Nechte počítač, ať hledá exoplanety'
                }
            ]
        }
    }

}