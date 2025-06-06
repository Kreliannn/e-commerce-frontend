// components/ProductSalesChart.tsx
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { TrendingUp } from "lucide-react"

interface ProductData {
  product_id: string
  total_sales: number
  total_quantity: number
  img: string
  product_name: string
}

interface Props {
  chartData: ProductData[]
}

const chartConfig: ChartConfig = {
  total_sales: {
    label: "Total Sales",
    color: "hsl(var(--chart-1))",
  },
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ProductData
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[250px]">
        <div className="flex items-center gap-3 mb-3">
          <img 
            src={data.img} 
            alt={data.product_name}
            className="w-12 h-12 object-cover rounded-md"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
          <div>
            <p className="font-semibold text-gray-900">{data.product_name}</p>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Total Sales:</span> ₱{data.total_sales.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Quantity Sold:</span> {data.total_quantity}
          </p>
        </div>
      </div>
    )
  }
  return null
}

export default function ProductSalesChart() {

const rawData = [
    {
        "product_id": "no0wp0rb",
        "total_sales": 5860,
        "total_quantity": 6,
        "img": "https://res.cloudinary.com/dljxtf9dg/image/upload/v1749125708/oilhgasuvrr6o1jvqgpc.jpg",
        "product_name": "thsirt version 1"
      },
      {
        "product_id": "azn8twp8",
        "total_sales": 4870,
        "total_quantity": 4,
        "img": "https://res.cloudinary.com/dljxtf9dg/image/upload/v1749125811/d9qn5jsvsncpp2fesxik.jpg",
        "product_name": "tshirt special edition"
      },
      {
        "product_id": "3jzot9ag",
        "total_sales": 21450,
        "total_quantity": 2,
        "img": "https://res.cloudinary.com/dljxtf9dg/image/upload/v1749125747/j2pd1oa0dwjcqo4xdr91.jpg",
        "product_name": "tshirt version 2"
      },
      {
        "product_id": "hoac5py3",
        "total_sales": 12690,
        "total_quantity": 25,
        "img": "https://res.cloudinary.com/dljxtf9dg/image/upload/v1749131681/vza9hvg8n17tbbtmefrm.jpg",
        "product_name": "set"
      }
]
  // Sort products from lowest to highest sales
  const sortedData = [...rawData].sort((a, b) => a.total_sales - b.total_sales)
  
  const totalSales = rawData.reduce((sum, product) => sum + product.total_sales, 0)
  const totalQuantity = rawData.reduce((sum, product) => sum + product.total_quantity, 0)
  
  // Find best and worst performing products
  const bestProduct = sortedData[sortedData.length - 1]
  const worstProduct = sortedData[0]
  const performanceGap = bestProduct && worstProduct 
    ? ((bestProduct.total_sales - worstProduct.total_sales) / worstProduct.total_sales * 100).toFixed(1)
    : "0.0"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Sales Performance</CardTitle>
        <CardDescription>Products sorted by sales performance (lowest to highest)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart 
            accessibilityLayer 
            data={sortedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="product_name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `₱${value.toLocaleString()}`}
            />
            <ChartTooltip 
              cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }} 
              content={<CustomTooltip />} 
            />
            <Bar 
              dataKey="total_sales" 
              fill="var(--color-total_sales)" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {performanceGap !== "0.0" && bestProduct && worstProduct && (
            <>
              Top performer ({bestProduct.product_name}) unit sold {bestProduct.total_quantity}pcs total of  ₱{bestProduct.total_sales} sales
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Total sales across all products: ₱{totalSales.toLocaleString()} ({totalQuantity} units sold)
        </div>
      </CardFooter>
    </Card>
  )
}