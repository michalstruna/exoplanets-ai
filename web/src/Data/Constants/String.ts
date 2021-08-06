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
import { MessageSelection, MessageTag, Sex, UserRole } from '../../User'
import ProcessLogType from '../../Discovery/Constants/ProcessLogType'

const CS = Language.CS
const EN = Language.EN

const strings = {

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

    units: {
        now: { [CS]: 'Teď', [EN]: 'Now' },
        before: {
            prefix: { [CS]: 'Před ', [EN]: '' },
            suffix: { [CS]: '', [EN]: ' ago' }
        },
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
        dataFields: { [CS]: 'Přehled', [EN]: 'Overview' },
        types: {
            [DatasetType.STAR_PROPERTIES]: { [CS]: 'Hvězdy', [EN]: 'Stars' },
            [DatasetType.PLANET_PROPERTIES]: { [CS]: 'Planety', [EN]: 'Planets' },
            [DatasetType.TARGET_PIXEL]: 'Target pixel',
            [DatasetType.SYSTEM_NAMES]: { [CS]: 'Názvy systémů', [EN]: 'System names' }
        },
        priorities: {
            [DatasetPriority.LOWEST]: { [CS]: 'Nejnižší', [EN]: 'Lowest' },
            [DatasetPriority.LOW]: { [CS]: 'Nízká', [EN]: 'Low' },
            [DatasetPriority.NORMAL]: { [CS]: 'Normální', [EN]: 'Normal' },
            [DatasetPriority.HIGH]: { [CS]: 'Vysoká', [EN]: 'High' },
            [DatasetPriority.HIGHEST]: { [CS]: 'Nejvyšší', [EN]: 'Highest' }
        },

        type: { [CS]: 'Typ', [EN]: 'Type' },
        name: { [CS]: 'Název', [EN]: 'Name' },
        missingName: { [CS]: 'Zadejte název', [EN]: 'Type name' },
        size: { [CS]: 'Položek', [EN]: 'Items' },

        planets: { [CS]: 'Planet', [EN]: 'Planets' },
        items: { [CS]: 'Křivek', [EN]: 'Curves' },
        data: { [CS]: 'Zpracováno', [EN]: 'Processed' },
        time: { [CS]: 'Výpoč. čas', [EN]: 'Comput. time' },

        processed: { [CS]: 'Zpracováno', [EN]: 'Processed' },
        date: { [CS]: 'Datum', [EN]: 'Date' },
        published: { [CS]: 'Zveřejněno', [EN]: 'Published' },
        url: 'URL',
        modified: { [CS]: 'Aktivní', [EN]: 'Active' },
        priority: { [CS]: 'Priorita', [EN]: 'Priority' },

        new: { [CS]: 'Nový dataset', [EN]: 'New dataset' },
        add: { [CS]: 'Přidat dataset', [EN]: 'Add dataset' },
        edit: { [CS]: 'Upravit dataset', [EN]: 'Edit dataset' },
        fields: { [CS]: 'Pole', [EN]: 'Fields' },
        modification: { [CS]: 'Modifikace', [EN]: 'Modification' },

        itemsGetter: { [CS]: 'Items getter', [EN]: 'Items getter' },
        itemGetter: { [CS]: 'Item getter', [EN]: 'Item getter' },

        selection: {
            noDatasets: { [CS]: 'Žádná data k dispozici', [EN]: 'No data available' },
            delete: { [CS]: 'Smazat', [EN]: 'Delete' },
            reset: 'Reset'

        }
    },

    forms: {
        reset: { [CS]: 'Výchozí', [EN]: 'Default' }
    },

    stars: {
        // Properties
        type: { [CS]: 'Typ', [EN]: 'Type' },
        name: { [CS]: 'Název', [EN]: 'Name' },
        spectralClass: { [CS]: 'Spektrální třída', [EN]: 'Spectral class' },
        luminosityClass: { [CS]: 'Třída svítivosti', [EN]: 'Luminosity class' },
        diameter: { [CS]: 'Průměr', [EN]: 'Diameter' },
        mass: { [CS]: 'Hmotnost', [EN]: 'Mass' },
        density: { [CS]: 'Hustota', [EN]: 'Density' },
        luminosity: { [CS]: 'Zář. výkon', [EN]: 'Luminosity' },
        distance: { [CS]: 'Vzdálenost', [EN]: 'Distance' },
        surfaceTemperature: { [CS]: 'Teplota', [EN]: 'Temperature' },
        surfaceGravity: { [CS]: 'Gravitace', [EN]: 'Gravity' },
        absoluteMagnitude: 'Abs. mag.',
        apparentMagnitude: { [CS]: 'Zdánl. mag.', [EN]: 'Apparent mag.' },
        metallicity: { [CS]: 'Metalicita', [EN]: 'Metallicity' },
        ra: { [CS]: 'Rektascenze', [EN]: 'Right ascension' },
        dec: { [CS]: 'Deklinace', [EN]: 'Declination' },
        planets: { [CS]: 'Planet', [EN]: 'Planets' },
        dataset: { [CS]: 'Datasety', [EN]: 'Datasets' },
        lightCurve: { [CS]: 'Světelná křivka', [EN]: 'Light curve' },
        transit: 'Transit',
        transitDepth: { [CS]: 'Hloubka transitu', [EN]: 'Transit depth' },
        surface: { [CS]: 'Povrch', [EN]: 'Surface' },
        matter: { [CS]: 'Hmota', [EN]: 'Matter' },
        other: { [CS]: 'Ostatní', [EN]: 'Other' },
        age: { [CS]: 'Stáří', [EN]: 'Age' },
        location: { [CS]: 'Poloha', [EN]: 'Location' },

        unknownSize: { [CS]: 'Typ', [EN]: 'Type' },
        unknownType: { [CS]: 'Neznámý', [EN]: 'Unknown' },

        sizes: {
            [LuminosityClass.ZERO]: { [CS]: 'Hyperobr', [EN]: 'Hypergiant' },
            [LuminosityClass.I]: { [CS]: 'Veleobr', [EN]: 'Supergiant' },
            [LuminosityClass.II]: { [CS]: 'Nadobr', [EN]: 'Bright giant' },
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
        },

        orbit: { [CS]: 'Orbita planety', [EN]: 'Planet orbit' },
        lifeZone: { [CS]: 'Zóna života', [EN]: 'Life zone' },
        legend: { [CS]: 'Legenda', [EN]: 'Legend' },

        quantitites: { [CS]: 'Veličiny', [EN]: 'Quantities' },
        curves: { [CS]: 'Křivky', [EN]: 'Curves' }
    },

    tp: {
        name: { [CS]: 'Název', [EN]: 'Name' },
    },

    planets: {
        // Properties
        name: { [CS]: 'Název', [EN]: 'Name' },
        type: { [CS]: 'Typ', [EN]: 'Type' },
        diameter: { [CS]: 'Průměr', [EN]: 'Diatemer' },
        mass: { [CS]: 'Hmotnost', [EN]: 'Mass' },
        density: { [CS]: 'Hustota', [EN]: 'Density' },
        surfaceTemperature: { [CS]: 'Teplota', [EN]: 'Temperature' },
        semiMajorAxis: { [CS]: 'Velká poloosa', [EN]: 'Semi-major axis' },
        transit: { [CS]: 'Tranzit', [EN]: 'Transit' },
        transitDepth: { [CS]: 'Hloubka transitu', [EN]: 'Transit depth' },
        period: { [CS]: 'Perioda', [EN]: 'Period' },
        velocity: { [CS]: 'Rychlost', [EN]: 'Velocity' },
        lifeConditions: { [CS]: 'Život', [EN]: 'Life' },
        planet: { [CS]: 'Planeta', [EN]: 'Planet' },
        status: 'Status',
        eccentricity: { [CS]: 'Excentricita', [EN]: 'Eccentricity' },
        inclination: { [CS]: 'Inklinace', [EN]: 'Inclination' },
        surfaceGravity: { [CS]: 'Gravitace', [EN]: 'Gravity' },
        dataset: { [CS]: 'Datasety', [EN]: 'Datasets' },
        ra: { [CS]: 'Rektascenze', [EN]: 'Right ascension' },
        dec: { [CS]: 'Deklinace', [EN]: 'Declination' },
        distance: { [CS]: 'Vzdálenost', [EN]: 'Distance' },
        discoveryDate: { [CS]: 'Objevení', [EN]: 'Discovery' },
        discoveryAuthor: { [CS]: 'Autor', [EN]: 'Author' },

        unknownType: { [CS]: 'Neznámý typ', [EN]: 'Unknown type' },

        lifeConditionsTypes: {
            [LifeType.IMPOSSIBLE]: { [CS]: 'Vyloučen', [EN]: 'Impossible' },
            [LifeType.POSSIBLE]: { [CS]: 'Možný', [EN]: 'Possible' },
            [LifeType.UNKNOWN]: { [CS]: 'Neznámý', [EN]: 'Unknown' },
            [LifeType.PROMISING]: { [CS]: 'Slibný', [EN]: 'Promising' }
        },
        types: {
            [PlanetType.MERCURY]: { [CS]: 'Merkur', [EN]: 'Mercury' },
            [PlanetType.EARTH]: { [CS]: 'Země', [EN]: 'Earth' },
            [PlanetType.SUPEREARTH]: { [CS]: 'Superzemě', [EN]: 'Superearth' },
            [PlanetType.NEPTUNE]: { [CS]: 'Neptun', [EN]: 'Neptune' },
            [PlanetType.JUPITER]: { [CS]: 'Jupiter', [EN]: 'Jupiter' }
        },
        statuses: {
            [PlanetStatus.CANDIDATE]: { [CS]: 'Kandidát', [EN]: 'Candidate' },
            [PlanetStatus.CONFIRMED]: { [CS]: 'Potvrzena', [EN]: 'Confirmed' },
            [PlanetStatus.REJECTED]: { [CS]: 'Zamítnuta', [EN]: 'Rejected' }
        },

        latest: { [CS]: 'Poslední objevené exoplanety', [EN]: 'Last discovered exoplanets' },
        similar: { [CS]: 'Zemi nejpodobnější exoplanety', [EN]: 'Most simular exoplanets to Earth' },
        nearest: { [CS]: 'Nejbližší exoplanety', [EN]: 'Nearest planets' }
    },

    system: {
        content: { [CS]: 'Obsah', [EN]: 'Content' },
        observations: { [CS]: 'Pozorování', [EN]: 'Observations' },
        lightCurve: { [CS]: 'Světelná křivka', [EN]: 'Light curve' },
        radialVelocity: { [CS]: 'Radiální rychlost', [EN]: 'Radial velocity' },
        planets: { [CS]: 'Planety', [EN]: 'Planets' },
        visualization: { [CS]: 'Vizualizace', [EN]: 'Visualization' },
        sizes: { [CS]: 'Velikosti', [EN]: 'Sizes' },
        distances: { [CS]: 'Vzdálenosti', [EN]: 'Distances' },
        references: { [CS]: 'Reference', [EN]: 'References' },
        matter: { [CS]: 'Hmota', [EN]: 'Matter' },
        orbit: { [CS]: 'Dráha', [EN]: 'Orbit' },
        other: { [CS]: 'Ostatní', [EN]: 'Other' },
        localView: { [CS]: 'Lokální pohled', [EN]: 'Local view' },
        globalView: { [CS]: 'Globální pohled', [EN]: 'Global view' },
        nObservations: { [CS]: 'Počet pozorování', [EN]: 'Number of observations' },
        length: { [CS]: 'Délka', [EN]: 'Length' },
        ...new Array(6).fill(null).reduce((obj, _, i) => ({ ...obj, [`name${i + 1}`]: { [CS]: `Název ${i + 1}`, [EN]: `Name ${i + 1}` } }), {})
    },

    stats: {
        units: {
            time: 'h',
            data: 'GiB'
        },
        planets: {
            [CS]: 'Objevených planet',
            [EN]: 'Discovered planets'
        },
        stars: {
            [CS]: 'Zpracováno hvězd',
            [EN]: 'Explored Stars'
        },
        time: {
            [CS]: 'Výpočetní čas',
            [EN]: 'Computing time'
        },
        volunteers: {
            [CS]: 'Dobrovolníků',
            [EN]: 'Volunteers'
        },
        data: {
            [CS]: 'Zpracováno dat',
            [EN]: 'Processed data'
        },
        items: {
            [CS]: 'Zpracováno křivek',
            [EN]: 'Processed curves'
        },
        lastWeek: { [CS]: 'poslední týden', [EN]: 'Last week' }
    },

    auth: {
        email: 'Email',
        password: { [CS]: 'Heslo', [EN]: 'Password' },
        oldPassword: { [CS]: 'Aktuální heslo', [EN]: 'Current password' },
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

    users: {
        name: { [CS]: 'Jméno', [EN]: 'Name' },
        role: 'Role',
        created: { [CS]: 'Registrace', [EN]: 'Registration' },
        modified: { [CS]: 'Aktivní', [EN]: 'Active' },
        planets: { [CS]: 'Planet', [EN]: 'Planets' },
        items: { [CS]: 'Křivek', [EN]: 'Curves' },
        data: { [CS]: 'Zpracováno', [EN]: 'Processed' },
        time: { [CS]: 'Výpoč. čas', [EN]: 'Comput. time' },
        country: { [CS]: 'Země', [EN]: 'Country' },
        sex: { [CS]: 'Pohlaví', [EN]: 'Sex' },
        birth: { [CS]: 'Narození', [EN]: 'Birth' },
        contact: { [CS]: 'Kontakt', [EN]: 'Contact' },
        age: { [CS]: 'Věk', [EN]: 'Age' },
        volunteersRank: { [CS]: 'Žebříček dobrovolníků', [EN]: 'Volunteers rank' },
        lastWeek: { [CS]: 'Poslední týden', [EN]: 'Last week' },
        total: { [CS]: 'Celkem', [EN]: 'Total' },

        sexName: {
            [Sex.FEMALE]: { [CS]: 'Žena', [EN]: 'Female' },
            [Sex.MALE]: { [CS]: 'Muž', [EN]: 'Male' }
        },

        roles: {
            [UserRole.UNAUTHENTICATED]: 'Nepřihlášený',
            [UserRole.AUTHENTICATED]: 'Uživatel',
            [UserRole.MODERATOR]: 'Moderátor',
            [UserRole.ADMIN]: 'Administrátor'
        },

        logout: { [CS]: 'Odhlásit se', [EN]: 'Logout' },
        profile: { [CS]: 'Profil', [EN]: 'Profile' },
        edit: { [CS]: 'Editace', [EN]: 'Edit' },
        emptyText: { [CS]: 'Tento uživatel o sobě nic nenapsal.', [EN]: 'This user has not written anything about himself.' },
        emptyInput: { [CS]: 'Nechci uvést', [EN]: 'Don\'t want provide' },
        text: { [CS]: 'Profilový text', [EN]: 'Profile text' },
        noOnlineUsers: { [CS]: 'Nikdo není online.', [EN]: 'Nobody is online.' },
        volunteers: { [CS]: 'Dobrovolníci', [EN]: 'Volunteers' },
        discussion: { [CS]: 'Diskuse', [EN]: 'Discussion' },
        unauth: { [CS]: 'Nejste přihlášený', [EN]: 'You are not logged in' },

        chat: {
            type: { [CS]: 'Napište něco', [EN]: 'Type anything' },
            messageSelection: {
                [MessageSelection.ALL]: { [CS]: 'Vše', [EN]: 'All' },
                [MessageSelection.MESSAGES]: { [CS]: 'Zprávy', [EN]: 'Messages' },
                [MessageSelection.NOTIFICATIONS]: { [CS]: 'Oznámení', [EN]: 'Notification' },
                [MessageSelection.DATASETS]: { [CS]: 'Datasety', [EN]: 'Datasets' },
                [MessageSelection.PLANETS]: { [CS]: 'Planety', [EN]: 'Planets' },
                [MessageSelection.USERS]: { [CS]: 'Uživatelé', [EN]: 'Users' }
            },
    
            messageTag: {
                [MessageTag.NEW_VOLUNTEER]: { [CS]: 'Nový dobrovolník', [EN]: 'New volunteer' },
                [MessageTag.NEW_DATASET]: { [CS]: 'Nový dataset', [EN]: 'New dataset' }
            }
        },
    },

    discovery: {
        tutorial: {
            title: 'Chcete poskytnout výkon svého počítače pro hledání exoplanet?',
            steps: [
                {
                    icon: 'Download.svg',
                    download: 'https://www.google.com',
                    title: 'Stáhněte si program'
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
        stats: {
            join: {
                [CS]: 'Zapojte se do hledání',
                [EN]: 'Join the search'
            },
            remains: { [CS]: 'Zbývá zpracovat', [EN]: 'Remains' },
            data: { [CS]: 'dat', [EN]: 'data' }
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
            },
            pause: { [CS]: 'Pozastavit', [EN]: 'Pause' },
            terminate: { [CS]: 'Ukončit', [EN]: 'Terminate' },
            run: { [CS]: 'Spustit', [EN]: 'Run' },
            analyzedCurves: { [CS]: 'Analyzovaných křivek', [EN]: 'Analyzed curves' },
            discoveredPlanets: { [CS]: 'Objevených planet', [EN]: 'Discovered planets' },
            log: {
                [ProcessLogType.CONNECT]: { [CS]: ['Spojení navázáno (', ').'], [EN]: ['Connection established (', ').'] },
                [ProcessLogType.NO_DATA]: { [CS]: ['Žádná data ke zpracování.'], [EN]: 'No data for processing.' },
                [ProcessLogType.DOWNLOAD_TP]: { [CS]: ['Stahuji target pixel ', '.'], [EN]: ['Downloading target pixel ', '.'] }, 
                [ProcessLogType.ANALYZE_LC]: { [CS]: ['Analyzuji světelnou křivku ', '.'], [EN]: ['Analyzing light curve ', '.'] },
                [ProcessLogType.PLANET_FOUND]: { [CS]: ['Nalezena perioda ', ' d (planeta).'], [EN]: ['Period found ', ' d (planet).'] },
                [ProcessLogType.FALSE_POSITIVE]: { [CS]: ['Nalezena perioda ', ' d (false positive).'], [EN]: ['Period found ', ' d (false positive).'] }
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
    },

    errors: {
        general: { [CS]: 'Nastala chyba', [EN]: 'Error occured' }
    },

    data: {
        paginator: {
            showed: { [CS]: 'Zobrazeno', [EN]: 'Showed' },
            from: { [CS]: 'z', [EN]: 'from' },
            pageSize: { [CS]: 'Velikost stránky', [EN]: 'Page size' }
        }
    }

}

export default strings