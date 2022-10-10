import { lazy } from 'react'
import { Switch, Route } from 'wouter'

const Home = lazy(() => import('./home'))
const Collections = lazy(() => import('./collections'))
const Collection = lazy(() => import('./collection'))
const Heroes = lazy(() => import('./heroes'))
const Hero = lazy(() => import('./hero'))
const Summon = lazy(() => import('./summon'))
const Battles = lazy(() => import('./battles'))
const Battle = lazy(() => import('./battle'))
const Player = lazy(() => import('./player'))
const Faq = lazy(() => import('./faq'))
const Test = lazy(() => import('./test'))
const NotFound = lazy(() => import('./404'))
const Terms = lazy(() => import('./terms'))

export default function Pages() {
  return (
    <Switch>
      <Route path='/' component={Home} />
      <Route path='/collections' component={Collections} />
      <Route path='/collections/:address' component={Collection} />
      <Route path='/heroes' component={Heroes} />
      <Route path='/heroes/summon' component={Summon} />
      <Route path='/heroes/:address/:id' component={Hero} />
      <Route path='/heroes/:address/:id/meta' component={Hero} />
      <Route path='/heroes/:address/:id/experience' component={Hero} />
      <Route path='/battles' component={Battles} />
      <Route path='/battles/:bid' component={Battle} />
      <Route path='/player/:address' component={Player} />
      <Route path='/faq' component={Faq} />
      <Route path='/terms' component={Terms} />
      <Route path='/test' component={Test} />
      <Route><NotFound /></Route>
    </Switch>
  )
}
