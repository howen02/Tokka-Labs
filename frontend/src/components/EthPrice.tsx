import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components/ui/tooltip'

const fetchEthPrice = () =>
	fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT')
		.then(res => res.json())
		.then(data => data.price)
		.catch(_ => 0)

function EthPriceCard() {
	const { data: price } = useQuery({
		queryKey: ['ethPrice'],
		queryFn: fetchEthPrice,
		refetchInterval: 60 * 1000
	})

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Card className="flex justify-center items-center px-5 whitespace-nowrap cursor-help">
						<img src="/eth.svg" alt="Ethereum logo" className="w-6 h-6 mr-2" />
						<p className="text-lg tabular-nums text-gray-500">
							${parseFloat(price).toFixed(2)}
						</p>
					</Card>
				</TooltipTrigger>
				<TooltipContent>
					<p>ETH price in USD</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

export default EthPriceCard
