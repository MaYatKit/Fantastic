import util from '../util'


test('Get hash object from url', () => {
    let url1 = 'https://www.fantasy.com/?search=lol&limit=10'
    let url2 = 'www.fantasy.com:1000/?access_token=abcd123&expiry=158000'

    let obj1 = util.getParamFromUrl_test(url1)
    let obj2 = util.getParamFromUrl_test(url2)

    expect(obj1).toEqual({
        'search': 'lol',
        'limit': '10'
    })

    expect(obj2).toEqual({
        'access_token': 'abcd123',
        'expiry': '158000'
    })
})