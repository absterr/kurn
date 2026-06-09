import type { Context } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import env from "@/config/env.js";
import { fifteenMinsFromNow, oneWeekFromNow } from "./date";

const REFRESH_PATH = "/auth/refresh";
const secure = env.API_ENV === "production";

const defaults = {
  sameSite: "Strict" as const,
  httpOnly: true,
  secure,
};

export const setAuthCookies = (
  ctx: Context,
  accessToken: string,
  refreshToken: string,
) => {
  setCookie(ctx, "accessToken", accessToken, {
    ...defaults,
    expires: fifteenMinsFromNow(),
  });
  setCookie(ctx, "refreshToken", refreshToken, {
    ...defaults,
    path: REFRESH_PATH,
    expires: oneWeekFromNow(),
  });
  setCookie(ctx, "logged_in", "true", {
    secure,
    sameSite: "Lax",
    httpOnly: false,
    expires: fifteenMinsFromNow(),
  });
};

export const refreshAuthCookies = (
  ctx: Context,
  newAccessToken: string,
  newRefreshToken?: string,
) => {
  setCookie(ctx, "accessToken", newAccessToken, {
    ...defaults,
    expires: fifteenMinsFromNow(),
  });
  if (newRefreshToken) {
    setCookie(ctx, "refreshToken", newRefreshToken, {
      ...defaults,
      path: REFRESH_PATH,
      expires: oneWeekFromNow(),
    });
    setCookie(ctx, "logged_in", "true", {
      secure,
      sameSite: "Lax",
      httpOnly: false,
      expires: fifteenMinsFromNow(),
    });
  }
};

export const clearAuthCookies = (ctx: Context) => {
  deleteCookie(ctx, "accessToken");
  deleteCookie(ctx, "refreshToken", { path: REFRESH_PATH });
  deleteCookie(ctx, "logged_in");
};
