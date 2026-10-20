<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

Payment access uses provider-neutral plan lookup keys and environment-scoped subscription rows; this keeps tiers stable across test/live catalogs.
All payment-provider requests use the built-in gateway transport and authenticated server functions; credentials never enter browser code.
Verified payment events persist idempotent access and payment ledger records before acknowledging delivery; historical provider columns remain deprecated until older deployments no longer use them.
