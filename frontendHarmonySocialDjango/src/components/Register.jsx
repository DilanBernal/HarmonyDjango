import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import RegisterViewModel from "../viewmodels/RegisterViewModel";
import { useNavigate } from "react-router-dom";

export default function Register() {
 const navigate = useNavigate();
 const { t } = useTranslation();
 const vm = RegisterViewModel();
 const [email, setEmail] = useState("");
 const [username, setUsername] = useState("");
 const [password, setPassword] = useState("");
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);

 const onSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  try {
   await vm.register({ email, username, password });
   alert(t("register.success"));
   navigate("/login");
  } catch (err) {
   setError(err.response?.data || err.message || t("register.failed"));
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className="card p-4 m-5">
   <h3>{t("register.title")}</h3>
   <form onSubmit={onSubmit} className="d-flex flex-column gap-2 mt-3">
    <input
     className="form-control"
     placeholder={t("register.email")}
     value={email}
     onChange={(e) => setEmail(e.target.value)}
    />
    <input
     className="form-control"
     placeholder={t("register.username")}
     value={username}
     onChange={(e) => setUsername(e.target.value)}
    />
    <input
     className="form-control"
     type="password"
     placeholder={t("register.password")}
     value={password}
     onChange={(e) => setPassword(e.target.value)}
    />
    <div className="d-flex gap-2">
     <button className="btn btn-primary" disabled={loading} type="submit">
      {loading ? t("register.loading") : t("register.button")}
     </button>
     <button
      type="button"
      className="btn btn-link"
      onClick={() => navigate("/login")}
     >
      {t("register.have_account")}
     </button>
    </div>
    {error && <div className="text-danger">{JSON.stringify(error)}</div>}
   </form>
  </div>
 );
}
