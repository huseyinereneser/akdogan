import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

const OTURUM_ANAHTARI = "akd_admin_oturum";

/**
 * Bu site sunucusuz (statik) yayınlandığı için gerçek bir sunucu-taraflı
 * kimlik doğrulama YOK. Bu, tarayıcıda görülebilen/atlanabilen bir parola
 * kapısıdır — meraklı ziyaretçiyi caydırır, güvenlik sağlamaz. Kullanıcı
 * adı/şifreyi `.env` dosyasında VITE_ADMIN_USERNAME / VITE_ADMIN_PASSWORD
 * olarak tanımlayın (bkz. .env.example).
 */
const ADMIN_KULLANICI_ADI = import.meta.env.VITE_ADMIN_USERNAME || "admin";
const ADMIN_SIFRESI = import.meta.env.VITE_ADMIN_PASSWORD;

interface AdminAuthValue {
  girisYapildi: boolean;
  sifreTanimliMi: boolean;
  girisYap: (kullaniciAdi: string, sifre: string) => boolean;
  cikisYap: () => void;
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [girisYapildi, setGirisYapildi] = useState(
    () => sessionStorage.getItem(OTURUM_ANAHTARI) === "1"
  );

  const girisYap = useCallback((kullaniciAdi: string, sifre: string) => {
    if (!ADMIN_SIFRESI) return false;
    if (kullaniciAdi.trim() !== ADMIN_KULLANICI_ADI || sifre !== ADMIN_SIFRESI) {
      return false;
    }
    sessionStorage.setItem(OTURUM_ANAHTARI, "1");
    setGirisYapildi(true);
    return true;
  }, []);

  const cikisYap = useCallback(() => {
    sessionStorage.removeItem(OTURUM_ANAHTARI);
    setGirisYapildi(false);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{ girisYapildi, sifreTanimliMi: !!ADMIN_SIFRESI, girisYap, cikisYap }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth, AdminAuthProvider içinde kullanılmalı");
  return ctx;
}
