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

  async function getfileslist(id) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/file?id=${id}`,
        {
          method: "GET",
        }
      );
      if (res.status==200) {
        return res.json();
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  }


  async function downloadfile(id,filename) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/file/download?id=${id}&file=${filename}`,
        {
          method: "GET",
        }
      );
      if (res.status==200) {
        return res.json();
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  }
  export {tranferfile,getfileslist}