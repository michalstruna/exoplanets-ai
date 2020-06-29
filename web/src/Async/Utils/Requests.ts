import Axios, { AxiosPromise } from 'axios'
import Url from 'url'

import Config from '../../Async/Constants/Config'
import { useIdentity } from '../../User/Redux/Selectors'

export default class Requests {

    public static get<T>(path: string, query: Record<string, any> = {}): Promise<T> {
        return this.process<T>(
            Axios.get(
                Url.resolve(Config.apiUrl, path),
                this.getOptions(query)
            )
        )
    }

    public static post<T>(path: string, body: Record<string, any> = {}, query: Record<string, any> = {}): Promise<T> {
        console.log(Config.apiUrl, path, Url.resolve(Config.apiUrl, path))

        return this.process<T>(
            Axios.post(
                Url.resolve(Config.apiUrl, path),
                body,
                this.getOptions(query)
            )
        )
    }

    public static put<T>(path: string, body: Record<string, any> = {}, query: Record<string, any> = {}): Promise<T> {
        return this.process<T>(
            Axios.put(
                Url.resolve(Config.apiUrl, path),
                body,
                this.getOptions(query)
            )
        )
    }

    public static delete<T>(path: string, query: Record<string, any> = {}): Promise<T> {
        return this.process<T>(
            Axios.delete(
                Url.resolve(Config.apiUrl, path),
                this.getOptions(query)
            )
        )
    }

    private static process<T>(request: AxiosPromise<T>): Promise<T> {
        return new Promise((resolve, reject) => (
            request
                .then(response => resolve(response.data as T))
                .catch(error => reject(error))
        ))
    }

    private static getOptions(query: Record<string, any>): object {
        const identity = null as any//useIdentity()

        return {
            params: query,
            headers: { [Config.authHeaderName]: identity ? identity.authorization : null }
        }
    }

}