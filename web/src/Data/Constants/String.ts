import Language from './Language'
import Url from '../../Routing/Constants/Url'
import { Validator } from '../../Native'
import ProcessState from '../../Discovery/Constants/ProcessState'

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
        title: { [CS]: 'Nadpis', [EN]: 'Title' },
        toggle: { [CS]: 'Změnit jazyk', [EN]: 'Change language' },
        help: { [CS]: 'Nápověda', [EN]: 'Help' }
    },

    help: {
        home: { [CS]: 'Domů', [EN]: 'Home' }
    },

    filter: {
        relations: {
            [Validator.Relation.CONTAINS]: { [CS]: 'Obsahuje', [EN]: 'Contains' },
            [Validator.Relation.EQUALS]: { [CS]: 'Rovná se', [EN]: 'Equals' },
            [Validator.Relation.ENDS_WITH]: { [CS]: 'Končí na', [EN]: 'Ends with' },
            [Validator.Relation.STARTS_WITH]: { [CS]: 'Začíná na', [EN]: 'Starts with' },
            [Validator.Relation.LESS_THAN]: { [CS]: 'Je menší než', [EN]: 'Is less than' },
            [Validator.Relation.MORE_THAN]: { [CS]: 'Je větší než', [EN]: 'Is more than' }
        },
        value: { [CS]: 'Hodnota filtru...', [EN]: 'Filter value...' }
    },

    properties: {
        // Datasets
        name: { [CS]: 'Název', [EN]: 'Name' },
        objects: { [CS]: 'Objektů', [EN]: 'Objects' },
        processed: { [CS]: 'Zpracováno', [EN]: 'Processed' },
        type: { [CS]: 'Typ', [EN]: 'Type' },
        date: { [CS]: 'Datum', [EN]: 'Date' },
        published: { [CS]: 'Zveřejněno', [EN]: 'Published' },
        url: 'URL',
        processTime: { [CS]: 'Výpočetní čas', [EN]: 'Process time' },
        lastActivity: { [CS]: 'Posl. aktivita', [EN]: 'Last activity' },
        priority: { [CS]: 'Priorita', [EN]: 'Priority' },

        // Stars
        diameter: { [CS]: 'Průměr', [EN]: 'Diameter' },
        mass: { [CS]: 'Hmotnost', [EN]: 'Mass' },
        distance: { [CS]: 'Vzdálenost', [EN]: 'Distance' },
        temperature: { [CS]: 'Teplota', [EN]: 'Temperature' },
        spectralClass: { [CS]: 'Spektr. třída', [EN]: 'Spectr. class' },
        density: { [CS]: 'Hustota', [EN]: 'Density' },
        luminosity: { [CS]: 'Zář. výkon', [EN]: 'Luminosity' },
        gravity: { [CS]: 'Gravitace', [EN]: 'Gravity' },
        planets: { [CS]: 'Planet', [EN]: 'Planets' },
        datasets: { [CS]: 'Datasety', [EN]: 'Datasets' }
    },

    units: {
        time: {
            second: 's', minute: 'm', hour: 'h', day: 'd', year: { [CS]: 'r', [EN]: 'y' }, millisecond: 'ms'
        }
    },

    datasets: {
        types: {
            STAR_PROPERTIES: { [CS]: 'Hvězdy', [EN]: 'Stars' },
            PLANET_PROPERTIES: { [CS]: 'Planety', [EN]: 'Planets' },
            LIGHT_CURVE: { [CS]: 'Světelné křivky', [EN]: 'Light curves' }
        },
        priorities: [
            { [CS]: 'Nejnižší', [EN]: 'Lowest' },
            { [CS]: 'Nízká', [EN]: 'Low' },
            { [CS]: 'Normální', [EN]: 'Normal' },
            { [CS]: 'Vysoká', [EN]: 'High' },
            { [CS]: 'Nejvyšší', [EN]: 'Highest' }
        ]
    },

    stars: {
        types: {
            YELLOW_DWARF: { [CS]: 'Žlutý trpaslík', [EN]: 'Yellow dwarf' }
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

    auth: {
        email: 'Email',
        password: { [CS]: 'Heslo', [EN]: 'Password' },
        forgotPassword: { [CS]: 'Zapomenuté heslo?', [EN]: 'Forgot password?' },
        error: { [CS]: 'Špatné přihlašovací údaje.', [EN]: 'Bad credentials' },
        missingEmail: { [CS]: 'Napište svůj email', [EN]: 'Type your email' },
        invalidEmail: { [CS]: 'Napište email ve tvaru email@doména.', [EN]: 'Type email in form email@domain.' },
        missingPassword: { [CS]: 'Napište své heslo', [EN]: 'Type your password' },
        or: { [CS]: 'Nebo', [EN]: 'Or' },
        name: { [CS]: 'Jméno', [EN]: 'Name' },
        login: { [CS]: 'Přihlásit se', [EN]: 'Login' },
        signUp: { [CS]: 'Zaregistrovat se', [EN]: 'Sign up' },
        resetPassword: { [CS]: 'Resetovat heslo', [EN]: 'Reset password' },
        signUpToLogin: { [CS]: 'Již máte účet?', [EN]: 'Already have account?' }
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
                    icon: 'Pair.png',
                    title: 'Spárujte program s webovou aplikací'
                },
                {
                    icon: 'Discovery.png',
                    title: 'Nechte počítač, ať hledá exoplanety'
                }
            ]
        },
        process: {
            state: {
                [ProcessState.ACTIVE]: { [CS]: 'Aktivní', [EN]: 'Active' },
                [ProcessState.WAITING_FOR_TERMINATE]: { [CS]: 'Aktivní', [EN]: 'Active' },
                [ProcessState.WAITING_FOR_PAUSE]: { [CS]: 'Aktivní', [EN]: 'Active' },
                [ProcessState.PAUSED]: { [CS]: 'Pauza', [EN]: 'Pause' },
                [ProcessState.WAITING_FOR_RESUME]: { [CS]: 'Pauza', [EN]: 'Pause' },
                [ProcessState.TERMINATED]: { [CS]: 'Ukončen', [EN]: 'Terminated' }
            },
            stateMessage: {
                [ProcessState.WAITING_FOR_PAUSE]: { [CS]: 'Čeká na pauzu.', [EN]: 'Waiting for pause.' },
                [ProcessState.WAITING_FOR_RESUME]: { [CS]: 'Čeká na spuštění', [EN]: 'Waiting for run.' },
                [ProcessState.WAITING_FOR_TERMINATE]: { [CS]: 'Čeká na ukončení.', [EN]: 'Waiting for terminate.' },
                [ProcessState.TERMINATED]: { [CS]: 'Proces byl ukončen.', [EN]: 'Process was terminated.' }
            }
        }
    },

    sync: {
        login: {
            [CS]: 'Pro hledání exoplanet se přihlašte',
            [EN]: 'Log in to search for exoplanets'
        },
        confirm: {
            [CS]: 'Chcete začít hledat exoplanety jako',
            [EN]: 'Start looking for exoplanets under'
        },
        submit: {
            [CS]: 'Začít hledat'
        },
        changeIdentity: {
            [CS]: 'Přihlásit se jako jiný uživatel'
        }
    }

}