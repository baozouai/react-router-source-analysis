import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { Routes, Route, useLocation } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";

describe("A <StaticRouter>", () => {
  describe("with a string location prop", () => {
    it("parses the location into an object", () => {
      let location!: ReturnType<typeof useLocation>;
      function LocationChecker() {
        location = useLocation();
        return null;
      }

      ReactDOMServer.renderToStaticMarkup(
        <StaticRouter location="/the/path?the=query#the-hash">
          <Routes>
            <Route path="/the/path" element={<LocationChecker />} />
          </Routes>
        </StaticRouter>
      );

      expect(location).toMatchObject({
        pathname: "/the/path",
        search: "?the=query",
        hash: "#the-hash",
        state: {},
        key: expect.any(String)
      });
    });
  });

  describe("with an object location prop", () => {
    it("adds missing properties", () => {
      let location!: ReturnType<typeof useLocation>;
      function LocationChecker() {
        location = useLocation();
        return null;
      }

      ReactDOMServer.renderToStaticMarkup(
        <StaticRouter
          location={{ pathname: "/the/path", search: "?the=query" }}
        >
          <Routes>
            <Route path="/the/path" element={<LocationChecker />} />
          </Routes>
        </StaticRouter>
      );

      expect(location).toMatchObject({
        pathname: "/the/path",
        search: "?the=query",
        hash: "",
        state: {},
        key: expect.any(String)
      });
    });
  });
});
