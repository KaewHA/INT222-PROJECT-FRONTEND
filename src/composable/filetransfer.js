async function tranferfile(data, token) {
    try {
      let auth = "Bearer "+token;
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/file`,
        {
          method: "POST",
          headers: {
            Authorization: auth,
          },
          body: data,
        }
      );
      if (res.status==200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  }


  export {tranferfile}