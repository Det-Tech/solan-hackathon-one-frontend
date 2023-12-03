import { createContext, useContext, useState, useCallback } from 'react';

const GlobalContext = createContext({
    address: '',
    setAddress: (addr) => {},
    activeSubMenu: false,
    activeSubMenuHandle: () => {},
    activeNavbar: 0,
    activeNavbarHandle: (num) => {},
    product_data:{},
    productDataHandle:(key, value) =>{},
    downSubMenuHandle:()=>{},
    responseVisible: false,
    responsiveVisibleHandle:()=>{},
    editProduct: false,
    editProductHandle: ()=>{},
    editproductDataHandle: ()=>{},
    paymentVisible: false,
    paymentVisibleHandle: (data) =>{},
    cartData: undefined,
    cartDataHandle:(data)=>{},
    selectedSidebar: 1,
    selectedSidebarHandle:(data)=>{}
});

const GlobalProviders = (props) => {
    const [address, setWalletAddress] = useState("");
    const [activeSubMenu, setActiveSubMenu] = useState(false);
    const [activeNavbar, setActiveNavbar] = useState(0);
    const [responseVisible, setResponseVisible] = useState(false);

    const [editProduct, setEditProduct] = useState(false);

    const [paymentVisible, setPaymentVisible] = useState(false);
    const [cartData, setCartData] = useState();

    const [selectedSidebar, setSelectedSidebar] = useState(1);

    const [product_data, setProductData] = useState({        
        product_name: "",
        product_cost: "",
        product_desc: "",
        product_type: "local",
        product_link: "nfc",
        product_payment: "Payment Type",
        product_delivery: "Delivery Method",
        product_category: "Category",
        product_qrcode: "physical",
        delivery_cost: "",
        quantity: "",

        background_color: "",
        button1_color: "",
        button2_color: "",
        buy_color: "",
        website: false,
        link: "",

        survey: false,
        ai: true,

        product_file: null,
        product_id:""
    });

    const selectedSidebarHandle = (data) =>{
        setSelectedSidebar(data)
    }

    const cartDataHandle = (data) =>{
        setCartData(data)
    }

    const paymentVisibleHandle = (data) =>{
        setPaymentVisible(data)
    }

    const setAddress = useCallback(
        async (addr) => {
            setWalletAddress(addr);
        },
        [address]
    );

    const editProductHandle = (data)=>{
        setEditProduct(data)
    }

    const downSubMenuHandle = async () => {
        setActiveSubMenu(false);
    }

    const responsiveVisibleHandle = async () => {
        setResponseVisible(!responseVisible);
    }

    const activeSubMenuHandle = async () => {
        setActiveSubMenu(!activeSubMenu);
    }

    const activeNavbarHandle = async (data) => {
        setActiveNavbar(data);
    }

    const editproductDataHandle = async(data) => {
        setProductData({
            ...product_data,
            ...data
        })
    }

    const productDataHandle = async(key, value) => {
        setProductData({
            ...product_data,
            [key] : value
        })
    }

    let wrapperValues = {
        address,
        activeSubMenu,
        activeNavbar,
        product_data,
        responseVisible,
        editProduct,
        paymentVisible,
        cartData,
        selectedSidebar,
        setAddress,
        activeSubMenuHandle,
        activeNavbarHandle,
        productDataHandle,
        downSubMenuHandle,
        responsiveVisibleHandle,
        editProductHandle,
        editproductDataHandle,
        paymentVisibleHandle,
        cartDataHandle,
        selectedSidebarHandle
    };

    return (
        <GlobalContext.Provider value={wrapperValues}>
            {props.children}
        </GlobalContext.Provider>
    );
};


const useGlobal = () => useContext(GlobalContext);

export {GlobalContext, GlobalProviders, useGlobal}
