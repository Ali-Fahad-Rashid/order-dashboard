import { Order } from "@shared/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
} from "lucide-react";

interface StatsCardsProps {
  orders: Order[];
}

export function StatsCards({ orders }: StatsCardsProps) {
  const stats = {
    total: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    pending: orders.filter((order) => order.status === "pending").length,
    processing: orders.filter((order) => order.status === "processing").length,
    shipped: orders.filter((order) => order.status === "shipped").length,
    delivered: orders.filter((order) => order.status === "delivered").length,
    cancelled: orders.filter((order) => order.status === "cancelled").length,
    averageOrderValue:
      orders.length > 0
        ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length
        : 0,
  };

  const cards = [
    {
      title: "Total Orders",
      value: stats.total.toLocaleString(),
      icon: ShoppingCart,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Average Order Value",
      value: `$${stats.averageOrderValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Order Status",
      value: "",
      icon: Package,
      color: "text-gray-600 dark:text-gray-400",
      bgColor: "bg-gray-50 dark:bg-gray-800/20",
      customContent: (
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-200 dark:text-yellow-400 dark:border-yellow-800"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pending: {stats.pending}
          </Badge>
          <Badge
            variant="outline"
            className="text-blue-600 border-blue-200 dark:text-blue-400 dark:border-blue-800"
          >
            <Package className="w-3 h-3 mr-1" />
            Processing: {stats.processing}
          </Badge>
          <Badge
            variant="outline"
            className="text-orange-600 border-orange-200 dark:text-orange-400 dark:border-orange-800"
          >
            <Truck className="w-3 h-3 mr-1" />
            Shipped: {stats.shipped}
          </Badge>
          <Badge
            variant="outline"
            className="text-green-600 border-green-200 dark:text-green-400 dark:border-green-800"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Delivered: {stats.delivered}
          </Badge>
          <Badge
            variant="outline"
            className="text-red-600 border-red-200 dark:text-red-400 dark:border-red-800"
          >
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled: {stats.cancelled}
          </Badge>
        </div>
      ),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={`p-2 rounded-full ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            {card.customContent ? (
              card.customContent
            ) : (
              <div className="text-2xl font-bold">{card.value}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
