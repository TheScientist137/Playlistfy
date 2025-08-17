import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

export function Dashboard() {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
