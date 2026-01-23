import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
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
import { LoginPage, RegisterPage, ForgotPassword } from "@/pages/auth";
import {
  MyProfile,
  PublishedNotes,
  PrivateNotes,
  UploadNotes,
  AskAI,
  AINotebook,
} from "@/pages/authenticated";
import RAGLayout from "@/layouts/RAGLayout";
import ProtectedRoute from "./protectedRoute";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path={routeSet.public.home} element={<MainLayout />}>
        {/* UnAuthenticated Routes */}
        <Route index element={<Home />} />
        <Route path={routeSet.public.about} element={<About />} />
        <Route path={routeSet.public.contact} element={<Contact />} />
        <Route
          path={routeSet.public.privacyPolicy}
          element={<PrivacyPolicy />}
        />
        <Route path={routeSet.public.notesGallery} element={<NotesLibrary />} />

        {/* Auth Pages Routes */}
        <Route path={routeSet.auth.login} element={<LoginPage />} />
        <Route path={routeSet.auth.register} element={<RegisterPage />} />
        <Route
          path={routeSet.auth.forgotPassword}
          element={<ForgotPassword />}
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path={routeSet.authenticated.uploadNotes}
            element={<UploadNotes />}
          />
          <Route
            path={routeSet.authenticated.myProfile}
            element={<MyProfile />}
          />
          <Route
            path={routeSet.authenticated.publishedNotes}
            element={<PublishedNotes />}
          />
          <Route
            path={routeSet.authenticated.privateNotes}
            element={<PrivateNotes />}
          />

          <Route path={routeSet.authenticated.askAI} element={<AskAI />} />
        </Route>
      </Route>

      <Route
        path={`/${routeSet.authenticated.aiNotebook}/:id`}
        element={<AINotebook />}
      />
    </>,
  ),
);
