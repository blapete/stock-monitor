const router = require('express').Router()
const fetch = require('node-fetch')
const { YAHOO_CREDENTIALS } = require('../../secrets/yahooCredentials')
const { TOP_STOCKS } = require('../../secrets/topStocks')
const { STOCK_QUOTE } = require('../../secrets/quotes')

router.post('/quote', (request, response, next) => {
	let symbol = request.body.data
	fetch(STOCK_QUOTE + symbol, YAHOO_CREDENTIALS)
		.then((res) => res.json())
		.then((res) => {
			if (!res.length) {
				const error = new Error('invalid symbol')
				throw error
			}
			if (!res[0].longName || !res[0].marketCap || !res[0].symbol) {
				const error = new Error('no current data')
				throw error
			}
			//if type == usd
			// let fixedAmount = res[0].marketCap.toFixed(0)
			// console.log('amount:', fixedAmount)
			let data = new Object()
			data.ask = res[0].ask
			data.twoHundredDayAverage = res[0].twoHundredDayAverage
			data.language = res[0].language
			data.exchangeTimezoneName = res[0].exchangeTimezoneName
			data.exchangeTimezoneShortName = res[0].exchangeTimezoneShortName
			data.fiftyTwoWeekLow = res[0].fiftyTwoWeekLow
			data.fiftyTwoWeekHigh = res[0].fiftyTwoWeekHigh
			data.currency = res[0].financialCurrency
			data.fullExchangeName = res[0].fullExchangeName
			data.longName = res[0].longName
			data.marketCap = res[0].marketCap
			data.symbol = res[0].symbol
			response.json({ data, message: 'Found stock' })
		})
		.catch((error) => {
			console.error('get quote error', error)
			next(error)
		})
})

router.get('/topstocks', (request, response, next) => {
	fetch(TOP_STOCKS, YAHOO_CREDENTIALS)
		.then((res) => res.json())
		.then((res) => {
			let filteredArr = []
			let count = 0
			for (let i of res.quotes) {
				name = new Object()
				name.id = count++
				name.longName = i.longName
				name.symbol = i.symbol
				name.exchange = i.exchange
				name.marketCap = i.marketCap
				name.ask = i.ask
				name.fiftyTwoWeekLowChangePercent = i.fiftyTwoWeekLowChangePercent
				name.financialCurrency = i.financialCurrency
				filteredArr.push(name)
			}
			response.json({ message: 'success', data: filteredArr })
		})
		.catch((error) => {
			console.error('topstocks error:', error)
			next(error)
		})
})

module.exports = router
