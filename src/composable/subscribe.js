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

export { sendOTP };
