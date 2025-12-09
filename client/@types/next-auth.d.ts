// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: DefaultSession["user"] & {
			id: string;
		};
	}

	// nếu bạn dùng User riêng (thường từ DB)
	interface User {
		id: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id?: string;
	}
}
