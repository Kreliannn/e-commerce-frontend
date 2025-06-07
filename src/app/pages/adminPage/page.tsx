"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { getOrderInterface } from "@/app/types/order.types";
import { Badge } from "@/components/ui/badge";
import ProductSalesChart from "./components/productSalesChart";
import MonthlySalesChart from "./components/monthlySalesChart";

export default function SalesTable() {
  const [orders, setOrders] = useState<getOrderInterface[]>([]);
  const [productChartData, setProductChartData] = useState<getOrderInterface[]>([]);
  const [selectedMonthChart, setSelectedMonthChart] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<getOrderInterface[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [toggle, setToggle] = useState(true);

  const { data }: { data?: { data: getOrderInterface[] } } = useQuery({
    queryKey: ["order"],
    queryFn: (): Promise<{ data: getOrderInterface[] }> => axios.get("http://localhost:5000/orders/get")
  });

  const years = ["2025", "2026", "2027", "2028"];
  const months = [
    { value: "all", label: "All Months" },
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ];

  useEffect((): void => {
    if (data?.data) {
      const rawData: getOrderInterface[] = data.data;
      const completedOrders: getOrderInterface[] = rawData.filter((item: getOrderInterface): boolean => item.status === "completed");
      setOrders(completedOrders);
    }
  }, [data]);

  // Filter orders based on selected year and month
  useEffect(() => {
    if (orders.length > 0) {
      let filtered = orders;

      // Filter by year
      filtered = filtered.filter(order => {
        const orderYear = order.date.split('-')[0];
        return orderYear === selectedYear;
      });

      // Filter by month if not "all"
      if (selectedMonth !== "all") {
        filtered = filtered.filter(order => {
          const orderMonth = order.date.split('-')[1];
          return orderMonth === selectedMonth;
        });
      }

      setFilteredOrders(filtered);
    }
  }, [orders, selectedYear, selectedMonth]);

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setSelectedMonth("all"); // Reset month to "all" when year changes
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  const handleSelectBarMonth = ( month : string) => {
    const monthValue = months.filter((item) => item.label == month)

    const filteredData = orders.filter(order => {
      const orderMonth = order.date.split('-')[1];
      return orderMonth === monthValue[0].value;
    });

    setSelectedYear("2025")
    setSelectedMonth(monthValue[0].value)
    setSelectedMonthChart(month)
    
    setProductChartData(filteredData)
    setToggle(false)
  }


  const handleCloseChart = () => {
    setToggle(true)
    setProductChartData([])
    setSelectedYear("2025")
    setSelectedMonth("all")
  }

  return (
    <div className="min-h-screen ">
      <Navbar />
      <br />

      <div className="w-[900px] flex gap-10 m-auto ">
        {(!toggle) ? <Button onClick={handleCloseChart}> Back to monthly Sales Chart </Button> : null}
      </div>

      <br />

      <div className="w-[900px] h-[500px] m-auto ">
        {(toggle) ? <MonthlySalesChart data={orders} handleSelectBarMonth={handleSelectBarMonth}/> : <ProductSalesChart productChartData={productChartData} selectedMonth={selectedMonthChart} />}
      </div>

      <br /><br /><br /> <br /><br /> <br /><br />

      {/* Filter Section */}
      <div className="w-[900px] m-auto mb-6">
        <div className="flex gap-4 items-center  p-4 rounded-lg shadow-lg bg-stone-50">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Year:</label>
            <Select value={selectedYear} onValueChange={handleYearChange}>
              <SelectTrigger className="w-[120px] bg-white">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Month:</label>
            <Select value={selectedMonth} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-[140px] bg-white">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-gray-600 ml-auto">
            Showing {filteredOrders.length} orders
          </div>
        </div>
      </div>

      <div className="m-auto w-[900px] shadow-lg">
        <Table className="bg-white shadow-lg rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
               <TableHead>Color</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.customer_name}</TableCell>
                <TableCell>{item.product_name}</TableCell>
                <TableCell>{item.color}</TableCell>
                <TableCell>{item.size}</TableCell>
                <TableCell>₱{item.product_price}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>₱{item.total_price.toLocaleString()}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>
                  {item.status === "completed" && <Badge className="bg-green-400 text-white">Completed</Badge>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <br /><br /><br /><br />
    </div>
  );
}