import * as React from "react";
import { create as createTestRenderer } from "react-test-renderer";
import { MemoryRouter, Routes, Route } from "react-router";

describe("A <Route>", () => {
  it("renders its `element` prop", () => {
    function Home() {
      return <h1>Home</h1>;
    }

    let renderer = createTestRenderer(
      <MemoryRouter initialEntries={["/home"]}>
        <Routes>
          <Route path="home" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    expect(renderer.toJSON()).toMatchInlineSnapshot(`
      <h1>
        Home
      </h1>
    `);
  });

  it("renders its child routes when no `element` prop is given", () => {
    function Home() {
      return <h1>Home</h1>;
    }

    let renderer = createTestRenderer(
      <MemoryRouter initialEntries={["/app/home"]}>
        <Routes>
          <Route path="app">
            <Route path="home" element={<Home />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(renderer.toJSON()).toMatchInlineSnapshot(`
      <h1>
        Home
      </h1>
    `);
  });
});
