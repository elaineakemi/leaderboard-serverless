import faunadb from 'faunadb'

const query = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB
})

const compareByScore = (a, b) => {
  if (a.playerScore < b.playerScore) {
    return -1
  }
  if (a.playerScore > b.playerScore) {
    return 1
  }
  return 0
}

export const handler = (event, context, callback) => {
  return client.query(
    query.Map(
      query.Paginate(
        query.Match(
          query.Index('all_scores')
        )
      ),
      query.Lambda(
        ['playerScore', 'playerName', 'playerTime'],
        {
          playerScore: query.Var('playerScore'),
          playerName: query.Var('playerName'),
          playerTime: query.Var('playerTime')
        }
       
      )
    ),
    { size: 10, reverse: true }
  

  )
    .then((res) => {
      const data = res?.data.sort(compareByScore).reverse()
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(data)
      })
    })
    .catch((error) => {
      console.log('error', error)
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify(error)
      })
    })
}