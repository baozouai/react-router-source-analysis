import * as React from "react";
import { Action, createMemoryHistory, parsePath } from "history";
import type {
  History,
  InitialEntry,
  Location,
  MemoryHistory,
  Path,
  State,
  To
} from "history";

function invariant(cond: any, message: string): asserts cond {
  if (!cond) throw new Error(message);
}

function warning(cond: any, message: string): void {
  if (!cond) {
    // eslint-disable-next-line no-console
    if (typeof console !== "undefined") console.warn(message);

    try {
      // Welcome to debugging React Router!
      //
      // This error is thrown as a convenience so you can more easily
      // find the source for a warning that appears in the console by
      // enabling "pause on exceptions" in your JavaScript debugger.
      throw new Error(message);
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}

const alreadyWarned: Record<string, boolean> = {};
function warningOnce(key: string, cond: boolean, message: string) {
  if (!cond && !alreadyWarned[key]) {
    alreadyWarned[key] = true;
    warning(false, message);
  }
}

///////////////////////////////////////////////////////////////////////////////
// CONTEXT
///////////////////////////////////////////////////////////////////////////////

/**
 * A Navigator is a "location changer"; it's how you get to different locations.
 *
 * Every history instance conforms to the Navigator interface, but the
 * distinction is useful primarily when it comes to the low-level <Router> API
 * where both the location and a navigator must be provided separately in order
 * to avoid "tearing" that may occur in a suspense-enabled app if the action
 * and/or location were to be read directly from the history instance.
 */
export type Navigator = Omit<
  History,
  "action" | "location" | "back" | "forward" | "listen" | "block"
>;

interface NavigationContextObject {
  basename: string;
  navigator: Navigator;
  static: boolean;
}

const NavigationContext = React.createContext<NavigationContextObject>(null!);


interface LocationContextObject {
  action: Action;
  location: Location;
}

const LocationContext = React.createContext<LocationContextObject>(null!);


interface RouteContextObject {
  outlet: React.ReactElement | null;
  matches: RouteMatch[];
}

const RouteContext = React.createContext<RouteContextObject>({
  outlet: null,
  matches: []
});


///////////////////////////////////////////////////////////////////////////////
// COMPONENTS
///////////////////////////////////////////////////////////////////////////////

export interface MemoryRouterProps {
  basename?: string;
  children?: React.ReactNode;
  initialEntries?: InitialEntry[];
  initialIndex?: number;
}

/**
 * A <Router> that stores all entries in memory.
 *
 * @see https://reactrouter.com/api/MemoryRouter
 */
export function MemoryRouter({
  basename,
  children,
  initialEntries,
  initialIndex
}: MemoryRouterProps): React.ReactElement {
  const historyRef = React.useRef<MemoryHistory>();
  if (historyRef.current == null) {
    historyRef.current = createMemoryHistory({ initialEntries, initialIndex });
  }

  const history = historyRef.current;
  const [state, setState] = React.useState({
    action: history.action,
    location: history.location
  });

  React.useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      basename={basename}
      children={children}
      action={state.action}
      location={state.location}
      navigator={history}
    />
  );
}

export interface NavigateProps {
  to: To;
  replace?: boolean;
  state?: State;
}

/**
 * Changes the current location.
 *
 * Note: This API is mostly useful in React.Component subclasses that are not
 * able to use hooks. In functional components, we recommend you use the
 * `useNavigate` hook instead.
 *
 * @see https://reactrouter.com/api/Navigate
 */
export function Navigate({ to, replace, state }: NavigateProps): null {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of
    // the router loaded. We can help them understand how to avoid that.
    `<Navigate> may be used only in the context of a <Router> component.`
  );

  warning(
    !React.useContext(NavigationContext).static,
    `<Navigate> must not be used on the initial render in a <StaticRouter>. ` +
      `This is a no-op, but you should modify your code so the <Navigate> is ` +
      `only ever rendered in response to some user interaction or state change.`
  );

  const navigate = useNavigate();
  React.useEffect(() => {
    navigate(to, { replace, state });
  });

  return null;
}

export interface OutletProps {}

/**
 * Renders the child route's element, if there is one.
 *
 * @see https://reactrouter.com/api/Outlet
 * 
 * @example
 * return useContext(RouteContext).outlet
 */
export function Outlet(_props: OutletProps): React.ReactElement | null {
  debugger
  return useOutlet();
}

export interface RouteProps {
  /** 用于正则匹配是否要加上i，false才加，表示忽略大小写 */
  caseSensitive?: boolean;
  children?: React.ReactNode;
  element?: React.ReactElement | null;
  index?: boolean;
  path?: string;
}

export interface PathRouteProps {
  /** 用于正则匹配是否要加上i，false才加，表示忽略大小写 */
  caseSensitive?: boolean;
  children?: React.ReactNode;
  element?: React.ReactElement | null;
  index?: false;
  path: string;
}

export interface LayoutRouteProps {
  children?: React.ReactNode;
  element?: React.ReactElement | null;
}

export interface IndexRouteProps {
  /** 用于正则匹配是否要加上i，false才加，表示忽略大小写 */
  caseSensitive?: boolean;
  element?: React.ReactElement | null;
  index: true;
  path?: string;
}

/**
 * Declares an element that should be rendered at a certain URL path.
 *
 * @see https://reactrouter.com/api/Route
 */
export function Route(
  _props: PathRouteProps | LayoutRouteProps | IndexRouteProps
): React.ReactElement | null {
  // Route实际上没有render，只是作为Routes的child
  invariant(
    false,
    `A <Route> is only ever to be used as the child of <Routes> element, ` +
      `never rendered directly. Please wrap your <Route> in a <Routes>.`
  );
}

export interface RouterProps {
  action?: Action;
  basename?: string;
  children?: React.ReactNode;
  location: Partial<Location> | string;
  navigator: Navigator;
  static?: boolean;
}

/**
 * Provides location context for the rest of the app.
 *
 * Note: You usually won't render a <Router> directly. Instead, you'll render a
 * router that is more specific to your environment such as a <BrowserRouter>
 * in web browsers or a <StaticRouter> for server rendering.
 *
 * @see https://reactrouter.com/api/Router
 */
export function Router({
  action = Action.Pop,
  basename: basenameProp = "/",
  children = null,
  location: locationProp,
  /** 实质上就是history */
  navigator,
  static: staticProp = false
}: RouterProps): React.ReactElement | null {
  invariant(
    !useInRouterContext(),
    `You cannot render a <Router> inside another <Router>.` +
      ` You should never have more than one in your app.`
  );

  const basename = normalizePathname(basenameProp);
  const navigationContext = React.useMemo(
    () => ({ basename, navigator, static: staticProp }),
    [basename, navigator, staticProp]
  );

  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }

  const {
    pathname = "/",
    search = "",
    hash = "",
    state = null,
    key = "default"
  } = locationProp;
  // 替换传入location的pathname
  const location = React.useMemo(() => {
    // 获取pathname中basename后的字符串
    const trailingPathname = stripBasename(pathname, basename);

    if (trailingPathname == null) {
      // 1.pathname不是以basename开头的
      // 2.pathname以basename开头的，但不是以`${basename}/`开头
      return null;
    }
    // 到了这里则：
    // 1.basename === "/"
    // 2.pathname以`${basename}/`开头
    return {
      pathname: trailingPathname,
      search,
      hash,
      state,
      key
    };
  }, [basename, pathname, search, hash, state, key]);

  warning(
    location != null,
    `<Router basename="${basename}"> is not able to match the URL ` +
      `"${pathname}${search}${hash}" because it does not start with the ` +
      `basename, so the <Router> won't render anything.`
  );
  // 上面有警告，然后下面location为null就不会渲染任何组件
  if (location == null) {
    return null;
  }

  return (
    <NavigationContext.Provider value={navigationContext}>
      <LocationContext.Provider
        children={children}
        value={{ action, location }}
      />
    </NavigationContext.Provider>
  );
}

export interface RoutesProps {
  children?: React.ReactNode;
  location?: Partial<Location> | string;
}

/**
 * @description <Route> elements 的容器
 * A container for a nested tree of <Route> elements that renders the branch
 * that best matches the current location.
 *
 * @see https://reactrouter.com/api/Routes
 */
export function Routes({
  children,
  location
}: RoutesProps): React.ReactElement | null {
  debugger
  return useRoutes(createRoutesFromChildren(children), location);
}

///////////////////////////////////////////////////////////////////////////////
// HOOKS
///////////////////////////////////////////////////////////////////////////////

/**
 * Returns the full href for the given "to" value. This is useful for building
 * custom links that are also accessible and preserve right-click behavior.
 *
 * @see https://reactrouter.com/api/useHref
 */
export function useHref(to: To): string {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useHref() may be used only in the context of a <Router> component.`
  );

  const { basename, navigator } = React.useContext(NavigationContext);
  const path = useResolvedPath(to);

  if (basename !== "/") {
    const toPathname = getToPathname(to);
    const endsWithSlash = toPathname != null && toPathname.endsWith("/");
    path.pathname =
      path.pathname === "/"
        ? basename + (endsWithSlash ? "/" : "")
        : joinPaths([basename, path.pathname]);
  }

  return navigator.createHref(path);
}

/**
 * @description React.useContext(LocationContext) != null
 * 
 * Returns true if this component is a descendant of a <Router>.
 *
 * @see https://reactrouter.com/api/useInRouterContext
 */
export function useInRouterContext(): boolean {
  return React.useContext(LocationContext) != null;
}

/**
 * @description 从 `LocationContext` 获取location，所以必须用于 `LocationContext` 中
 * Returns the current location object, which represents the current URL in web
 * browsers.
 *
 * Note: If you're using this it may mean you're doing some of your own
 * "routing" in your app, and we'd like to know what your use case is. We may
 * be able to provide something higher-level to better suit your needs.
 *
 * @see https://reactrouter.com/api/useLocation
 */
export function useLocation(): Location {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useLocation() may be used only in the context of a <Router> component.`
  );

  return React.useContext(LocationContext).location;
}

/**
 * Returns true if the URL for the given "to" value matches the current URL.
 * This is useful for components that need to know "active" state, e.g.
 * <NavLink>.
 *
 * @see https://reactrouter.com/api/useMatch
 */
export function useMatch<ParamKey extends string = string>(
  pattern: PathPattern | string
): PathMatch<ParamKey> | null {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useMatch() may be used only in the context of a <Router> component.`
  );

  return matchPath(pattern, useLocation().pathname);
}

/**
 * The interface for the navigate() function returned from useNavigate().
 */
export interface NavigateFunction {
  (to: To, options?: NavigateOptions): void;
  (delta: number): void;
}

export interface NavigateOptions {
  replace?: boolean;
  state?: State;
}

/**
 * Returns an imperative method for changing the location. Used by <Link>s, but
 * may also be used by other elements to change the location.
 *
 * @see https://reactrouter.com/api/useNavigate
 */
export function useNavigate(): NavigateFunction {
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useNavigate() may be used only in the context of a <Router> component.`
  );

  const { basename, navigator } = React.useContext(NavigationContext);
  const { matches } = React.useContext(RouteContext);
  const { pathname: locationPathname } = useLocation();

  const routePathnamesJson = JSON.stringify(
    matches.map(match => match.pathnameBase)
  );
  /** 是否已挂载 */
  const activeRef = React.useRef(false);
  React.useEffect(() => {
    activeRef.current = true;
  });

  const navigate: NavigateFunction = React.useCallback(
    (to: To | number, options: { replace?: boolean; state?: State } = {}) => {
      warning(
        activeRef.current,
        `You should call navigate() in a React.useEffect(), not when ` +
          `your component is first rendered.`
      );

      if (!activeRef.current) return;

      if (typeof to === "number") {
        navigator.go(to);
        return;
      }

      const path = resolveTo(
        to,
        JSON.parse(routePathnamesJson),
        locationPathname
      );

      if (basename !== "/") {
        path.pathname = joinPaths([basename, path.pathname]);
      }
      // replace为true才调用replace方法，否则都是push
      (!!options.replace ? navigator.replace : navigator.push)(
        path,
        options.state
      );
    },
    [basename, navigator, routePathnamesJson, locationPathname]
  );

  return navigate;
}

/**
 * Returns the element for the child route at this level of the route
 * hierarchy. Used internally by <Outlet> to render child routes.
 *
 * @see https://reactrouter.com/api/useOutlet
 */
export function useOutlet(): React.ReactElement | null {
  return React.useContext(RouteContext).outlet;
}

/**
 * Returns an object of key/value pairs of the dynamic params from the current
 * URL that were matched by the route path.
 *
 * @see https://reactrouter.com/api/useParams
 */
export function useParams<Key extends string = string>(): Readonly<
  Params<Key>
> {
  const { matches } = React.useContext(RouteContext);
  const routeMatch = matches[matches.length - 1];
  return routeMatch ? (routeMatch.params as any) : {};
}

/**
 * 根据当前location解析给定to的pathname
 * Resolves the pathname of the given `to` value against the current location.
 *
 * @see https://reactrouter.com/api/useResolvedPath
 */
export function useResolvedPath(to: To): Path {
  const { matches } = React.useContext(RouteContext);
  const { pathname: locationPathname } = useLocation();
  // 转为字符串是为了避免memo依赖加上对象导致缓存失效？
  const routePathnamesJson = JSON.stringify(
    matches.map(match => match.pathnameBase)
  );

  return React.useMemo(
    () => resolveTo(to, JSON.parse(routePathnamesJson), locationPathname),
    [to, routePathnamesJson, locationPathname]
  );
}

/**
 * @description 返回与当前路径匹配的route element，用正确的上下文来render路由树是其他部分。
 * 树中的 route elements必须render在<Outlet>来render它们的子 route elements
 * Returns the element of the route that matched the current location, prepared
 * with the correct context to render the remainder of the route tree. Route
 * elements in the tree must render an <Outlet> to render their child route's
 * element.
 *
 * @see https://reactrouter.com/api/useRoutes
 */
export function useRoutes(
  routes: RouteObject[],
  locationArg?: Partial<Location> | string
): React.ReactElement | null {
  debugger
  invariant(
    useInRouterContext(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    `useRoutes() may be used only in the context of a <Router> component.`
  );
  /**
   * typeof RouteContext = {
   *   outlet: React.ReactElement | null;
   *   matches: RouteMatch[];
   * }
   */
  const { matches: parentMatches } = React.useContext(RouteContext);
  // 比如当前路径为：http://localhost:3000/auth，
  // parentMatches为：[
  //   { params: {*: ''}, pathname: "/", pathnameBase: "/", route: {path: "/", children: [{...}, {...}]} },
  //   { params: {*: ''}, pathname: "/auth", pathnameBase: "/auth", route: { path: "auth/*" } }
  // ]
  // 拿parentMatches的最后一个,从上面例子可看到最后一个parentMatch是最接近的
  const routeMatch = parentMatches[parentMatches.length - 1];
  // 如果match了，获取params、pathname、pathnameBase
  const parentParams = routeMatch ? routeMatch.params : {};
  const parentPathname = routeMatch ? routeMatch.pathname : "/";
  const parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  const parentRoute = routeMatch && routeMatch.route;

  // 从 LocationContext 获取location
  const locationFromContext = useLocation();

  let location;
  if (locationArg) {
    const parsedLocationArg =
      typeof locationArg === "string" ? parsePath(locationArg) : locationArg;

    invariant(
      parentPathnameBase === "/" ||
        parsedLocationArg.pathname?.startsWith(parentPathnameBase),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, ` +
        `the location pathname must begin with the portion of the URL pathname that was ` +
        `matched by all parent routes. The current pathname base is "${parentPathnameBase}" ` +
        `but pathname "${parsedLocationArg.pathname}" was given in the \`location\` prop.`
    );

    location = parsedLocationArg;
  } else {
    location = locationFromContext;
  }
  // 一般来说，对于http://localhost:3000/auth，location.pathname为/auth
  const pathname = location.pathname || "/";
  // parentPathnameBase不为 '/'那么就从pathname中的parentPathnameBase后截取。
  // 因为useRoutes是在<Routes></Routes>中调用的，remainingPathname代表当前Routes的相对路径
  // eg: pathname = `${parentPathnameBase}xxx`，remainingPathname = 'xxx'
  // eg: pathname = `/auth`，remainingPathname = '/'
  // eg: pathname = `/auth/login`，parentPathnameBase = '/auth', remainingPathname = '/login'
  const remainingPathname =
    parentPathnameBase === "/"
      ? pathname
      : pathname.slice(parentPathnameBase.length) || "/";
  const matches = matchRoutes(routes, { pathname: remainingPathname });

  return _renderMatches(
    matches &&
      matches.map(match =>
        Object.assign({}, match, {
          params: Object.assign({}, parentParams, match.params),
          pathname: joinPaths([parentPathnameBase, match.pathname]),
          pathnameBase: joinPaths([parentPathnameBase, match.pathnameBase])
        })
      ),
    parentMatches
  );
}

///////////////////////////////////////////////////////////////////////////////
// UTILS
///////////////////////////////////////////////////////////////////////////////

/**
 * @description 创建一个route配置: 
 * @example
 * RouteObject {
 *  caseSensitive?: boolean;
 *  children?: RouteObject[];
 *  element?: React.ReactNode;
 *  index?: boolean;
 *  path?: string;
 * }[]
 * Creates a route config from a React "children" object, which is usually
 * either a `<Route>` element or an array of them. Used internally by
 * `<Routes>` to create a route config from its children.
 *
 * @see https://reactrouter.com/api/createRoutesFromChildren
 */
export function createRoutesFromChildren(
  children: React.ReactNode
): RouteObject[] {
  const routes: RouteObject[] = [];
  debugger
  React.Children.forEach(children, element => {
    if (!React.isValidElement(element)) {
      // 忽悠掉 non-elements
      // Ignore non-elements. This allows people to more easily inline
      // conditionals in their route config.
      return;
    }

    if (element.type === React.Fragment) {
      // element为<></>
      // Transparently support React.Fragment and its children.
      routes.push.apply(
        routes,
        createRoutesFromChildren(element.props.children)
      );
      return;
    }

    const route: RouteObject = {
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      index: element.props.index,
      path: element.props.path
    };

    if (element.props.children) {
      /**
       * 如果有children
       * @example
       * <Route path="/" element={<Layout />}>
       *  <Route path='user/*'/>
       *  <Route path='dashboard/*'/>
       * </Route>
       */
      route.children = createRoutesFromChildren(element.props.children);
    }

    routes.push(route);
  });
  return routes;
}

/**
 * The parameters that were parsed from the URL path.
 */
export type Params<Key extends string = string> = {
  readonly [key in Key]: string | undefined;
};

/**
 * A route object represents a logical route, with (optionally) its child
 * routes organized in a tree-like structure.
 */
export interface RouteObject {
  caseSensitive?: boolean;
  children?: RouteObject[];
  element?: React.ReactNode;
  index?: boolean;
  path?: string;
}

/**
 * Returns a path with params interpolated.
 *
 * @example
 * generatePath("/users/:id", { id: 42 }); // "/users/42"
 * generatePath("/files/:type/*", {
 * type: "img",
 * "*": "cat.jpg"
 * }); // "/files/img/cat.jpg"
 * @see https://reactrouter.com/api/generatePath
 */
export function generatePath(path: string, params: Params = {}): string {
  return path
    .replace(/:(\w+)/g, (_, key) => {
      invariant(params[key] != null, `Missing ":${key}" param`);
      return params[key]!;
    })
    .replace(/\/*\*$/, _ =>
      params["*"] == null ? "" : params["*"].replace(/^\/*/, "/")
    );
}

/**
 * A RouteMatch contains info about how a route matched a URL.
 */
export interface RouteMatch<ParamKey extends string = string> {
  /**
   * The names and values of dynamic parameters in the URL.
   */
  params: Params<ParamKey>;
  /**
   * The portion of the URL pathname that was matched.
   */
  pathname: string;
  /**
   * The portion of the URL pathname that was matched before child routes.
   */
  pathnameBase: string;
  /**
   * The route object that was used to match.
   */
  route: RouteObject;
}

/**
 * Matches the given routes to a location and returns the match data.
 */
export function matchRoutes(
  routes: RouteObject[],
  locationArg: Partial<Location> | string,
  basename = "/"
): RouteMatch[] | null {
  const location =
    typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  // pathname是一个取出来basename的相对路径
  const pathname = stripBasename(location.pathname || "/", basename);

  if (pathname == null) {
    return null;
  }
  // routes有可能是多层设置，那么flatten下
  const branches = flattenRoutes(routes);
  /**
   * 通过score或childrenIndex[]排序branch
   * @example
   *  // 排序前
   *  [
   *  {
   *   path: '/', score: 4, routesMeta: [
   *     {relativePath: "",caseSensitive: false,childrenIndex: 0},
   *     {relativePath: "",caseSensitive: false,childrenIndex: 0}
   *   ]
   * },
   *  {
   *   path: '/login', score: 13, routesMeta: [
   *     {relativePath: "",caseSensitive: false,childrenIndex: 0},
   *     {relativePath: "login",caseSensitive: false,childrenIndex: 1}
   * ]
   * },
   *  {
   *   path: '/protected', score: 13, routesMeta: [
   *     {relativePath: "",caseSensitive: false,childrenIndex: 0},
   *     {relativePath: "protected",caseSensitive: true,childrenIndex: 2}
   *   ]
   * }
   * ]
   * // 排序后
   *  [
   *  { path: '/login', score: 13, ...},
   *  { path: '/protected', score: 13, ...}
   *  { path: '/', score: 4, ... },
   * ]
   */
  rankRouteBranches(branches);

  let matches = null;
  // 直到`matches`有值(意味着匹配到，那么自然不用再找了）或遍历完`branches`才跳出循环
  for (let i = 0; matches == null && i < branches.length; ++i) {
    matches = matchRouteBranch(branches[i], routes, pathname);
  }

  return matches;
}

interface RouteMeta {
  relativePath: string;
  caseSensitive: boolean;
  childrenIndex: number;
}

interface RouteBranch {
  path: string;
  score: number;
  routesMeta: RouteMeta[];
}
/**
 * @description 如果route有children，会先把children处理完push `branches`，然后再push该`route`
 */
function flattenRoutes(
  routes: RouteObject[],
  branches: RouteBranch[] = [],
  parentsMeta: RouteMeta[] = [],
  parentPath = ""
): RouteBranch[] {
  routes.forEach((route, index) => {
    const meta: RouteMeta = {
      relativePath: route.path || "",
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index
    };

    if (meta.relativePath.startsWith("/")) {
      // 如果相对路径以"/"开头，说明是绝对路径，那么必须要以parentPath开头，否则这里会报错。
      // 因为这里是嵌套在parentPath下的路由
      invariant(
        meta.relativePath.startsWith(parentPath),
        `Absolute route path "${meta.relativePath}" nested under path ` +
          `"${parentPath}" is not valid. An absolute child route path ` +
          `must start with the combined path of all its parent routes.`
      );
      // 到这里就说明是以parentPath开头了，那么相对路径不需要parentPath，取后面的
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }
    // 将parentPath, meta.relativePath用 / 连起来成为绝对路径
    const path = joinPaths([parentPath, meta.relativePath]);
    // 这里用concat就不会影响到parentsMeta
    const routesMeta = parentsMeta.concat(meta);

    // Add the children before adding this route to the array so we traverse the
    // route tree depth-first and child routes appear before their parents in
    // the "flattened" version.
    if (route.children && route.children.length > 0) {
      // 如果route有children，那么不能为index route，即其prop的index不能为true
      invariant(
        route.index !== true,
        `Index routes must not have child routes. Please remove ` +
          `all child routes from route path "${path}".`
      );
      // 有children的先处理children，处理完的children branch放进branches
      flattenRoutes(route.children, branches, routesMeta, path);
    }

    // Routes without a path shouldn't ever match by themselves unless they are
    // index routes, so don't add them to the list of possible branches.
    if (route.path == null && !route.index) {
      // 如果route没有path，且不是index route，那么不放入branches
      /**
       * @example
       * 对于 examples/auth/index.tsx, http://localhost:3000/auth
       * // 最外层的Route就没有path和index，那么就return
       * 
       * <Route element={<Layout />}>
       *   <Route path="" element={<PublicPage />} />
       *   <Route path="login" element={<LoginPage />} />
       *   <Route
       *     path="protected"
       *     caseSensitive
       *     element={
       *       <RequireAuth>
       *         <ProtectedPage />
       *       </RequireAuth>
       *     }
       *   />
       * </Route>
       * 
       * 那么最终最下面收集到的branches为：
       * [
       *  {
       *   path: '/', score: 4, routesMeta: [
       *     {relativePath: "",caseSensitive: false,childrenIndex: 0},
       *     {relativePath: "",caseSensitive: false,childrenIndex: 0}
       *   ]
       * },
       *  {
       *   path: '/login', score: 13, routesMeta: [
       *     {relativePath: "",caseSensitive: false,childrenIndex: 0},
       *     {relativePath: "login",caseSensitive: false,childrenIndex: 1}
       * ]
       * },
       *  {
       *   path: '/protected', score: 13, routesMeta: [
       *     {relativePath: "",caseSensitive: false,childrenIndex: 0},
       *     {relativePath: "protected",caseSensitive: true,childrenIndex: 2}
       *   ]
       * }
       * ]
       */
      return;
    }
    // 到了这里满足上面的所有条件了，那么放入branches
    branches.push({ path, score: computeScore(path, route.index), routesMeta });
  });

  return branches;
}
function compareIndexes(a: number[], b: number[]): number {
  // slice(0, -1)是获取【除最后一个】的前面元素(parents route)
  // 这里叫siblings是因为最后一个是该 route的index，parent route都在前面，
  // 为true的话说明a、b长度相等，且除最后一个selfIndex外前面的所有`parentIndex`都相等，那么就肯定是siblings了
  const siblings =
    a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);
  // 那么如果是siblings，那么比较它们的selfIndex值就知道哪个排前面了，排前面的就会优先match了
  return siblings
    ? // If two routes are siblings, we should try to match the earlier sibling
      // first. This allows people to have fine-grained control over the matching
      // behavior by simply putting routes with identical paths in the order they
      // want them tried.
      a[a.length - 1] - b[b.length - 1]
    : // Otherwise, it doesn't really make sense to rank non-siblings by index,
      // so they sort equally.
      // 如果selfIndex都相等，那么就返回0了，但目前还不清楚怎么出现这种情况？
      0;
}
/** 通过`score`或`childrenIndex[]`排序`branch` */
function rankRouteBranches(branches: RouteBranch[]): void {
  branches.sort((a, b) =>
    a.score !== b.score
    // 不等的话，高的排前面
      ? b.score - a.score // Higher score first
      // score相等的话，那么判断是否是siblings，是的话比较selfIndex(小的排前面)，否则相等
      : compareIndexes(
          a.routesMeta.map(meta => meta.childrenIndex),
          b.routesMeta.map(meta => meta.childrenIndex)
        )
  );
}

const paramRe = /^:\w+$/;
const dynamicSegmentValue = 3;
const indexRouteValue = 2;
const emptySegmentValue = 1;
const staticSegmentValue = 10;
const splatPenalty = -2;
const isSplat = (s: string) => s === "*";
/**
 * @description 计算path的得分，用来排序`branches`，得分越多排序越前，见上面的`rankRouteBranches`
 */
function computeScore(path: string, index: boolean | undefined): number {
  // 获取片段
  const segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    // 如果任一片段等于*，那么-2
    initialScore += splatPenalty;
  }

  if (index) {
    // 如果是index route， 那么+2
    initialScore += indexRouteValue;
  }
  // 过滤掉片段中等于*的，然后遍历每一片段，累加initialScore
  // - 如果该片段是动态的，比如:id,那么+3
  // - 如果该片段是空字符串""，那么+1
  // - 否则+10
  return segments
    .filter(s => !isSplat(s))
    .reduce(
      (score, segment) =>
        score +
        (paramRe.test(segment)
          ? dynamicSegmentValue
          : segment === ""
          ? emptySegmentValue
          : staticSegmentValue),
      initialScore
    );
}

function matchRouteBranch<ParamKey extends string = string>(
  branch: RouteBranch,
  // TODO: attach original route object inside routesMeta so we don't need this arg
  routesArg: RouteObject[],
  pathname: string
): RouteMatch<ParamKey>[] | null {
  let routes = routesArg;
  const { routesMeta } = branch;
  /** 已匹配到的动态参数 */
  const matchedParams = {};
  /** 表示已经匹配到的路径名 */
  let matchedPathname = "/";
  const matches: RouteMatch[] = [];
  for (let i = 0; i < routesMeta.length; ++i) {
    const meta = routesMeta[i];
    // 是否到了最后一个routesMeta
    const end = i === routesMeta.length - 1;
    // remainingPathname表示剩下还没匹配到的路径
    // matchedPathname不为 '/'那么就从pathname中的matchedPathname后截取
    // eg: pathname = `${matchedPathname}xxx`，remainingPathname = 'xxx'
    // eg: matchedPathname = '/', pathname = `/`，remainingPathname = '/'
    // eg: matchedPathname = '/', pathname = `/auth`，remainingPathname = '/auth'
    const remainingPathname =
      matchedPathname === "/"
        ? pathname
        : pathname.slice(matchedPathname.length) || "/";
    const match = matchPath(
      { path: meta.relativePath, caseSensitive: meta.caseSensitive, end },
      remainingPathname
    );
      // 只要有一个没match到，就return掉，意味着即使前面的都match了，但如果最后一个没match到，最终matchRouteBranch还是null
    if (!match) return null;

    Object.assign(matchedParams, match.params);

    const route = routes[meta.childrenIndex];

    matches.push({
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: joinPaths([matchedPathname, match.pathnameBase]),
      route
    });

    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
    // 上面已经match到了，那么继续从其children中查找，特别注意的是routes的层次与routesMeta.length相对，所以这里加了!
    routes = route.children!;
  }

  return matches;
}

/**
 * Renders the result of `matchRoutes()` into a React element.
 */
export function renderMatches(
  matches: RouteMatch[] | null
): React.ReactElement | null {
  return _renderMatches(matches);
}

function _renderMatches(
  matches: RouteMatch[] | null,
  parentMatches: RouteMatch[] = []
): React.ReactElement | null {
  debugger
  if (matches == null) return null;

  /**
   * 这里生成的结构如下，即对于matches `index + 1` 生成的Provider作为 `index` Provider value的outlet(出口) ：
   * // matches.length = 2
   * return (
   *   <RouteContext.Provider
   *     value={{
   *       matches: parentMatches.concat(matches.slice(0, 1)),
   *       outlet: (
   *       <RouteContext.Provider
   *         value={{
   *           matches: parentMatches.concat(matches.slice(0:2)),
   *           outlet: null // 第一次outlet为null,
   *         }}
   *       >
   *         {<Layout2 /> || <Outlet />}
   *       </RouteContext.Provider>
   *     ),
   *     }}
   *   >
   *     {<Layout1 /> || <Outlet />}
   *   </RouteContext.Provider>
   * )
   */
  return matches.reduceRight((outlet, match, index) => {
    debugger
    // 如果match.route.element为空，那么<Outlet />实际上就是该RouteContext的outlet，就是下面value的outlet
    return (
      <RouteContext.Provider
        children={match.route.element || <Outlet />}
        value={{
          outlet,
          matches: parentMatches.concat(matches.slice(0, index + 1))
        }}
      />
    );
  }, null as React.ReactElement | null);
}

/**
 * A PathPattern is used to match on some portion of a URL pathname.
 */
export interface PathPattern {
  /**
   * A string to match against a URL pathname. May contain `:id`-style segments
   * to indicate placeholders for dynamic parameters. May also end with `/*` to
   * indicate matching the rest of the URL pathname.
   */
  path: string;
  /**
   * Should be `true` if the static portions of the `path` should be matched in
   * the same case.
   */
  caseSensitive?: boolean;
  /**
   * Should be `true` if this pattern should match the entire URL pathname.
   */
  end?: boolean;
}

/**
 * A PathMatch contains info about how a PathPattern matched on a URL pathname.
 */
export interface PathMatch<ParamKey extends string = string> {
  /**
   * The names and values of dynamic parameters in the URL.
   */
  params: Params<ParamKey>;
  /**
   * The portion of the URL pathname that was matched.
   */
  pathname: string;
  /**
   * The portion of the URL pathname that was matched before child routes.
   */
  pathnameBase: string;
  /**
   * The pattern that was used to match.
   */
  pattern: PathPattern;
}

type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

/**
 * Performs pattern matching on a URL pathname and returns information about
 * the match.
 *
 * @see https://reactrouter.com/api/matchPath
 */
export function matchPath<ParamKey extends string = string>(
  pattern: PathPattern | string,
  pathname: string
): PathMatch<ParamKey> | null {
  if (typeof pattern === "string") {
    pattern = { path: pattern, caseSensitive: false, end: true };
  }
  // 根据pattern.path生成正则以及获取path中的动态参数
  const [matcher, paramNames] = compilePath(
    pattern.path,
    pattern.caseSensitive,
    pattern.end
  );
  // pattern.path生成正则是否match传入的pathname
  const match = pathname.match(matcher);
  if (!match) return null;

  const matchedPathname = match[0];
  // eg: 'auth/'.replace(/(.)\/+$/, "$1") => 'auth // 即(.)，$1表示第一个匹配到的小括号中的值;
  // eg: 'auth/*'.replace(/(.)\/+$/, "$1") => 'auth/*'; // 不匹配，返回原字符串
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  // eg: pattern = {path: 'auth/*', caseSensitive: false, end: true}, pathname = '/auth/login';
  //     matcher = /^\/auth(?:\/(.+)|\/*)$/i, paramNames = ['*'];
  //     match = ['/auth/login', 'login', index: 0, input: '/auth/login', groups: undefined]
  // 那么 matchedPathname = '/auth/login', captureGroups = ['login'], params = { '*': 'login' }, pathnamebase = '/auth'
  // 从第二项就是()中匹配的，所以叫slice从1开始
  const captureGroups = match.slice(1);
  const params: Params = paramNames.reduce<Mutable<Params>>(
    (memo, paramName, index) => {
      // We need to compute the pathnameBase here using the raw splat value
      // instead of using params["*"] later because it will be decoded then
      if (paramName === "*") {
        const splatValue = captureGroups[index] || "";
        pathnameBase = matchedPathname
          .slice(0, matchedPathname.length - splatValue.length)
          .replace(/(.)\/+$/, "$1");
      }

      memo[paramName] = safelyDecodeURIComponent(
        captureGroups[index] || "",
        paramName
      );
      return memo;
    },
    {}
  );

  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
/**
 * @description: 根据path生成正则以及获取path中的动态参数
 * @param {string} path path不能是：xxx*，如果尾部是*，那么需要以"/*"结尾，正常的"/", "/auth"没问题
 * @param {boolean} caseSensitive 默认false，根据path生成的正则是否忽略大小写
 * @param {boolean} end 默认true，是否到了最后一个routesMeta
 * @return {[RegExp, string[]]} 正则以及获取path中的动态参数
 * 
 * @example
 * 
 * compilePath('/') => matcher = /^\/\/*$/i
 * compilePath('/', true, false) => matcher = /^\/(?:\b|$)/i
 * compilePath('/auth') => matcher = /^\/auth\/*$/i
 * compilePath('/auth/public', true) => matcher = /^\/auth\/public\/*$/
 * compilePath('auth/*', true) => matcher = /^\/auth(?:\/(.+)|\/*)$/
 */
function compilePath(
  path: string,
  caseSensitive = false,
  end = true
): [RegExp, string[]] {
  warning(
    path === "*" || !path.endsWith("*") || path.endsWith("/*"),
    `Route path "${path}" will be treated as if it were ` +
      `"${path.replace(/\*$/, "/*")}" because the \`*\` character must ` +
      `always follow a \`/\` in the pattern. To get rid of this warning, ` +
      `please change the route path to "${path.replace(/\*$/, "/*")}".`
  );
  // 动态参数名数组
  // eg: '/auth/:id/www/:name/ee' => paramNames = ['id', 'name']
  const paramNames: string[] = [];
  let regexpSource =
    "^" +
    path
      .replace(/\/*\*?$/, "") // 去掉'/'或'/*'
      .replace(/^\/*/, "/") //  开头没'/'那么加上；开头有多个'/',那么保留一个；eg: (//auth | auth) => /auth
      .replace(/[\\.*+^$?{}|()[\]]/g, "\\$&") // 对\.*+^$?{}或()[]都给加上\,eg: `()[]` => '\(\)\[\]';`.*+^$?{}` => '\.\*\+\^\$\?\{\}'
      .replace(/:(\w+)/g, (_: string, paramName: string) => {  // \w ===  [A-Za-z0-9_]
        paramNames.push(paramName);
        /** [^\\/]+ 表示不能是出现/
         * @example
         * '/auth/:id/www/:name/ee' => '/auth/([^\/]+)/www/([^\/]+)/ee'
         * const reg = new RegExp('/auth/([^\/]+)/www/([^\/]+)/ee', 'i')
         * reg.test('/auth/33/www/a1_A/ee') // params = ['33', 'a1_A'], true
         * reg.test('/auth/33/www/a1_A//ee')) // params = ['33', 'a1_A/'], false
         */
        return "([^\\/]+)";
      });

  if (path.endsWith("*")) {
    // 如果path以"*"结尾，那么paramNames也push
    paramNames.push("*");
    regexpSource +=
      // 如果path等于*或/*
      path === "*" || path === "/*"
        ? "(.*)$" // Already matched the initial /, just match the rest (.*)$表示match剩下的
        /**
         * (?:x)，匹配 'x' 但是不记住匹配项。这种括号叫作非捕获括号，使得你能够定义与正则表达式运算符一起使用的子表达式。
         * @example
         * eg1: 
         * /(?:foo){1,2}/。如果表达式是 /foo{1,2}/，{1,2} 将只应用于 'foo' 的最后一个字符 'o'。
         * 如果使用非捕获括号，则 {1,2} 会应用于整个 'foo' 单词
         * 
         * eg2: 对比下两种exec的结果
         * const reg = new RegExp('w(?:\\d+)e')
         * reg.exec('w12345e')
         * ['w12345e', index: 0, input: 'w12345e', groups: undefined] // 不记住匹配项
         * 
         * 而
         * const reg = new RegExp('w(\\d+)e')
         * reg.exec('w12345e')
         * ['w12345e', '12345', index: 0, input: 'w12345e', groups: undefined] // 记住匹配项
         * 
         * 本处eg：
         * path = 'xxx/*'
         * const reg = new RegExp("xxx(?:\\/(.+)|\\/*)$", 'i')
         * 下面的abc是(.+)中的
         * reg.exec('xxx/abc') // ['xxx/abc', 'abc', index: 0, input: 'xxx/abc', groups: undefined]
         * 下面两处满足 `|` 后面的\\/*: '/' 出现出现零次或者多次 
         * reg.exec('xxx') //  ['xxx', undefined, index: 0, input: 'xxx', groups: undefined]
         * reg.exec('xxx/') //  ['xxx/', undefined, index: 0, input: 'xxx/', groups: undefined]
         * 当>= 2个'/'，就又变成满足\\/(.+)了，所以个人感觉这里的\\/*是不是应该改为\\/{0,1} ????
         * reg.exec('xxx//') //  ['xxx//','/', index: 0, input: 'xxx//', groups: undefined]
         */
        : "(?:\\/(.+)|\\/*)$"; // Don't include the / in params["*"]
  } else {
    // path不以"*"结尾
    regexpSource += end
      ? "\\/*$" // When matching to the end, ignore trailing slashes end的话，忽略斜杠"/"
      : // Otherwise, at least match a word boundary. This restricts parent
        // routes to matching only their own words and nothing more, e.g. parent
        // route "/home" should not match "/home2".
        /**
         * 否则，至少匹配到一个单词边界，这限制了parent routes只能匹配自己的单词。比如/home不允许匹配为/home2。
         * 
         * \b: 匹配这样的位置：它的前一个字符和后一个字符不全是(一个是,一个不是或不存在) \w (\w ===  [A-Za-z0-9_])
         * 通俗的理解，\b 就是“隐式位置”
         * "It"中 'I' 和 't' 就是显示位置，中间是“隐式位置”。 更多可见：https://www.cnblogs.com/litmmp/p/4925374.html
         * 使用"moon"举例：
         * /\bm/匹配“moon”中的‘m’；
         * /oo\b/并不匹配"moon"中的'oo'，因为'oo'被一个“字”字符'n'紧跟着
         * /oon\b/匹配"moon"中的'oon'，因为'oon'是这个字符串的结束部分。这样他没有被一个“字”字符紧跟着
         * 
         * 本例：
         * compilePath('/', true, false) => matcher = /^\/(?:\b|$)/i
         * '/auth'.match(/^\/(?:\b|$)/i) // ['/', index: 0, input: '/auth', groups: undefined]
         * 'auth'.match(/^\/(?:\b|$)/i) // null
         * reg.exec('/xxx2') or reg.exec('/xxxx') // null
         *  */ 
        "(?:\\b|$)";
  }

  const matcher = new RegExp(regexpSource, caseSensitive ? undefined : "i");

  return [matcher, paramNames];
}
/** decodeURIComponent(value) */
function safelyDecodeURIComponent(value: string, paramName: string) {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    warning(
      false,
      `The value for the URL param "${paramName}" will not be decoded because` +
        ` the string "${value}" is a malformed URL segment. This is probably` +
        ` due to a bad percent encoding (${error}).`
    );

    return value;
  }
}

/**
 * 
 * @description
 * - 如果 `toPathname` 为空，或空字符串，那么直接取 `fromPathname`
 * - 如果以 `/` 开头，那么直接取 `toPathname`
 * - 否则是 resolvePathname(toPathname, fromPathname)) 
 * 
 * @example
 * resolvePathname('login', '/auth') => '/auth/login'
 * 
 * Returns a resolved path object relative to the given pathname.
 *
 * @see https://reactrouter.com/api/resolvePath
 * 
 *  src/packages/react-router-dom/__tests__/exports-test.tsx
 */
export function resolvePath(to: To, fromPathname = "/"): Path {
  const {
    pathname: toPathname,
    search = "",
    hash = ""
  } = typeof to === "string" ? parsePath(to) : to;
  const pathname = toPathname
    ? (toPathname.startsWith("/")
      ? toPathname
      : resolvePathname(toPathname, fromPathname))
    : fromPathname;

  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash)
  };
}
/**
 * @example
 * resolvePathname('.', '/auth/') => '/auth'
 * resolvePathname('.', '/auth') => '/auth'
 * resolvePathname('login', '/auth/') => '/auth/login'
 * resolvePathname('./login', '/auth/') => '/auth/login'
 * resolvePathname('../login', '/auth/') => '/login'
 * resolvePathname('..', '/auth/') => '/'
 * resolvePathname('../', '/auth/') => '/'
 * resolvePathname('../../', '/auth/') => '/'
 */
function resolvePathname(relativePath: string, fromPathname: string): string {
  // 去掉尾部的/。eg: '/auth/' => ['', 'auth']
  const segments = fromPathname.replace(/\/+$/, "").split("/");
  const relativeSegments = relativePath.split("/");

  relativeSegments.forEach(segment => {
    if (segment === "..") {
      // eg: 
      // resolvePathname('../login', '/auth') => '/login'
      // Keep the root "" segment so the pathname starts at /
      // segments.length <= 1代表 到了 '/'
      // resolvePathname('../../', '/auth/') => '/'。第一个`..`会起作用，第二个就不会了，因为到这里segments.length = 1
      if (segments.length > 1) segments.pop();
    } else if (segment !== ".") {
      // .代表当前RouterContext
      segments.push(segment);
    }
  });

  return segments.length > 1 ? segments.join("/") : "/";
}

function resolveTo(
  toArg: To,
  routePathnames: string[],
  locationPathname: string
): Path {
  const to = typeof toArg === "string" ? parsePath(toArg) : toArg;
  const toPathname = toArg === "" || to.pathname === "" ? "/" : to.pathname;

  // If a pathname is explicitly provided in `to`, it should be relative to the
  // route context. This is explained in `Note on `<Link to>` values` in our
  // migration guide from v5 as a means of disambiguation between `to` values
  // that begin with `/` and those that do not. However, this is problematic for
  // `to` values that do not provide a pathname. `to` can simply be a search or
  // hash string, in which case we should assume that the navigation is relative
  // to the current location's pathname and *not* the route pathname.
  // 如果在`to`中明确提供了路径名，那么它应该是相对于RouterContext的。这在v5的`Note on `<Link to>` values`中作了解释，
  // 目的是为了消除是否以'/'开头的`to`的歧义。
  // 然而，对于不提供路径名的`to`值来说，这是有问题的。
  // 因为`to`可以是一个search或hash，在这种情况下，我们应该假设navigation是相对于当前location的pathname，而不是route pathname
  let from: string;
  if (toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;

    if (toPathname.startsWith("..")) {
      // 如果toPathname以..开头，如../login,那么toSegments = ['..','login']
      const toSegments = toPathname.split("/");
      // ..代表回溯到上一个route，而不是URL片段，这个和a 'href'不同
      // Each leading .. segment means "go up one route" instead of "go up one
      // URL segment".  This is a key difference from how <a href> works and a
      // major reason we call this a "to" value instead of a "href".
      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }

      to.pathname = toSegments.join("/");
    }

    // If there are more ".." segments than parent routes, resolve relative to
    // the root / URL.
    // 如果m ".."片段超过了 parent routes，那么from相对于 '/'
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }

  const path = resolvePath(to, from);

  // Ensure the pathname has a trailing slash if the original to value had one.
  if (
    toPathname &&
    toPathname !== "/" &&
    toPathname.endsWith("/") &&
    !path.pathname.endsWith("/")
  ) {
    // 如果toPathname以/结尾但不等于/，且resolvePath后得到的path.pathname不以/结尾，那么path.pathname要以/结尾
    path.pathname += "/";
  }

  return path;
}

function getToPathname(to: To): string | undefined {
  // Empty strings should be treated the same as / paths
  return to === "" || (to as Path).pathname === ""
    ? "/"
    : typeof to === "string"
    ? parsePath(to).pathname
    : to.pathname;
}
/**
 * @description 获取pathname中basename后的字符串，如果basename是/,直接返回该pathname
 */
function stripBasename(pathname: string, basename: string): string | null {
  if (basename === "/") return pathname;
  // 如果pathname不是以basename开头的，那么return null
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  // 到了这里pathname是以basename开头且basename不为 "/"
  // nextChar为pathname中basename的下一个字符
  const nextChar = pathname.charAt(basename.length);
  if (nextChar && nextChar !== "/") {
    // pathname不是以`${basename}/`开头
    // pathname does not start with basename/
    return null;
  }
  // pathname以`${basename}/`开头
  // pathname.slice(basename.length)： eg: pathname = `${basename}/xxx`, pathname.slice(basename.length) = '/xxx'
  return pathname.slice(basename.length) || "/";
}
/** 
 * @description 将paths用 `/` 连起来，然后替换掉所有 `//`
 * 
 * @example
 * - joinPaths(['baozouai', '/react-router-source-analysis']) => 'baozouai/react-router-source-analysis'
 * - joinPaths(['baozouai/', '/react-router-source-analysis']) => 'baozouai/react-router-source-analysis'
 */
const joinPaths = (paths: string[]): string =>
  paths.join("/").replace(/\/\/+/g, "/");
/**
 * @description 去除掉尾部的/,头部如果有多个"/",只保留一个
 * 
 * @example
 * normalizePathname('//github.com/baozouai//') => '/github.com/baozouai'
 */
const normalizePathname = (pathname: string): string =>
  pathname.replace(/\/+$/, "").replace(/^\/*/, "/");

/**
 * @description 
 * - `search`为空字符串""或只有"?"，那么返回空字符串""
 * - 如果不是上面的情况且`search`以?开头，那么直接返回`search`
 * - 否则返回`"?" + search`
 * @example
 * normalizeSearch('') => ''
 * normalizeSearch('?') => ''
 * normalizeSearch('?a') => '?a'
 * normalizeSearch('a') => '?a'
 */
const normalizeSearch = (search: string): string =>
  !search || search === "?"
    ? ""
    : search.startsWith("?")
    ? search
    : "?" + search;

/**
 * @description 
 * - `hash`为空字符串""或只有"#"，那么返回空字符串""
 * - 如果不是上面的情况且`hash`以#开头，那么直接返回`hash`
 * - 否则返回`"#" + hash`
 * @example
 * normalizeHash('') => ''
 * normalizeHash('#') => ''
 * normalizeHash('#a') => '#a'
 * normalizeHash('a') => '#a'
 */
const normalizeHash = (hash: string): string =>
  !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
///////////////////////////////////////////////////////////////////////////////
// DANGER! PLEASE READ ME!
// We provide these exports as an escape hatch in the event that you need any
// routing data that we don't provide an explicit API for. With that said, we
// want to cover your use case if we can, so if you feel the need to use these
// we want to hear from you. Let us know what you're building and we'll do our
// best to make sure we can support you!
//
// We consider these exports an implementation detail and do not guarantee
// against any breaking changes, regardless of the semver release. Use with
// extreme caution and only if you understand the consequences. Godspeed.
///////////////////////////////////////////////////////////////////////////////

/** @internal */
export {
  NavigationContext as UNSAFE_NavigationContext,
  LocationContext as UNSAFE_LocationContext,
  RouteContext as UNSAFE_RouteContext
};
