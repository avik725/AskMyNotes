import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router";
import MainLayout from "@/layouts/MainLayout";

import { routeSet } from "./routeSet";
import {
  Home,
  About,
  Contact,
  PrivacyPolicy,
  NotesLibrary,
} from "@/pages/public";
import LoginPage from "@/pages/auth/Login";
import RegisterPage from "@/pages/auth/Register";
import { MyProfile, MyUploads, UploadNotes } from "@/pages/authenticated";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path={routeSet.public.home} element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path={routeSet.public.about} element={<About />} />
        <Route path={routeSet.public.contact} element={<Contact />} />
        <Route
          path={routeSet.public.privacyPolicy}
          element={<PrivacyPolicy />}
        />
        <Route path={routeSet.public.notesGallery} element={<NotesLibrary />} />
        <Route
          path={routeSet.authenticated.uploadNotes}
          element={<UploadNotes />}
        />
        <Route
          path={routeSet.authenticated.myProfile}
          element={<MyProfile />}
        />
        <Route
          path={routeSet.authenticated.myUploads}
          element={<MyUploads />}
        />
        <Route path={routeSet.auth.login} element={<LoginPage />} />
        <Route path={routeSet.auth.register} element={<RegisterPage />} />
      </Route>
    </>
  )
);
