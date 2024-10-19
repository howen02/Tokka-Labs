import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from './ui/select'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip.tsx'

export function SelectPageSize() {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div>
						<Select defaultValue="50">
							<SelectTrigger className="w-[70px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="50">50</SelectItem>
									<SelectItem value="100">100</SelectItem>
									<SelectItem value="200">200</SelectItem>
									<SelectItem value="500">500</SelectItem>
									<SelectItem value="1000">1000</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
				</TooltipTrigger>
				<TooltipContent>
					<p>Page size</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
