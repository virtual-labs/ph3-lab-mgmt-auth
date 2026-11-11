# Virtual Labs sign-in

Lab and experiment builds include Virtual Labs sign-in. Accounts live in the
auth service at `auth.vlabs.ac.in`
([tool-virtual-labs-auth-analytics-iiith](https://github.com/virtual-labs/tool-virtual-labs-auth-analytics-iiith)).
It serves the sign-in and registration pages itself, so builds contain no
sign-in pages, only the service's header widget.

## What a build gets

Every page gets two things:

- **a slot in the header:** `<div class="vl-auth ml-auto" data-vlabs-auth></div>`;
- **the widget:** `<script src="https://auth.vlabs.ac.in/widget.js" defer></script>`.

The widget fills the slot:

- **Signed out:** a **Sign in** button. It opens
  `https://auth.vlabs.ac.in/login?return_to=<this page>`. After signing in,
  users come back to the page they started from; new accounts fill in the
  registration form on the way.
- **Signed in:** the user's picture (from Google, GitHub or their
  institution, else their initials) and first name. The menu offers *My
  profile* and *Sign out*. Until the registration form is saved, it also
  offers *Complete your registration*.
- **Shared session:** users sign in once for every lab and experiment. The
  session cookie belongs to `vlabs.ac.in`.
- **Referral links:** any page opened with `?ref=CODE` remembers the code for
  30 days, across labs. The code fills in the referral code on the
  registration form.

Simulation pages have no header, but they still load the widget, which
keeps referral codes working there.

Other scripts on a page can use `window.VlabsAuth`, for example
`VlabsAuth.session()` for the signed-in user. The auth service's README
describes it.

## Files

| File | Purpose |
|---|---|
| `config.js` (`authWidgetUrl`) | the widget's URL for a build |
| `lab_build/page-templates/auth-head.handlebars` | lab pages: the widget's `<script>` |
| `lab_build/skeleton.html` | lab pages: the header slot |
| `exp_build/templates/partials/commons.handlebars` | experiment pages: the widget's `<script>` |
| `exp_build/templates/partials/header.handlebars` | experiment pages: the header slot |

## Choosing the auth service

| Build | Widget |
|---|---|
| `--env=production`, `--env=testing` | `https://auth.vlabs.ac.in/widget.js` |
| `--env=local` | `http://localhost:8080/widget.js`, the auth service's local setup |

- **`VLAB_AUTH_URL` environment variable:** set it to build against another
  auth service, e.g. `VLAB_AUTH_URL=https://auth-test.vlabs.ac.in`.
- **`--disableAuth`:** leaves sign-in out of a build entirely.

The auth service must allow the pages' origin: `frontend.allowed_domains`
covers `*.vlabs.ac.in`. On other sites (a GitHub Pages preview, say) the
widget still shows **Sign in**, but it can't see the session, and users land
on their profile page after signing in instead of coming back.

## Trying it locally

1. **Run the auth service.** Follow its README (`docker compose up -d`, then
   `go run ./cmd/vlabs-auth`). It serves `http://localhost:8080`, and its
   development config allows pages from `http://localhost:5500`.
2. **Build a lab with local links to its experiments.** Use Node 18–22; the
   build fails on Node 25 and later.

   ```sh
   node main.js buildLab --env=local --disablePlugin --src=../lab-5g-core-dei
   ```

3. **Serve the build on port 5500.** Open
   `http://localhost:5500/Introduction.html`, using `localhost` and not
   `127.0.0.1`.

   ```sh
   python -m http.server 5500 --directory ../lab-5g-core-dei/build
   ```

Sign-up emails go to the auth service's Mailpit at `http://localhost:8025`.
