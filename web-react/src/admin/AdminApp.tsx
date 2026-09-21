import { Navigate, Route, Routes } from "react-router-dom";
import "./admin.css";
import { AdminAuthProvider, useAdminAuth } from "./AdminAuth";
import { AdminDataProvider } from "./useAdminData";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminShell } from "./AdminShell";
import { AdminPanel } from "./pages/AdminPanel";
import { AdminAyarlar } from "./pages/AdminAyarlar";
import { AdminHizmetler } from "./pages/AdminHizmetler";
import { AdminGaleri } from "./pages/AdminGaleri";
import { AdminSayfalar } from "./pages/AdminSayfalar";
import { AdminCeviriler } from "./pages/AdminCeviriler";

function AdminGate() {
  const { girisYapildi } = useAdminAuth();

  if (!girisYapildi) {
    return (
      <Routes>
        <Route path="*" element={<AdminLogin />} />
      </Routes>
    );
  }

  return (
    <AdminDataProvider>
      <AdminShell>
        <Routes>
          <Route index element={<AdminPanel />} />
          <Route path="ayarlar" element={<AdminAyarlar />} />
          <Route path="hizmetler" element={<AdminHizmetler />} />
          <Route path="galeri" element={<AdminGaleri />} />
          <Route path="sayfalar" element={<AdminSayfalar />} />
          <Route path="ceviriler" element={<AdminCeviriler />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AdminShell>
    </AdminDataProvider>
  );
}

export default function AdminApp() {
  return (
    <div className="akdadmin">
      <AdminAuthProvider>
        <AdminGate />
      </AdminAuthProvider>
    </div>
  );
}
