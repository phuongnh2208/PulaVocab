import React from 'react';

interface FirebaseStatusProps {
  ready: boolean;
  signedIn: boolean;
}

export default function FirebaseStatus({ ready, signedIn }: FirebaseStatusProps) {
  const pill = (text: string, ok: boolean) => (
    <span
      className={`text-xs font-bold px-2 py-1 rounded-xl border ${
        ok
          ? 'bg-green-50 text-green-700 border-green-200'
          : 'bg-red-50 text-red-700 border-red-200'
      }`}
    >
      {text}
    </span>
  );

  // Debug: Check environment variables
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const appId = import.meta.env.VITE_FIREBASE_APP_ID;

  const envCheck = {
    apiKey: !!apiKey,
    authDomain: !!authDomain,
    projectId: !!projectId,
    appId: !!appId,
  };

  const allEnvSet = Object.values(envCheck).every(Boolean);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {pill(ready ? 'Firebase: READY' : 'Firebase: NOT CONFIGURED', ready)}
        {pill(signedIn ? 'Auth: SIGNED IN' : 'Auth: SIGNED OUT', signedIn)}
      </div>
      {!ready && (
        <details className="text-xs text-[#777] bg-gray-50 p-2 rounded border border-gray-200">
          <summary className="cursor-pointer font-bold">Debug: Kiểm tra biến môi trường</summary>
          <div className="mt-2 space-y-1">
            <div>VITE_FIREBASE_API_KEY: {envCheck.apiKey ? '✅ Có' : '❌ Thiếu'}</div>
            <div>VITE_FIREBASE_AUTH_DOMAIN: {envCheck.authDomain ? '✅ Có' : '❌ Thiếu'}</div>
            <div>VITE_FIREBASE_PROJECT_ID: {envCheck.projectId ? '✅ Có' : '❌ Thiếu'}</div>
            <div>VITE_FIREBASE_APP_ID: {envCheck.appId ? '✅ Có' : '❌ Thiếu'}</div>
            {!allEnvSet && (
              <div className="mt-2 text-red-600 font-bold">
                ⚠️ Một hoặc nhiều biến môi trường bị thiếu. Kiểm tra file .env.local và khởi động lại server.
              </div>
            )}
          </div>
        </details>
      )}
    </div>
  );
}
