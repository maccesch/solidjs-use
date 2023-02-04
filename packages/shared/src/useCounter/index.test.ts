import { useCounter } from '.'

describe('useCounter', () => {
  it('should be defined', () => {
    expect(useCounter).to.be.not.undefined
  })

  it('should be update counter', () => {
    const { count, inc, dec, set, reset } = useCounter()

    expect(count()).to.eq(0)
    inc()
    expect(count()).to.eq(1)
    inc(2)
    expect(count()).to.eq(3)
    dec()
    expect(count()).to.eq(2)
    dec(5)
    expect(count()).to.eq(-3)
    set(100)
    expect(count()).to.eq(100)
    reset()
    expect(count()).to.eq(0)
    reset(25)
    expect(count()).to.eq(25)
    reset()
    expect(count()).to.eq(25)
  })

  it('should be update limited counter', () => {
    const { count, inc, dec, set, reset } = useCounter(1, { min: -2, max: 15 })
    expect(count()).to.eq(1)
    inc(20)
    expect(count()).to.eq(15)
    dec(2)
    expect(count()).to.eq(13)
    dec()
    expect(count()).to.eq(12)
    dec(20)
    expect(count()).to.eq(-2)
    reset()
    expect(count()).to.eq(1)
    set(20)
    expect(count()).to.eq(15)
    set(-10)
    expect(count()).to.eq(-2)
    reset()
    expect(count()).to.eq(1)
    reset(20)
    expect(count()).to.eq(15)
    reset(-10)
    expect(count()).to.eq(-2)
  })
})
