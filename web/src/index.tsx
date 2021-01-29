import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import * as serviceWorker from './serviceWorker'
import { App, HelpView, Store } from './Core'
import { History, Redirect, Url } from './Routing'
import { DatabaseView, OverviewView, SystemView } from './Database'
import { DiscoveryView } from './Discovery'
import { SyncView } from './User'
import DbTable from './Database/Constants/DbTable'

ReactDOM.render(
    <Provider store={Store}>
        <Router history={History}>
            <App>
                <Switch>
                    <Route exact path={Url.HOME} component={OverviewView} />
                    <Route path={Url.HELP} component={HelpView} />

                    <Route path={Url.DATABASE + `/:table(${Object.values(DbTable).join('|')})`} component={DatabaseView} />
                    <Redirect path={Url.DATABASE + '/:table?'} to={{ pathname: Url.DATABASE + '/' + DbTable.BODIES}} />

                    <Route path={Url.SYSTEM + '/:system'} component={SystemView} />
                    <Redirect path={Url.SYSTEM} to={{ pathname: Url.DATABASE }} />

                    <Route path={Url.DISCOVERY} component={DiscoveryView} />
                    <Route path={Url.SYNC + '/:clientId'} component={SyncView} />
                    <Redirect to={{ pathname: Url.HOME}} />
                </Switch>
            </App>
        </Router>
    </Provider>, document.getElementById('app')
)

serviceWorker.unregister()
