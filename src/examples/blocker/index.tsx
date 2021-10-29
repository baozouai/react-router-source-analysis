/*
 * @Description: block和listen
 * @Author: Moriaty
 * @Date: 2021-10-28 16:08:03
 * @Last modified by: Moriaty
 * @LastEditTime: 2021-10-29 15:42:24
 */
import { useContext, useEffect, useState, useRef } from "react";
import { Routes, Route, Outlet, Link, UNSAFE_NavigationContext } from "react-router-dom";
import ModalImg from './modal.png'

export default function Blocker() {
  const [state, setstate] = useState(0)
  const countRef = useRef(0)
  const {navigator} = useContext(UNSAFE_NavigationContext)
  useEffect(() => {
    const unblock  = navigator.block((tx) => {
      // block两次后调用retry和取消block
      if (countRef.current < 2) {
        countRef.current  = countRef.current + 1
        alert(`再点${3 - countRef.current}次就可以切换路由`)
      } else {
        unblock();
        tx.retry()
      }
    })
    // 注意，Blocker卸载后这里还是会调用一次listen
    const  unListen = navigator.listen((update) => {
      debugger
      console.log(update);
    })

    return unListen
  }, [navigator])
  return (
    <div>
      <button onClick={() => setstate(state => state + 1)}>{state}</button><span>(block时切换路由 state不变)</span>
      <h2>1. 进入页面的时候<span style={{color: 'red'}}>刷新、关闭、修改路由然后enter都会弹窗提示</span></h2>
      <img src={ModalImg} alt="弹窗提示" />
      <h2>2. 进入页面点击<span style={{color: 'red'}}>前进 → 、后退 ← 和切换其他路由都会阻塞(block)，第三次后就不会(unblock)</span></h2>
      <h3>下面()中的就是真实的Link组件</h3>
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
