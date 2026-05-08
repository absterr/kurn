import { Injectable } from "@nestjs/common";
import { addMinutes, addWeeks } from "date-fns";
import type { CookieOptions, Response } from "express";
import { EnvProvider } from "src/config/env/env.provider";

const REFRESH_PATH = "/api/v1/auth/refresh";

@Injectable()
export class AuthCookieService {
  private readonly secure: boolean;
  private readonly defaults: CookieOptions;

  constructor(private readonly env: EnvProvider) {
    this.secure = this.env.get("NODE_ENV") === "production";
    this.defaults = {
      sameSite: "strict",
      httpOnly: true,
      secure: this.secure,
    };
  }

  setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
    refresh = false,
  ) {
    if (refresh) {
      return res.cookie("accessToken", accessToken, {
        ...this.defaults,
        expires: addMinutes(new Date(), 15),
      });
    }

    return res
      .cookie("accessToken", accessToken, {
        ...this.defaults,
        expires: addMinutes(new Date(), 15),
      })
      .cookie("refreshToken", refreshToken, {
        ...this.defaults,
        path: REFRESH_PATH,
        expires: addWeeks(new Date(), 2),
      })
      .cookie("logged_in", "true", {
        secure: this.secure,
        sameSite: "lax",
        httpOnly: false,
        expires: addMinutes(new Date(), 15),
      });
  }

  clearAuthCookies(res: Response) {
    return res
      .clearCookie("accessToken")
      .clearCookie("refreshToken", { path: REFRESH_PATH })
      .clearCookie("logged_in");
  }
}
