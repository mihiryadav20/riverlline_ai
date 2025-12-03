"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  id: string;
  username: string;
  phone: string;
  creditCardNumber: string;
  bank: string;
  amountDue: number;
  dueMonth: string;
  overduePeriodInDays: number;
  status: string;
  lastCallAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Bank</TableHead>
            <TableHead>Amount Due</TableHead>
            <TableHead>Due Month</TableHead>
            <TableHead>Overdue Days</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Call</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.bank}</TableCell>
                <TableCell>₹{user.amountDue.toLocaleString()}</TableCell>
                <TableCell>{user.dueMonth}</TableCell>
                <TableCell>{user.overduePeriodInDays} days</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      user.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : user.status === "calling"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell>
                  {user.lastCallAt
                    ? new Date(user.lastCallAt).toLocaleString()
                    : "Never"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
