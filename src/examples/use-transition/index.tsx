import  {
  Suspense,
  // @ts-ignore
  useTransition
} from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Link,
  Navigate,
  useParams
} from "react-router-dom";

import createResource from "./createResource";

const User = createResource((id: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: `User ${id}` });
    }, 4000);
  });
});

function UsersPage() {
  const [startTransition] = useTransition({
    timeoutMs: 2000,
  });

  function enter(id: string) {
    startTransition(() => {
      User.preload(id);
    });
  }

  return (
    <>
      <h1>Users</h1>
      <ul>
        <li><Link to=".">Start page</Link></li>
        <li><Link to="42" onClick={() => enter('42')}>User with id 42</Link></li>
        <li><Link to="1337" onClick={() => enter('1337')}>User with id 1337</Link></li>
      </ul>

      <Suspense fallback={<span>Loading ...</span>}>
        <Outlet />
      </Suspense>
    </>
  );
}

function IndexPage() {
  return (
    <div>Start page</div>
  );
}

function ShowPage() {
  const { id } = useParams<'id'>();
  const user = User.read(id!);

  return (
    <div>User with id {id} named {user.name}</div>
  );
}

export default function App() {
  return (
      <Routes>
        <Route element={<UsersPage />}>
          <Route index element={<IndexPage />} />
          <Route path=":id" element={<ShowPage />} />
        </Route>
      </Routes>
  );
}
