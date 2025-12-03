import { prisma } from "@/lib/db";
import { UsersTable } from "@/components/users-table";

export default async function Home() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Riverline AI</h1>
        <p className="text-muted-foreground">
          Manage and track user payment information
        </p>
      </div>
      <UsersTable users={users} />
    </div>
  );
}
