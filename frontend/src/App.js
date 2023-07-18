import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import DashLayout from "./components/DashLayout";
import Login from "./features/auth/Login";
import Welcome from "./features/auth/Welcome";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import EditNote from "./features/notes/EditNote";
import NewNote from "./features/notes/NewNote";

function App() {
   return (
      <Routes>
         <Route path="/" element={<Layout />}>
            <Route index element={<Public />} />
            <Route path="login" element={<Login />} />

            <Route path="dash" element={<DashLayout />}>
               <Route index element={<Welcome />} />

               <Route path="users">
                  <Route index element={<UsersList />} />
                  <Route path=":id" element={<EditUser />} />
                  <Route path="new" element={<NewUserForm />} />
               </Route>

               <Route path="notes">
                  <Route index element={<NotesList />} />
                  <Route path=":id" element={<EditNote />} />
                  <Route path="new" element={<NewNote />} />
               </Route>
            </Route>
            {/* End Dash */}
         </Route>
      </Routes>
   );
}

export default App;
