import Axios, { AxiosPromise } from 'axios'
import Url from 'url'
import Cookies from 'js-cookie'

import { Cookie } from '../../Native'
import Config from '../../Async/Constants/Config'
import { Cursor } from '../../Layout'
import { Query } from '../../Routing'

export default class Requests {

    public static get<T>(path: string, query: Record<string, any> = {}, cursor?: Cursor): Promise<T> {
        return this.process<T>(
            Axios.get(
                Url.resolve(Config.apiUrl, path),
                this.getOptions(query, cursor)
            )
        )
    }

    public static post<T>(path: string, body: Record<string, any> = {}, query: Record<string, any> = {}): Promise<T> {
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

    private static getOptions(query: Record<string, any>, cursor?: Cursor): object {
        const identity = Cookies.getJSON(Cookie.IDENTITY.name)
        const finalQuery = {...query}

        if (cursor) {
            finalQuery.sort = cursor.sort.columnName + ',' + ( cursor.sort.isAsc ? 'asc' : 'desc')
        }

        return {
            params: finalQuery,
            headers: { [Config.authHeaderName]: identity ? ('Bearer ' + identity.token) : null }
        }
    }

}