import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'
import Login from './login'
import Register from './register'
import Sync from './sync'
import InboundDocs from './inboundDocs'
import FabricBooks from './fabricBooks'
import Colors from './colors'
import SKUCreation from './skucreation'

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to='/login'>Login</Link></li>
            <li><Link to='/register'>Register</Link></li>
            <li><Link to='/logout'>Logout</Link></li>
            <li><Link to='/sync'>Sync</Link></li>
            <li><Link to='/inboundDocs'>Inbound Docs</Link></li>
            <li><Link to='/fabricBooks'>Fabric Books</Link></li>
            <li><Link to='/colors'>Colors</Link></li>
            <li><Link to='/skuCreation'>SKUs</Link></li>
          </ul>
        </nav>

        <Switch>
          <Route path='/login'>
            <Login />
          </Route>
          <Route path='/register'>
            <Register />
          </Route>
          <Route path='/sync'>
            <Sync />
          </Route>
          <Route path='/inboundDocs'>
            <InboundDocs />
          </Route>
          <Route path='/fabricBooks'>
            <FabricBooks />
          </Route>
          <Route path='/colors'>
            <Colors />
          </Route>
          <Route path='/skuCreation'>
            <SKUCreation />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById('approot'))
