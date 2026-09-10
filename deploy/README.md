# The deploy workflow

`github-pages-workflow.yml` belongs at `.github/workflows/deploy-pages.yml`.

It is parked here because a Personal Access Token without the `workflow` scope
cannot push any branch that adds or changes a file under `.github/workflows/`.
GitHub rejects the push outright, so the file cannot reach the remote this way.

## Getting it in place

Pick whichever is easier.

**In the browser.** Go to the repo, Add file, Create new file, name it
`.github/workflows/deploy-pages.yml`, paste the contents of
`github-pages-workflow.yml`, commit to `main`. The web editor is not subject to
the token scope rule.

**From the shell,** with a token that has the `workflow` scope, or with SSH:

```
git switch main
mkdir -p .github/workflows
cp deploy/github-pages-workflow.yml .github/workflows/deploy-pages.yml
git add .github && git commit -m "Add the GitHub Pages deploy workflow"
git push origin main
```

To use SSH instead of a token:

```
git remote set-url origin git@github.com:zykelabs/zyke-frontend.git
```

## After that

1. Settings, Pages, Source: GitHub Actions.
2. Settings, Pages, Custom domain: `zyke.in`, then tick Enforce HTTPS once the
   certificate is issued.
3. Set DNS. The records are in the root `README.md` under Deploying.
4. Optional, for the Google tag: Settings, Secrets and variables, Actions,
   Variables, add `GA_ID`, `GTM_ID` and `GOOGLE_SITE_VERIFICATION`.

Until the workflow exists you can still publish by hand:

```
npm ci && npm run build      # writes ./out
```

and upload `out/` to any static host.
