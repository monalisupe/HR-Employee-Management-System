
const supabase = require("../config/supabase");

// CHANGE 1: Removed the console.log using req.body
// from outside the function because req is unavailable there.

const register = async (req, res) => {
  try {
    // CHANGE 2: Read both common naming formats.
    // This supports fullName and full_name from the frontend.
    const fullName = (req.body.fullName || req.body.full_name || "").trim();
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password;

    // CHANGE 3: Keep debugging inside the request handler.
    // This lets us see the received field names without logging passwords.
    console.log("Registration fields received:", {
      fullNameReceived: Boolean(fullName),
      emailReceived: Boolean(email),
      passwordReceived: Boolean(password),
    });

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, and password are required",
      });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Existing Supabase Auth registration logic.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: "candidate",
        },
      },
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: data.session
        ? "Registration successful"
        : "Registration received. Check your email to confirm your account.",
      user: data.user
        ? {
          id: data.user.id,
          email: data.user.email,
        }
        : null,
      requiresEmailConfirmation: !data.session,
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to complete registration",
    });
  }
};

module.exports = { register };
//
