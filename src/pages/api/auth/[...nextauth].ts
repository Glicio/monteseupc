import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db";
import { User } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      const dbUser = user as User
      if (session.user) {
        session.user.id = user.id;
        session.user.isAdmin = dbUser.isAdmin || false;
        session.user.isMod = dbUser.isMod || false;
        session.user.isBanned = dbUser.isBanned || false;
        session.user.isMutted = dbUser.isMutted || false;
      }
      return session;
    },
    async signIn({ user }) {
      const dbUser = user as User

      if(dbUser.isBanned){
        if(this.redirect) return this.redirect({ url: "/banned", baseUrl: env.NEXTAUTH_URL })
        return false
      }
      

      if(user.id){
        try {
          await prisma.user.update({
            where: {
              id: user.id
            },
            data: {
              lastLogin: new Date()
            }
          })
        }
        catch (error) {
          console.info("Error updating last login", error);
        }

      }
      return true
    }
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    })
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

export default NextAuth(authOptions);
