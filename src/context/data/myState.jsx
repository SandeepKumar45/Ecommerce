import React, { useEffect, useState } from 'react'
import MyContext from './myContext'
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, setDoc, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { fireDB } from '../../fireabase/FirebaseConfig';

function myState(props) {
    const [mode, setMode] = useState('light');

    const toggleMode = () => {
        if (mode === 'light') {
            setMode('dark');
            document.body.style.backgroundColor = "rgb(17, 24, 39)"
        }
        else {
            setMode('light');
            document.body.style.backgroundColor = "white"
        }
    }

    const [loading, setLoading] = useState(false);

    const [products, setProducts] = useState({
        title: '',
        price: '',
        imageUrl: '',
        category: '',
        description: '',
        time: Timestamp.now(),
        date: new Date().toLocaleString(
            "en-US",
            {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }
        )
    });

    const addProduct = async () => {
        if (products.title == '' || products.price == '' || products.imageUrl == '' || products.category == '' || products.description == '') {
            return toast.error("all fields are required")
        }

        setLoading(true)

        try {
            const productRef = collection(fireDB, 'products');
            await addDoc(productRef, products)
            toast.success("Add product successfully");
            setTimeout(() => {
                window.location.href = '/dashboard'
            }, 800);
            getProductData();
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
        // setProducts("")


    }

    const [product, setProduct] = useState([]);

    const getProductData = async () => {

        setLoading(true)

        try {
            const q = query(
                collection(fireDB, 'products'),
                orderBy('time')
            );

            const data = onSnapshot(q, (QuerySnapshot) => {
                let productArray = [];
                QuerySnapshot.forEach((doc) => {
                    productArray.push({ ...doc.data(), id: doc.id });
                });
                setProduct(productArray);
                setLoading(false)
            });

            return () => data;

        } catch (error) {
            console.log(error)
            setLoading(false)
        }

    }

    useEffect(() => {
        getProductData();
    }, []);

    // update product function

    const edithandle = (item) => {
        setProducts(item)
    }

    const updateProduct = async () => {
        setLoading(true)
        try {

            await setDoc(doc(fireDB, 'products', products.id), products)
            toast.success("Product Updated successfully")
            setTimeout(() => {
                window.location.href = '/dashboard'
            }, 800);
            getProductData();
            setLoading(false)

        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    // delete product

    const deleteProduct = async (item) => {
        setLoading(true)
        try {
            await deleteDoc(doc(fireDB, 'products', item.id))
            toast.success('Product Deleted successfully')
            getProductData();
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    // 
    const userData = JSON.parse(localStorage.getItem('user'))
    const [cartItem, setCartItem] = useState([])
    
    // get cartItem
    const getCartItem = async () => {
        try {
            const q = query(
                collection(fireDB, 'cart'),
                where('email', '==', userData.user.email)
            );

            const data = onSnapshot(q, (QuerySnapshot) => {
                let item = [];
                QuerySnapshot.forEach((doc) => {
                    item.push({ ...doc.data(), cartId: doc.id })
                });
                setCartItem([...item])
            });
        }
        catch (error) {
            throw error
        }
    }

    useEffect(() => {
        getCartItem()
    }, [])

    // 

    const [order, setOrder] = useState([]);

    const getOrderData = async () => {
        setLoading(true)
        try {
            const result = await getDocs(collection(fireDB, "order"))
            const ordersArray = [];
            result.forEach((doc) => {
                ordersArray.push(doc.data());
                setLoading(false)
            });
            setOrder(ordersArray);
            setLoading(false);
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const [user, setUser] = useState([]);

    const getUserData = async () => {
        setLoading(true)
        try {
            const result = await getDocs(collection(fireDB, "users"))
            const usersArray = [];
            result.forEach((doc) => {
                usersArray.push(doc.data());
                setLoading(false)
            });
            setUser(usersArray);
            setLoading(false);
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        getOrderData();
        getUserData();
    }, []);

    const [searchkey, setSearchkey] = useState('')
    const [filterType, setFilterType] = useState('')
    const [filterPrice, setFilterPrice] = useState('')

    return (
        <MyContext.Provider value={{
            mode, toggleMode, loading, setLoading,
            products, setProducts, addProduct, product,
            edithandle, updateProduct, deleteProduct, order,
            user, searchkey, setSearchkey, filterType, setFilterType,
            filterPrice, setFilterPrice, cartItem
        }}>
            {props.children}
        </MyContext.Provider>
    )
}

export default myState