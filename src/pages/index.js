import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Toggle between login/signup
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/dashboard");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Signup successful! Now you can log in.");
        setIsLogin(true);
      }
    } catch (error) {
      console.error(`${isLogin ? "Login" : "Signup"} failed:`, error.message);
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{ display: "block", margin: "10px auto" }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={{ display: "block", margin: "10px auto" }}
        />
        <button type="submit" style={{ margin: "10px" }}>
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>
      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{ color: "blue", background: "none", border: "none", cursor: "pointer" }}
        >
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
}

