![test workflow](https://github.com/zerotier/ztchooks-ts/actions/workflows/node.yml/badge.svg)

# ZTC Hooks TypeScript

`ztchooks` provides primitives for serializing and verifying hooks fired from [ZeroTier Central](https://my.zerotier.com)

Webhook signatures from ZeroTier Central are in the HTTP header field: `X-ZTC-Signature`

Example:

```typescript

const psk = "<your_pre_shared_key>"
const signature = "<hook_signature>"
const payload = "<hook payload>";

verifySignature(psk, signature, payload, Number.MAX_SAFE_INTEGER);

```

# License

Copyright 2023 ZeroTier, Inc. All rights reserved.  Licensed under the Mozilla Public License Version 2.0.  See the `LICENSE` file for the full license text.
