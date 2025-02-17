---
'apollo-angular': major
---

- Requires `@apollo/client` 3.13.1
- Dropped `SubscriptionResult`, because it added extra maintenance work to
keep native types in sync, and it brought no value over using native
type.
    ```diff
    - import type { SubscriptionResult } from 'apollo-angular';
    + import type { FetchResult } from '@apollo/client/core';
    ```
- Most methods of `QueryRef` forward types from `@apollo/client`. That
should allow always using correct types from whichever `@apollo/client`
version is installed without needing to touch `apollo-angular`.
- `QueryRef.valueChanges` and `QueryRef.queryId` are readonly, because
there is no reason for those to be re-affected.

