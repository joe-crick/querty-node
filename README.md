
# Querty Node

## Querty Node is currently in _Beta_

Querty Node is a small module you can add to [Querty](https://www.npmjs.com/package/querty) to enable Querty to function as an 
Isomorphic http client.

Once you have Querty and Querty Node installed, to make Querty Isomorphic (enable it for use in Node and the Browser), add the 
following to your Querty `config`:

```javascript
import { nodeProvider } from "querty-node";

const config = {
  apiUrl: "https://my-api.com",
  nodeProvider
};
```