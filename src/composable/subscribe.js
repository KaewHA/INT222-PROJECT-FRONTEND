async function sendOTP(email) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/sub/otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email),
    });
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("Error, data is error!");
    }
  } catch (error) {
    console.log(error);
  }
}


async function CHECKOTP(obj) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/sub/otp`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    if (res.ok) {
      return res.status
    } else {
      console.log(JSON.stringify(obj));
      return res.status
    }
  } catch (error) {
    console.log(error);
  }
}

async function ADDNEWSUB(INFO) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/sub`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(INFO),
    });
    if (res.ok) {
      return res.json();
    } else {
      return res.status
    }
  } catch (error) {
    console.log(error);
  }
}
export { sendOTP,CHECKOTP,ADDNEWSUB };

