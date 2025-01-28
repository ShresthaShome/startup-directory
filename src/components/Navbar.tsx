import { auth, signIn, signOut } from "@/auth";
import { BadgePlus, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { UserIcon, UserIconFallback, UserIconImage } from "./ui/usericon";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans font-medium">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={144} height={30} />
        </Link>
        <div className="flex items-center gap-5 text-black">
          {session && session?.user ? (
            <>
              <Link href="/startup/create">
                <span className="max-sm:hidden">Create Startup</span>
                <BadgePlus className="size-6 sm:hidden text-red-500" />
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit">
                  <span className="max-sm:hidden">Logout</span>
                  <LogOut className="size-6 sm:hidden text-red-500" />
                </button>
              </form>

              <Link href={`/user/${session?.user?.id}`}>
                <UserIcon className="size-10">
                  <UserIconImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || ""}
                  />
                  <UserIconFallback>UI</UserIconFallback>
                </UserIcon>
              </Link>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("github");
              }}
            >
              <button type="submit">Login</button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
}
