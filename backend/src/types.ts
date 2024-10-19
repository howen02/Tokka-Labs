export type Transaction = {
	blockNumber: number
	gasUsed: number
	gasPrice: number
	timeStamp: number
	hash: string
}

export type TransactionReceipt = {
	blockNumber: number
	gasUsed: number
	effectiveGasPrice: number
	hash: string
}
