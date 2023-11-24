async function tranferfile(data, token) {
  try {
    let auth = "Bearer " + token;
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/file`, {
      method: "POST",
      headers: {
        Authorization: auth,
      },
      body: data,
    });
    if (res.status == 200) {
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
    if (res.status == 200) {
      return res.json();
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
}

async function delFile(data, id, token) {
  try {
    let auth = "Bearer " + token;
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/file/delete/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
        body: JSON.stringify(data),
      }
    );
    if (res.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
}

async function checkAnnFiles(id) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/file/getfile?id=${id}`,
      {
        method: "GET",
      }
    );
    if (res.status == 200) {
      return 200;
    } else {
      return 404;
    }
  } catch (error) {
    console.log(error);
  }
}
export { tranferfile, getfileslist, delFile, checkAnnFiles };
