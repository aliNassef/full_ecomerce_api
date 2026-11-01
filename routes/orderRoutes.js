const express = require('express');

const router = express.Router();

const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');


router.use(authController.authGate);

router.get('/', authController.verifyTo('admin', 'user'), orderController.filterOrder, orderController.getOrders);
router.get('/:id', authController.verifyTo('user'), orderController.getOrder);

router.post('/:cartId', authController.verifyTo('user'), orderController.createCashOrder);

router.patch('/:id/pay', authController.verifyTo('admin'), orderController.updateOrderToPaid);
router.patch('/:id/deliverd', authController.verifyTo('admin'), orderController.updateOrderToDelivred);


module.exports = router;