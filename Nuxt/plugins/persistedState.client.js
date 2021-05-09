import createPersistedState from 'vuex-persistedstate'

export default ({store}) => {
  createPersistedState({
    key: 'myKey',
    paths: ["isAuth"]
  })(store)
}