import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LoginViewModel from "../viewmodels/LoginViewModel";

export default function Login() {
 const { t, i18n } = useTranslation();
 const vm = LoginViewModel();
 const navigate = useNavigate();
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);

 const onSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  try {
   await vm.login({ email, password });
   navigate("/home");
  } catch (err) {
   setError(err.message || t("login.failed"));
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className="card p-4 m-5 py-5">
   <h3 className="text-center mb-4 fw-bold">{t("login.title")}</h3>
   <div className="mb-2">
    <select
     className="form-select form-select-sm"
     value={i18n.language}
     onChange={(e) => i18n.changeLanguage(e.target.value)}
    >
     <option value="en">EN</option>
     <option value="es">ES</option>
     <option value="fr">FR</option>
    </select>
   </div>
   <form onSubmit={onSubmit} className="d-flex flex-column gap-2">
    <input
     className="form-control"
     placeholder={t("login.email")}
     value={email}
     onChange={(e) => setEmail(e.target.value)}
    />
    <input
     className="form-control"
     type="password"
     placeholder={t("login.password")}
     value={password}
     onChange={(e) => setPassword(e.target.value)}
    />
    <div className="d-flex gap-2 flex-column px-2 my-2">
     <button className="btn btn-primary" type="submit" disabled={loading}>
      {loading ? t("login.loading") : t("login.button")}
     </button>
     <button
      type="button"
      className="btn btn-link"
      onClick={() => navigate("/register")}
     >
      {t("register.have_account") || "Register"}
     </button>
    </div>
    {error && <div className="text-danger">{error}</div>}
   </form>
  </div>
 );
}
