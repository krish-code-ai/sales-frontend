// import NextAuth from "next-auth";
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

//         // Call your Laravel login API
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
//           // user should include { token, user info }
//           return user;
//         }

//         return null; // login failed
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt", // store session in JWT
//   },
//   pages: {
//     signIn: "/auth/signin", // custom login page
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       // Store Laravel token in JWT
//       if (user?.token) {
//         token.accessToken = user.token;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       // Make token available in session
//       session.user = { ...session.user, token: token.accessToken };
//       return session;
//     },
//   },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
