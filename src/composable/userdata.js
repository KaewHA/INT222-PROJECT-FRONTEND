async function getAllUser(mode = "admin", category = 0) {
    let api = `${import.meta.env.VITE_BASE_URL}/api/users`;
    try {
      const res = await fetch(api);
      if (res.ok) {
        const user = await res.json();
        return user;
      } else throw new Error("CANT FETCH");
    } catch (error) {
      console.error(error);
    }
  }


  export{getAllUser}