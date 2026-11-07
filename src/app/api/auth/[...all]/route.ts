import { auth } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

async function handler(request: Request) {
  return auth().handler(request);
}

export { handler as GET, handler as POST };
