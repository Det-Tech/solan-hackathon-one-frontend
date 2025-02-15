import axios from "axios";
import { toast } from "react-toastify";
import jwt from "jsonwebtoken";
import {
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
    Connection,
  } from "@solana/web3.js";
  
import {
    Metaplex,
    keypairIdentity,
    walletAdapterIdentity,
    bundlrStorage,
    toMetaplexFile,
    toBigNumber,
    findMetadataPda,
    findMasterEditionV2Pda,
    findCollectionAuthorityRecordPda,
    amount,
  } from "@metaplex-foundation/js";
  
const config = require("./config.json");
const XLSX = require("xlsx");
const fileSaver = require("file-saver");

const api = axios.create();

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = token;
        }
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

export const getUserIdFromToken = () => {
    const decodedToken = jwt.decode(localStorage.getItem("token"));
    return decodedToken.id;
};

export const getStripeIDFromToken = () => {
    const decodedToken = jwt.decode(localStorage.getItem("token"));
    return decodedToken?.stripe_account;
};

export const getCurrentProductId = () => {
    const id = localStorage.getItem("product_id");
    return id;
};

function _interopDefaultLegacy(e) {
    return e && typeof e === "object" && "default" in e ? e : { default: e };
}

export const exportToExcel = (exportFileName, data) => {
    var XLSX__default = /*#__PURE__*/ _interopDefaultLegacy(XLSX);
    var EXCEL_TYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    var EXCEL_EXTENSION = ".xlsx";
    var ws = XLSX__default["default"].utils.json_to_sheet(data);
    var wb = {
        Sheets: {
            data: ws,
        },
        SheetNames: ["data"],
    };
    var eb = XLSX__default["default"].write(wb, {
        bookType: "xlsx",
        type: "array",
    });
    var blob = new Blob([eb], {
        type: EXCEL_TYPE,
    });
    fileSaver.saveAs(blob, exportFileName + EXCEL_EXTENSION);
};

const signin = async (data) => {
    try {
        const res = (
            await api.post(`${config.backend_url}/api/auth/login`, data)
        ).data;
        if (res.success) {
            localStorage.setItem("token", res.token);
        }
        return res;
    } catch (err) {
        console.log(err);
        return { success: false, message: "Server Error" };
    }
};

export const signinHandle = async (data) => {
    if (data.email == "") {
        toast.warning("Please input the email!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
        });
        return;
    }

    if (data.password == "") {
        toast.warning("Please input the password!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
        });
        return;
    }

    const id = toast.loading("Login", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
    });

    const res = await signin(data);

    toast.update(id, {
        render: res.message,
        type: res.success ? "success" : "error",
        autoClose: 2000,
        isLoading: false,
    });

    return res;
};

const signup = async (data) => {
    try {
        const res = await api.post(
            `${config.backend_url}/api/auth/register`,
            data
        );
        return res.data;
    } catch (err) {
        return { success: false, message: "Server Error" };
    }
};

export const signupHandle = async (data) => {
    if (data.username == "") {
        toast.warning("Please input the username!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
        });
        return;
    }

    if (data.phone == "") {
        toast.warning("Please input the phone!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
        });
        return;
    }

    if (data.email == "") {
        toast.warning("Please input the email!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
        });
        return;
    }

    if (data.password == "") {
        toast.warning("Please input the password!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
        });
        return;
    }

    const id = toast.loading("Signup", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
    });

    const res = await signup(data);

    toast.update(id, {
        render: res.message,
        type: res.success ? "success" : "error",
        autoClose: 2000,
        isLoading: false,
    });

    return res;
};

export const sentOTP = async (data) => {
    const id = toast.loading("Sending code", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
    });
    try {
        const res = (
            await api.post(`${config.backend_url}/api/auth/login`, data)
        ).data;
        toast.update(id, {
            render: res.message,
            type: res.success ? "success" : "error",
            autoClose: 2000,
            isLoading: false,
        });
        return res;
    } catch (err) {
        toast.update(id, {
            render: "Server Error",
            type: "error",
            autoClose: 2000,
            isLoading: false,
        });
        return { success: false, message: "Server Error" };
    }
};

export const verifyOTP = async (data) => {
    console.log("verify...");
    const id = toast.loading("Verify code", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
    });
    try {
        const res = (
            await api.post(`${config.backend_url}/api/auth/verifycode`, data)
        ).data;

        if (res.success) {
            localStorage.setItem("token", res.token);
        }

        toast.update(id, {
            render: res.message,
            type: res.success ? "success" : "error",
            autoClose: 2000,
            isLoading: false,
        });
        return res;
    } catch (err) {
        toast.update(id, {
            render: "Server Error",
            type: "error",
            autoClose: 2000,
            isLoading: false,
        });
        return { success: false, message: "Server Error" };
    }
};

export const checkAuthentication = async (router) => {
    try {
        console.log("checkauthentication");

        if (
            router.pathname.includes("product") ||
            router.pathname.includes("refer")
        ) {
            // authenticate ignore whitelist
            return;
        }

        const res = (await api.get(`${config.backend_url}/api/auth/whoami`))
            .data;
        if (!res?.success) {
            localStorage.removeItem("token");
            toast.warning("Please login!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
            router.push("/login");
        } else {
            if (router.pathname.includes("login")) {
                router.push("/dashboard");
            }
        }
    } catch (err) {
        toast.warning("Please login!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
        });
        console.log(err);
        if (err.response?.status == 401 && err.response?.data.success)
            localStorage.setItem("token", err.response.data.token);
        router.push("/login");
        return { success: false, message: "Server Error" };
    }
};

export const logout = async (router) => {
    localStorage.removeItem("token");
    router.push("/login");
};

export const uploadImgForItem = async (data) => {
    console.log("uploading Image for item...");
    const id = toast.loading("uploading...", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
    });
    try {
        const res = (
            await api.post(
                `${config.backend_url}/api/product/upload_img_for_item`,
                data
            )
        ).data;
        toast.update(id, {
            render: res.message,
            type: res.success ? "success" : "error",
            autoClose: 2000,
            isLoading: false,
        });
        return res;
    } catch (err) {
        toast.update(id, {
            render: "Server Error",
            type: "error",
            autoClose: 2000,
            isLoading: false,
        });
        return { success: false, message: "Server Error" };
    }
};

export const createOrder = async (data) => {
    console.log("create order...");
    const id = toast.loading("Create order", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
    });
    try {
        const res = (
            await api.post(`${config.backend_url}/api/product/create`, data)
        ).data;

        toast.update(id, {
            render: res.message,
            type: res.success ? "success" : "error",
            autoClose: 2000,
            isLoading: false,
        });
        return res;
    } catch (err) {
        toast.update(id, {
            render: "Server Error",
            type: "error",
            autoClose: 2000,
            isLoading: false,
        });
        return { success: false, message: "Server Error" };
    }
};

export const updateOrder = async (data) => {
    console.log("update order...");
    const id = toast.loading("Update order", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
    });
    try {
        const res = (
            await api.put(`${config.backend_url}/api/product/update`, data)
        ).data;

        toast.update(id, {
            render: res.message,
            type: res.success ? "success" : "error",
            autoClose: 2000,
            isLoading: false,
        });
        return res;
    } catch (err) {
        toast.update(id, {
            render: "Server Error",
            type: "error",
            autoClose: 2000,
            isLoading: false,
        });
        return { success: false, message: "Server Error" };
    }
};

export const createStore = async (data) => {
    console.log("create store...");
    const id = toast.loading("Create store", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
    });
    try {
        const res = (
            await api.post(`${config.backend_url}/api/store/create`, data)
        ).data;

        toast.update(id, {
            render: res.message,
            type: res.success ? "success" : "error",
            autoClose: 2000,
            isLoading: false,
        });
        return res;
    } catch (err) {
        toast.update(id, {
            render: "Server Error",
            type: "error",
            autoClose: 2000,
            isLoading: false,
        });
        return { success: false, message: "Server Error" };
    }
};

export const updateStore = async (data) => {
    console.log("update store...");
    const id = toast.loading("Update store", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
    });
    try {
        const res = (
            await api.put(`${config.backend_url}/api/store/update`, data)
        ).data;

        toast.update(id, {
            render: res.message,
            type: res.success ? "success" : "error",
            autoClose: 2000,
            isLoading: false,
        });
        return res;
    } catch (err) {
        toast.update(id, {
            render: "Server Error",
            type: "error",
            autoClose: 2000,
            isLoading: false,
        });
        return { success: false, message: "Server Error" };
    }
};

export const updateQuantity = async (data) => {
    console.log("update quantity according to product..");
    const id = toast.loading("Updating...", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
    });
    try {
        const res = (
            await api.post(
                `${config.backend_url}/api/product/update_quantity`,
                data
            )
        ).data;

        toast.update(id, {
            render: res.message,
            type: res.success ? "success" : "error",
            autoClose: 2000,
            isLoading: false,
        });
        return res;
    } catch (err) {
        toast.update(id, {
            render: "Server Error",
            type: "error",
            autoClose: 2000,
            isLoading: false,
        });
        return { success: false, message: "Server Error" };
    }
};

export const getProducts = async () => {
    console.log("get products...");
    try {
        const res = (
            await api.post(`${config.backend_url}/api/product/get_products`)
        ).data;
        return res;
    } catch (err) {
        return { success: false, message: "Server Error" };
    }
};

export const getProduct = async (data, router) => {
    console.log("get product...");
    const id = toast.loading("Getting product...", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
    });
    try {
        const res = (
            await api.post(
                `${config.backend_url}/api/product/get_product`,
                data
            )
        ).data;

        toast.update(id, {
            render: res.message,
            type: res.success ? "success" : "error",
            autoClose: 2000,
            isLoading: false,
        });
        return res;
    } catch (err) {
        toast.update(id, {
            render: "Server Error",
            type: "error",
            autoClose: 2000,
            isLoading: false,
        });
        return { success: false, message: "Server Error" };
    }
};

export const getProductSummary = async (data) => {
    console.log("get Product Summary..");
    try {
        const res = (
            await axios.post(
                `${config.backend_url}/api/product/get_product_summary`,
                data
            )
        ).data;
        return res;
    } catch (err) {
        return { success: false, message: "Server Error" };
    }
};

export const getSummary = async (data) => {
    console.log("get Summary..");
    try {
        const res = (
            await api.post(
                `${config.backend_url}/api/product/get_summary`,
                data
            )
        ).data;
        return res;
    } catch (err) {
        return { success: false, message: "Server Error" };
    }
};

export const addMembershipDiscount = async (data) => {
    console.log("add membership discount ...");
    const id = toast.loading("Create Qrcode...", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
    });
    try {
        const res = (
            await api.post(
                `${config.backend_url}/api/product/add_membership_discount`,
                data
            )
        ).data;

        toast.update(id, {
            render: res.message,
            type: res.success ? "success" : "error",
            autoClose: 2000,
            isLoading: false,
        });
        return res;
    } catch (err) {
        toast.update(id, {
            render: "Server Error",
            type: "error",
            autoClose: 2000,
            isLoading: false,
        });
        return { success: false, message: "Server Error" };
    }
};

export const customizeDeploy = async (data) => {
    console.log("deploy customized ...");
    const id = toast.loading("Save and deploying...", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
    });
    try {
        const res = (
            await api.post(
                `${config.backend_url}/api/product/customize_deploy`,
                data
            )
        ).data;

        toast.update(id, {
            render: res.message,
            type: res.success ? "success" : "error",
            autoClose: 2000,
            isLoading: false,
        });
        return res;
    } catch (err) {
        toast.update(id, {
            render: "Server Error",
            type: "error",
            autoClose: 2000,
            isLoading: false,
        });
        return { success: false, message: "Server Error" };
    }
};

export const surveyDeploy = async (data) => {
    console.log("deploy customized ...");
    const id = toast.loading("Save and deploying...", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
    });
    try {
        const res = (
            await api.post(
                `${config.backend_url}/api/product/survey_deploy`,
                data
            )
        ).data;

        toast.update(id, {
            render: res.message,
            type: res.success ? "success" : "error",
            autoClose: 2000,
            isLoading: false,
        });
        return res;
    } catch (err) {
        toast.update(id, {
            render: "Server Error",
            type: "error",
            autoClose: 2000,
            isLoading: false,
        });
        return { success: false, message: "Server Error" };
    }
};

export const aiDeploy = async (data) => {
    console.log("deploy ai bot ...");
    const id = toast.loading("Save and deploying...", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
    });
    try {
        const res = (
            await api.post(`${config.backend_url}/api/product/ai_deploy`, data)
        ).data;

        toast.update(id, {
            render: res.message,
            type: res.success ? "success" : "error",
            autoClose: 2000,
            isLoading: false,
        });
        return res;
    } catch (err) {
        toast.update(id, {
            render: "Server Error",
            type: "error",
            autoClose: 2000,
            isLoading: false,
        });
        return { success: false, message: "Server Error" };
    }
};

export const forgotPassword = async (data) => {
    console.log("forgotPassword...");
    const id = toast.loading("Requesting forgot password...", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
    });
    try {
        const res = (
            await api.post(
                `${config.backend_url}/api/auth/forgot_password`,
                data
            )
        ).data;

        toast.update(id, {
            render: res.message,
            type: res.success ? "success" : "error",
            autoClose: 2000,
            isLoading: false,
        });
        return res;
    } catch (err) {
        toast.update(id, {
            render: "Server Error",
            type: "error",
            autoClose: 2000,
            isLoading: false,
        });
        return { success: false, message: "Server Error" };
    }
};

export const getRefer = async (data) => {
    try {
        const res = (
            await api.post(`${config.backend_url}/api/auth/get_refer`, data)
        ).data;
        return res;
    } catch (err) {
        console.log(err);
        return { success: false, message: "Server Error" };
    }
};

export const aiChat = async (data) => {
    console.log("ai chat..");
    try {
        const res = (
            await api.post(`${config.backend_url}/api/product/ai_chat`, data)
        ).data;
        return res;
    } catch (err) {
        return { success: false, message: "Server Error" };
    }
};

export const createPayment = async (data) => {
    console.log("creatPayment...");
    try {
        const res = (
            await api.post(
                `${config.backend_url}/api/payment/create_payment`,
                data
            )
        ).data;
        return res;
    } catch (err) {
        return { success: false, message: "Server Error" };
    }
};

export const getOauthStripe = async (data) => {
    try {
        const res = await api.post(
            `${config.backend_url}/api/payment/get_oauth`,
            data
        );
        return res.data;
    } catch (err) {
        return { success: false, message: "Server Error" };
    }
};

export const validateCheck = (publicKey, product_data, file) => {
    if (!publicKey) {
        toast.warning("Please connect the wallet", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
        });
        return false;
    }
    if (product_data.product_name == "") {
        toast.warning("Please input product name", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
        });
        return false;
    }
    if (product_data.product_cost == "") {
        toast.warning("Please input the cost", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
        });
        return false;
    }
    if (product_data.product_desc == "") {
        toast.warning("Please input the description", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
        });
        return false;
    }
    if (product_data.product_delivery == "Delivery Method") {
        toast.warning("Please select the Delivery Method", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
        });
        return false;
    }
    if (product_data.product_payment == "Payment Type") {
        toast.warning("Please select the Payment Type", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
        });
        return false;
    }
    if (product_data.product_category == "Category") {
        toast.warning("Please select the Category", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
        });
        return false;
    }
    if (product_data.quantity == "") {
        toast.warning("Please select the quantity", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
        });
        return false;
    }
    if (!file) {
        toast.warning("Please select the file", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
        });
        return false;
    }

    return true;
};

export const updateWaxAccount = async (data) => {
    try {
        const res = await api.post(`${config.backend_url}/api/auth/wax`, data);
        return res.data;
    } catch (err) {
        return { success: false, message: "Server Error" };
    }
};

export const updateNotification = async (data) => {
    try {
        const res = await api.put(
            `${config.backend_url}/api/auth/notifications`,
            data
        );
        return res.data;
    } catch (err) {
        return { success: false, message: "Server Error" };
    }
};

export const getUser = async (data) => {
    try {
        const res = await api.get(`${config.backend_url}/api/auth/info`, data);
        return res.data;
    } catch (err) {
        return { success: false, message: "Server Error" };
    }
};

export const getDeliveryProducts = async (data) => {
    try {
        const res = (
            await api.get(`${config.backend_url}/api/delivery/all`, data)
        ).data;
        return res;
    } catch (err) {
        return { success: false, message: "Server Error" };
    }
};

export const cashOut = async (data) => {
    let id;
    try {
        id = toast.loading("Requesting cashout...", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
        });
        const res = (
            await api.post(`${config.backend_url}/api/payment/cashout`, data)
        ).data;
        toast.update(id, {
            render: "Succes",
            type: res.success ? "success" : "error",
            autoClose: 2000,
            isLoading: false,
        });
        return res;
    } catch (err) {
        toast.update(id, {
            render: "Server Error",
            type: "error",
            autoClose: 2000,
            isLoading: false,
        });
        return { success: false, message: "Server Error" };
    }
};

export const getDAONFT = async (wallet) => {
    try {
        console.log("Get ALL NFT FROM WALLET");
        const nfts = [];
        let connection;
        connection = new Connection(config.mainnetRPC1);
        const metaplex = new Metaplex(connection);
        const owner = wallet;
        const allNFTs = await metaplex.nfts().findAllByOwner({ owner: owner });
        console.log(allNFTs);
        for (let i = 0; i < allNFTs.length; i++) {
            if (allNFTs[i]?.collection?.key.toBase58() == config.dao_collection_key) {
                nfts.push(allNFTs[i]);
            }
        }
        return nfts;
    } catch (err) {
        console.log("sorry", err);
        return [];
    }
};
