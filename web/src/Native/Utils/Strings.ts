export const capitalize = (text: string) => {
    if (!text[0]) {
        return text
    }

    return text[0].toUpperCase() + text.slice(1)
}