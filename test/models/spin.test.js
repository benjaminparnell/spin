import test from 'ava'
import Spin from '../../models/spin'

test('spin model should always have a created date', (t) => {
  t.plan(1)
  let spin = new Spin({ stages: {} })
  t.ok(spin.createdDate instanceof Date)
})

test.cb('spin model stages should be required', (t) => {
  t.plan(1)
  let spin = new Spin({})
  spin.validate((err) => {
    t.ok(err.errors.stages)
    t.end()
  })
})
