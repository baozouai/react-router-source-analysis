import * as React from "react";
import { create as createTestRenderer } from "react-test-renderer";
import { MemoryRouter, Routes, Route } from "react-router";

describe("<Routes>", () => {
  let consoleWarn: jest.SpyInstance;
  beforeEach(() => {
    consoleWarn = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarn.mockRestore();
  });

  it("renders null and issues a warning when no routes match the URL", () => {
    let renderer = createTestRenderer(
      <MemoryRouter>
        <Routes />
      </MemoryRouter>
    );

    expect(renderer.toJSON()).toBeNull();
    expect(consoleWarn).toHaveBeenCalledTimes(1);
    expect(consoleWarn).toHaveBeenCalledWith(
      expect.stringContaining("No routes matched location")
    );
  });

  it("renders the first route that matches the URL", () => {
    let renderer = createTestRenderer(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
        </Routes>
      </MemoryRouter>
    );

    expect(renderer.toJSON()).toMatchInlineSnapshot(`
      <h1>
        Home
      </h1>
    `);
  });

  it("does not render a 2nd route that also matches the URL", () => {
    let renderer = createTestRenderer(
      <MemoryRouter initialEntries={["/home"]}>
        <Routes>
          <Route path="home" element={<h1>Home</h1>} />
          <Route path="home" element={<h1>Dashboard</h1>} />
        </Routes>
      </MemoryRouter>
    );

    expect(renderer.toJSON()).toMatchInlineSnapshot(`
      <h1>
        Home
      </h1>
    `);
  });

  it("renders with non-element children", () => {
    let renderer = createTestRenderer(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          {false}
          {undefined}
        </Routes>
      </MemoryRouter>
    );

    expect(renderer.toJSON()).toMatchInlineSnapshot(`
      <h1>
        Home
      </h1>
    `);
  });

  it("renders with React.Fragment children", () => {
    let renderer = createTestRenderer(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <React.Fragment>
            <Route path="admin" element={<h1>Admin</h1>} />
          </React.Fragment>
        </Routes>
      </MemoryRouter>
    );

    expect(renderer.toJSON()).toMatchInlineSnapshot(`
      <h1>
        Admin
      </h1>
    `);
  });
});
