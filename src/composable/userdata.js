async function getAllUser(mode = "admin", category = 0,token) {
  let api = `${import.meta.env.VITE_BASE_URL}/api/users`;
  let auth = "Bearer "+token;
  try {
    const res = await fetch(api, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
    });
    if (res.ok) {
      const user = await res.json();
      return user;
    } else throw new Error("CAN'T FETCH");
  } catch (error) {
    console.error(error);
  }
}

async function getUserDetail(id,token) {
  let api = `${import.meta.env.VITE_BASE_URL}/api/users/${id}`
  let auth = "Bearer "+token;
  try {
    const res = await fetch(api, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
    });
    const user = await res.json();
    if (res.ok) {
      return user;
    } else throw new Error("CAN'T FETCH");
  } catch (error) {
    console.error(error);
  }
}

async function addUser(user,token) {
  let auth = "Bearer "+token;
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
        body: JSON.stringify(user),
      }
    );
    const errRes = await res.json()
    if (res.ok) {
      return true
    } else {
      return errRes.detail;
    }
  } catch (error) {
    console.log(error);
  }
}

async function updateUserById(user, id,token) {
  let auth = "Bearer "+token;
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/users/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
        body: JSON.stringify(user),
      }
    );
    const errRes = await res.json()
    if (res.ok) {
      return true
    } else {
      return errRes.detail
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteUserData(id,token) {
  let auth = "Bearer "+token;
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/users/${id}`,
      { method: "DELETE" ,headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      }}
    );
    if (res.ok) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log(error);
  }
}
async function Authenfund(user) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/users/match`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (res.ok) {
      return 200;
    } else if(res.status === 404) {
      return 404;
    } else {
      return 401
    }
  } catch (error) {
    console.log(error);
  }
}



export { getAllUser, getUserDetail, addUser, updateUserById, deleteUserData, Authenfund }