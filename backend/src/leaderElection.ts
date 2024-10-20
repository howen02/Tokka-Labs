import { createClient } from 'redis'

const redisClient = createClient({
	url: `redis://${process.env.REDIS_HOST}:6379`
})
const instanceId = process.env.INSTANCE_ID || `instance_${Math.random()}`
const LEADER_KEY = 'leader'
const LEADER_TTL = 10

const connectRedis = () =>
	redisClient
		.connect()
		.then(() => console.log('Connected to Redis.'))
		.catch(error => console.error('Error connecting to Redis:', error))

const isLeader = () =>
	redisClient
		.get(LEADER_KEY)
		.then(leader => leader === instanceId)
		.catch(_ => false)

const attemptLeadership = () =>
	redisClient
		.set(LEADER_KEY, instanceId, { NX: true, EX: LEADER_TTL })
		.then(result =>
			result ?
				console.log('This instance is now the leader.')
			:	console.log('This instance is a follower.')
		)
		.catch(error => console.error('Error attempting leadership:', error))

const renewLeadership = () =>
	redisClient
		.get(LEADER_KEY)
		.then(leader =>
			leader === instanceId ?
				redisClient
					.expire(LEADER_KEY, LEADER_TTL)
					.then(() => console.log('Leadership renewed.'))
			:	null
		)
		.catch(error => console.error('Error renewing leadership:', error))

export { connectRedis, isLeader, attemptLeadership, renewLeadership }
