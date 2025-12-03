"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

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

type SortField = "amountDue" | "overduePeriodInDays" | null;
type SortOrder = "asc" | "desc";

export function UsersTable({ users: initialUsers }: UsersTableProps) {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedUsers = [...initialUsers].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-2 hover:text-foreground transition-colors"
    >
      {label}
      <ArrowUpDown
        size={16}
        className={`${
          sortField === field
            ? "text-blue-600"
            : "text-muted-foreground"
        }`}
      />
    </button>
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="font-bold">
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Bank</TableHead>
            <TableHead>
              <SortButton field="amountDue" label="Amount Due" />
            </TableHead>
            <TableHead>Due Month</TableHead>
            <TableHead>
              <SortButton field="overduePeriodInDays" label="Overdue Days" />
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            sortedUsers.map((user) => (
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
                  <Button variant="outline" size="sm">
                    Agent Call
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
