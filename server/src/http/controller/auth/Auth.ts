import Elysia, { t } from 'elysia'
import { core } from '~/application'


export default core.Elysia()
  .get('/hi', async ({ body, service }) => {
    //

    console.log(Object.keys(service));

    return { body }

  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 1, maxLength: 255 }),
    })
  })
