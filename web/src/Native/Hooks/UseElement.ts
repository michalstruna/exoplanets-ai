const app = { current: document.querySelector<HTMLElement>('#app')! }
const nav = { current: document.querySelector<HTMLElement>('#nav')! }

const useElement = () => ({ app, nav })

export default useElement