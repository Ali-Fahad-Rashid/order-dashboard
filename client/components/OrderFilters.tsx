import { useState, useCallback, useEffect } from "react";
import { OrderFilters, OrderStatus } from "@shared/orders";
import { useDebounced } from "@/hooks/use-debounced";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Search,
  Filter,
  Calendar as CalendarIcon,
  DollarSign,
  Settings,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface OrderFiltersComponentProps {
  filters: OrderFilters;
  onFiltersChange: (filters: OrderFilters) => void;
  onBulkStatusUpdate: (status: OrderStatus) => void;
  selectedCount: number;
}

export function OrderFiltersComponent({
  filters,
  onFiltersChange,
  onBulkStatusUpdate,
  selectedCount,
}: OrderFiltersComponentProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounced(searchInput, 300);

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  // Effect to update filters when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFiltersChange({ ...filters, search: debouncedSearch });
    }
  }, [debouncedSearch, filters, onFiltersChange]);

  const handleStatusChange = useCallback(
    (status: OrderStatus | "all") => {
      onFiltersChange({ ...filters, status });
    },
    [filters, onFiltersChange],
  );

  const handleDateRangeChange = useCallback(
    (start: Date | null, end: Date | null) => {
      onFiltersChange({
        ...filters,
        dateRange: { start, end },
      });
    },
    [filters, onFiltersChange],
  );

  const handleAmountRangeChange = useCallback(
    (min: number, max: number) => {
      onFiltersChange({
        ...filters,
        amountRange: { min, max },
      });
    },
    [filters, onFiltersChange],
  );

  const clearFilters = useCallback(() => {
    onFiltersChange({
      search: "",
      status: "all",
      dateRange: { start: null, end: null },
      amountRange: { min: 0, max: 1000 },
    });
  }, [onFiltersChange]);

  const getQuickDateRange = useCallback((days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    return { start, end };
  }, []);

  const statusOptions: {
    value: OrderStatus | "all";
    label: string;
    color: string;
  }[] = [
    { value: "all", label: "All Orders", color: "bg-gray-100 text-gray-800" },
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "processing",
      label: "Processing",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "shipped",
      label: "Shipped",
      color: "bg-orange-100 text-orange-800",
    },
    {
      value: "delivered",
      label: "Delivered",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
    },
  ];

  const bulkUpdateOptions: OrderStatus[] = [
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  return (
    <div className="space-y-4">
      {/* Search and Quick Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search orders by ID, customer name, or email..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {(filters.status !== "all" ||
              filters.dateRange.start ||
              filters.amountRange.min > 0 ||
              filters.amountRange.max < 1000) && (
              <Badge variant="secondary" className="ml-1">
                Active
              </Badge>
            )}
          </Button>

          {selectedCount > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="default" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Bulk Actions ({selectedCount})
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Update Status</Label>
                  {bulkUpdateOptions.map((status) => (
                    <Button
                      key={status}
                      variant="ghost"
                      size="sm"
                      onClick={() => onBulkStatusUpdate(status)}
                      className="w-full justify-start"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Mark as {status}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* Quick Status Filter */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <Badge
            key={option.value}
            variant={filters.status === option.value ? "default" : "outline"}
            className={cn(
              "cursor-pointer transition-colors",
              filters.status === option.value ? "" : option.color,
            )}
            onClick={() => handleStatusChange(option.value)}
          >
            {option.label}
          </Badge>
        ))}
      </div>

      {/* Advanced Filters */}
      {isFiltersOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Advanced Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Date Range Filter */}
              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !filters.dateRange.start && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange.start
                          ? format(filters.dateRange.start, "PPP")
                          : "Start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.start || undefined}
                        onSelect={(date) =>
                          handleDateRangeChange(
                            date || null,
                            filters.dateRange.end,
                          )
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !filters.dateRange.end && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange.end
                          ? format(filters.dateRange.end, "PPP")
                          : "End date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.end || undefined}
                        onSelect={(date) =>
                          handleDateRangeChange(
                            filters.dateRange.start,
                            date || null,
                          )
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Quick date range buttons */}
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const range = getQuickDateRange(1);
                      handleDateRangeChange(range.start, range.end);
                    }}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const range = getQuickDateRange(7);
                      handleDateRangeChange(range.start, range.end);
                    }}
                  >
                    7 days
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const range = getQuickDateRange(30);
                      handleDateRangeChange(range.start, range.end);
                    }}
                  >
                    30 days
                  </Button>
                </div>
              </div>

              {/* Amount Range Filter */}
              <div className="space-y-2">
                <Label>Amount Range</Label>
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.amountRange.min}
                      onChange={(e) =>
                        handleAmountRangeChange(
                          Number(e.target.value) || 0,
                          filters.amountRange.max,
                        )
                      }
                      className="pl-10"
                    />
                  </div>
                  <span className="text-muted-foreground">to</span>
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.amountRange.max}
                      onChange={(e) =>
                        handleAmountRangeChange(
                          filters.amountRange.min,
                          Number(e.target.value) || 1000,
                        )
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Status Filter (Dropdown) */}
              <div className="space-y-2">
                <Label>Order Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
