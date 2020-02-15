import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import { App, HomeView } from './Core'
import { Urls } from './Utils'

render(
    <Router>
        <App>
            <Switch>
                <Route exact path={Urls.HOME} component={HomeView} />
                <Redirect to={Urls.HOME} />
            </Switch>
        </App>
    </Router>, document.getElementById('app')
)

if ((module as any).hot) {
    (module as any).hot.accept()
}