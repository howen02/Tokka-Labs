import { DayPicker, DateRange } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from '@radix-ui/react-icons'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
import { format } from 'date-fns'

interface DateRangePickerProps {
	className?: string
	value: DateRange | undefined
	onChange: (value: DateRange | undefined) => void
}

export function DateRangePicker({
	className,
	value,
	onChange
}: DateRangePickerProps) {
	return (
		<div className={className}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={'outline'}
						className={`w-[300px] justify-start text-left font-normal ${
							!value && 'text-muted-foreground'
						}`}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{value?.from ?
							value.to ?
								<>
									{format(value.from, 'LLL dd, y')} -{' '}
									{format(value.to, 'LLL dd, y')}
								</>
							:	format(value.from, 'LLL dd, y')
						:	<span>Date</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<DayPicker
						mode="range"
						selected={value}
						onSelect={onChange}
						numberOfMonths={2}
						disabled={{ after: new Date() }}
					/>
				</PopoverContent>
			</Popover>
		</div>
	)
}
