import { Routes, Route, Outlet, Link, useRoutes } from "react-router-dom";

export default function Basic() {
  const routelements = useRoutes([
    {
      element: <BasicLayout />,
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: 'about/*',
          element: <Home />
        },
        {
          path: 'dashboard',
          element: <Dashboard />,
        },
        {
          path: '*',
         element: <NoMatch /> 
        }
      ]
    }
  ])
  return (
    <Routes>
      <Route element={<BasicLayout />}>
        <Route index element={<Home />} />
        <Route path="about/*" element={<About />} />
        <Route path="dashboard" element={<Dashboard />}/>
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  );
}

function BasicLayout() {
  return (
    <div>
      <h1>Welcome to the app!</h1>
      <li>
        <Link to=".">Home</Link>
      </li>
      <li>
        <Link to="about">About</Link>
      </li>
      <li>
        <Link to="dashboard">Dashboard</Link>
      </li>
      <li>
        <Link to="nothing-here">Nothing Here</Link>
      </li>
      <hr />
      <Outlet />
    </div>
  );
}

function Home() {
  return (
    <h2>Home</h2>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
      <Link to='child'>about-child</Link>
      <Routes>
        <Route path='child' element={<AboutChild/>  }/>
      </Routes>
    </div>
  );
}
function AboutChild() {
  return (
    <h2>AboutChild</h2>
  );
}
function Dashboard() {
  return (
    <h2>Dashboard</h2>
  );
}

export function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to=".">Go to the home page</Link>
      </p>
    </div>
  );
}
