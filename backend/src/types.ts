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

export type GenericResponse<T> = {
	status: string
	message: string
	result: T
}
