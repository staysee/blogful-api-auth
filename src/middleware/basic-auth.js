function requireAuth(req, res, next) {
    // console.log('requireAuth')
    // console.log(req.get('Authorization'))
    const authToken = req.get('Authorization') || ''

    let basicToken
    if (!authToken.toLowerCase().startsWith('basic ')) {
        return res.status(401).json({ error: 'Missing basic token' })
    } else {
      basicToken = authToken.slice('basic '.length, authToken.length)
    }

    const [tokenUserName, tokenPassword] = Buffer
      .from(basicToken, 'base64')
      .toString()
      .split(':')
    
    if (!tokenUserName || !tokenPassword) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }

    //query database for a user matching this username
    req.app.get('db')('blogful_users')
      .where({ user_name: tokenUserName })
      .first()
      .then(user => {
        //check password
        if (!user || user.password !== tokenPassword) {
          return res.status(401).json({ error: 'Unauthorized request' })
        }
        next()
      })
      .catch(next)
  }
  
  module.exports = {
    requireAuth,
  }