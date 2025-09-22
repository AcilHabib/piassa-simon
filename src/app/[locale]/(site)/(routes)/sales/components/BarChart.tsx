'use client'

import {
  Bar,
  BarChart as BarChartCN,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Separator } from '@/components/ui/separator'
const chartData = [
  { productName: 'Piassa 1', ordersNumber: 5 },
  { productName: 'Piassa 2', ordersNumber: 10 },
  { productName: 'Piassa 3', ordersNumber: 3 },
  { productName: 'Piassa 4', ordersNumber: 4 },
  { productName: 'Piassa 5', ordersNumber: 2 },
  { productName: 'Piassa 6', ordersNumber: 7 },
]

const chartConfig = {
  ordersNumber: {
    label: 'Orders number',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig

export function BarChart() {
  return (
    <Card className="flex flex-1 flex-col gap-2 bg-offWhite p-2 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Slow and Fast movers</CardTitle>
        <CardDescription className="flex gap-2 py-2">
          <Button variant="outline" className="rounded-xl px-4 text-base">
            Slow
          </Button>
          <Button className="rounded-xl px-4 text-base">Fast</Button>
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChartCN
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="productName"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="ordersNumber" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="ordersNumber"
              layout="vertical"
              fill="var(--color-ordersNumber)"
              radius={4}
            >
              <LabelList
                dataKey="productName"
                position="insideLeft"
                offset={8}
                className="truncate fill-offWhite text-base font-semibold"
                fontSize={12}
              />
              <LabelList
                dataKey="ordersNumber"
                position="right"
                offset={8}
                className="fill-foreground text-base"
                fontSize={12}
              />
            </Bar>
          </BarChartCN>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
