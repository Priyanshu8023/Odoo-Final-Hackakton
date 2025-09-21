import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

interface FinancialMetricProps {
  title: string;
  periods: {
    "24h": {
      value: string;
      change?: string;
      changeType?: "positive" | "negative" | "neutral";
    };
    "7d": {
      value: string;
      change?: string;
      changeType?: "positive" | "negative" | "neutral";
    };
    "30d": {
      value: string;
      change?: string;
      changeType?: "positive" | "negative" | "neutral";
    };
  };
}

function FinancialMetric({ title, periods }: FinancialMetricProps) {
  const getChangeIcon = (changeType?: "positive" | "negative" | "neutral") => {
    switch (changeType) {
      case "positive":
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case "negative":
        return <TrendingDown className="h-3 w-3 text-red-600" />;
      default:
        return null;
    }
  };

  const getChangeColor = (changeType?: "positive" | "negative" | "neutral") => {
    switch (changeType) {
      case "positive":
        return "text-green-600 bg-green-100";
      case "negative":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Last 24 hours */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {periods["24h"].value}
            </div>
            <div className="text-sm text-gray-600">Last 24 hours</div>
          </div>
          {periods["24h"].change && (
            <div className={cn(
              "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium",
              getChangeColor(periods["24h"].changeType)
            )}>
              {getChangeIcon(periods["24h"].changeType)}
              <span>{periods["24h"].change}</span>
            </div>
          )}
        </div>

        {/* Last 7 Days */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {periods["7d"].value}
            </div>
            <div className="text-sm text-gray-600">Last 7 Days</div>
          </div>
          {periods["7d"].change && (
            <div className={cn(
              "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium",
              getChangeColor(periods["7d"].changeType)
            )}>
              {getChangeIcon(periods["7d"].changeType)}
              <span>{periods["7d"].change}</span>
            </div>
          )}
        </div>

        {/* Last 30 Days */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {periods["30d"].value}
            </div>
            <div className="text-sm text-gray-600">Last 30 Days</div>
          </div>
          {periods["30d"].change && (
            <div className={cn(
              "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium",
              getChangeColor(periods["30d"].changeType)
            )}>
              {getChangeIcon(periods["30d"].changeType)}
              <span>{periods["30d"].change}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function FinancialMetrics() {
  // Static data matching the image
  const metrics = [
    {
      title: "TOTAL INVOICE",
      periods: {
        "24h": {
          value: "₹0",
          changeType: "neutral" as const,
        },
        "7d": {
          value: "₹ 23,610",
          changeType: "neutral" as const,
        },
        "30d": {
          value: "₹ 23,610",
          changeType: "neutral" as const,
        },
      },
    },
    {
      title: "TOTAL PURCHASE",
      periods: {
        "24h": {
          value: "₹ 0",
          changeType: "neutral" as const,
        },
        "7d": {
          value: "₹ 17,857",
          changeType: "neutral" as const,
        },
        "30d": {
          value: "₹ 17,857",
          changeType: "neutral" as const,
        },
      },
    },
    {
      title: "TOTAL PAYMENT",
      periods: {
        "24h": {
          value: "₹ 0",
          changeType: "neutral" as const,
        },
        "7d": {
          value: "₹ 5,752",
          changeType: "neutral" as const,
        },
        "30d": {
          value: "₹ 5,752",
          changeType: "neutral" as const,
        },
      },
    },
  ];

  return (
    <div className="bg-gray-100 p-8 rounded-2xl shadow-inner">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {metrics.map((metric, index) => (
          <FinancialMetric
            key={index}
            title={metric.title}
            periods={metric.periods}
          />
        ))}
      </div>
    </div>
  );
}
