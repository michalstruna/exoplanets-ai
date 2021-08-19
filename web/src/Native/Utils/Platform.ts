const agent = window.navigator.userAgent

export const IS_WINDOWS = agent.includes('Windows') || agent.includes('Win')
export const IS_LINUX = agent.includes('Linux')