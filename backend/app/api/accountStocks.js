const router = require('express').Router()
const { hash } = require('../account/helper')
const db = require('../../database/models')

router.post('/add', (req, res, next) => {
	const { stockName, stockSymbol, username } = req.body
	console.log(req.body)
	if (!stockName || !username) {
		const error = new Error('There has been an error with your request')
		throw error
	}
	let infObject = {
		id: null,
		name: stockName,
		symbol: stockSymbol,
	}
	let user = hash(username)
	db.users
		.findAll({
			where: {
				usernameHash: user,
			},
		})
		.then((res) => {
			let arr
			let cleaned = res[0].dataValues.history
			if (cleaned === null) cleaned = []
			if (cleaned !== []) {
				let history = cleaned
				let parsed = history.map((x) => {
					return JSON.parse(x)
				})
				for (let i = 0; i < parsed.length; i++) {
					if (parsed[i].symbol == stockSymbol) {
						const error = new Error('already in favorites')
						throw error
					}
				}
			}
			arr = cleaned
			if (arr.length !== 0) {
				let lastId = arr.length - 1
				let tempValue = JSON.parse(arr[lastId])
				infObject.id = tempValue.id + 1
				arr.push(infObject)
			} else {
				infObject.id = 1
				arr = [infObject]
			}

			return db.users.update(
				{ history: arr },
				{
					where: {
						usernameHash: user,
					},
				}
			)
		})
		.then((data) => {
			res.json({ data, message: 'added' })
		})
		.catch((error) => {
			console.error('fav add error:', error)
			next(error)
		})
})

router.post('/all', (req, response, next) => {
	const { username } = req.body
	if (!username) {
		const error = new Error('You are not logged in')
		throw error
	}
	let user = hash(username)
	db.users
		.findAll({
			where: {
				usernameHash: user,
			},
		})
		.then((res) => {
			let arr = res[0].dataValues.history
			if (arr === null) arr = []
			response.json({
				message: 'success',
				favorites: arr,
			})
		})
		.catch((error) => {
			console.error('get all favs error:', error)
			next(error)
		})
})

router.delete('/remove/:data', (req, response, next) => {
	console.log('params', req.params, req.body)
	const identifier = parseInt(req.params.data.split('|')[0])
	const user = req.params.data.split('|')[1]
	let username = hash(user)
	db.users
		.findAll({
			where: {
				usernameHash: username,
			},
		})
		.then((data) => {
			let arr
			arr = data[0].dataValues.history
			let parsed = arr.map((x) => {
				return JSON.parse(x)
			})
			let filtered = parsed.filter((y) => {
				return y.id !== identifier
			})
			return db.users.update(
				{ history: filtered },
				{
					where: {
						usernameHash: username,
					},
				}
			)
		})
		.then((data) => {
			db.users
				.findAll({
					where: {
						usernameHash: username,
					},
				})
				.then((res) => {
					let arr = res[0].dataValues.history
					response.json({
						message: 'removed item',
						favorites: arr,
					})
				})
		})
		.catch((error) => {
			console.error('remove fav error:', error)
			next(error)
		})
})

module.exports = router
