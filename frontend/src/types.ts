export type Transaction = {
	blockNumber: number
	gasUsed: number
	gasPrice: number
	timeStamp: number
	ethPrice: number
	hash: string
}

export type Response<T> = {
	status: number
	body: {
		message: string
		data?: T
	}
}
