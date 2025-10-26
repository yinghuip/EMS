import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./pages/landing/landing.page').then((m) => m.LandingPage)
	},
	{
		path: 'about',
		loadComponent: () => import('./pages/about/about.page').then((m) => m.AboutPage)
	},
	{
		path: 'events/:id',
		loadComponent: () => import('./pages/event-detail/event-detail.page').then((m) => m.EventDetailPage)
	},
	{ path: '**', redirectTo: '' }
];
