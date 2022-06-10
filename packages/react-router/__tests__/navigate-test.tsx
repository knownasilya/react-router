import * as React from "react";
import * as TestRenderer from "react-test-renderer";
import { MemoryRouter, Navigate, Outlet, Routes, Route } from "react-router";

describe("<Navigate>", () => {
  describe("with an absolute href", () => {
    it("navigates to the correct URL", () => {
      let renderer: TestRenderer.ReactTestRenderer;
      TestRenderer.act(() => {
        renderer = TestRenderer.create(
          <MemoryRouter initialEntries={["/home"]}>
            <Routes>
              <Route path="home" element={<Navigate to="/about" />} />
              <Route path="about" element={<h1>About</h1>} />
            </Routes>
          </MemoryRouter>
        );
      });

      expect(renderer.toJSON()).toMatchInlineSnapshot(`
        <h1>
          About
        </h1>
      `);
    });
  });

  describe("with a relative href", () => {
    it("navigates to the correct URL", () => {
      let renderer: TestRenderer.ReactTestRenderer;
      TestRenderer.act(() => {
        renderer = TestRenderer.create(
          <MemoryRouter initialEntries={["/home"]}>
            <Routes>
              <Route path="home" element={<Navigate to="../about" />} />
              <Route path="about" element={<h1>About</h1>} />
            </Routes>
          </MemoryRouter>
        );
      });

      expect(renderer.toJSON()).toMatchInlineSnapshot(`
        <h1>
          About
        </h1>
      `);
    });

    it("handles upward navigation from an index routes", () => {
      let renderer: TestRenderer.ReactTestRenderer;
      TestRenderer.act(() => {
        renderer = TestRenderer.create(
          <MemoryRouter initialEntries={["/home"]}>
            <Routes>
              <Route path="home">
                <Route index element={<Navigate to="../about" />} />
              </Route>
              <Route path="about" element={<h1>About</h1>} />
            </Routes>
          </MemoryRouter>
        );
      });

      expect(renderer.toJSON()).toMatchInlineSnapshot(`
        <h1>
          About
        </h1>
      `);
    });

    it("handles upward navigation from inside a pathless layout route", () => {
      let renderer: TestRenderer.ReactTestRenderer;
      TestRenderer.act(() => {
        renderer = TestRenderer.create(
          <MemoryRouter initialEntries={["/home"]}>
            <Routes>
              <Route element={<Outlet />}>
                <Route path="home" element={<Navigate to="../about" />} />
              </Route>
              <Route path="about" element={<h1>About</h1>} />
            </Routes>
          </MemoryRouter>
        );
      });

      expect(renderer.toJSON()).toMatchInlineSnapshot(`
        <h1>
          About
        </h1>
      `);
    });

    it("handles upward navigation from inside multiple pathless layout routes + index route", () => {
      let renderer: TestRenderer.ReactTestRenderer;
      TestRenderer.act(() => {
        renderer = TestRenderer.create(
          <MemoryRouter initialEntries={["/home"]}>
            <Routes>
              <Route path="home">
                <Route element={<Outlet />}>
                  <Route element={<Outlet />}>
                    <Route element={<Outlet />}>
                      <Route index element={<Navigate to="../about" />} />
                    </Route>
                  </Route>
                </Route>
              </Route>
              <Route path="about" element={<h1>About</h1>} />
            </Routes>
          </MemoryRouter>
        );
      });

      expect(renderer.toJSON()).toMatchInlineSnapshot(`
        <h1>
          About
        </h1>
      `);
    });

    it("handles upward navigation from inside multiple pathless layout routes + path route", () => {
      let renderer: TestRenderer.ReactTestRenderer;
      TestRenderer.act(() => {
        renderer = TestRenderer.create(
          <MemoryRouter initialEntries={["/home/page"]}>
            <Routes>
              <Route path="home" element={<Outlet />}>
                <Route element={<Outlet />}>
                  <Route element={<Outlet />}>
                    <Route element={<Outlet />}>
                      <Route
                        path="page"
                        element={<Navigate to="../../about" />}
                      />
                    </Route>
                  </Route>
                </Route>
              </Route>
              <Route path="about" element={<h1>About</h1>} />
            </Routes>
          </MemoryRouter>
        );
      });

      expect(renderer.toJSON()).toMatchInlineSnapshot(`
        <h1>
          About
        </h1>
      `);
    });

    it("handles parent navigation from inside multiple pathless layout routes", () => {
      let renderer: TestRenderer.ReactTestRenderer;
      TestRenderer.act(() => {
        renderer = TestRenderer.create(
          <MemoryRouter initialEntries={["/home/page"]}>
            <Routes>
              <Route
                path="home"
                element={
                  <>
                    <h1>Home</h1>
                    <Outlet />
                  </>
                }
              >
                <Route element={<Outlet />}>
                  <Route element={<Outlet />}>
                    <Route element={<Outlet />}>
                      <Route
                        path="page"
                        element={
                          <>
                            <h2>Page</h2>
                            <Navigate to=".." />
                          </>
                        }
                      />
                    </Route>
                  </Route>
                </Route>
              </Route>
              <Route path="about" element={<h1>About</h1>} />
            </Routes>
          </MemoryRouter>
        );
      });

      expect(renderer.toJSON()).toMatchInlineSnapshot(`
        <h1>
          Home
        </h1>
      `);
    });

    it("handles relative navigation from nested index route", () => {
      let renderer: TestRenderer.ReactTestRenderer;
      TestRenderer.act(() => {
        renderer = TestRenderer.create(
          <MemoryRouter initialEntries={["/layout/thing"]}>
            <Routes>
              <Route path="layout">
                <Route path=":param">
                  {/* redirect /layout/:param/ index routes to /layout/:param/dest */}
                  <Route index element={<Navigate to="dest" />} />
                  <Route path="dest" element={<h1>Destination</h1>} />
                </Route>
              </Route>
            </Routes>
          </MemoryRouter>
        );
      });

      expect(renderer.toJSON()).toMatchInlineSnapshot(`
        <h1>
          Destination
        </h1>
      `);
    });
  });
});
