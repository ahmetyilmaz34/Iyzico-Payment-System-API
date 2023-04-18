import Iyzipay from "iyzipay";
import config from "../config/config.json"

//! iyzipay objesini her yerden çağırabileceğiz
const iyzipay = new Iyzipay(config);

export default iyzipay;

