import React from 'react'

import { useLanguage, useStrings, setLanguage, Language, useActions } from '../../Data'
import { Link, Url } from '../../Routing'

const HomeView = () => {

    const strings = useStrings().home
    const language = useLanguage()
    const actions = useActions({ setLanguage })

    return (
        <>
            Language: {language}
            <br />
            <button onClick={() => actions.setLanguage(language === Language.EN ? Language.CS : Language.EN)}>
                {strings.toggle}
            </button>
            <br />
            {strings.title}
            <br />
            <Link pathname={Url.HELP}>
                {strings.help}
            </Link>
        </>
    )

}

export default HomeView