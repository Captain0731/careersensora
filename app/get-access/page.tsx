import { Suspense } from 'react';
import Login from '../components/Log in/login';

export default function GetAccessPage() {
	return (
		<Suspense fallback={null}>
			<Login />
		</Suspense>
	);
}
