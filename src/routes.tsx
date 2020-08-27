import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';

function Routes() {
    return (
        <BrowserRouter>
            <Route component={Home} path='/Ecoleta_Web/' exact></Route>
            <Route component={CreatePoint} path='/Ecoleta_Web/create-point'></Route>
        </BrowserRouter>
    )
}

export default Routes