import { NextRequest, NextResponse } from 'next/server';

/**
 * WeChat OAuth Callback Handler
 * 
 * Handles the OAuth flow when WeChat redirects back after authentication
 * Query params: code, state
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // Validate required parameters
  if (!code) {
    return NextResponse.json(
      { success: false, error: 'Missing authorization code' },
      { status: 400 }
    );
  }

  try {
    // Exchange code for access token with WeChat API
    const tokenResponse = await fetch('https://api.weixin.qq.com/sns/oauth2/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appid: process.env.WECHAT_APP_ID,
        secret: process.env.WECHAT_APP_SECRET,
        code,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();
    
    if (tokenData.errcode) {
      throw new Error(`WeChat API error: ${tokenData.errmsg}`);
    }

    const { access_token, openid, unionid } = tokenData;

    // Get user info from WeChat
    const userInfoResponse = await fetch(
      `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`
    );

    if (!userInfoResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userInfo = await userInfoResponse.json();

    if (userInfo.errcode) {
      throw new Error(`WeChat API error: ${userInfo.errmsg}`);
    }

    // Check if user exists in database
    const existingUser = await fetch(`${process.env.API_URL}/api/users/wechat/${unionid || openid}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    let userId: string;

    if (existingUser.ok) {
      // User exists - log them in
      const userData = await existingUser.json();
      userId = userData.id;
    } else {
      // Create new user
      const createUserResponse = await fetch(`${process.env.API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wechatOpenId: openid,
          wechatUnionId: unionid,
          nickname: userInfo.nickname,
          avatar: userInfo.headimgurl,
          gender: userInfo.sex === 1 ? 'male' : userInfo.sex === 2 ? 'female' : 'other',
          country: userInfo.country,
          province: userInfo.province,
          city: userInfo.city,
          language: userInfo.language || 'zh',
        }),
      });

      if (!createUserResponse.ok) {
        throw new Error('Failed to create user');
      }

      const newUser = await createUserResponse.json();
      userId = newUser.id;
    }

    // Create session
    const sessionResponse = await fetch(`${process.env.API_URL}/api/auth/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        provider: 'wechat',
        expiresIn: 60 * 60 * 24 * 30, // 30 days
      }),
    });

    if (!sessionResponse.ok) {
      throw new Error('Failed to create session');
    }

    const session = await sessionResponse.json();

    // Set session cookie and redirect to appropriate pillar
    const response = NextResponse.redirect(new URL('/zh/square', request.url));
    
    response.cookies.set('session_token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    // Store user preferences
    response.cookies.set('user_id', userId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('WeChat OAuth callback error:', error);

    // Redirect to login with error message
    const errorUrl = new URL('/zh/auth/login', request.url);
    errorUrl.searchParams.set('error', 'wechat_auth_failed');
    errorUrl.searchParams.set(
      'message',
      error instanceof Error ? error.message : 'Authentication failed'
    );

    return NextResponse.redirect(errorUrl);
  }
}
