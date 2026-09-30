// SHOP (research/sprint-0930/shop/SHOTLIST.md): art id -> component ({ props, rm }), spread into ART in art/index.js.
// Order = the spatial chain: street -> doors -> list -> cart -> aisles 1-3 (the HER LIST game) -> basket -> snacks ->
// checkout -> register -> nails -> self-checkout -> way out.
import { ShopVending, ShopDoors, ShopList, ShopCart, ShopExit } from './Street.jsx';
import { AisleProduce, ProduceCarrots, AisleEggs, EggsRack, AisleCups, CupsFront, TeaTins } from './Aisles.jsx';
import { BasketCups, ShopSnacks, CheckoutWide, Register, BasketHandle, SelfCheckout, SelfCheckoutClose } from './Checkout.jsx';

export const SHOP = {
  'shop-vending': ShopVending,
  'shop-doors': ShopDoors,
  'shop-list': ShopList,
  'shop-cart': ShopCart,
  'shop-aisle-produce': AisleProduce,
  'shop-carrots': ProduceCarrots,
  'shop-aisle-eggs': AisleEggs,
  'shop-eggs-rack': EggsRack,
  'shop-aisle-cups': AisleCups,
  'shop-cups-front': CupsFront,
  'shop-tea-tins': TeaTins,
  'shop-basket-cups': BasketCups,
  'shop-snacks': ShopSnacks,
  'shop-checkout': CheckoutWide,
  'shop-register': Register,
  'shop-basket-handle': BasketHandle,
  'shop-self-checkout': SelfCheckout,
  'shop-self-close': SelfCheckoutClose,
  'shop-way-out': ShopExit,
};
export default SHOP;
