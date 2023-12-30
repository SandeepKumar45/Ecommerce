import { createSlice } from "@reduxjs/toolkit";
import { addDoc, collection, deleteDoc, doc,   } from 'firebase/firestore'
import { fireDB } from '../fireabase/FirebaseConfig'

const userData = JSON.parse(localStorage.getItem('user'))

// add to cart
const add = async (action) => {
    const item = { ...action.payload, email: userData.user.email }
    try {
        const itemRef = collection(fireDB, 'cart')
        await addDoc(itemRef, item)
    }
    catch (error) {
        console.log(error);
    }
}

// delete from cart
const removeItem = async (action) => {
    try{
        await deleteDoc(doc(fireDB, 'cart', action.payload.cartId))
      }
      catch(error){
        console.log(error);
      }
}

// const initialState = JSON.parse(localStorage.getItem('cart')) ?? [];
const initialState = [];

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart(state,action){
            return action.payload
        },
        addToCart(state, action) {
            state.push({...action.payload,email: userData.user.email})
            add(action)
        },
        deleteFromCart(state, action) {
            removeItem(action)
            return state.filter(item => item.id != action.payload.id);
        }
    }
})

export const { setCart, addToCart, deleteFromCart } = cartSlice.actions;

export default cartSlice.reducer;