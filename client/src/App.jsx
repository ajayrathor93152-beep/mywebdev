import { AnimatePresence, MotionConfig } from "motion/react";
import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PageTransition from "@/components/layout/PageTransition";
import { scrollToTop, useSmoothScroll } from "@/hooks/useSmoothScroll";
import Home from "@/pages/Home";

// Home ships in the main bundle for the fastest first paint; everything else is code-split.
const Services = lazy(() => import("@/pages/Services"));
const Work = lazy(() => import("@/pages/Work"));
const WorkSample = lazy(() => import("@/pages/WorkSample"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const routes = [
  { path: "/", element: <Home /> },
  { path: "/services", element: <Services /> },
  { path: "/work", element: <Work /> },
  { path: "/work/:category", element: <WorkSample /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "*", element: <NotFound /> },
];

export default function App() {
  const location = useLocation();
  useSmoothScroll();

  return (
    // Respect the OS "reduce motion" setting across every Motion component.
    <MotionConfig reducedMotion="user">
      <Layout>
        <AnimatePresence mode="wait" onExitComplete={scrollToTop}>
          <Routes location={location} key={location.pathname}>
            {routes.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={
                  <PageTransition>
                    <Suspense fallback={<div className="min-h-[100svh]" />}>{element}</Suspense>
                  </PageTransition>
                }
              />
            ))}
          </Routes>
        </AnimatePresence>
      </Layout>
    </MotionConfig>
  );
}
