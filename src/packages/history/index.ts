/**
 * Actions represent the type of change to a location value.
 *
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#action
 */
export enum Action {
  /**
   * A POP indicates a change to an arbitrary index in the history stack, such
   * as a back or forward navigation. It does not describe the direction of the
   * navigation, only that the current index changed.
   *
   * Note: This is the default action for newly created history objects.
   */
  Pop = 'POP',

  /**
   * A PUSH indicates a new entry being added to the history stack, such as when
   * a link is clicked and a new page loads. When this happens, all subsequent
   * entries in the stack are lost.
   */
  Push = 'PUSH',

  /**
   * A REPLACE indicates the entry at the current index in the history stack
   * being replaced by a new one.
   */
  Replace = 'REPLACE'
}

/**
 * A URL pathname, beginning with a /.
 *
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.pathname
 */
export type Pathname = string;

/**
 * A URL search string, beginning with a ?.
 *
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.search
 */
export type Search = string;

/**
 * A URL fragment identifier, beginning with a #.
 *
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.hash
 */
export type Hash = string;

/**
 * An object that is used to associate some arbitrary data with a location, but
 * that does not appear in the URL path.
 *
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.state
 */
export type State = object | null;

/**
 * A unique string associated with a location. May be used to safely store
 * and retrieve data in some other storage API, like `localStorage`.
 *
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.key
 */
export type Key = string;

/**
 * The pathname, search, and hash values of a URL.
 */
export interface Path {
  /**
   * A URL pathname, beginning with a /.
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.pathname
   */
  pathname: Pathname;

  /**
   * A URL search string, beginning with a ?.
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.search
   */
  search: Search;

  /**
   * A URL fragment identifier, beginning with a #.
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.hash
   */
  hash: Hash;
}

/**
 * An entry in a history stack. A location contains information about the
 * URL path, as well as possibly some arbitrary state and a key.
 *
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location
 */
export interface Location<S extends State = State> extends Path {
  /**
   * An object of arbitrary data associated with this location.
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.state
   */
  state: S;

  /**
   * A unique string associated with this location. May be used to safely store
   * and retrieve data in some other storage API, like `localStorage`.
   *
   * Note: This value is always "default" on the initial location.
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.key
   */
  key: Key;
}

/**
 * A partial Path object that may be missing some properties.
 */
export type PartialPath = Partial<Path>;

/**
 * A partial Location object that may be missing some properties.
 */
export type PartialLocation = Partial<Location>;

/**
 * A change to the current location.
 */
export interface Update<S extends State = State> {
  /**
   * The action that triggered the change.
   */
  action: Action;

  /**
   * The new location.
   */
  location: Location<S>;
}

/**
 * A function that receives notifications about location changes.
 */
export interface Listener<S extends State = State> {
  (update: Update<S>): void;
}

/**
 * A change to the current location that was blocked. May be retried
 * after obtaining user confirmation.
 */
export interface Transition<S extends State = State> extends Update<S> {
  /**
   * Retries the update to the current location.
   */
  retry(): void;
}

/**
 * A function that receives transitions when navigation is blocked.
 */
export interface Blocker<S extends State = State> {
  (tx: Transition<S>): void;
}

/**
 * Describes a location that is the destination of some navigation, either via
 * `history.push` or `history.replace`. May be either a URL or the pieces of a
 * URL path.
 */
export type To = string | PartialPath;

/**
 * A history is an interface to the navigation stack. The history serves as the
 * source of truth for the current location, as well as provides a set of
 * methods that may be used to change it.
 *
 * It is similar to the DOM's `window.history` object, but with a smaller, more
 * focused API.
 */
export interface History<S extends State = State> {
  /**
   * The last action that modified the current location. This will always be
   * Action.Pop when a history instance is first created. This value is mutable.
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#history.action
   */
  readonly action: Action;

  /**
   * The current location. This value is mutable.
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#history.location
   */
  readonly location: Location<S>;

  /**
   * @description 返回一个新的href, to为string则返回to，否则返回 `createPath(to)` => pathname + search + hash
   * 
   * Returns a valid href for the given `to` value that may be used as
   * the value of an <a href> attribute.
   *
   * @param to - The destination URL
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#history.createHref
   */
  createHref(to: To): string;

  /**
   * Pushes a new location onto the history stack, increasing its length by one.
   * If there were any entries in the stack after the current one, they are
   * lost.
   *
   * @param to - The new URL
   * @param state - Data to associate with the new location
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#history.push
   */
  push(to: To, state?: S): void;

  /**
   * Replaces the current location in the history stack with a new one.  The
   * location that was replaced will no longer be available.
   *
   * @param to - The new URL
   * @param state - Data to associate with the new location
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#history.replace
   */
  replace(to: To, state?: S): void;

  /**
   * Navigates `n` entries backward/forward in the history stack relative to the
   * current index. For example, a "back" navigation would use go(-1).
   *
   * @param delta - The delta in the stack index
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#history.go
   */
  go(delta: number): void;

  /**
   * Navigates to the previous entry in the stack. Identical to go(-1).
   *
   * Warning: if the current location is the first location in the stack, this
   * will unload the current document.
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#history.back
   */
  back(): void;

  /**
   * Navigates to the next entry in the stack. Identical to go(1).
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#history.forward
   */
  forward(): void;

  /**
   * Sets up a listener that will be called whenever the current location
   * changes.
   *
   * @param listener - A function that will be called when the location changes
   * @returns unlisten - A function that may be used to stop listening
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#history.listen
   */
  listen(listener: Listener<S>): () => void;

  /**
   * Prevents the current location from changing and sets up a listener that
   * will be called instead.
   *
   * @param blocker - A function that will be called when a transition is blocked
   * @returns unblock - A function that may be used to stop blocking
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#history.block
   */
  block(blocker: Blocker<S>): () => void;
}

/**
 * A browser history stores the current location in regular URLs in a web
 * browser environment. This is the standard for most web apps and provides the
 * cleanest URLs the browser's address bar.
 *
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#browserhistory
 */
export interface BrowserHistory<S extends State = State> extends History<S> {}

/**
 * A hash history stores the current location in the fragment identifier portion
 * of the URL in a web browser environment.
 *
 * This is ideal for apps that do not control the server for some reason
 * (because the fragment identifier is never sent to the server), including some
 * shared hosting environments that do not provide fine-grained controls over
 * which pages are served at which URLs.
 *
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#hashhistory
 */
export interface HashHistory<S extends State = State> extends History<S> {}

/**
 * A memory history stores locations in memory. This is useful in stateful
 * environments where there is no web browser, such as node tests or React
 * Native.
 *
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#memoryhistory
 */
export interface MemoryHistory<S extends State = State> extends History<S> {
  index: number;
}

const readOnly: <T extends unknown>(obj: T) => T = obj => obj;

function warning(cond: boolean, message: string) {
  if (!cond) {
    // eslint-disable-next-line no-console
    if (typeof console !== 'undefined') console.warn(message);

    try {
      // Welcome to debugging history!
      //
      // This error is thrown as a convenience so you can more easily
      // find the source for a warning that appears in the console by
      // enabling "pause on exceptions" in your JavaScript debugger.
      throw new Error(message);
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}

////////////////////////////////////////////////////////////////////////////////
// BROWSER
////////////////////////////////////////////////////////////////////////////////

type HistoryState = {
  usr: State;
  key?: string;
  idx: number;
};

const BeforeUnloadEventType = 'beforeunload';
const HashChangeEventType = 'hashchange';
const PopStateEventType = 'popstate';

export type BrowserHistoryOptions = { window?: Window };

/**
 * Browser history stores the location in regular URLs. This is the standard for
 * most web apps, but it requires some configuration on the server to ensure you
 * serve the same app at multiple URLs.
 *
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#createbrowserhistory
 */
export function createBrowserHistory(
  options: BrowserHistoryOptions = {}
): BrowserHistory {
  // 默认值是document.defaultView，即浏览器的window
  const { window = document.defaultView! } = options;
  const globalHistory = window.history;
  /** 获取索引和当前location */
  function getIndexAndLocation(): [number, Location] {
    const { pathname, search, hash } = window.location;
    const state = globalHistory.state || {};
    return [
      state.idx,
      readOnly<Location>({
        pathname,
        search,
        hash,
        state: state.usr || null,
        key: state.key || 'default'
      })
    ];
  }
  /** 用于存储下面的 blockers.call方法的参数，有 { action,location,retry }  */
  let blockedPopTx: Transition | null = null;
  /** popstate的回调, 点击浏览器 ← 或 → 会触发 */
  function handlePop() {
    debugger
    // 第一次进来没有值，然后下面的else判断到有blockers.length就会赋值，之后判断到if (delta)就好调用go(delta)，
    // 就会再次触发handlePop，然后这里满足条件进入blockers.call(blockedPopTx)
    if (blockedPopTx) {
      // 如果参数有值，那么将参数传给blockers中的handlers
      blockers.call(blockedPopTx);
      // 然后参数置空
      blockedPopTx = null;
    } else {
      // 为空的话，给blockPopTx赋值
      // 因为是popstate，那么这里的nextAction就是pop了
      const nextAction = Action.Pop;
      // 点击浏览器前进或后退后的state.idx和location
      // 比如/basic/about的index = 2, 点击后退后就会触发handlePop，后退后的nextLocation.pathname = /basic, nextIndex = 1
      const [nextIndex, nextLocation] = getIndexAndLocation();

      if (blockers.length) {
        if (nextIndex != null) {
          // 这里的index是上一次的getIndexAndLocation得到了，下面有
          // 从上面例子 delta = index - nextIndex = 2 - 1 = 1
          const delta = index - nextIndex;
          if (delta) {
            // Revert the POP
            blockedPopTx = {
              action: nextAction,
              location: nextLocation,
              retry() {
                // 由于下面的go(delta)阻塞了当前页面的变化，那么retry就可以让页面真正符合浏览器行为的变化了
                // 这个在blocker回调中可以调用
                go(delta * -1);
              }
            };
            // 上面/basic/about => /basic，delta为1，那么go(1)就又到了/basic/about
            // 此处是真正触发前进后退时保持当前location不变的关键所在
            // 还有需要特别注意一点的是，这里调用go后又会触发handleProp，那么if (blockedPopTx)就为true了，那么
            // 就会调用blockers.call(blockedPopTx)，blocer可以根据blockedPopTx的retry看是否允许跳转页面，然后再把blockedPopTx = null
            go(delta);
          }
        } else {
          // Trying to POP to a location with no index. We did not create
          // this location, so we can't effectively block the navigation.
          warning(
            false,
            // TODO: Write up a doc that explains our blocking strategy in
            // detail and link to it here so people can understand better what
            // is going on and how to avoid it.
            `You are trying to block a POP navigation to a location that was not ` +
              `created by the history library. The block will fail silently in ` +
              `production, but in general you should do all navigation with the ` +
              `history library (instead of using window.history.pushState directly) ` +
              `to avoid this situation.`
          );
        }
      } else {
        // blockers为空，那么赋值新的action，然后获取新的index和location，然后
        // 将action, location作为参数消费listeners
        applyTx(nextAction);
      }
    }
  }
  /**
   * 监听popstate
   * 调用history.pushState()或history.replaceState()不会触发popstate事件。
   * 只有在做出浏览器动作时，才会触发该事件，如用户点击浏览器的前进、后退按钮、在Javascript代码中调用history.back()
   * 、history.forward()、history.go方法,此外，a 标签的锚点也会触发该事件
   * 
   * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Window/popstate_event
   */
  window.addEventListener(PopStateEventType, handlePop);

  let action = Action.Pop;
  // createBrowserHistory创建的时候获取初始当前路径index和location
  let [index, location] = getIndexAndLocation();
  // blockers不为空的话listeners不会触发
  const listeners = createEvents<Listener>();
  const blockers = createEvents<Blocker>();

  if (index == null) {
    // 初始index为空，那么给个0
    index = 0;
    // 这里replaceState后，history.state.idx就为0了
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, '');
  }
  /** 返回一个新的href, to为string则返回to，否则返回 `createPath(to)` => pathname + search + hash */
  function createHref(to: To) {
    return typeof to === 'string' ? to : createPath(to);
  }
  /**
   * @description 获取新的Location
   * @param to 新的path
   * @param state 状态
   */
  function getNextLocation(to: To, state: State = null): Location {
    return readOnly<Location>({
      ...location,
      ...(typeof to === 'string' ? parsePath(to) : to),
      state,
      key: createKey()
    });
  }
  /** 获取state和url */
  function getHistoryStateAndUrl(
    nextLocation: Location,
    index: number
  ): [HistoryState, string] {
    return [
      {
        usr: nextLocation.state,
        key: nextLocation.key,
        idx: index
      },
      createHref(nextLocation)
    ];
  }
  /** 
   * @description 判断是否允许路由切换，有blockers就不允许
   * 
   * - blockers有handlers，那么消费handlers，然后返回false
   * - blockers没有handlers，返回true
   *  */
  function allowTx(action: Action, location: Location, retry: () => void): boolean {
    return (
      !blockers.length || (blockers.call({ action, location, retry }), false)
    );
  }
  /** blocker为空才执行所有的listener, handlePop、push、replace都会调用 */
  function applyTx(nextAction: Action) {
    debugger
    action = nextAction;
  //  获取当前index和location
    [index, location] = getIndexAndLocation();
    listeners.call({ action, location });
  }
  /** history.push,跳到哪个页面 */
  function push(to: To, state?: State) {
    debugger
    const nextAction = Action.Push;
    const nextLocation = getNextLocation(to, state);
    /**
     * retry的目的是为了如果有blockers可以在回调中调用
     * @example
     * const { navigator } = useContext(UNSAFE_NavigationContext)
     * const countRef = useRef(0)
     * useEffect(() => {
     *   const unblock  = navigator.block((tx) => {
     *     // block两次后调用retry和取消block
     *     if (countRef.current < 2) {
     *       countRef.current  = countRef.current + 1
     *     } else {
     *       unblock();
     *       tx.retry()
     *     }
     *   })
     * }, [navigator])
     * 
     * 当前路径为/blocker
     * 点击<Link to="about">About({`<Link to="about">`})</Link>
     * 第三次(countRef.current >= 2)因为unblock了，随后调用rety也就是push(to, state)判断到下面的allowTx返回true，
     * 就成功pushState了，push到/blocker/about了
     */
    function retry() {
      push(to, state);
    }
    // 只要blockers不为空下面就进不去
    // 但是blockers回调里可以unblock(致使blockers.length = 0),然后再调用retry，那么又会重新进入这里，
    // 就可以调用下面的globalHistory改变路由了
    if (allowTx(nextAction, nextLocation, retry)) {
      const [historyState, url] = getHistoryStateAndUrl(nextLocation, index + 1);

      // TODO: Support forced reloading
      // try...catch because iOS limits us to 100 pushState calls :/
      // 用try  catch的原因是因为ios限制了100次pushState的调用
      try {
        globalHistory.pushState(historyState, '', url);
      } catch (error) {
        // They are going to lose state here, but there is no real
        // way to warn them about it since the page will refresh...
        window.location.assign(url);
      }

      applyTx(nextAction);
    }
  }

  function replace(to: To, state?: State) {
    const nextAction = Action.Replace;
    const nextLocation = getNextLocation(to, state);
    /**
     * retry的目的是为了如果有blockers可以在回调中调用
     * @example
     * const { navigator } = useContext(UNSAFE_NavigationContext)
     * const countRef = useRef(0)
     * useEffect(() => {
     *   const unblock  = navigator.block((tx) => {
     *     // block两次后调用retry和取消block
     *     if (countRef.current < 2) {
     *       countRef.current  = countRef.current + 1
     *     } else {
     *       unblock();
     *       tx.retry()
     *     }
     *   })
     * }, [navigator])
     * 
     * 当前路径为/blocker
     * 点击<Link to="about">About({`<Link to="about">`})</Link>
     * 第三次(countRef.current >= 2)因为unblock了，随后调用rety也就是push(to, state)判断到下面的allowTx返回true，
     * 就成功pushState了，push到/blocker/about了
     */
    function retry() {
      replace(to, state);
    }
    // 只要blockers不为空下面就进不去
    // 但是blockers回调里可以unblock(致使blockers.length = 0),然后再调用retry，那么又会重新进入这里，
    // 就可以调用下面的globalHistory改变路由了
    if (allowTx(nextAction, nextLocation, retry)) {
      const [historyState, url] = getHistoryStateAndUrl(nextLocation, index);

      // TODO: Support forced reloading
      globalHistory.replaceState(historyState, '', url);

      applyTx(nextAction);
    }
  }
  /** eg: go(-1)，返回上一个路由，go(1),进入下一个路由 */
  function go(delta: number) {
    globalHistory.go(delta);
  }
  // 这里创建一个新的history
  const history: BrowserHistory = {
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref,
    push,
    replace,
    go,
    back() {
      go(-1);
    },
    forward() {
      go(1);
    },
    listen(listener) {
      return listeners.push(listener);
    },
    block(blocker) {
      // push后返回unblock，即把该blocker从blockers去掉
      const unblock = blockers.push(blocker);

      if (blockers.length === 1) {
        // beforeunload
        // 只在第一次block加上beforeunload事件
        window.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
      }

      return function() {
        unblock();
        // 移除beforeunload事件监听器以便document在pagehide事件中仍可以使用
        // Remove the beforeunload listener so the document may
        // still be salvageable in the pagehide event.
        // See https://html.spec.whatwg.org/#unloading-documents
        if (!blockers.length) {
          // 移除的时候发现blockers空了那么就移除`beforeunload`事件
          window.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
        }
      };
    }
  };

  return history;
}

////////////////////////////////////////////////////////////////////////////////
// HASH
////////////////////////////////////////////////////////////////////////////////

export type HashHistoryOptions = { window?: Window };

/**
 * Hash history stores the location in window.location.hash. This makes it ideal
 * for situations where you don't want to send the location to the server for
 * some reason, either because you do cannot configure it or the URL space is
 * reserved for something else.
 *
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#createhashhistory
 */
export function createHashHistory(
  options: HashHistoryOptions = {}
): HashHistory {
  const { window = document.defaultView! } = options;
  const globalHistory = window.history;

  function getIndexAndLocation(): [number, Location] {
    const { pathname = '/', search = '', hash = '' } = parsePath(
      window.location.hash.substr(1)
    );
    const state = globalHistory.state || {};
    return [
      state.idx,
      readOnly<Location>({
        pathname,
        search,
        hash,
        state: state.usr || null,
        key: state.key || 'default'
      })
    ];
  }

  let blockedPopTx: Transition | null = null;
  function handlePop() {
    debugger
    if (blockedPopTx) {
      blockers.call(blockedPopTx);
      blockedPopTx = null;
    } else {
      const nextAction = Action.Pop;
      const [nextIndex, nextLocation] = getIndexAndLocation();

      if (blockers.length) {
        if (nextIndex != null) {
          const delta = index - nextIndex;
          if (delta) {
            // Revert the POP
            blockedPopTx = {
              action: nextAction,
              location: nextLocation,
              retry() {
                go(delta * -1);
              }
            };

            go(delta);
          }
        } else {
          // Trying to POP to a location with no index. We did not create
          // this location, so we can't effectively block the navigation.
          warning(
            false,
            // TODO: Write up a doc that explains our blocking strategy in
            // detail and link to it here so people can understand better
            // what is going on and how to avoid it.
            `You are trying to block a POP navigation to a location that was not ` +
              `created by the history library. The block will fail silently in ` +
              `production, but in general you should do all navigation with the ` +
              `history library (instead of using window.history.pushState directly) ` +
              `to avoid this situation.`
          );
        }
      } else {
        applyTx(nextAction);
      }
    }
  }

  window.addEventListener(PopStateEventType, handlePop);

  // popstate does not fire on hashchange in IE 11 and old (trident) Edge
  // https://developer.mozilla.org/de/docs/Web/API/Window/popstate_event
  window.addEventListener(HashChangeEventType, () => {
    const [, nextLocation] = getIndexAndLocation();

    // Ignore extraneous hashchange events.
    if (createPath(nextLocation) !== createPath(location)) {
      handlePop();
    }
  });

  let action = Action.Pop;
  let [index, location] = getIndexAndLocation();
  // blockers不为空的话listeners不会触发
  const listeners = createEvents<Listener>();
  const blockers = createEvents<Blocker>();

  if (index == null) {
    index = 0;
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, '');
  }

  function getBaseHref() {
    const base = document.querySelector('base');
    let href = '';

    if (base && base.getAttribute('href')) {
      const url = window.location.href;
      const hashIndex = url.indexOf('#');
      // 有hash的话去掉#及其之后的
      href = hashIndex === -1 ? url : url.slice(0, hashIndex);
    }

    return href;
  }

  function createHref(to: To) {
    return getBaseHref() + '#' + (typeof to === 'string' ? to : createPath(to));
  }

  function getNextLocation(to: To, state: State = null): Location {
    return readOnly<Location>({
      ...location,
      ...(typeof to === 'string' ? parsePath(to) : to),
      state,
      key: createKey()
    });
  }

  function getHistoryStateAndUrl(
    nextLocation: Location,
    index: number
  ): [HistoryState, string] {
    return [
      {
        usr: nextLocation.state,
        key: nextLocation.key,
        idx: index
      },
      createHref(nextLocation)
    ];
  }

  function allowTx(action: Action, location: Location, retry: () => void) {
    return (
      !blockers.length || (blockers.call({ action, location, retry }), false)
    );
  }

  function applyTx(nextAction: Action) {
    action = nextAction;
    [index, location] = getIndexAndLocation();
    listeners.call({ action, location });
  }

  function push(to: To, state?: State) {
    debugger
    const nextAction = Action.Push;
    const nextLocation = getNextLocation(to, state);
    // retry的目的是为了如果有blockers可以在回调中调用
    /**
     * @example
     * const { navigator } = useContext(UNSAFE_NavigationContext)
     * const countRef = useRef(0)
     * useEffect(() => {
     *   const unblock  = navigator.block((tx) => {
     *     // block两次后调用retry和取消block
     *     if (countRef.current < 2) {
     *       countRef.current  = countRef.current + 1
     *     } else {
     *       unblock();
     *       tx.retry()
     *     }
     *   })
     * }, [navigator])
     * 
     * 当前路径为/blocker
     * 点击<Link to="about">About({`<Link to="about">`})</Link>
     * 第三次因为unblock了，随后调用rety也就是push(to, state)判断到下面的allowTx返回true，
     * 就成功pushState了，push到/blocker/about了
     */
    function retry() {
      push(to, state);
    }

    warning(
      nextLocation.pathname.charAt(0) === '/',
      `Relative pathnames are not supported in hash history.push(${JSON.stringify(
        to
      )})`
    );
    // 只要blockers不为空下面就进不去
    // 但是blockers回调里可以unblock(致使blockers.length = 0),然后再调用retry，那么又会重新进入这里，
    // 就可以调用下面的globalHistory改变路由了
    if (allowTx(nextAction, nextLocation, retry)) {
      const [historyState, url] = getHistoryStateAndUrl(nextLocation, index + 1);

      // TODO: Support forced reloading
      // try...catch because iOS limits us to 100 pushState calls :/
      try {
        globalHistory.pushState(historyState, '', url);
      } catch (error) {
        // They are going to lose state here, but there is no real
        // way to warn them about it since the page will refresh...
        window.location.assign(url);
      }

      applyTx(nextAction);
    }
  }

  function replace(to: To, state?: State) {
    const nextAction = Action.Replace;
    const nextLocation = getNextLocation(to, state);
    function retry() {
      replace(to, state);
    }

    warning(
      nextLocation.pathname.charAt(0) === '/',
      `Relative pathnames are not supported in hash history.replace(${JSON.stringify(
        to
      )})`
    );
    // 只要blockers不为空下面就进不去
    // 但是blockers回调里可以unblock(致使blockers.length = 0),然后再调用retry，那么又会重新进入这里，
    // 就可以调用下面的globalHistory改变路由了
    if (allowTx(nextAction, nextLocation, retry)) {
      const [historyState, url] = getHistoryStateAndUrl(nextLocation, index);

      // TODO: Support forced reloading
      globalHistory.replaceState(historyState, '', url);

      applyTx(nextAction);
    }
  }

  function go(delta: number) {
    globalHistory.go(delta);
  }

  const history: HashHistory = {
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref,
    push,
    replace,
    go,
    back() {
      go(-1);
    },
    forward() {
      go(1);
    },
    listen(listener) {
      return listeners.push(listener);
    },
    block(blocker) {
      const unblock = blockers.push(blocker);

      if (blockers.length === 1) {
        window.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
      }

      return function() {
        unblock();

        // Remove the beforeunload listener so the document may
        // still be salvageable in the pagehide event.
        // See https://html.spec.whatwg.org/#unloading-documents
        if (!blockers.length) {
          // 移除的时候发现blockers空了那么就移除`beforeunload`事件
          window.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
        }
      };
    }
  };

  return history;
}

////////////////////////////////////////////////////////////////////////////////
// MEMORY
////////////////////////////////////////////////////////////////////////////////

/**
 * A user-supplied object that describes a location. Used when providing
 * entries to `createMemoryHistory` via its `initialEntries` option.
 */
export type InitialEntry = string | PartialLocation;

export type MemoryHistoryOptions = {
  initialEntries?: InitialEntry[];
  initialIndex?: number;
};

/**
 * Memory history stores the current location in memory. It is designed for use
 * in stateful non-browser environments like tests and React Native.
 *
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#creatememoryhistory
 */
export function createMemoryHistory(
  options: MemoryHistoryOptions = {}
): MemoryHistory {
  const { initialEntries = ['/'], initialIndex } = options;
  const entries: Location[] = initialEntries.map(entry => {
    const location = readOnly<Location>({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: createKey(),
      ...(typeof entry === 'string' ? parsePath(entry) : entry)
    });

    warning(
      location.pathname.charAt(0) === '/',
      `Relative pathnames are not supported in createMemoryHistory({ initialEntries }) (invalid entry: ${JSON.stringify(
        entry
      )})`
    );

    return location;
  });
  let index = clamp(
    initialIndex == null ? entries.length - 1 : initialIndex,
    0,
    entries.length - 1
  );

  let action = Action.Pop;
  let location = entries[index];
  const listeners = createEvents<Listener>();
  const blockers = createEvents<Blocker>();

  function createHref(to: To) {
    return typeof to === 'string' ? to : createPath(to);
  }

  function getNextLocation(to: To, state: State = null): Location {
    return readOnly<Location>({
      ...location,
      ...(typeof to === 'string' ? parsePath(to) : to),
      state,
      key: createKey()
    });
  }

  function allowTx(action: Action, location: Location, retry: () => void) {
    return (
      !blockers.length || (blockers.call({ action, location, retry }), false)
    );
  }

  function applyTx(nextAction: Action, nextLocation: Location) {
    action = nextAction;
    location = nextLocation;
    listeners.call({ action, location });
  }

  function push(to: To, state?: State) {
    const nextAction = Action.Push;
    const nextLocation = getNextLocation(to, state);
    function retry() {
      push(to, state);
    }

    warning(
      location.pathname.charAt(0) === '/',
      `Relative pathnames are not supported in memory history.push(${JSON.stringify(
        to
      )})`
    );

    if (allowTx(nextAction, nextLocation, retry)) {
      index += 1;
      entries.splice(index, entries.length, nextLocation);
      applyTx(nextAction, nextLocation);
    }
  }

  function replace(to: To, state?: State) {
    const nextAction = Action.Replace;
    const nextLocation = getNextLocation(to, state);
    function retry() {
      replace(to, state);
    }

    warning(
      location.pathname.charAt(0) === '/',
      `Relative pathnames are not supported in memory history.replace(${JSON.stringify(
        to
      )})`
    );

    if (allowTx(nextAction, nextLocation, retry)) {
      entries[index] = nextLocation;
      applyTx(nextAction, nextLocation);
    }
  }

  function go(delta: number) {
    const nextIndex = clamp(index + delta, 0, entries.length - 1);
    const nextAction = Action.Pop;
    const nextLocation = entries[nextIndex];
    function retry() {
      go(delta);
    }

    if (allowTx(nextAction, nextLocation, retry)) {
      index = nextIndex;
      applyTx(nextAction, nextLocation);
    }
  }

  const history: MemoryHistory = {
    get index() {
      return index;
    },
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref,
    push,
    replace,
    go,
    back() {
      go(-1);
    },
    forward() {
      go(1);
    },
    listen(listener) {
      return listeners.push(listener);
    },
    block(blocker) {
      return blockers.push(blocker);
    }
  };

  return history;
}

////////////////////////////////////////////////////////////////////////////////
// UTILS
////////////////////////////////////////////////////////////////////////////////

function clamp(n: number, lowerBound: number, upperBound: number) {
  return Math.min(Math.max(n, lowerBound), upperBound);
}
/** 刷新、修改路径然后enter、关闭页面前都会弹窗询问 */
function promptBeforeUnload(event: BeforeUnloadEvent) {
  // Cancel the event.
  event.preventDefault();
  // Chrome (and legacy IE) requires returnValue to be set.
  event.returnValue = '';
}

type Events<F> = {
  length: number;
  push: (fn: F) => () => void;
  call: (arg: any) => void;
};

function createEvents<F extends Function>(): Events<F> {
  let handlers: F[] = [];

  return {
    get length() {
      return handlers.length;
    },
    push(fn: F) {
      // 其实就是一个观察者模式，push后返回unsubscribe
      handlers.push(fn);
      return function() {
        handlers = handlers.filter(handler => handler !== fn);
      };
    },
    call(arg) {
      debugger
      // 消费所有handle
      handlers.forEach(fn => fn && fn(arg));
    }
  };
}
/** `Math.random().toString(36)`返回类似 `0.txwl3yylcrc`，那么substr就是类似 `txwl3yyl`(createKey的结果) */
function createKey() {
  return Math.random()
    .toString(36)
    .substr(2, 8);
}

/**
 * Creates a string URL path from the given pathname, search, and hash components.
 * @return pathname + search + hash
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#createpath
 */
export function createPath({
  pathname = '/',
  search = '',
  hash = ''
}: PartialPath) {
  return pathname + search + hash;
  // 这里是否需要去掉尾部的'/' ?? 
  // eg: pathname = '/basic/' search = '', hash = ''
  // pathname + search + hash = '/basic/'
  // (pathname + search + hash).replace(/\/$/, '') = '/basic'
  // return (pathname + search + hash).replace(/\/$/, '');
}

/**
 * Parses a string URL path into its separate pathname, search, and hash components.
 *
 * @example
 * parsePath('https://juejin.cn/post/7005725282363506701?utm_source=gold_browser_extension#heading-2')
 * {
 *   "hash": "#heading-2",
 *   "search": "?utm_source=gold_browser_extension",
 *   "pathname": "https://juejin.cn/post/7005725282363506701"
 * }
 * 从结果可看到，去掉 `hash` 、 `search` 就是 `pathname` 了
 * 
 * parsePath('?utm_source=gold_browser_extension#heading-2')
 * {
 *   "hash": "#heading-2",
 *   "search": "?utm_source=gold_browser_extension",
 * }
 * parsePath('') => {}
 * 而如果只有search和hash，那么parse完也没有pathname，这里要特别注意
 * 
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#parsepath
 */
export function parsePath(path: string) {
  const partialPath: PartialPath = {};

  if (path) {
    const hashIndex = path.indexOf('#');
    if (hashIndex >= 0) {
      partialPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }

    const searchIndex = path.indexOf('?');
    if (searchIndex >= 0) {
      partialPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }

    if (path) {
      partialPath.pathname = path;
    }
  }

  return partialPath;
}
