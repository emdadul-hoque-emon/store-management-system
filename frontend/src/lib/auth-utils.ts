enum UserRole {
  ADMIN = "admin",
  EMPLOYEE = "employee",
}
export interface RouteConfig {
  exact: string[];
  patterns: RegExp[];
}

export const authRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
  "/forgot-password/verify",
  "/reset-password",
  "/register-store",
];
export const parentProtectedRoutes: RouteConfig = {
  exact: ["/profile", "/settings"],
  patterns: [/^\/parent/],
};
export const teacherProtectedRoutes: RouteConfig = {
  exact: [],
  patterns: [/^\/teacher/],
};
export const studentProtectedRoutes: RouteConfig = {
  exact: [],
  patterns: [/^\/student/],
};
export const adminProtectedRoutes: RouteConfig = {
  exact: [],
  patterns: [/^\/admin/],
};

export const isAuthRoute = (pathname: string) => {
  return authRoutes.some((route: string) => pathname === route);
};

export const isRouteMatches = (
  pathname: string,
  routes: RouteConfig,
): boolean => {
  if (routes.exact.includes(pathname)) {
    return true;
  }

  return routes.patterns.some((r) => r.test(pathname));
};

export const getRouteOwner = (
  pathname: string,
): "admin" | "teacher" | "student" | "parent" | null => {
  if (isRouteMatches(pathname, adminProtectedRoutes)) {
    return "admin";
  }
  if (isRouteMatches(pathname, teacherProtectedRoutes)) {
    return "teacher";
  }
  if (isRouteMatches(pathname, studentProtectedRoutes)) {
    return "student";
  }
  if (isRouteMatches(pathname, parentProtectedRoutes)) {
    return "parent";
  }
  return null;
};

export const getDefaultDashboardRoute = (role: UserRole) => {
  return "/";
};

export const isValidRedirectForRole = (
  redirectPath: string,
  role: UserRole,
): boolean => {
  const routeOwner = getRouteOwner(redirectPath);
  console.log("route owner: ", routeOwner);

  if (routeOwner === role) {
    return true;
  }
  return false;
};
