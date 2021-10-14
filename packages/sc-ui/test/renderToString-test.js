/**
 * @jest-environment node
 */

const React = require('react')
const renderToString = require('react-dom/server').renderToString

const components = [
  'Button',
]

describe('Render to string', () => {
  afterEach(() => {
    console.error.restore()
  })

  components.forEach(function (file) {
    it(
      'should render: ' + file,
      function () {
        const Type = require('../src/' + file).default

        expect(function () {
          const comp = renderToString(React.createElement(Type))

          expect(typeof comp === 'string').to.equal(true)
        }).to.not.throw()
      }.bind(null, file),
    )
  })
})
