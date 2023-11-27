const jwt = require('jsonwebtoken')
const dayjs = require('dayjs')

const privateKey = `
-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEApZg9TwokiY6UOTzPWwlrY+MryP3prtOWYYXYv2bY5Cid8/MN
K6n7yddcxQbNdPPJKsmbJcGWL7zxC8xue3Oq6Ezo/LH2mjCoSGxlXsboXjC0aUvI
Zf7eQlROgo+0TDi5inS9Zn/iYw1uwD+k//1qe1z1lcoIB4kxonzAOjFbmtVDp/et
PtfyUeC+jaPlf4rx5wwZN3MwPjZkeIu54yw4HEfAwoGmeAKSg2zyHrjROV6j/td9
68MzltNpzEytURvW4s6o2DEKviatj9Ur1wBXuI9DxNMdHNIcqo+JetRO9EI+bwC9
vfupf0p7wcpq4vt+pumfuTSA7j3Rg82lhiEntwIDAQABAoIBAGhoQZeZNIpKjGg+
UBr9KGm1bQDwHyusmq9ofc3IYc4RUe3i/BXgujF8CTDs5hPsNZU1wg2fLjtxLKYc
wjgyKLsI6wmQh4SWUzQ+q/eDADWLDeUp8/NjK+20TEADrVE1nr6OdnCvByUe7gpm
1njU5hNb/DfyRvfBZ7skXusR/cjz1BFVHh5z2YuYF6hSlZd+N1KvCTENHxIC+mV0
zOIgWtW5FWl4eTJLXSKbeP1O0qfCcNKAg8DuPFWufEMLs7HJ17APlqWhjWOgxrGJ
qE9z5SVaekw2uai3a06suwTRNrJIMcHJAkDuQugiISanQDBL1mBf686HiwZsIjvE
SK7g1SkCgYEA2RxKyyQoZals+rVJ+TM1P83HE+ln/FuDwdMl+1iGMCQsZMc/Qx7L
lzmL8+w9PTPQGiKCOhPJ/nSt7GUtb5lbS/lS1lyyHBg5J/Xi0FMXZHoaqjsxKVgZ
pwDsT/5060g05x8+eZ68px28rPltriMjYdHq2vCkuLaMjoeIG5qQwisCgYEAw0Gp
+YtJitCzItyBwo2ZJv58FHoSj+Loe7L5/eouG2jrW0WS5jpKQk59nXawY1QWy+XU
Gg8jKUBJxTwzVy8b+9YNnsr4Ggb3HdbCMHAgdQxi+EX6j0Bnq+cbq9GIeVpXeZWp
uD4lRLgMMsJWfLRFYgPDLI21m5YMHondPh5VBqUCgYBmLS15+xNT/O9/8e/Vaucl
lveZBGDe4Eba4j9e0eOdJnkKGMdKFGUmT3vxGP4dHpRSqGj3YjbPHSR5O4itm9Pe
poD4x3k/RZsolkzfVCuPKvP/p4nUdlTkRsfwQcXOsRXMq+SgIjeQwqr4EQ8wQ/Mz
5zILRfOPxsHRljFVJGH6LwKBgDlbrMb1t+DjdfwjsqqoVfkygNizE4jZK1pLNUz1
4h2DMMBbK9AeB3p6/EOpfh9vsFKtbSVKlRWlIQajrKFL4XiVZOLk1QUwTp+hWuJH
zgEUZm5wgC5cyReiiGps3x5m/5Nj97t75g7N0ieHF0kC2+7zE/6ekl7mMSE3dpqs
5mVRAoGAPKnfV+Zllor4ulxCpnpq9vua953CP+jIrD7QdEqPdfpCB11zDUMfN4Ql
Z1GdE3qyEmG8bPPrsVA9Gfs7BJ4NHmCadliHwGQtubt2kwZDmpXdxPtmK9/qz+Uf
vNSM3adSy2mozq/5RF4Eqve7fgFFqAbic4iTYcRj22S4zmcF6uo=
-----END RSA PRIVATE KEY-----
`

const publicKey = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApZg9TwokiY6UOTzPWwlr
Y+MryP3prtOWYYXYv2bY5Cid8/MNK6n7yddcxQbNdPPJKsmbJcGWL7zxC8xue3Oq
6Ezo/LH2mjCoSGxlXsboXjC0aUvIZf7eQlROgo+0TDi5inS9Zn/iYw1uwD+k//1q
e1z1lcoIB4kxonzAOjFbmtVDp/etPtfyUeC+jaPlf4rx5wwZN3MwPjZkeIu54yw4
HEfAwoGmeAKSg2zyHrjROV6j/td968MzltNpzEytURvW4s6o2DEKviatj9Ur1wBX
uI9DxNMdHNIcqo+JetRO9EI+bwC9vfupf0p7wcpq4vt+pumfuTSA7j3Rg82lhiEn
twIDAQAB
-----END PUBLIC KEY-----
`

const createJWT = data => jwt.sign({
  ...data,
  iss: 'cooapp',
  aud: 'cooapp',
  exp: dayjs().add(1, 'minute').unix(),
}, privateKey, {
  algorithm: 'RS256'
})

const validateJWT = async token => new Promise((resolve, reject) => {
  if (!token || token.length === 0) reject()
  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err && err?.name === 'TokenExpiredError') {
      const decoded = jwt.decode(token)
      resolve(decoded)
      return
    } else if (err && !err?.name === 'TokenExpiredError') {
      reject()
      return
    }
    resolve(decoded)
  })
})


module.exports = {
  createJWT,
  validateJWT
}