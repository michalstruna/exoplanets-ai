import React from 'react'
import { render } from 'react-dom'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import { Provider } from 'react-redux'

import { App, HomeView, Store } from './Core'
import { History, Url } from './Routing'
import HelpView from './Core/Views/HelpView'

render(
    <Provider store={Store}>
        <Router history={History}>
            <App>
                <Switch>
                    <Route exact path={Url.HOME} component={HomeView} />
                    <Route path={Url.HELP} component={HelpView} />
                    <Redirect to={Url.HOME} />
                </Switch>
            </App>
        </Router>
    </Provider>, document.getElementById('app')
)

if ((module as any).hot) {
    (module as any).hot.accept()
}