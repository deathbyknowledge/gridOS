- had to fix headers to allow fonts.googleapis.com
- seed file was not dropping Credential table
- had to set up custom caledar as shadcn doesn't work rn https://github.com/shadcn-ui/ui/issues/7258#issuecomment-2831931709
- turnstile no longer included in the standard starter
- Errors are terrible. Not enough information. Random functions not in my code are crashing...
- getFileIconSSR. getFileIconSSRSSR. What? Moving the function outside of the component makes it work.
- Cannot perform I/O on behalf of a different request. I/O objects (such as streams, request/response bodies, and others) created in the context of one request handler cannot be accessed from a different request's handler. This is a limitation of Cloudflare Workers which allows us to improve overall performance. (I/O type: SpanParent)
- ✘ [ERROR] A request to the Cloudflare API (/accounts/7f49e999393b02a187662b9ce84a28bc/workers/scripts/grid-os) failed.

  Uncaught Error: Disallowed operation called within global scope. Asynchronous I/O (ex: fetch() or
  connect()), setting a timeout, and generating random values are not allowed within global scope.
  To fix this error, perform this operation within a handler.
  https://developers.cloudflare.com/workers/runtime-apis/handlers/
    at null.<anonymous>
  (file:///Users/sam/fun/gridOS/node_modules/react-resizable-panels/dist/react-resizable-panels.edge-light.js:621:32)
   [code: 10021] (react-resiable-panels fault)
