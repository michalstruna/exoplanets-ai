import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import { Provider } from 'react-redux'

import * as serviceWorker from './serviceWorker'
import { App, HelpView, Store } from './Core'
import { History, Url } from './Routing'
import { DatabaseView, OverviewView } from './Database'
import { DiscoveryView } from './Discovery'
import { SyncView } from './User'

ReactDOM.render(
    <Provider store={Store}>
        <Router history={History}>
            <App>
                <Switch>
                    <Route exact path={Url.HOME} component={OverviewView} />
                    <Route path={Url.HELP} component={HelpView} />
                    <Route path={Url.DATABASE} component={DatabaseView} />
                    <Route path={Url.DISCOVERY} component={DiscoveryView} />
                    <Route path={Url.SYNC} component={SyncView} />
                    <Redirect to={Url.HOME} />
                </Switch>
            </App>
        </Router>
    </Provider>, document.getElementById('app')
)

serviceWorker.unregister()
