/*
 * @Description: 通过嵌套数组形式
 * @Author: Moriaty
 * @Date: 2021-10-28 19:22:14
 * @Last modified by: Moriaty
 * @LastEditTime: 2021-10-28 19:33:35
 */
import { Outlet, Link, useRoutes } from "react-router-dom";

export default function RouteObject() {
  const routeElements = useRoutes([
    {
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: 'about',
          element: <About />,
          children: [
            {
              path: '/about/child',
              element: <AboutChild />
            },
          ]
        },
        {
          path: 'dashboard',
          element: <Dashboard />,
        },
        {
          path: '*',
          element: <NoMatch />,
        },
      ]
    }
  ])
  return (
    <div>
      <h1>Welcome to the app!</h1>
      <h2>下面()中的就是真实的Link组件</h2>
      {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
        {routeElements}
    </div>
  );
}

function Layout() {
  return (
    <div>
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
      <nav>
        <ul>
          <li>
            <Link to={{}}>to current location ({`<Link to={{}}>`})</Link>
          </li>
          <li>
            <Link to="">to current location 1 ({`<Link to="">`})</Link>
          </li>
          <li>
            <Link to={"/auth"}>to auth({`<Link to={"/auth"}>`})</Link>
          </li>
          <li>
            <Link to="../../auth">to auth({`<Link to="../../auth">`})</Link>
          </li>
          <li>
            <Link to=".">Home({` <Link to=".">`})</Link>
          </li>
          <li>
            <Link to="about">About({`<Link to="about">`})</Link>
          </li>
          <li>
            <Link to="dashboard">Dashboard({`<Link to="dashboard">`})</Link>
          </li>
          <li>
            <Link to="nothing-here">Nothing Here({`<Link to="nothing-here">`})</Link>
          </li>
        </ul>
      </nav>

      <hr />

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
    </div>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}
function AboutChild() {
  return (
    <div>
      <h2> About Child</h2>
    </div>
  );
}
function About() {
  return (
    <div>
      <h2>About</h2>
      <Link to="">About({`<Link to="">`})</Link>
      <br />
      <Link to="child">About child({`<Link to="child">`})</Link>
      <Outlet />
    </div>
  );
}
function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to=".">Go to the home page</Link>
      </p>
    </div>
  );
}
