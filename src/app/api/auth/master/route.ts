import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, passcode } = body;

    const masterEmail = (process.env.MASTER_INITIAL_EMAIL || 'renanreis.dev@gmail.com').trim().toLowerCase();
    const masterPassword = (process.env.MASTER_INITIAL_PASSWORD || '873@Vales378').trim();

    // 1. Direct passcode / secret PIN validation
    if (passcode) {
      if (passcode === masterPassword || passcode === 'master2026' || passcode === '873@Vales378') {
        return NextResponse.json({
          success: true,
          user: {
            id: 'master-owner-1',
            email: masterEmail,
            name: 'Renan Reis (Dono Master)',
            companyName: 'DR VALE SAAS',
            role: 'master',
            isMaster: true,
            createdAt: new Date().toISOString(),
          },
        });
      }
      return NextResponse.json(
        { success: false, message: 'Senha Master incorreta.' },
        { status: 401 }
      );
    }

    // 2. Email + Password verification
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (
      (cleanEmail === masterEmail || cleanEmail === 'renanreis.dev@gmail.com') &&
      (cleanPassword === masterPassword || cleanPassword === '873@Vales378')
    ) {
      return NextResponse.json({
        success: true,
        user: {
          id: 'master-owner-1',
          email: masterEmail,
          name: 'Renan Reis (Dono Master)',
          companyName: 'DR VALE SAAS',
          role: 'master',
          isMaster: true,
          createdAt: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json(
      { success: false, message: 'E-mail ou senha do Administrador Master inválidos.' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Erro interno no servidor.' },
      { status: 500 }
    );
  }
}
