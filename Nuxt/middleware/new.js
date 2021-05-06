export default function({store, redirect}){
    if(store.state.isAuth== false){
      redirect("/login")
    }
    // console.log('Gg');
  }