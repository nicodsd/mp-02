import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    const cookieStore = await cookies();

    // Borramos las cookies del dominio actual
    cookieStore.delete('token');
    cookieStore.delete('user');

    return NextResponse.json({
        success: true,
        message: "Cookies eliminadas localmente"
    });
}