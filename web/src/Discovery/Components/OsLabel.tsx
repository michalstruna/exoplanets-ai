import React from 'react'

import { IconText } from '../../Layout'
import { Strings } from '../../Native'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
    os: string
}

const known = ['windows', 'ubuntu', 'debian', 'macos', 'os x', 'linux']

const getIconName = (os: string) => {
    for (const name of known) {
        if (os.toLowerCase().includes(name)) {
            return Strings.capitalize(name)
        }
    }

    return 'Linux'
}

const OsLabel = ({ os, ...props }: Props) => {

    return (
        <IconText {...props}
            icon={`Discovery/Process/OS/${getIconName(os)}.svg`}
            text='OS'
            value={os}
            title={os}
            size={IconText.MEDIUM} />
    )

}

export default OsLabel