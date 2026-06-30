import { auth } from "@/auth";
import CategoryInfoSidebar from "@/components/layout/category-info.sidebar";
import HomeSidebar from "@/components/layout/home.sidebar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center">
      <div className="flex w-full max-w-7xl">
        <HomeSidebar session={session} />
        <main className="flex-1 max-w-2xl mx-auto p-4">
          <div className="space-y-4">{children}</div>
        </main>
        <CategoryInfoSidebar />
      </div>
    </div>
  );
}
