export const includeKeys = <Object extends Record<any, any>, Key extends keyof Object>(obj: Object, ...keys: Key[]) => {
    const result = {} as Partial<Object>

    for (const key in obj) {
        if (keys.includes(key as any)) {
            result[key] = obj[key]
        }
    }

    return result
}