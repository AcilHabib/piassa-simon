import DatePicker from '@/components/layout/DatePicker'
import { FC } from 'react'
import { BarChart } from './components/BarChart'
import { PieChart } from './components/PieChart'

const page: FC = async ({}) => {
  return (
    <div className="flex w-[95%] flex-col gap-3">
      <div className="self-end">
        <DatePicker />
      </div>
      <div className="flex gap-8">
        <PieChart />
        <BarChart />
      </div>
    </div>
  )
}

export default page
