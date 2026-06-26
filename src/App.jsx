import React, { useState } from "react";

// Update this to match your Express server's base URL and port
const API_BASE_URL ="https://rutech-backend.onrender.com/api/auth"; 

export default function App() {
  const [currentPage, setCurrentPage] = useState("subscribe"); 

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <button 
          style={{...styles.navButton, ...(currentPage === "subscribe" ? styles.activeNav : {})}} 
          onClick={() => setCurrentPage("subscribe")}
        >
          Subscribe
        </button>
        <button 
          style={{...styles.navButton, ...(currentPage === "unsubscribe" ? styles.activeNav : {})}} 
          onClick={() => setCurrentPage("unsubscribe")}
        >
          Unsubscribe
        </button>
      </nav>

      <main style={styles.mainContent}>
        {currentPage === "subscribe" ? <SubscribePage /> : <UnsubscribePage />}
      </main>
    </div>
  );
}

/* ==========================================================================
   PAGE 1: SUBSCRIBE PAGE
   ========================================================================== */
function SubscribePage() {
  const [step, setStep] = useState(1); // 1: Send OTP Form, 2: Verify OTP Form
  const [formData, setFormData] = useState({ name: "", email: "", otp: "" });
  const [message, setMessage] = useState({ text: "", isError: false });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Request OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", isError: false });

    try {
      // Points to your sendotp controller
      const response = await fetch(`${API_BASE_URL}/sendotp`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email }),
      });
      const data = await response.json();

      // Maps directly to your backend's "status: true" payload response
      if (response.ok && (data.status === true || data.success === true)) {
        setMessage({ text: "OTP sent successfully! Please check your email inbox.", isError: false });
        setStep(2);
      } else {
        setMessage({ text: data.message || "Failed to dispatch OTP.", isError: true });
      }
    } catch (error) {
      setMessage({ text: "Unable to connect to server.", isError: true });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Compare OTP & Complete Subscription
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", isError: false });

    try {
      // Points to your compareotp controller
      const response = await fetch(`${API_BASE_URL}/compareotp`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok && data.success === true) {
        setMessage({ text: "Verification complete! Welcome to our newsletter subscription.", isError: false });
        setFormData({ name: "", email: "", otp: "" });
        setStep(1);
      } else {
        setMessage({ text: data.message || "Incorrect OTP sequence.", isError: true });
      }
    } catch (error) {
      setMessage({ text: "Unable to connect to server.", isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2>Subscribe to Newsletter</h2>
      <p>Verify your email to sign up for premium updates.</p>
      
      {message.text && (
        <div style={{ ...styles.alert, backgroundColor: message.isError ? "#ffebee" : "#e8f5e9", color: message.isError ? "#c62828" : "#2e7d32" }}>
          {message.text}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleSendOtp} style={styles.form}>
          <input 
            type="text" name="name" placeholder="Full Name" required 
            value={formData.name} onChange={handleChange} style={styles.input} 
          />
          <input 
            type="email" name="email" placeholder="Email address" required 
            value={formData.email} onChange={handleChange} style={styles.input} 
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Sending OTP..." : "Get Verification Code"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} style={styles.form}>
          <p>Verification code sent to: <strong>{formData.email}</strong></p>
          <input 
            type="text" name="otp" placeholder="Enter OTP Code" required 
            value={formData.otp} onChange={handleChange} style={styles.input} 
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Confirming..." : "Verify & Activate"}
          </button>
          <button type="button" onClick={() => setStep(1)} style={styles.linkButton}>
            Change Email Address
          </button>
        </form>
      )}
    </div>
  );
}

/* ==========================================================================
   PAGE 2: UNSUBSCRIBE PAGE
   ========================================================================== */
function UnsubscribePage() {
  const [step, setStep] = useState(1); // 1: Send Unsubscribe OTP, 2: Verify Unsubscribe
  const [formData, setFormData] = useState({ email: "", otp: "" });
  const [message, setMessage] = useState({ text: "", isError: false });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Request Unsubscribe OTP
  const handleSendUnsubOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", isError: false });

    try {
      // Points to your deletesubssendotp controller
      const response = await fetch(`${API_BASE_URL}/deletesubssendotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await response.json();

      if (response.ok && data.success === true) {
        setMessage({ text: "A otp has been sent to your mail.", isError: false });
        setStep(2);
      } else {
        setMessage({ text: data.message || "Failed to process unsubscribe request.", isError: true });
      }
    } catch (error) {
      setMessage({ text: "Unable to connect to server.", isError: true });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm OTP Cancellation
  const handleConfirmUnsub = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", isError: false });

    try {
      // Points to your deletesubscompareotp controller
      const response = await fetch(`${API_BASE_URL}/deletesubscompareotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: formData.otp }),
      });
      const data = await response.json();

      if (response.ok && data.success === true) {
        setMessage({ text: "Unsubscribed successfully. Your storage files have been updated.", isError: false });
        setFormData({ email: "", otp: "" });
        setStep(1);
      } else {
        setMessage({ text: data.message || "Cancellation failed. Code did not match.", isError: true });
      }
    } catch (error) {
      setMessage({ text: "Unable to connect to server.", isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2>Unsubscribe</h2>
      <p>Enter your registration email below to cancel your membership subscription.</p>

      {message.text && (
        <div style={{ ...styles.alert, backgroundColor: message.isError ? "#ffebee" : "#e8f5e9", color: message.isError ? "#c62828" : "#2e7d32" }}>
          {message.text}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleSendUnsubOtp} style={styles.form}>
          <input 
            type="email" name="email" placeholder="Registered Email Address" required 
            value={formData.email} onChange={handleChange} style={styles.input} 
          />
          <button type="submit" disabled={loading} style={{...styles.button, backgroundColor: "#dc3545"}}>
            {loading ? "Processing..." : "Deactivate Subscription"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleConfirmUnsub} style={styles.form}>
          <p>Processing cancellation request for: <strong>{formData.email}</strong></p>
          <input 
            type="text" name="otp" placeholder="Enter Verification Code" required 
            value={formData.otp} onChange={handleChange} style={styles.input} 
          />
          <button type="submit" disabled={loading} style={{...styles.button, backgroundColor: "#bd2130"}}>
            {loading ? "Cancelling..." : "Confirm Removal"}
          </button>
          <button type="button" onClick={() => setStep(1)} style={styles.linkButton}>
            Go Back
          </button>
        </form>
      )}
    </div>
  );
}

/* ==========================================================================
   STYLING DEFINITIONS
   ========================================================================== */
const styles = {
  container: {
    fontFamily: "system-ui, -apple-system, sans-serif",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  navbar: {
    display: "flex",
    gap: "12px",
    margin: "40px 0 20px 0",
    backgroundColor: "#ffffff",
    padding: "6px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
  },
  navButton: {
    padding: "8px 16px",
    border: "none",
    background: "none",
    fontSize: "15px",
    cursor: "pointer",
    borderRadius: "6px",
    transition: "background-color 0.2s, color 0.2s"
  },
  activeNav: {
    backgroundColor: "#007bff",
    color: "#ffffff",
    fontWeight: "600"
  },
  mainContent: {
    width: "100%",
    maxWidth: "420px",
    padding: "0 16px"
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "32px",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    textAlign: "center"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    marginTop: "24px"
  },
  input: {
    padding: "10px 14px",
    fontSize: "15px",
    border: "1px solid #ced4da",
    borderRadius: "6px",
    outline: "none"
  },
  button: {
    padding: "11px",
    fontSize: "15px",
    backgroundColor: "#007bff",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600"
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "#007bff",
    textDecoration: "underline",
    cursor: "pointer",
    fontSize: "13px",
    marginTop: "6px"
  },
  alert: {
    padding: "12px",
    borderRadius: "6px",
    fontSize: "14px",
    textAlign: "left",
    lineHeight: "1.4"
  }
};
