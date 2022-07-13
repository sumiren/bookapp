# Tech Stack

This is `frontend` folder, and adapt following tech stack

* Nuxt3
* AWS Lambda(deploy target)

# Prerequisite

You need to setup nothing additionally.

# How to start

First, `npm install` to install dependencies.

* `npm run dev` start the dev server locally on http://localhost:3000 
  * this command contains hot-reloading functionality.
* `npm run build` build the application for production. Usually `/aws` folder calls this command.

# CodeBase Design

* `Nuxt3 resource` Nuxt3 resources. Mainly develop them.
  * `./pages`
  * `./static`
  * `./app.vue`
  * etc
* `./.nuxt/` Nuxt3 development server builds resources and emit asset to the folder.
* `./.output/` Nuxt3 production build emit asset to the folder. See following section.
* `./index.js` custom adapter from Lambda to Nuxt3.
* `./dist/` finally our npm build command put together following into this folder.
  *  Nuxt3 production build resource`./.output/` 
  *  Custom Lambda adapter `index.js`,

# Build Detail

Nuxt3 production build emits assets to `./.output/` folder, whose format is deployable to AWS Lambda.
it uses Nuxt3 build option for Lambda.<br>
[lambda format official documentation](https://v3.nuxtjs.org/docs/deployment/presets/lambda/).

`./index.js` is Lambda adapter and it calls `./.output/` folder.<br>
So, `./index.js` and `./.output/*` are put together to `./.dist/` folder by `npm run build`, and  deployed to Lambda by AWS CDK.

Also, `./index.js` is not used when you run `npm run dev`, because  Nuxt3 development server doesn't need Lambda adapter. Instead, Nuxt3 development server emits and uses `./nuxt/*` asset in its own format.

# Note: Nuxt3 Documantation

[official documentation](https://v3.nuxtjs.org).
