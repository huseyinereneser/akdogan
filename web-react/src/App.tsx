import { Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import Hakkimizda from "@/pages/Hakkimizda";
import Kadromuz from "@/pages/Kadromuz";
import Belgeler from "@/pages/Belgeler";
import HesapNumaralarimiz from "@/pages/HesapNumaralarimiz";
import Kvkk from "@/pages/Kvkk";
import Hizmetler from "@/pages/Hizmetler";
import Projeler from "@/pages/Projeler";
import Referanslar from "@/pages/Referanslar";
import Galeri from "@/pages/Galeri";
import Videolar from "@/pages/Videolar";
import Haberler from "@/pages/Haberler";
import Yorumlar from "@/pages/Yorumlar";
import Iletisim from "@/pages/Iletisim";
import InsanKaynaklari from "@/pages/InsanKaynaklari";
import Tesekkurler from "@/pages/Tesekkurler";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/hakkimizda" element={<Hakkimizda />} />
        <Route path="/kadromuz" element={<Kadromuz />} />
        <Route path="/belgeler" element={<Belgeler />} />
        <Route path="/hesap-numaralarimiz" element={<HesapNumaralarimiz />} />
        <Route path="/kvkk" element={<Kvkk />} />
        <Route path="/hizmetler" element={<Hizmetler />} />
        <Route path="/projeler" element={<Projeler />} />
        <Route path="/referanslar" element={<Referanslar />} />
        <Route path="/galeri" element={<Galeri />} />
        <Route path="/videolar" element={<Videolar />} />
        <Route path="/haberler" element={<Haberler />} />
        <Route path="/yorumlar" element={<Yorumlar />} />
        <Route path="/iletisim" element={<Iletisim />} />
        <Route path="/insan-kaynaklari" element={<InsanKaynaklari />} />
        <Route path="/tesekkurler" element={<Tesekkurler />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
