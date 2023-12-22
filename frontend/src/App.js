import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
} from "react-router-dom";
import {Etudiant} from "./component/EtudiantComponent/etudiant";
import {Matiere} from "./component/MatiereComponent/Matiere";
import {NavBar} from "./component/NavBarComponent/NavBar";
import {EtudiantDetail} from "./component/EtudiantComponent/etudiantDetail";

const Layout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Etudiant />,
      },
      {
        path: "/matiere",
        element: <Matiere />,
      },
      {
        path: "/etudiant",
        element: <Etudiant />,
      },
      {
        path: "/etudiant-note/:id",
        element : <EtudiantDetail />,
      },
    ],
  },
  {
    path: "/register",
    element: <p>register</p>,
  },
  {
    path: "/login",
    element: <p>login</p>,
  },
]);

function App() {
  return (
    <>
      <>
        <RouterProvider router={router} />
      </>
    </>
  );
}

export default App;