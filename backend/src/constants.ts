import dotenv from 'dotenv'

dotenv.config()

export const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
export const INFURA_API_KEY = process.env.INFURA_API_KEY

export const ETHERSCAN_URL = 'https://api.etherscan.io/api'
export const BINANCE_ETH_PRICE_URL =
	'https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT'
export const BINANCE_HISTORICAL_ETH_PRICE_URL =
	'https://api.binance.com/api/v3/klines'
export const INFURA_PROVIDER = 'https://mainnet.infura.io/v3/' + INFURA_API_KEY

export const UNISWAP_POOL_ADDRESS = '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640'
export const FALLBACK_ETH_PRICE = 2722.71
export const END_OF_DAY_OFFSET = 86399

export const SERVER_PORT = 3000
export const ORIGINS = ['http://localhost:8080', 'http://localhost:5173']
