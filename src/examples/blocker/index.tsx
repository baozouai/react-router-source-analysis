import { useContext, useEffect, useState, useRef } from "react";
import { Routes, Route, Outlet, Link, UNSAFE_NavigationContext } from "react-router-dom";

export default function Blocker() {
  const [state, setstate] = useState(0)
  const countRef = useRef(0)
  const {navigator} = useContext(UNSAFE_NavigationContext)
  useEffect(() => {
    const unblock  = navigator.block((tx) => {
      // block两次后调用retry和取消block
      if (countRef.current < 2) {
        // retry两次
        countRef.current  = countRef.current + 1
      } else {
        unblock();
        tx.retry()
      }
    })

    const  unListen = navigator.listen((update) => {
      debugger
      console.log(update);
    })
  }, [navigator])
  return (
    <div>
      <button onClick={() => setstate(state => state + 1)}>{state}</button>
      <h1>Welcome to the blocker app!</h1>
      <h2>下面()中的就是真实的Link组件</h2>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
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
            <Link to=".">Home({` <Link to=".">`})</Link>
          </li>
          <li>
            <Link to="about">About({`<Link to="about">`})</Link>
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

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}
