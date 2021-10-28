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
import Blocker from './examples/blocker'
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
  // {
  //   path: 'customer-filter-link',
  //   Element: CustomFilterLink,
  // },
  // {
  //   path: 'customer-link',
  //   Element: CustomLink,
  // },
  // {
  //   path: 'modal',
  //   Element: Modal,
  // },
  // {
  //   path: 'search-params',
  //   Element: SearchParams,
  // },
  // {
  //   path: 'ssr',
  //   Element: SSR,
  // },
  // {
  //   path: 'use-routes',
  //   Element: UseRoutes,
  // },
  {
    path: 'blocker',
    Element: Blocker,
  },
]

function Layout() {
  debugger
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
  debugger
  return (
    <Routes>
      {/* 注意，这里不是LayoutRoute，因为LayoutRoute只允许element和children,而这里有path */}
      <Route path='/' element={<Layout />}> 
        {
          routeConfigs.map(({ path, Element }) => <Route key={path} path={`${path}/*`} element={<Element />} />)
        }
      </Route>
    </Routes>
  )
  ///////////////////////////////////////////////////////////////////////////////
  // src/App.tsx
  ///////////////////////////////////////////////////////////////////////////////
  // 如果当前路径为http://localhost:3000/basic/about, 那么剩下最终生成的就是下面这个
  // return (
  //   <RouteContext.Provider
  //     value={{
  //       matches: parentMatches.concat(matches.slice(0, 1)),
  //       outlet: (
  //       <RouteContext.Provider
  //         value={{
  //           matches: parentMatches.concat(matches.slice(0, 2)),
  //           outlet: null // 第一次outlet为null,
  //         }}
  //       >
  //         {<Basic />}
  //       </RouteContext.Provider>
  //     ),
  //     }}
  //   >
  //     <ul>
  //       <li>
  //         <Link to='/auth'>auth</Link>
  //       </li>
  //       <li>
  //         <Link to='/basic'>basic</Link>
  //       </li>
  //     </ul>
  //     <hr />
  //     <Outlet /> // 这里的<Outlet />就是第一层RouteContext.Provider的outlet，即第二个RouteContext.Provider
  //   </RouteContext.Provider>
  // )
  
  ///////////////////////////////////////////////////////////////////////////////
  // src/examples/basic/index.tsx
  ///////////////////////////////////////////////////////////////////////////////
  // 接着上面再render <Basic />，那么最终得到下面的

  // return (
  //   <RouteContext.Provider
  //     value={{
  //       matches: parentMatches.concat(matches.slice(0, 1)),
  //       outlet: (
  //       <RouteContext.Provider
  //         value={{
  //           matches: parentMatches.concat(matches.slice(0, 2)),
  //           outlet: null // 第一次outlet为null,
  //         }}
  //       >
  //         {<Basic />}
  //       </RouteContext.Provider>
  //     ),
  //     }}
  //   >
  //     <ul>
  //       <li>
  //         <Link to='/auth'>auth</Link>
  //       </li>
  //       <li>
  //         <Link to='/basic'>basic</Link>
  //       </li>
  //     </ul>
  //     <hr />
  ///////////////////////////////////////////////////////////////////////////////
  // <Basic /> start
  ///////////////////////////////////////////////////////////////////////////////
  //       <RouteContext.Provider
  //         value={{
  //           matches: parentMatches.concat(matches.slice(0, 2)),
  //           outlet: null // 第一次outlet为null,
  //         }}
  //       >
  //           <div>
  //             <h1>Welcome to the app!</h1>
  //             <h2>下面()中的就是真实的Link组件</h2>
  //              <RouteContext.Provider
  //                value={{
  //                  matches: parentMatches.concat(matches.slice(0, 1)),
  //                  outlet: (
  //                  <RouteContext.Provider
  //                    value={{
  //                      matches: parentMatches.concat(matches.slice(0:2)),
  //                      outlet: null // 第一次outlet为null,
  //                    }}
  //                  >
  //                    {<About />}
  //                  </RouteContext.Provider>
  //                ),
  //                }}
  //              >
  ///////////////////////////////////////////////////////////////////////////////
  // src/examples/basic/index.tsx 中的 <Layout /> start
  ///////////////////////////////////////////////////////////////////////////////
  //                 <div>
  //                   <nav>
  //                     <ul>
  //                       <li>
  //                         <Link to={{}}>to current location ({`<Link to={{}}>`})</Link>
  //                       </li>
  //                       <li>
  //                         <Link to="">to current location 1 ({`<Link to="">`})</Link>
  //                       </li>
  //                       ...
  //                     </ul>
  //                   </nav>
  //                   <hr />
  ///////////////////////////////////////////////////////////////////////////////
  // src/examples/basic/index.tsx 中的 <About /> start
  ///////////////////////////////////////////////////////////////////////////////
  //                   <div>
  //                     <h2>About</h2>
  //                   </div>
  ///////////////////////////////////////////////////////////////////////////////
  // src/examples/basic/index.tsx 中的 <About /> end
  ///////////////////////////////////////////////////////////////////////////////
  //                 </div>
  ///////////////////////////////////////////////////////////////////////////////
  // src/examples/basic/index.tsx 中的 <Layout /> end
  ///////////////////////////////////////////////////////////////////////////////
  //              </RouteContext.Provider>
  //           </div>
  //       </RouteContext.Provider>
  ///////////////////////////////////////////////////////////////////////////////
  // <Basic /> end
  ///////////////////////////////////////////////////////////////////////////////
  //   </RouteContext.Provider>
  // )
  
}

export default App
