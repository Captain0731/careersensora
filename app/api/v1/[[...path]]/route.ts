import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BACKEND = (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'https://careersensora.onrender.com').replace(/\/$/, '');

async function proxyToExpress(request: NextRequest, method: string) {
	const pathname = request.nextUrl.pathname;
	const search = request.nextUrl.search;
	const target = `${BACKEND}${pathname}${search}`;

	const headers = new Headers(request.headers);
	headers.delete('host');
	headers.delete('content-length');
	headers.delete('connection');
	headers.delete('accept-encoding');

	const init: RequestInit = {
		method,
		headers,
		cache: 'no-store',
	};

	if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
		init.body = await request.arrayBuffer();
	}

	let upstream: Response;
	try {
		upstream = await fetch(target, { ...init, signal: AbortSignal.timeout(30_000) });
	} catch {
		return NextResponse.json(
			{
				detail: `Cannot reach Express at ${BACKEND}. Check BACKEND_URL and Render health.`,
			},
			{ status: 502 }
		);
	}

	const out = new NextResponse(await upstream.arrayBuffer(), {
		status: upstream.status,
	});

	upstream.headers.forEach((value, key) => {
		if (key.toLowerCase() === 'transfer-encoding' || key.toLowerCase() === 'content-length') {
			return;
		}
		out.headers.set(key, value);
	});

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

export async function OPTIONS(request: NextRequest) {
	return proxyToExpress(request, 'OPTIONS');
}
