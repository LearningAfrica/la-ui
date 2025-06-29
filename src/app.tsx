import React from 'react';
import BaseLayout from './components/layouts/base-layout';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

export default function App() {
	return (
		<BaseLayout>
			<RouterProvider router={router} />
		</BaseLayout>
	);
}
