import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";

const AdminApp = lazy(() => import("@/admin/AdminApp"));
import Home from "@/pages/Home";
import Hakkimizda from "@/pages/Hakkimizda";
import Hizmetler from "@/pages/Hizmetler";
import Projeler from "@/pages/Projeler";
import Referanslar from "@/pages/Referanslar";
import Galeri from "@/pages/Galeri";
import Haberler from "@/pages/Haberler";
import Iletisim from "@/pages/Iletisim";
import Tesekkurler from "@/pages/Tesekkurler";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={null}>
            <AdminApp />
          </Suspense>
        }
      />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/kurumsal" element={<Hakkimizda />} />
        <Route path="/hakkimizda" element={<Navigate to="/kurumsal#hakkimizda" replace />} />
        <Route path="/kadromuz" element={<Navigate to="/kurumsal#kadromuz" replace />} />
        <Route path="/belgeler" element={<Navigate to="/kurumsal#belgeler" replace />} />
        <Route path="/hesap-numaralarimiz" element={<Navigate to="/kurumsal#hesaplar" replace />} />
        <Route path="/kvkk" element={<Navigate to="/kurumsal#kvkk" replace />} />
        <Route path="/hizmetler" element={<Hizmetler />} />
        <Route path="/projeler" element={<Projeler />} />
        <Route path="/referanslar" element={<Referanslar />} />
        <Route path="/medya" element={<Galeri />} />
        <Route path="/galeri" element={<Navigate to="/medya#galeri" replace />} />
        <Route path="/videolar" element={<Navigate to="/medya#videolar" replace />} />
        <Route path="/haberler" element={<Haberler />} />
        <Route path="/yorumlar" element={<Navigate to="/medya#yorum-birak" replace />} />
        <Route path="/iletisim" element={<Iletisim />} />
        <Route path="/insan-kaynaklari" element={<Navigate to="/iletisim#insan-kaynaklari" replace />} />
        <Route path="/tesekkurler" element={<Tesekkurler />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
