import React from 'react'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'

import { useLanguage, useStrings, setLanguage, Language } from '../../Content'

interface Static {

}

interface Props {

}

const HomeView: React.FC<Props> & Static = () => {

    const strings = useStrings().home
    const language = useLanguage()
    const actions = bindActionCreators({ setLanguage }, useDispatch())

    return (
        <>
            Language: {language}
            <br />
            {strings.title}
            <button onClick={() => actions.setLanguage(language === Language.EN ? Language.CS : Language.EN)}>
                {strings.toggle}
            </button>
        </>
    )

}

export default HomeView