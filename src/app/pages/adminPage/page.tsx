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
import { useRef } from "react";
import { getMonthName } from "@/app/utils/customFunction";
import { getTotalSales } from "@/app/utils/customFunction";

interface ProductData {
  product_id: string
  total_sales: number
  total_quantity: number
  img: string
  product_name: string,
  color : string
}


const formatData =  ( data : getOrderInterface[]) => {
  const orders = data;
  const completedOrders = orders.filter(order => order.status === "completed");

  const productSales = completedOrders.reduce((acc, order) => {
    const productId = order.product_id ;

    if (typeof productId === "string" && order.product_name && order.img) {
      if (!acc[productId]) {
        acc[productId] = {
          product_id: productId,
          total_sales: 0,
          total_quantity: 0,
          img : order.img ,
          product_name : order.product_name,
          color : order.color
        };
      }

      acc[productId].total_sales += ( order.total_price || 0);
      acc[productId].total_quantity += ( order.quantity || 0);
    }

    return acc;
  }, {} as Record<string, { product_id: string; total_sales: number; total_quantity: number, img : string, product_name : string, color : string }>);

  return Object.values(productSales);
};





export default function SalesTable() {
  const [orders, setOrders] = useState<getOrderInterface[]>([]);
  const [chartData, setChartData] = useState<ProductData[]>([]);
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
      setChartData(formatData(completedOrders))
    }
  }, [data]);

  console.log(chartData)

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
      setChartData(formatData(filtered))
      setFilteredOrders(filtered);
    }
  }, [orders, selectedYear, selectedMonth]);

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setSelectedMonth("all"); // Reset month to "all" when year changes
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    if(month != "all") handleSelectBarMonth(getMonthName(month) as string)
    
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
    setChartData(formatData(filteredData))
    setProductChartData(filteredData)
    setToggle(false)
  }

  const handleCloseChart = () => {
    setToggle(true)
    setProductChartData([])
    setSelectedYear("2025")
    setSelectedMonth("all")
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen ">
      {/* Print-only styles */}
      <style jsx global>{`
        @media print {
          /* Hide everything except the sales report */
          body * {
            visibility: hidden;
          }
          
          .sales-report-container,
          .sales-report-container * {
            visibility: visible;
          }
          
          .sales-report-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
          
          /* Enhanced print header */
          .print-header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #000;
          }
          
          .print-title {
            font-size: 32px !important;
            font-weight: bold !important;
            margin-bottom: 15px !important;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #000 !important;
          }
          
          /* Enhanced shop info section */
          .print-shop-info {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 20px !important;
            margin-bottom: 30px !important;
            background-color: #f8f9fa !important;
            border: 2px solid #000 !important;
            font-weight: bold !important;
            font-size: 14px !important;
          }
          
          /* Enhanced table styling */
          .print-table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin: 0 !important;
            background: white !important;
          }
          
          .print-table th {
            background-color: #343a40 !important;
            color: white !important;
            padding: 12px 8px !important;
            border: 2px solid #000 !important;
            font-weight: bold !important;
            text-align: center !important;
            font-size: 12px !important;
          }
          
          .print-table td {
            padding: 10px 8px !important;
            border: 1px solid #000 !important;
            font-size: 11px !important;
            vertical-align: middle !important;
          }
          
          .print-table tbody tr:nth-child(even) {
            background-color: #f8f9fa !important;
          }
          
          .print-table tbody tr:nth-child(odd) {
            background-color: white !important;
          }
          
          /* Hide status column in print */
          .print-table th:last-child,
          .print-table td:last-child {
            display: none !important;
          }
          
          /* Right align numbers */
          .print-table td:nth-child(6),
          .print-table td:nth-child(7),
          .print-table td:nth-child(8) {
            text-align: right !important;
            font-weight: 600 !important;
          }
          
          /* Print footer */
          .print-footer {
            margin-top: 40px !important;
            padding-top: 20px !important;
            border-top: 3px solid #000 !important;
            text-align: right !important;
          }
          
          .print-total {
            font-size: 18px !important;
            font-weight: bold !important;
            margin-bottom: 15px !important;
          }
          
          .print-timestamp {
            font-size: 10px !important;
            color: #666 !important;
            margin-top: 20px !important;
          }
          
          /* Page settings */
          @page {
            margin: 1in;
            size: A4;
          }
        }
      `}</style>

      <Navbar />
      <br />

         {/* Filter Section */}
      <div className="w-[900px] m-auto ">
        <div className="flex gap-4 items-center  p-4 rounded-lg shadow-lg bg-stone-50">
          <Button onClick={handlePrint}>
                Print Report
          </Button>
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

  
      <br />

      <div className="w-[900px] h-[500px] m-auto ">
        {(selectedMonth == "all") ? <MonthlySalesChart data={filteredOrders} handleSelectBarMonth={handleSelectBarMonth}/> : <ProductSalesChart productChartData={productChartData} selectedMonth={selectedMonthChart} />}
      </div>

      <br /><br /><br /> <br /><br /> <br /><br />

   
      
      {/* sales report container */}
      <div className="sales-report-container m-auto w-[900px] shadow-lg">
        <div className="print-header">
          <h1 className="print-title text-center text-2xl font-bold mb-2 mt-2"> Sales Report </h1>
        </div>
        
        <div className="print-shop-info flex justify-between items-center p-2">
              <h1> Shop : <span className="font-bold"> SYARA </span> </h1>
              <h1> Date : <span className="font-bold"> {getMonthName(selectedMonth)} {selectedYear}  </span>  </h1>
              <h1> Total Sales : <span className="font-bold"> ₱{getTotalSales(filteredOrders)} </span> </h1>
        </div>

        <div className="hidden print:block">
            <h1 className="mt-10 mb-3 font-bold text-2xl"> Product Performance Report </h1>

            <Table className="print-table bg-white shadow-lg rounded-lg">
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Item Sold</TableHead>
                  <TableHead>Total Sales</TableHead>
                  <TableHead className="hidden">a</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...chartData]
                  .sort((a, b) => b.total_sales - a.total_sales)
                  .map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell>{item.color}</TableCell>
                      <TableCell>{item.total_quantity}</TableCell>
                      <TableCell>₱{item.total_sales.toLocaleString()}</TableCell>
                      <TableCell className="hidden">a</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

       <h1 className=" mt-10 mb-3 font-bold text-2xl hidden print:block"> Transaction Record </h1>

        <Table className="print-table bg-white shadow-lg rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
               <TableHead>Color</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.customer_name}</TableCell>
                <TableCell>{item.product_name}</TableCell>
                <TableCell>{item.color}</TableCell>
                <TableCell>{item.size}</TableCell>
                <TableCell>₱{item.product_price}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>₱{item.total_price.toLocaleString()}</TableCell>
        
                <TableCell>
                  {item.status === "completed" && <Badge className="bg-green-400 text-white">Completed</Badge>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="print-footer">
          <div className="print-total">
            Total Orders: {filteredOrders.length} | Grand Total: ₱{getTotalSales(filteredOrders).toLocaleString()}
          </div>
   
        </div>
      </div>

      <br /><br /><br /><br />
    </div>
  );
}