import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BACKEND = (process.env.BACKEND_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

async function proxyToExpress(request: NextRequest, method: string) {
	const pathname = request.nextUrl.pathname;
	const search = request.nextUrl.search;
	const target = `${BACKEND}${pathname}${search}`;

	const headers = new Headers();
	const auth = request.headers.get('authorization');
	if (auth) {
		headers.set('authorization', auth);
	}
	const contentType = request.headers.get('content-type');
	if (contentType) {
		headers.set('content-type', contentType);
	}

	const init: RequestInit = {
		method,
		headers,
		cache: 'no-store',
	};

	if (method !== 'GET' && method !== 'HEAD') {
		init.body = await request.arrayBuffer();
	}

	let upstream: Response;
	try {
		upstream = await fetch(target, { ...init, signal: AbortSignal.timeout(30_000) });
	} catch {
		return NextResponse.json(
			{
				detail: `Cannot reach Express at ${BACKEND}. Start: cd server && npm start`,
			},
			{ status: 502 }
		);
	}

	const out = new NextResponse(await upstream.arrayBuffer(), {
		status: upstream.status,
	});

	const ct = upstream.headers.get('content-type');
	if (ct) {
		out.headers.set('content-type', ct);
	}

	return out;
}

export async function GET(request: NextRequest) {
	return proxyToExpress(request, 'GET');
}

export async function POST(request: NextRequest) {
	return proxyToExpress(request, 'POST');
}

export async function PUT(request: NextRequest) {
	return proxyToExpress(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
	return proxyToExpress(request, 'DELETE');
}

export async function PATCH(request: NextRequest) {
	return proxyToExpress(request, 'PATCH');
}
