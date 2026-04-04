import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import ProblemCard from './components/ProblemCard.vue'
import FilterBar from './components/FilterBar.vue'
import ProblemList from './components/ProblemList.vue'
import './styles/custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('ProblemCard', ProblemCard)
    app.component('FilterBar', FilterBar)
    app.component('ProblemList', ProblemList)
  }
}
