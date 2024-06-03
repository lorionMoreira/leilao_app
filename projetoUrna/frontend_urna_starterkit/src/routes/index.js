import React from "react"
import { Navigate } from "react-router-dom"

// Profile
import UserProfile from "../pages/Profile/user-profile"
import UserProfileAdd from "../pages/Profile/user-profile-add"
import ProfileExpAdd from "../pages/Profile/user-profile-experimento-add"


// Dashboard
import Dashboard from "../pages/Dashboard/index"


// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

// Dashboard

// Componentes
import Componentes from "../pages/Componentes/index"
//tipoComponente

//salas
import SalaGerenciar from "../pages/Salas/Add/SalasGerenciar"

//usuarios
import Usuarios from "pages/Usuarios/index"

//leilões disponiveis
import LeiloesDisponiveis from "../pages/LeiloesDisponiveis/index"

//leilões sala
import LeilaoSala from "../pages/LeilaoSala/Chat"

// not found 
import NotFound from "pages/NotFound/pages-404"

const authProtectedRoutes = [


  //Componentes
  { path: "/salas/adicionar", component: <SalaGerenciar/> },

  //usuarios
  { path: "/usuarios/adicionar", component: <Usuarios/> },

   //profile
  { path: "/profile", component: <UserProfile/> },
  { path: "/profile/mydisciplina", component: <UserProfileAdd /> },
  { path: "/profile/experimentoadd/:disciplinaId", component: <ProfileExpAdd /> },

  //dashboard
  { path: "/dashboard", component: <Dashboard/> },

  //leiloes
  { path: "/leiloes/buscar", component: <LeiloesDisponiveis/> },

  { path: "/leiloes/sala/:uuid", component: <LeilaoSala/> },
  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
   {
    path: "/",
    exact: true,
    component: < Navigate to="/dashboard" />,
  },
    // "not found" route
    {
      path: "*", // or "/"
      component: <NotFound />,
    },
]

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login-safe", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },
]

export { authProtectedRoutes, publicRoutes }

