export const GET = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get("code");

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  const response = new Response(undefined, {
    status: 307,
  });

  return response;
};
