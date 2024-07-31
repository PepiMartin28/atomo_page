import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {LoginPage} from './pages/LoginPage';
import { AdminPage } from "./pages/AdminPage";
import { EmployeePage } from "./pages/EmployeePage";
import { ProtocolDetailPage } from "./pages/ProtocolDetailPage"
import { ProfilePage } from "./pages/ProfilePage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProtocolPage } from "./pages/ProtocolPage";
import { ProtocolDetailAdminPage } from "./pages/ProtocolDetailAdminPage";
import { AddProtocolPage } from "./pages/AddProtocolPage";
import { EditProtocolPage } from "./pages/EditProtocolPage";
import { AddContentPage } from "./pages/AddContentPage";
import { EditContentPage } from "./pages/EditContentPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { CategoryDetailPage } from "./pages/CategoryDetailPage";
import { AddCategoryPage } from "./pages/AddCategoryPage";
import { EditCategoryPage } from "./pages/EditCategoryPage";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/login'/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/admin' element={<AdminPage/>} />
        <Route path='/employee' element={<EmployeePage/>} />
        <Route path="/protocol/:protocol_id" element={<ProtocolDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/resetPassword/:employee_id" element={<ResetPasswordPage />} />
        <Route path="/register/:employee_id" element={<RegisterPage />} />
        <Route path="/admin/protocols" element={<ProtocolPage />} />
        <Route path="/admin/protocols/:protocol_id" element={<ProtocolDetailAdminPage />} />
        <Route path="/admin/add_protocol" element={<AddProtocolPage />} />
        <Route path="/admin/edit_protocol/:protocol_id" element={<EditProtocolPage />} />
        <Route path="/admin/add_content/:protocol_id" element={<AddContentPage />} />
        <Route path="/admin/edit_content/:content_id" element={<EditContentPage />} />
        <Route path="/admin/categories" element={<CategoriesPage />} />
        <Route path="/admin/categories/:category_id" element={<CategoryDetailPage />} />
        <Route path="/admin/categories/add_category" element={<AddCategoryPage />} />
        <Route path="/admin/categories/edit_category/:category_id" element={<EditCategoryPage />} />
        {/* <Route path="/admin/employees" element={<RegisterPage />} /> */}
        {/* <Route path="/admin/groups" element={<RegisterPage />} /> */}
        {/* <Route path="/admin/categories" element={<RegisterPage />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
