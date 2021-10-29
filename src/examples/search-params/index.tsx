import * as React from "react";
import { Link, Route, Routes, useSearchParams } from "react-router-dom";

export default function App() {
  return (
    <div>
      <h1>React Router - Search Params Example</h1>
      <Routes>
        <Route index element={<Home />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </div>
  );
}

function randomUser() {
  const users = ["chaance", "jacob-ebey", "mcansh", "mjackson", "ryanflorence"];
  return users[Math.floor(Math.random() * users.length)];
}

function Home() {
  const [search, setSearch] = useSearchParams();

  // The `search` object is a URLSearchParams object.
  // See https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
  const user = search.get("user");

  const [userData, setUserData] = React.useState<any>(null);

  React.useEffect(() => {
    let cleanupWasCalled = false;
    const abortController = new AbortController();

    async function getGitHubUser() {
      const response = await fetch(`https://api.github.com/users/${user}`, {
        signal: abortController.signal
      });
      const data = await response.json();
      if (cleanupWasCalled) return;
      setUserData(data);
    }

    if (user) {
      getGitHubUser();
    }

    return () => {
      cleanupWasCalled = true;
      abortController.abort();
    };
  }, [user]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newUser = formData.get("user") as string;
    if (!newUser) return;
    setSearch({ user: newUser });
  }

  function handleRandomSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newUser = randomUser();
    // our new random user is the same as our current one, let's try again
    if (newUser === user) {
      handleRandomSubmit(event);
    } else {
      setSearch({ user: newUser });
    }
  }

  return (
    <div>
      <div style={{ display: "flex" }}>
        <form onSubmit={handleSubmit}>
          <label>
            <input defaultValue={user ?? undefined} type="text" name="user" />
          </label>
          <button type="submit">Search</button>
        </form>
        <form onSubmit={handleRandomSubmit}>
          <input type="hidden" name="random" />
          <button type="submit">Random</button>
        </form>
      </div>

      {userData && (
        <div
          style={{
            padding: "24px",
            margin: "24px 0",
            borderTop: "1px solid #eaeaea",
            display: "flex",
            alignItems: "center",
            gap: "16px"
          }}
        >
          <img
            style={{ borderRadius: "50%" }}
            width={200}
            height={200}
            src={userData.avatar_url}
            alt={userData.login}
          />
          <div>
            <h2>{userData.name}</h2>
            <p>{userData.bio}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/search-params">Go to the home page</Link>
      </p>
    </div>
  );
}
