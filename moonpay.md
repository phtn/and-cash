```html
<div id="helioCheckoutContainer"></div>

<script type="module" crossorigin src="https://embed.hel.io/assets/index-v1.js"></script>

<script>
  document.addEventListener("DOMContentLoaded", () => {
    window.helioCheckout(
      document.getElementById("helioCheckoutContainer"),
      {
        paylinkId: "69562e92f47753462661addc",
        theme: {"themeMode":"dark"},
        primaryColor: "#d06806",
        neutralColor: "#19241c",
        amount: "5.99",
      }
    );
  });
</script>
```

```ts


import {HelioCheckout} from '@heliofi/checkout-react'

const helioConfig = {
    paylinkId: "69562e92f47753462661addc",
    theme: {"themeMode":"dark"},
    primaryColor: "#d06806",
    neutralColor: "#19241c",
    amount: "5.99",
};

function YourCheckoutComponent() {
  return <HelioCheckout config={helioConfig} />;
}
      
    
  // ADVANCED

import {HelioCheckout} from '@heliofi/checkout-react'

const helioConfig = {
    paylinkId: "69562e92f47753462661addc",
    theme: {"themeMode":"dark"},
    primaryColor: "#d06806",
    neutralColor: "#19241c",
    amount: "5.99",
    display: "inline",
    onSuccess: event => console.log(event),
    onError: event => console.log(event),
    onPending: event => console.log(event),
    onCancel: () => console.log("Cancelled payment"),
    onStartPayment: () => console.log("Starting payment"),
};

function YourCheckoutComponent() {
  return <HelioCheckout config={helioConfig} />;
}
       
```
