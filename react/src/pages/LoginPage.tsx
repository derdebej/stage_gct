import React from "react";
import Login from "../components/Login";
import logo from "../assets/Groupe_chimique_tunisien.jpg";

function LoginPage() {
  return (
    <>
      <img className="fixed  h-30 left-7 top-4 " src={logo} alt="GCT logo" />
      <div className="flex justify-around items-center bg-white h-screen">
        <div>
          <div className=" text-5xl">
            <span className="text-7xl font-bold text-blue-900">
              Bienvenue ,
            </span>{" "}
            <br />
            dans la plate-forme <br /> de gestion d’achats <br /> de{" "}
            <span className="text-7xl text-blue-900 font-bold">G.C.T</span>
          </div>
        </div>
        <Login />
      </div>
    </>
  );
}
export default LoginPage;