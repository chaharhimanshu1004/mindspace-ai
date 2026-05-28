import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "mindspace.token";

const AUTH_PAGES = ["/login", "/signup"];
const PROTECTED_PAGES = ["/memories"];

const startsWithAny = (pathname: string, list: string[]): boolean =>
    list.some((p) => pathname === p || pathname.startsWith(`${p}/`));

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get(COOKIE_NAME)?.value;

    if (token && startsWithAny(pathname, AUTH_PAGES)) {
        return NextResponse.redirect(new URL("/memories", req.url));
    }

    if (!token && startsWithAny(pathname, PROTECTED_PAGES)) {
        const url = new URL("/login", req.url);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/login", "/signup", "/memories/:path*"],
};
