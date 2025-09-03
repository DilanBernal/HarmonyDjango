import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import RegisterViewModel from "../viewmodels/RegisterViewModel";
import { useNavigate } from "react-router-dom";
import Mapa from "./Mapa";

export default function Register() {
 const navigate = useNavigate();
 const { t } = useTranslation();
 const vm = RegisterViewModel();
 const [email, setEmail] = useState("");
 const [username, setUsername] = useState("");
 const [password, setPassword] = useState("");
 const [coordenadas, setCoordenadas] = useState(null);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);

 //  const onSubmit = async (e) => {
 //   e.preventDefault();
 //   setLoading(true);
 //   setError(null);
 //   try {
 //    const payload = { email, username, password };
 //    if (coordenadas && coordenadas.lng != null && coordenadas.lat != null) {
 //     payload.location = {
 //      type: "Point",
 //      coordinates: [parseFloat(coordenadas.lng), parseFloat(coordenadas.lat)],
 //     };
 //    }

 //    await vm.register(payload);
 //    console.log(payload)
 //    alert(t("register.success"));
 //    navigate("/login");
 //   } catch (err) {
 //     console.log(err)
 //    setError(err.response?.data || err.message || t("register.failed"));
 //   } finally {
 //    setLoading(false);
 //   }
 //  };

 const onSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  try {
   const payload = { email, username, password };
   if (coordenadas && coordenadas.lng != null && coordenadas.lat != null) {
    payload.location = {
     type: "Point",
     coordinates: [parseFloat(coordenadas.lng), parseFloat(coordenadas.lat)],
    };
   }

   await vm.register(payload);
   alert(t("register.success"));
   navigate("/login");
  } catch (err) {
   console.error("Registration error:", err);

   // Manejar diferentes tipos de errores
   if (err.response?.data) {
    // Si el backend devuelve un objeto de error
    setError(err.response.data.message || JSON.stringify(err.response.data));
   } else if (err.message) {
    setError(err.message);
   } else {
    setError(t("register.failed"));
   }
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

    <div className="mb-3">
     <h5>{t("register.location_title") || "Ubicación"}</h5>
     <Mapa
      coordenadas={coordenadas}
      onCoordenadasChange={(coords) => setCoordenadas(coords)}
     />
     <div className="mt-2">
      <small className="text-muted">
       {coordenadas
        ? `${coordenadas.lat.toFixed(6)}, ${coordenadas.lng.toFixed(6)}`
        : t("register.location_help") ||
          "Clic en el mapa para seleccionar ubicación."}
      </small>
     </div>
    </div>
    {error && <div className="text-danger">{JSON.stringify(error)}</div>}
   </form>
  </div>
 );
}
