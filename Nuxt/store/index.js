export const state = ()=> ({
    isAuth:false,
})
export const mutations = {
    changeToTrue(state){
        state.isAuth = true
    },
    changeToFalse(state){
        state.isAuth = false
    }
}