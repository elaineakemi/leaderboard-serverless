import faunadb from 'faunadb'

/* configure faunaDB Client with our secret */
const query = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
})

export const handler = (event, context, callback) => {
  const body = {
    createdAt: new Date().toISOString(),
    ...JSON.parse(event.body),
  }
  return client.query(query.Create(
    query.Ref('classes/scores'),
    {
      data: body,
    },
  ))
    .then((response) => callback(null, {
      statusCode: 201,
      body: JSON.stringify(response),
    })).catch((error) => callback(null, {
      statusCode: 400,
      body: JSON.stringify(error),
    }))
}
