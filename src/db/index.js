import Users from './users';
import Products from './products';
import Carts from './carts';
import PaymentSuccess from './payment-success';
import PaymentFailed from './payment-failed';

// Tüm modeller tek bir yerden yönetilmesi için burada toplanıyor.
export default [
    Users,
    Products,
    Carts,
    PaymentSuccess,
    PaymentFailed
]