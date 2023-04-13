import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { api } from "../utils/api";

import "../styles/globals.css";
import { AppProvider } from "../components/context/AppContext";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <AppProvider>
        <ToastContainer/>
        <Component {...pageProps} />
      </AppProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
