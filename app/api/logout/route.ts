import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    
    // Clear all possible auth cookies
    response.cookies.set('next-auth.session-token', '', { 
      maxAge: 0, 
      path: '/' 
    });
    response.cookies.set('next-auth.csrf-token', '', { 
      maxAge: 0, 
      path: '/' 
    });
    response.cookies.set('next-auth.callback-url', '', { 
      maxAge: 0, 
      path: '/' 
    });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}