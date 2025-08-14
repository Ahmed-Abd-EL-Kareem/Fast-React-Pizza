import { useLoaderData } from "react-router-dom";
import { getOrder } from "../../services/apiRestaurant";
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from "../../utils/helpers";
import OrderItem from "./OrderItem";
import UpdateOrder from "./UpdateOrder";

function Order() {
  const order = useLoaderData();
  const { id, status } = order;

  const deliveryIn = calcMinutesLeft(order.estimatedDelivery);

  return (
    <div className="space-y-6 px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Order #{id} status</h2>

        <div className="space-x-2">
          {status === "preparing" && <UpdateOrder order={order} />}
          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold tracking-wide text-green-800 uppercase">
            {status} on the way
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-200 px-6 py-5">
        <p className="font-medium">
          {deliveryIn >= 0
            ? `Only ${calcMinutesLeft(order.estimatedDelivery)} minutes left 😃`
            : "Order should have arrived 😫"}
        </p>
        <p className="text-xs text-stone-500">
          Estimated delivery: {formatDate(order.estimatedDelivery)}
        </p>
      </div>

      <ul className="divide-y divide-stone-200 border-t border-b">
        {order.cart.map((item) => (
          <OrderItem
            item={item}
            key={item.pizzaId}
            ingredients={order.ingredients}
          />
        ))}
      </ul>

      <div className="space-y-2 border-t border-b border-stone-200 bg-stone-50 px-6 py-5">
        <p className="text-sm font-medium text-stone-600">
          Your pizza, {order.customer} is on the way.
        </p>
        <p className="text-sm font-medium text-stone-600">
          Address: {order.address}
        </p>
        <p className="text-sm font-medium text-stone-600">
          Phone: {order.phone}
        </p>
        <p className="text-sm font-medium text-stone-600">
          Total: {formatCurrency(order.totalPrice)}
        </p>
      </div>
    </div>
  );
}

export async function loader({ params }) {
  const order = await getOrder(params.orderId);
  return order;
}

export default Order;
