import Language from './Language'
import Url from '../../Routing/Constants/Url'
import { Validator } from '../../Native'
import ProcessState from '../../Discovery/Constants/ProcessState'
import DatasetType from '../../Database/Constants/DatasetType'
import LifeType from '../../Database/Constants/LifeType'
import PlanetType from '../../Database/Constants/PlanetType'
import DatasetPriority from '../../Database/Constants/DatasetPriority'
import SpectralClass from '../../Database/Constants/SpectralClass'
import LuminosityClass from '../../Database/Constants/LuminosityClass'
import PlanetStatus from '../../Database/Constants/PlanetStatus'

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
            [Validator.Relation.GREATER_THAN]: { [CS]: 'Je větší než', [EN]: 'Is more than' }
        },
        value: { [CS]: 'Hodnota filtru...', [EN]: 'Filter value...' }
    },

    properties: {
        // General
        type: { [CS]: 'Typ', [EN]: 'Type' },
        name: { [CS]: 'Název', [EN]: 'Name' },

        // Datasets
        totalSize: { [CS]: 'Objektů', [EN]: 'Objects' },
        processed: { [CS]: 'Zpracováno', [EN]: 'Processed' },
        date: { [CS]: 'Datum', [EN]: 'Date' },
        published: { [CS]: 'Zveřejněno', [EN]: 'Published' },
        url: 'URL',
        time: { [CS]: 'Výpočetní čas', [EN]: 'Process time' },
        modified: { [CS]: 'Posl. aktivita', [EN]: 'Last activity' },
        priority: { [CS]: 'Priorita', [EN]: 'Priority' },

        // Stars
        spectral_class: { [CS]: 'Spektrální třída', [EN]: 'Spectral class' },
        luminosity_class: { [CS]: 'Třída svítivosti', [EN]: 'Luminosity class' },
        diameter: { [CS]: 'Průměr', [EN]: 'Diameter' },
        mass: { [CS]: 'Hmotnost', [EN]: 'Mass' },
        distance: { [CS]: 'Vzdálenost', [EN]: 'Distance' },
        surfaceTemperature: { [CS]: 'Teplota', [EN]: 'Temperature' },
        spectralClass: { [CS]: 'Spektr. třída', [EN]: 'Spectr. class' },
        density: { [CS]: 'Hustota', [EN]: 'Density' },
        luminosity: { [CS]: 'Zář. výkon', [EN]: 'Luminosity' },
        surfaceGravity: { [CS]: 'Gravitace', [EN]: 'Gravity' },
        planets: { [CS]: 'Planet', [EN]: 'Planets' },
        dataset: { [CS]: 'Datasety', [EN]: 'Datasets' },
        lightCurve: { [CS]: 'Světelná křivka', [EN]: 'Light curve' },
        absoluteMagnitude: 'Abs. mag.',
        apparentMagnitude: { [CS]: 'Zdánl. mag.', [EN]: 'Apparent mag.' },
        metallicity: { [CS]: 'Metalicita', [EN]: 'Metallicity' },

        // Planets
        semiMajorAxis: { [CS]: 'Velká poloosa', [EN]: 'Semi-major axis' },
        transit: { [CS]: 'Tranzit', [EN]: 'Transit' },
        orbitalPeriod: { [CS]: 'Perioda', [EN]: 'Period' },
        orbitalVelocity: { [CS]: 'Rychlost', [EN]: 'Velocity' },
        lifeConditions: { [CS]: 'Život', [EN]: 'Life' },
        planet: { [CS]: 'Planeta', [EN]: 'Planet' },
        status: 'Status'
    },

    units: {
        time: {
            second: 's', minute: 'm', hour: 'h', day: 'd', year: { [CS]: 'r', [EN]: 'y' }, millisecond: 'ms'
        }
    },

    database: {
        select: { [CS]: 'Tabulka', [EN]: 'Table' },
        tables: {
            bodies: { [CS]: 'Tělesa', [EN]: 'Bodies' },
            stars: { [CS]: 'Hvězdy', [EN]: 'Stars' },
            planets: { [CS]: 'Planety', [EN]: 'Planets' },
            datasets: { [CS]: 'Datasety', [EN]: 'Datasety' },
            users: { [CS]: 'Uživatelé', [EN]: 'Users' }
        }
    },

    datasets: {
        types: {
            [DatasetType.STAR_PROPERTIES]: { [CS]: 'Hvězdy', [EN]: 'Stars' },
            [DatasetType.PLANET_PROPERTIES]: { [CS]: 'Planety', [EN]: 'Planets' },
            [DatasetType.LIGHT_CURVE]: { [CS]: 'Světelné křivky', [EN]: 'Light curves' },
            [DatasetType.TARGET_PIXEL]: 'Target pixel',
            [DatasetType.RADIAL_VELOCITY]: { [CS]: 'Radiální rychlosti', [EN]: 'Radial velocity' }
        },
        priorities: {
            [DatasetPriority.LOWEST]: { [CS]: 'Nejnižší', [EN]: 'Lowest' },
            [DatasetPriority.LOW]: { [CS]: 'Nízká', [EN]: 'Low' },
            [DatasetPriority.NORMAL]: { [CS]: 'Normální', [EN]: 'Normal' },
            [DatasetPriority.HIGH]: { [CS]: 'Vysoká', [EN]: 'High' },
            [DatasetPriority.HIGHEST]: { [CS]: 'Nejvyšší', [EN]: 'Highest' }
        }
    },

    stars: {
        unknownSize: { [CS]: 'Typ', [EN]: 'Type' },
        unknownType: { [CS]: 'Neznámý', [EN]: 'Unknown' },

        sizes: {
            [LuminosityClass.ZERO]: { [CS]: 'Hyperobr', [EN]: 'Hypergiant' },
            [LuminosityClass.I]: { [CS]: 'Superobr', [EN]: 'Supergiant' },
            [LuminosityClass.II]: { [CS]: 'Obr', [EN]: 'Giant' },
            [LuminosityClass.III]: { [CS]: 'Obr', [EN]: 'Giant' },
            [LuminosityClass.IV]: { [CS]: 'Podobr', [EN]: 'Subgiant' },
            [LuminosityClass.V]: { [CS]: 'Trpaslík', [EN]: 'Dwarf' },
            [LuminosityClass.VI]: { [CS]: 'Podtrpaslík', [EN]: 'Subdwarf' },
            [LuminosityClass.VII]: { [CS]: 'Trpaslík', [EN]: 'Dwarf' }
        },
        colors: {
            [SpectralClass.O]: { [CS]: 'Modrý', [EN]: 'Blue' },
            [SpectralClass.B]: { [CS]: 'Modrobílý', [EN]: 'Blue-white' },
            [SpectralClass.A]: { [CS]: 'Bílomodrý', [EN]: 'White-blue' },
            [SpectralClass.F]: { [CS]: 'Žlutobílý', [EN]: 'Yellow-white' },
            [SpectralClass.G]: { [CS]: 'Žlutý', [EN]: 'Yellow' },
            [SpectralClass.K]: { [CS]: 'Oranžový', [EN]: 'Orange' },
            [SpectralClass.M]: { [CS]: 'Červený', [EN]: 'Red' }
        }
    },

    planets: {
        unknownType: { [CS]: 'Neznámý typ', [EN]: 'Unknown type' },

        lifeConditions: {
            [LifeType.IMPOSSIBLE]: { [CS]: 'Vyloučen', [EN]: 'Impossible' },
            [LifeType.POSSIBLE]: { [CS]: 'Možný', [EN]: 'Possible' },
            [LifeType.UNKNOWN]: { [CS]: 'Neznámý', [EN]: 'Unknown' },
            [LifeType.PROMISING]: { [CS]: 'Slibný', [EN]: 'Promising' }
        },
        types: {
            [PlanetType.MERCURY]: { [CS]: 'Typ Merkur', [EN]: 'Mercury-like' },
            [PlanetType.EARTH]: { [CS]: 'Typ Země', [EN]: 'Earth-like' },
            [PlanetType.SUPEREARTH]: { [CS]: 'Superzemě', [EN]: 'Superearth' },
            [PlanetType.NEPTUNE]: { [CS]: 'Typ Neptun', [EN]: 'Neptune-like' },
            [PlanetType.JUPITER]: { [CS]: 'Typ Jupiter', [EN]: 'Jupiter-like' }
        },
        statuses: {
            [PlanetStatus.CANDIDATE]: { [CS]: 'Kandidát', [EN]: 'Candidate' },
            [PlanetStatus.CONFIRMED]: { [CS]: 'Potvrzena', [EN]: 'Confirmed' },
            [PlanetStatus.REJECTED]: { [CS]: 'Zamítnuta', [EN]: 'Rejected' }
        }
    },

    system: {
        planets: { [CS]: 'Planety', [EN]: 'Planets' }
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
                [ProcessState.TERMINATED]: { [CS]: 'Ukončen', [EN]: 'Terminated' },
                [ProcessState.WAITING_FOR_RUN]: { [CS]: 'Čeká na data', [EN]: 'Waiting for data' }
            },
            stateMessage: {
                [ProcessState.WAITING_FOR_PAUSE]: { [CS]: 'Čeká na pauzu.', [EN]: 'Waiting for pause.' },
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