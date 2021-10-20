import { Routes, Route, Outlet } from 'react-router'
import { Link } from 'react-router-dom'

import Auth from './examples/auth'
import Basic from './examples/basic'
import CustomFilterLink from './examples/custom-filter-link'
import CustomLink from './examples/custom-link'
import Modal from './examples/modal'
import SearchParams from './examples/search-params'
import SSR from './examples/ssr'
import UseRoutes from './examples/use-routes'
import './App.css'
const routeConfigs = [
  {
    path: 'auth',
    Element: Auth,
  },
  {
    path: 'basic',
    Element: Basic,
  },
  {
    path: 'customer-filter-link',
    Element: CustomFilterLink,
  },
  {
    path: 'customer-link',
    Element: CustomLink,
  },
  {
    path: 'modal',
    Element: Modal,
  },
  {
    path: 'search-params',
    Element: SearchParams,
  },
  {
    path: 'ssr',
    Element: SSR,
  },
  {
    path: 'use-routes',
    Element: UseRoutes,
  },
]

function Layout() {
  return (
    <>
      <ul>
        {
          routeConfigs.map(({ path }) => (
            <li key={path}>
              <Link to={`/${path}`}>{path}</Link>
            </li>
          ))
        }
      </ul>
      <hr />
      <Outlet />
    </>
  )
}
function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {
          routeConfigs.map(({ path, Element }) => <Route key={path} path={`${path}/*`} element={<Element />} />)
        }
      </Route>
    </Routes>
  )
}

export default App
