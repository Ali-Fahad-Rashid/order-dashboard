import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Order, OrderFilters, SortConfig } from "@shared/orders";
import {
  generateMockOrders,
  generateNewOrder,
  getRandomStatusUpdate,
} from "@/lib/mock-data";
import { OrderTable } from "@/components/OrderTable";
import { OrderFiltersComponent } from "@/components/OrderFilters";
import { OrderDetailsModal } from "@/components/OrderDetailsModal";
import { StatsCards } from "@/components/StatsCards";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";
import { Download, Plus } from "lucide-react";

export function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(
    new Set(),
  );
  const [filters, setFilters] = useState<OrderFilters>({
    search: "",
    status: "all",
    dateRange: { start: null, end: null },
    amountRange: { min: 0, max: 1000 },
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "orderDate",
    direction: "desc",
  });
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);

  // Initialize orders
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const mockOrders = generateMockOrders(100);
      setOrders(mockOrders);
      setIsLoading(false);
    }
  }, []);

  // Real-time simulation - new orders
  useEffect(() => {
    let mounted = true;

    const interval = setInterval(() => {
      if (mounted && Math.random() > 0.8) {
        // 20% chance every interval
        const newOrder = generateNewOrder();
        setOrders((prev) => [newOrder, ...prev]);
        toast.success(`New order received: ${newOrder.id}`);
      }
    }, 20000); // Every 20 seconds

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Real-time simulation - status updates
  useEffect(() => {
    let mounted = true;

    const interval = setInterval(() => {
      if (mounted && Math.random() > 0.9) {
        // 10% chance every interval
        setOrders((prev) => {
          const ordersToUpdate = prev.filter(
            (order) =>
              order.status !== "delivered" && order.status !== "cancelled",
          );
          if (ordersToUpdate.length === 0) return prev;

          const randomOrder =
            ordersToUpdate[Math.floor(Math.random() * ordersToUpdate.length)];
          const newStatus = getRandomStatusUpdate();

          const updatedOrders = prev.map((order) =>
            order.id === randomOrder.id
              ? { ...order, status: newStatus }
              : order,
          );

          if (mounted) {
            toast.info(
              `Order ${randomOrder.id} status updated to ${newStatus}`,
            );
          }
          return updatedOrders;
        });
      }
    }, 15000); // Every 15 seconds

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter((order) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !order.id.toLowerCase().includes(searchLower) &&
          !order.customer.name.toLowerCase().includes(searchLower) &&
          !order.customer.email.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // Status filter
      if (filters.status !== "all" && order.status !== filters.status) {
        return false;
      }

      // Date range filter
      if (
        filters.dateRange.start &&
        order.orderDate < filters.dateRange.start
      ) {
        return false;
      }
      if (filters.dateRange.end && order.orderDate > filters.dateRange.end) {
        return false;
      }

      // Amount range filter
      if (
        order.total < filters.amountRange.min ||
        order.total > filters.amountRange.max
      ) {
        return false;
      }

      return true;
    });

    // Sort orders
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortConfig.key) {
        case "customerName":
          aValue = a.customer.name;
          bValue = b.customer.name;
          break;
        case "orderDate":
          aValue = a.orderDate.getTime();
          bValue = b.orderDate.getTime();
          break;
        case "total":
          aValue = a.total;
          bValue = b.total;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [orders, filters, sortConfig]);

  const handleSort = useCallback((key: SortConfig["key"]) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handleBulkStatusUpdate = useCallback(
    (status: Order["status"]) => {
      if (selectedOrderIds.size === 0) {
        toast.error("No orders selected");
        return;
      }

      setOrders((prev) =>
        prev.map((order) =>
          selectedOrderIds.has(order.id) ? { ...order, status } : order,
        ),
      );

      toast.success(`Updated ${selectedOrderIds.size} orders to ${status}`);
      setSelectedOrderIds(new Set());
    },
    [selectedOrderIds],
  );

  const handleExportCSV = useCallback(() => {
    const csvContent = [
      ["Order ID", "Customer", "Status", "Total", "Date"].join(","),
      ...filteredAndSortedOrders.map((order) =>
        [
          order.id,
          order.customer.name,
          order.status,
          order.total.toFixed(2),
          order.orderDate.toISOString().split("T")[0],
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Orders exported to CSV");
  }, [filteredAndSortedOrders]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Order Management Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage and track all your orders in real-time
          </p>
        </div>
        <div className="flex gap-2">
          <ThemeToggle />
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            onClick={() => toast.info("Add new order feature coming soon!")}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards orders={filteredAndSortedOrders} />

      {/* Filters */}
      <OrderFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        onBulkStatusUpdate={handleBulkStatusUpdate}
        selectedCount={selectedOrderIds.size}
      />

      {/* Orders Table */}
      <OrderTable
        orders={filteredAndSortedOrders}
        selectedOrderIds={selectedOrderIds}
        onSelectedOrderIdsChange={setSelectedOrderIds}
        onOrderClick={setSelectedOrder}
        onSort={handleSort}
        sortConfig={sortConfig}
      />

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={(orderId, newStatus) => {
            setOrders((prev) =>
              prev.map((order) =>
                order.id === orderId ? { ...order, status: newStatus } : order,
              ),
            );
            toast.success(`Order ${orderId} updated to ${newStatus}`);
          }}
        />
      )}
    </div>
  );
}
