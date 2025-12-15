// import { useSelector } from "react-redux";

// export default function userAuth() {
// 	const { user } = useSelector((state: any) => state.auth);

// 	if (user) {
// 		return true;
// 	} else {
// 		return false;
// 	}
// }

// hooks/use-auth.tsx
import { useSelector } from "react-redux";

interface AuthHookReturn {
	data: any | null; // hoặc định nghĩa User type cụ thể
	isAuthenticated: boolean;
}

export default function userAuth(): AuthHookReturn {
	const { user } = useSelector((state: any) => state.auth);

	return {
		data: user || null,
		isAuthenticated: !!user,
	};
}
