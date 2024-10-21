import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useQuery } from '@tanstack/react-query'
import { ReloadIcon } from '@radix-ui/react-icons'
import { fetchDecodedPrice, validateHash } from '@/util.ts'
import { X } from 'lucide-react'

const PriceDecoderCard = () => {
	const [hash, setHash] = useState<string>('')

	const {
		data: price,
		refetch,
		isLoading
	} = useQuery({
		queryKey: ['decodedPrice', hash],
		queryFn: () => fetchDecodedPrice(hash),
		enabled: false,
		staleTime: Infinity
	})

	const handleDecodePrice = () =>
		validateHash(hash).then(isValid => {
			if (isValid) {
				refetch()
			} else {
				setHash('')
				alert('Invalid transaction hash')
			}
		})

	return (
		<Card className="w-full max-w-sm mx-auto">
			<CardContent className="flex flex-col p-2 gap-2">
				<Input
					type="text"
					placeholder="Enter transaction hash"
					value={hash}
					onChange={e => setHash(e.target.value)}
					className="w-full"
				/>
				<div className="flex gap-1">
					<Button
						onClick={handleDecodePrice}
						className="w-full"
						disabled={isLoading || !hash}
					>
						{isLoading ?
							<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
						:	'Decode Swap Price'}
					</Button>
					<Button
						variant="destructive"
						onClick={() => setHash('')}
						disabled={isLoading}
					>
						<X />
					</Button>
				</div>
				<div className="flex justify-center font-medium">
					{price ?
						<p>Swap Price: ${price}</p>
					:	<p className="font-semibold">Tokka Labs</p>}
				</div>
			</CardContent>
		</Card>
	)
}

export default PriceDecoderCard
