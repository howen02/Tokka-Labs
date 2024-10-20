import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TransactionsPage from '@/pages/TransactionsPage.tsx'

const queryClient = new QueryClient()

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<TransactionsPage />
		</QueryClientProvider>
	)
}

export default App
