// const api = "http://intproj22.sit.kmutt.ac.th:8080/nw3/api/anno"
import router from "../router/index.js";

async function getAnnouncement(mode = "admin", category = 0) {
  let api = `${import.meta.env.VITE_BASE_URL}/api/announcements?mode=${mode}&category=${category}`;
  try {
    const res = await fetch(api);
    if (res.ok) {
      const announc = await res.json();
      return announc;
    } else throw new Error("Error, data is error! with DTO");
  } catch (error) {
    console.error(error);
  }
}
async function getuserAnnouncement(mode = "active", page = 0, category = 0) {
  let api = `${import.meta.env.VITE_BASE_URL
    }/api/announcements/pages?mode=${mode}&page=${page}&size=5&category=${category}`;
  try {
    const res = await fetch(api);
    if (res.ok) {
      const announc = await res.json();
      return announc;
    } else throw new Error("Error, data is error! with DTO");
  } catch (error) {
    console.error(error);
  }
}
async function getAnnouncementById(id) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/announcements/${id}?count=false`
    );
    const announce = await res.json()
    if (res.ok) {
      return announce
    } else {
      return {ok: res.ok, status: res.status, message: announce.message}
    }
  } catch (error) {
    console.error(error);
  }
}

async function getAnnouncementByIddata(id) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/announcements/${id}/data`
    );
    if (res.ok) {
      const announc = await res.json();
      return announc;
    } else {
      throw new Error("Error, data is error! with ID");
    }
  } catch (error) {
    console.error(error);
  }
}

async function getAnnouncementByIduser(id) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/announcements/${id}?count=true`
    );
    const announce = await res.json()
    if (res.ok) {
      return announce
    } else {
      return {ok: res.ok, status: res.status, message: announce.message}
    }
  } catch (error) {
    console.error(error);
  }
}

async function getCategory() {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/categories`);
    if (res.ok) {
      const category = await res.json();
      return category;
    } else {
      throw new Error("Error, data is error!");
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteannocement(id, token) {
    let api = `${import.meta.env.VITE_BASE_URL}/api/announcements/${id}`;
    let auth = "Bearer "+token;
    try {
      const res = await fetch(api, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
      });
      if (res.ok) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error(error);
    }
}

async function addAnnouncement(announcement, token) {
    try {
      let auth = "Bearer "+token;
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/announcements`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: auth,
          },
          body: JSON.stringify(announcement),
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
  
  async function updateAnnouncement(announcement, id, token) {
    try {
      let auth = "Bearer "+token;
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/announcements/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: auth,
          },
          body: JSON.stringify(announcement),
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


export {
  getAnnouncement,
  getAnnouncementById,
  getCategory,
  addAnnouncement,
  deleteannocement,
  updateAnnouncement,
  getAnnouncementByIddata,
  getuserAnnouncement,
  getAnnouncementByIduser,
};
