'use client'

import { LabelList, Pie, PieChart as PieChartCN } from 'recharts'

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
import { formatNumber } from '@/lib/utils'

const chartData = [
  { type: 'piassa', orders: 1500, fill: 'var(--color-piassa)' },
  { type: 'offline', orders: 850, fill: 'var(--color-offline)' },
]

const chartConfig = {
  type: {
    label: 'Type',
  },
  piassa: {
    label: 'Piassa',
    color: 'hsl(var(--primary))',
  },
  offline: {
    label: 'Offline',
    color: '#44BB89',
  },
} satisfies ChartConfig

export function PieChart() {
  return (
    <Card className="flex flex-1 flex-col gap-2 bg-offWhite p-2 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Revenus</CardTitle>
        <CardDescription className="flex flex-col items-end">
          <span className="text-base text-muted-foreground">This week</span>
          <span className="text-2xl font-bold text-black">
            {formatNumber(229293)}
          </span>
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChartCN>
            <ChartTooltip content={<ChartTooltipContent nameKey="type" />} />
            <Pie
              data={chartData}
              dataKey="orders"
              nameKey="orders"
              label
              fontSize={21}
            >
              <LabelList
                dataKey={'type'}
                className="fill-background"
                stroke="none"
                fontSize={24}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
          </PieChartCN>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
