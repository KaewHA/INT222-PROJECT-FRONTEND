async function Authenfund(user) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (res.ok) {
      const token = await res.json();
      localStorage.clear();
      localStorage.setItem("refreshtoken", token.refreshToken);
      return token.token;
    } else if (res.status === 404) {
      return 404;
    } else {
      return 401;
    }
  } catch (error) {
    console.log(error);
  }
}
async function getToken() {
  if (localStorage.getItem("refreshtoken") == null) {
    return 401
  } else {
    let api = `${import.meta.env.VITE_BASE_URL}/api/token`;
    let auth = "Bearer "+localStorage.getItem("refreshtoken");
    try {
      const res = await fetch(api, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
      });
      if (res.ok) {
        const token = await res.json();
        console.log(token);
        return token;
      } else {
        return 401;
      }
    } catch (error) {
      console.error(error);
    }
  }
}

async function checkToken(token) {
  if (token == null) {
    return 404;
  } else {
    try {
      let auth = "Bearer " + token;
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/token`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
      });
      if (res.ok) {
        return 200;
      } else if (res.status === 404) {
        return 404;
      } else {
        return 401;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
export { Authenfund, getToken, checkToken };
