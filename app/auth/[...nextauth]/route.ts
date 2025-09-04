// import NextAuth, { User } from "next-auth";
// import { JWT } from "next-auth/jwt";
// import CredentialsProvider from "next-auth/providers/credentials";

// const API_URL = process.env.BACKEND_APP_URL;

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials) return null;

//         const res = await fetch(`${API_URL}/login`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             email: credentials.email,
//             password: credentials.password,
//           }),
//         });

//         const user = await res.json();

//         if (res.ok && user) {
//           return user; // must include { token, ... }
//         }
//         return null;
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//   },
//   pages: {
//     signIn: "/auth/signin",
//   },
//   callbacks: {
//     async jwt({ token, user }: { token: JWT; user?: User & { token?: string } }) {
//       if (user?.token) {
//         token.accessToken = user.token;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.token = token.accessToken as string;
//       }
//       session.accessToken = token.accessToken as string;
//       return session;
//     },
//   },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };

export const GET = async () => {
  return new Response("Auth not configured", { status: 501 });
};

export const POST = GET;