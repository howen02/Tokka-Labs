import { TransactionsTable } from './components/TransactionsTable.tsx'
import { useEffect, useState } from 'react'
import { Response, Transaction } from './types.ts'

function App() {
	const [transactions, setTransactions] = useState<Transaction[]>([])

	useEffect(() => {
		fetch('http://localhost:3000/transactions')
			.then(response => response.json() as Promise<Response<Transaction[]>>)
			.then(res => res.body.data)
			.then(data => (data ? setTransactions(data) : []))
	}, [])

	return (
		<div className="h-screen flex justify-center items-center">
			<div className="w-[600px]">
				<TransactionsTable transactions={transactions} />
			</div>
		</div>
	)
}

export default App
