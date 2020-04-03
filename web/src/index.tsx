import React from 'react'
import { render } from 'react-dom'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import { Provider } from 'react-redux'

import { App, HelpView, HomeView, Store } from './Core'
import { History, Url } from './Routing'
import { AIView, DatabaseView, OverviewView } from './Universe'

render(
    <Provider store={Store}>
        <Router history={History}>
            <App>
                <Switch>
                    <Route exact path={Url.HOME} component={HomeView} />
                    <Route path={Url.HELP} component={HelpView} />
                    <Route path={Url.DATABASE} component={DatabaseView} />
                    <Route path={Url.AI} component={AIView} />
                    <Redirect to={Url.HOME} />
                </Switch>
            </App>
        </Router>
    </Provider>, document.getElementById('app')
)

if ((module as any).hot) {
    (module as any).hot.accept()
}